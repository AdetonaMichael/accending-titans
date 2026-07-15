# Business & Birthdays — Frontend Subscription Flow Guide

> **For Frontend Developers**
> **Last Updated:** 2026-07-13
> **Base URL:** `{{APP_URL}}/api/v1`
> **Auth:** Bearer Token (Sanctum)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture & Flow Diagram](#2-architecture--flow-diagram)
3. [Step-by-Step Implementation](#3-step-by-step-implementation)
   - [Step 1: Fetch Available Plans](#step-1-fetch-available-plans)
   - [Step 2: User Selects a Plan](#step-2-user-selects-a-plan-ui-only)
   - [Step 3: Initialize Payment](#step-3-initialize-payment)
   - [Step 4: Paystack Inline Popup (Recommended)](#step-4-paystack-inline-popup-recommended)
   - [Step 5: Verify Payment & Create Subscription](#step-5-verify-payment--create-subscription)
   - [Step 6: Check Subscription Status](#step-6-check-subscription-status)
4. [Complete Code Example](#4-complete-code-example)
5. [Error Handling](#5-error-handling)
6. [Troubleshooting Common Issues](#6-troubleshooting-common-issues)
7. [Testing Checklist](#7-testing-checklist)

---

## 1. Overview

The subscription system uses **Paystack** for payment processing and recurring billing. The flow is:

```
1. Frontend fetches available plans
2. User selects a plan
3. Frontend initializes payment → gets reference + authorization_url
4. Paystack Inline Popup opens (user enters card details)
5. User completes payment → Paystack fires callback
6. Frontend calls verify-and-create automatically in callback
7. Frontend shows success screen with auto-redirect
```

### Why Paystack Inline Popup (not redirect)?

| Approach | UX | Issue |
|----------|----|-------|
| ❌ Redirect to Paystack page | User leaves app, hard to track completion | No `callback_url` configured on backend |
| ❌ New tab + manual "I've Paid" button | Broken UX, users click verify before paying → 400 error | Manual step is error-prone |
| ✅ **Inline Popup (recommended)** | User stays in-app, auto-verifies on success | Seamless, no manual button needed |

**The Paystack Inline Popup** (`PaystackPop.setup().openIframe()`) opens a modal within your page. When payment succeeds, Paystack fires the `callback` function automatically with the transaction reference. Your code then calls `verify-and-create` in that callback — no user intervention needed.

---

## 2. Architecture & Flow Diagram

```
User                    Frontend                          Backend                    Paystack
 │                        │                                 │                          │
 │  Select plan           │                                 │                          │
 │───────────────────────►│                                 │                          │
 │                        │                                 │                          │
 │                        │  POST /subscriptions/initialize │                          │
 │                        │────────────────────────────────►│                          │
 │                        │                                 │  POST /transaction/init  │
 │                        │                                 │─────────────────────────►│
 │                        │                                 │                          │
 │                        │       {authorization_url, ref}  │     {authorization_url}  │
 │                        │◄────────────────────────────────│◄─────────────────────────│
 │                        │                                 │                          │
 │                        │  PaystackPop.openIframe()       │                          │
 │                        │═══════════════════════════════════════════════►            │
 │                        │                                 │                          │
 │  Enter card details    │                                 │                          │
 │◄═══════════════════════╩══════════════════════════════════════════════               │
 │                        │                                 │                          │
 │                        │  callback(response) fired       │                          │
 │                        │◄══════════════════════════════════════════════               │
 │                        │                                 │                          │
 │                        │  POST /subscriptions/verify-and-create                    │
 │                        │────────────────────────────────►│                          │
 │                        │                                 │  GET /transaction/verify │
 │                        │                                 │─────────────────────────►│
 │                        │                                 │  POST /subscription      │
 │                        │                                 │─────────────────────────►│
 │                        │                                 │                          │
 │                        │     {subscription details}      │                          │
 │                        │◄────────────────────────────────│                          │
 │                        │                                 │                          │
 │  ✅ Show success       │                                 │                          │
 │◄───────────────────────│                                 │                          │
```

---

## 3. Step-by-Step Implementation

### Step 1: Fetch Available Plans

```typescript
// GET {{BASE_URL}}/subscriptions/plans
const response = await api.get('/subscriptions/plans');
const plans = response.data.data.plans;
```

**Response shape:**
```json
{
    "success": true,
    "data": {
        "plans": [
            {
                "id": 1,
                "name": "Basic Plan",
                "slug": "basic",
                "price": 2000.00,
                "daily_hours_limit": 6,
                "duration_days": 30,
                "features": ["6 hours daily access", "Portfolio creation", ...]
            }
        ]
    }
}
```

> ⚠️ Only plans with a valid `paystack_plan_code` (synced to Paystack) will appear here.

---

### Step 2: User Selects a Plan (UI only)

Display plans as cards. Let the user pick one. Store the selected plan's `id` — no API call yet.

---

### Step 3: Initialize Payment

```typescript
// POST {{BASE_URL}}/subscriptions/initialize
const response = await api.post('/subscriptions/initialize', {
    plan_id: selectedPlan.id,
});

const { authorization_url, reference, plan } = response.data.data;
```

**Success Response (200):**
```json
{
    "success": true,
    "data": {
        "authorization_url": "https://checkout.paystack.com/0peioxfhpn",
        "reference": "trx-ps-6a5490da56d01",
        "plan": { "id": 1, "name": "Basic Plan", "price": 2000 }
    }
}
```

**Common Errors:**

| Status | Message | Cause |
|--------|---------|-------|
| 401 | Unauthenticated | User not logged in |
| 400 | You already have an active subscription | User already subscribed |
| 400 | This plan is not configured for Paystack | Admin hasn't synced this plan |

---

### Step 4: Paystack Inline Popup (Recommended)

**Prerequisite:** Include the Paystack script in your HTML:

```html
<!-- Add to <head> of your layout -->
<script src="https://js.paystack.co/v1/inline.js"></script>
```

**Implementation:**

```typescript
const paystackHandler = (window as any).PaystackPop.setup({
    key: 'pk_test_xxxxxxxxxxxxx',     // Your Paystack PUBLIC key (from .env)
    email: user.email,                 // User's email
    amount: plan.price * 100,          // Amount in kobo (2000 NGN = 200000 kobo)
    currency: 'NGN',
    ref: reference,                    // Reference from Step 3
    onClose: () => {
        // ❌ User closed the popup without paying
        // Show a message and let them retry
        showError('Payment was cancelled.');
    },
    callback: async (response) => {
        // ✅ Payment successful! Auto-verify
        // 🔥 IMPORTANT: Do NOT show a "Verify" button — verify here automatically
        await verifyAndCreate(response.reference, plan.id);
    },
});

paystackHandler.openIframe();
```

**CRITICAL:** Do NOT show a manual "I've Completed Payment" button. The `callback` fires automatically when Paystack confirms the payment. A manual button causes the 400 error "No authorization found" because users click it before the payment is complete.

---

### Step 5: Verify Payment & Create Subscription

```typescript
// POST {{BASE_URL}}/subscriptions/verify-and-create
async function verifyAndCreate(reference: string, planId: number) {
    try {
        const response = await api.post('/subscriptions/verify-and-create', {
            reference: reference,
            plan_id: planId,
        });

        if (response.data.success) {
            // ✅ Active subscription created!
            const subscription = response.data.data.subscription;
            showSuccess(subscription);
        } else {
            showError(response.data.message);
        }
    } catch (error) {
        showError('Verification failed. Please contact support.');
    }
}
```

**Success Response:**
```json
{
    "success": true,
    "data": {
        "subscription": {
            "id": 10,
            "plan_name": "Basic Plan",
            "start_date": "2026-07-13",
            "end_date": "2026-08-12",
            "days_remaining": 30,
            "payment_status": "paid",
            "auto_renew": true,
            "paystack_subscription_code": "SUB_vsyqdmlzble3uii",
            "next_payment_date": "2026-08-12"
        }
    }
}
```

**Error: "No authorization found"**
- **Cause:** The Paystack transaction doesn't have an `authorization` object (saved card).
- **Fix:** Ensure you're calling `verify-and-create` ONLY after the Paystack Popup's `callback` fires. The `authorization` is only created when the user completes payment in the Paystack popup.

---

### Step 6: Check Subscription Status

```typescript
// GET {{BASE_URL}}/subscriptions/my-subscription
const response = await api.get('/subscriptions/my-subscription');
const { has_active_subscription, subscription } = response.data.data;
```

---

## 4. Complete Code Example

Here is a complete React component implementing the flow:

```tsx
import { useState } from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: '{{APP_URL}}/api/v1',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
});

// Attach auth token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export function SubscriptionCheckout({ plan, user, onSuccess, onError }) {
    const [step, setStep] = useState<'confirm' | 'processing' | 'verifying' | 'success' | 'error'>('confirm');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePayment = async () => {
        setStep('processing');

        // Step 3: Initialize
        const initRes = await api.post('/subscriptions/initialize', {
            plan_id: plan.id,
        });

        if (!initRes.data.success) {
            setStep('error');
            setErrorMessage(initRes.data.message);
            return;
        }

        const { authorization_url, reference } = initRes.data.data;

        // Step 4: Paystack Inline Popup
        const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

        if (!PAYSTACK_PUBLIC_KEY) {
            setStep('error');
            setErrorMessage('Paystack is not configured.');
            return;
        }

        const handler = (window as any).PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: user.email,
            amount: plan.price * 100,
            currency: 'NGN',
            ref: reference,
            onClose: () => {
                setStep('error');
                setErrorMessage('Payment was cancelled.');
            },
            callback: async (response) => {
                // Step 5: Auto-verify (no manual button needed)
                setStep('verifying');

                try {
                    const verifyRes = await api.post('/subscriptions/verify-and-create', {
                        reference: response.reference,
                        plan_id: plan.id,
                    });

                    if (verifyRes.data.success) {
                        setStep('success');
                        onSuccess?.(verifyRes.data.data.subscription);
                    } else {
                        setStep('error');
                        setErrorMessage(verifyRes.data.message);
                    }
                } catch {
                    setStep('error');
                    setErrorMessage('Verification failed. Contact support.');
                }
            },
        });

        handler.openIframe();
    };

    // Render different UI for each step...
    // confirm → show plan details + "Pay Now" button
    // processing → spinner "Initializing..."
    // verifying → spinner "Verifying..."
    // success → ✅ "Subscription Active!"
    // error → ❌ error message + "Try Again" button
}
```

---

## 5. Error Handling

### Error Response Format

```json
{
    "success": false,
    "message": "Human-readable error description",
    "code": 400
}
```

### Common Error Scenarios

| Scenario | What Happens | How to Handle |
|----------|-------------|---------------|
| User already subscribed | `initialize` returns 400 | Show "You already have an active subscription" + link to dashboard |
| Plan not synced | `initialize` returns 400 | Show "This plan is not available. Contact admin." |
| User closes popup | `onClose` fires | Show "Payment cancelled. Try again." |
| Payment fails on Paystack | Popup shows error, `onClose` fires | Show error, let user retry |
| Network error during verify | `verify-and-create` throws | Show "Verification failed. Check your subscription status on the dashboard." |
| Invalid reference | `verify-and-create` returns 400 | Show "Payment verification failed. Contact support." |

### Frontend Error Handler

```typescript
function handleApiError(error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data;
        return data.message || 'An error occurred';
    }
    return 'Network error. Please check your connection.';
}
```

---

## 6. Troubleshooting Common Issues

### Issue: "No authorization found in transaction" (400)

**Root Cause:** The `verify-and-create` endpoint was called before the payment was actually completed on Paystack.

**Why It Happens:**
- The modal shows a manual "I've Completed Payment" button
- The user opens Paystack in a new tab but doesn't complete payment
- The user clicks "I've Completed Payment" anyway
- Backend checks Paystack → no authorization found → 400 error

**Fix:** Remove the manual verify button. Use the Paystack Inline Popup's `callback` to call `verify-and-create` automatically when Paystack confirms payment success.

### Issue: Paystack popup doesn't open

**Root Cause:** Browser is blocking the popup, or the Paystack script isn't loaded.

**Fix:**
1. Ensure `<script src="https://js.paystack.co/v1/inline.js"></script>` is in your HTML `<head>`
2. Ensure `window.open` is called directly from a user click handler (not inside an async function after `await`)
3. If using React, call `window.open('', '_blank')` BEFORE any `await` calls

### Issue: Cannot read properties of undefined (reading 'PaystackPop')

**Root Cause:** The Paystack script hasn't loaded yet when you try to use it.

**Fix:** Use `(window as any).PaystackPop?.setup(...)` with optional chaining, or check if the script is loaded before using it:

```typescript
const waitForPaystack = (timeout = 5000): Promise<boolean> => {
    return new Promise((resolve) => {
        const check = () => {
            if ((window as any).PaystackPop) return resolve(true);
            if (timeout <= 0) return resolve(false);
            timeout -= 100;
            setTimeout(check, 100);
        };
        check();
    });
};
```

---

## 7. Testing Checklist

- [ ] `GET /subscriptions/plans` returns at least one plan
- [ ] `POST /subscriptions/initialize` returns `authorization_url` and `reference`
- [ ] Paystack Inline Popup opens when user clicks "Continue to Payment"
- [ ] User can enter test card details in the popup
- [ ] `callback` fires automatically after successful payment
- [ ] `verify-and-create` returns subscription details
- [ ] Success screen shows with auto-redirect countdown
- [ ] `GET /subscriptions/my-subscription` shows active subscription
- [ ] Duplicate subscription attempt shows "already subscribed" error
- [ ] Closing the popup without paying shows error + retry option

### Test Card Numbers (Paystack Test Mode)

| Card Type | Number | CVV | PIN | OTP |
|-----------|--------|-----|-----|-----|
| Success | 4084 0810 0000 0000 | Any | Any | Any |
| Success (QR) | 5078 5000 0000 0002 | Any | Any | Any |
| Failure | 4000 0000 0000 0002 | Any | Any | Any |

---

## Appendix: TypeScript Interfaces

```typescript
interface SubscriptionPlan {
    id: number;
    name: string;
    slug: string;
    price: number;
    daily_hours_limit: number;
    duration_days: number;
    features: string[] | null;
}

interface ActiveSubscription {
    id: number;
    plan_name: string;
    plan_slug: string;
    price: number;
    start_date: string;
    end_date: string;
    days_remaining: number;
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    auto_renew: boolean;
    paystack_subscription_code: string | null;
    next_payment_date: string | null;
    daily_hours: {
        limit: number;
        limit_minutes: number;
        used_minutes: number;
        remaining_minutes: number;
    };
}
```

## Appendix: Useful Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/subscriptions/plans` | No | List available plans |
| POST | `/subscriptions/initialize` | Yes | Initialize payment |
| POST | `/subscriptions/verify-and-create` | Yes | Verify & create subscription |
| GET | `/subscriptions/my-subscription` | Yes | Get active subscription |
| GET | `/subscriptions/history` | Yes | Past subscriptions |
| POST | `/subscriptions/cancel-auto-renew` | Yes | Disable auto-renewal |
| GET | `/subscriptions/remaining-hours` | Yes | Daily hours remaining |
