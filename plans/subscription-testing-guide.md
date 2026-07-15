# Subscription System — End-to-End Testing Guide

> **Version:** 1.0  
> **Last Updated:** 2026-07-12  
> **Base URL:** `https://api.bb.remonode.com/api/v1`

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Test Data Setup](#2-test-data-setup)
3. [Landing Page — Plan Cards](#3-landing-page--plan-cards)
4. [Dashboard — Plan Selection](#4-dashboard--plan-selection)
5. [Paystack Checkout Flow](#5-paystack-checkout-flow)
6. [Subscription Management](#6-subscription-management)
7. [Daily Hours Tracking](#7-daily-hours-tracking)
8. [Subscription History](#8-subscription-history)
9. [Edge Cases & Error Handling](#9-edge-cases--error-handling)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

### 1.1 Environment
- Dev server running: `npx next dev`
- Backend API accessible at `https://api.bb.remonode.com/api/v1`
- Paystack test keys configured on the backend
- A test user account (register via `/auth/register`)

### 1.2 Verification Checklist
| Item | Status |
|------|--------|
| Backend API is reachable | □ |
| Auth token can be obtained | □ |
| Paystack test mode is active | □ |
| At least one subscription plan exists in DB | □ |

---

## 2. Test Data Setup

Backend must have subscription plans created. Use the admin endpoints or seed the database:

### 2.1 Verify Plans Exist on Backend

```bash
curl -X GET https://api.bb.remonode.com/api/v1/subscriptions/plans
```

**Expected Response (200):**
```json
{
    "success": true,
    "message": "Plans retrieved successfully",
    "data": {
        "plans": [
            {
                "id": 1,
                "name": "Basic Plan",
                "slug": "basic",
                "price": 2000.00,
                "daily_hours_limit": 6,
                "duration_days": 30,
                "features": [
                    "6 hours daily access",
                    "Basic portfolio",
                    "Email support"
                ]
            },
            {
                "id": 2,
                "name": "Standard Plan",
                "slug": "standard",
                "price": 3500.00,
                "daily_hours_limit": 12,
                "duration_days": 30,
                "features": [
                    "12 hours daily access",
                    "Enhanced portfolio",
                    "Priority support"
                ]
            },
            {
                "id": 3,
                "name": "Premium Plan",
                "slug": "premium",
                "price": 5000.00,
                "daily_hours_limit": 0,
                "duration_days": 30,
                "features": [
                    "Unlimited daily access",
                    "Premium portfolio",
                    "VIP support",
                    "Birthday rewards eligibility"
                ]
            }
        ]
    }
}
```

### 2.2 Verify API Client Configuration

Check that [`src/services/api-client.ts`](src/services/api-client.ts) points to the correct URL:

```typescript
// Line 18
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.bb.remonode.com/api/v1';
```

If your backend runs locally, set the env variable:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 3. Landing Page — Plan Cards

### 3.1 Test: Plans Display on Landing Page

**Steps:**
1. Navigate to `/` (landing page)
2. Scroll down past the Features section
3. Observe the **"Choose Your Growth Plan"** section

**Expected:**
- Section header: "Choose Your Growth Plan" with subtitle
- 3 plan cards in a responsive grid
- Each card shows: icon, plan name, description, price, daily access badge, feature list, CTA button
- The recommended/middle plan has a "Most Popular" badge and elevated styling (gold border, shadow)
- Premium plan shows "Best Value" badge (gold gradient)

**Visual Checklist:**
| Element | Present |
|---------|---------|
| Gold (#C9A84C) branding accents | □ |
| Plan-specific icons (Star/Sparkles/Crown) | □ |
| Price displayed with ₦ formatting | □ |
| Daily hours limit badge | □ |
| Feature list with green checkmarks | □ |
| "Most Popular" badge on middle plan | □ |
| Hover effects on cards | □ |
| "View all plans & details" link at bottom | □ |

**If plans don't appear:**
- Open browser DevTools → Network tab
- Reload the page
- Look for `GET /subscriptions/plans` request
- Verify the response returns plans with `success: true`

### 3.2 Test: Loading State

**Steps:**
1. Clear browser cache
2. Set network throttling to "Slow 3G" in DevTools
3. Navigate to `/`

**Expected:**
- A centered gold spinner (`Loader2`) displays briefly while plans load
- Cards appear once data is received

### 3.3 Test: Empty State

**Steps:**
1. If backend has no plans, the section should not render at all
2. Check the component logic in [`SubscriptionPlansSection.tsx`](src/components/subscription/SubscriptionPlansSection.tsx):
   - Line: `if (plans.length === 0) return null;`

**Expected:**
- Nothing renders — no empty section with broken layout

---

## 4. Dashboard — Plan Selection

### 4.1 Test: Navigate to Dashboard Subscriptions

**Steps:**
1. Log in at `/auth/login`
2. Navigate to `/dashboard/subscriptions`
3. (Or use the sidebar: click "Subscription")

**Expected (No Active Subscription):**
- Header: "Choose Your Plan"
- 3 plan cards in a grid
- Same design as landing page but with "Subscribe Now" buttons
- No active subscription details shown

**Expected (With Active Subscription):**
- Header: "My Subscription"
- Active subscription management card (see section 6)

### 4.2 Test: Plan Selection Triggers Checkout

**Steps:**
1. Ensure no active subscription
2. Click "Subscribe Now" on any plan
3. Observe the modal that appears

**Expected:**
- Modal opens with title "Complete Subscription"
- Plan summary showing: plan name, slug badge, price
- Feature preview (first 4 features + count if more)
- Security note about Paystack encryption
- "Continue to Payment" button

---

## 5. Paystack Checkout Flow

This tests the complete payment flow: `initialize` → `pay` → `verify-and-create`

### 5.1 Step 1: Continue to Payment

**Steps:**
1. From the checkout modal, click "Continue to Payment"

**Expected:**
- Modal transitions to "Processing" state with spinner
- Backend receives `POST /subscriptions/initialize` with `{ plan_id }`
- On success: transitions to "Paystack" step

### 5.2 Step 2: Paystack Checkout Page

**Steps:**
1. After initialization, modal shows "Complete Payment" screen
2. A new browser tab opens with the `authorization_url` from Paystack
3. Transaction details displayed: plan name, amount, reference

**Expected:**
- New tab opens Paystack's hosted checkout page
- Paystack shows the plan price and card input
- Reference truncated in modal for identification

### 5.3 Step 3: Complete Payment on Paystack

**Steps:**
1. In the Paystack tab, enter test card details:
   - **Card Number:** `4084 0840 8408 4081`
   - **Expiry:** any future date (e.g., `12/28`)
   - **CVV:** any 3 digits (e.g., `123`)
   - **PIN:** any 4 digits
2. Click "Pay"

**Expected:**
- Paystack processes the test payment
- Shows success page on Paystack
- **Do NOT close the Paystack tab yet**

### 5.4 Step 4: Verify Payment

**Steps:**
1. Return to the app tab
2. Click **"I've Completed Payment"**

**Expected:**
- Modal transitions to "Verifying" with spinner
- Backend receives `POST /subscriptions/verify-and-create` with `{ reference, plan_id }`
- Backend calls Paystack to verify the transaction
- Paystack subscription is created

### 5.5 Step 5: Success Confirmation

**Expected:**
- Modal shows "Subscription Active!" success screen
- Green checkmark icon
- Plan summary: plan name, amount
- "Redirecting to dashboard in 5s..." countdown
- Auto-redirects to `/dashboard/subscriptions` after countdown

### 5.6 Test: Payment Cancellation

**Steps:**
1. Repeat the flow but click **"I Changed My Mind"** instead of completing payment

**Expected:**
- Modal shows error state: "Payment was cancelled"
- "Try Again" and "Close" buttons
- "Contact Support" link at bottom

---

## 6. Subscription Management

After a successful subscription, test the management dashboard.

### 6.1 Test: Active Subscription Card

**Navigate to:** `/dashboard/subscriptions`

**Expected:**
- Gold gradient header with plan name, status badge, slug badge, and price
- Status grid (4 columns):
  - **Start Date** — formatted date
  - **End Date** — formatted date
  - **Days Left** — number with `d` suffix
  - **Auto-Renew** — "Active" (green) or "Cancelled" (gray)
- Daily hours card with progress bar
- Next payment notice (if auto-renew is on)
- Action buttons row

### 6.2 Test: Daily Hours Progress Bar

**Expected:**
- Shows "Today's Usage" header
- Progress bar with gold-to-amber gradient
- Used minutes / Total limit displayed
- 3-column stats: Daily Limit, Used Today, Remaining
- Bar turns red when usage exceeds 80%

### 6.3 Test: Cancel Auto-Renew

**Steps:**
1. Click "Cancel Auto-Renew" button (red outline)

**Expected:**
- `POST /subscriptions/cancel-auto-renew` is called
- Success toast: "Auto-renewal cancelled successfully"
- Auto-Renew status updates to "Cancelled" (gray)
- Button disappears (since it's already cancelled)

### 6.4 Test: Update Card

**Steps:**
1. Click "Update Card" button

**Expected:**
- Backend receives `GET /subscriptions/paystack/{code}/manage/link`
- Returns a Paystack management URL
- New tab opens with Paystack's card update page
- User can enter new card details

### 6.5 Test: Disable Subscription

**Steps:**
1. Click "Disable Subscription" button
2. Browser `prompt()` asks: "Enter your email token to disable this subscription:"
3. Enter the email token (obtained from the backend/subscription creation response)

**Expected:**
- `POST /subscriptions/paystack/disable` is called with `{ subscription_code, email_token }`
- Success toast
- Subscription status updates

---

## 7. Daily Hours Tracking

### 7.1 Test: View Remaining Hours in Dashboard

**Steps:**
1. Ensure active subscription
2. Navigate to `/dashboard/subscriptions`

**Expected:**
- `GET /subscriptions/remaining-hours` is called
- Daily hours card shows accurate `limit_minutes`, `used_minutes`, `remaining_minutes`
- Progress bar reflects usage percentage

### 7.2 Test: Usage Boundary Conditions

| Scenario | Expected Behavior |
|----------|------------------|
| 0 minutes used | Bar at 0%, "0m / 6h" |
| 50% usage | Bar at 50%, "3h / 6h" |
| 80%+ usage | Bar turns amber/red gradient |
| Unlimited plan (0 limit) | Shows "Unlimited", no progress bar |
| -1 remaining (unlimited) | Shows "∞" for remaining |

---

## 8. Subscription History

### 8.1 Test: View History

**Steps:**
1. Ensure you have past subscriptions
2. Navigate to `/dashboard/subscriptions`
3. Click "View Subscription History"

**Expected:**
- Accordion expands to show history card
- `GET /subscriptions/history` is called
- Each history item shows: plan name, date range, amount, payment status badge

### 8.2 Test: Pagination

**Steps:**
1. If you have 20+ history records, pagination controls appear

**Expected:**
- Page numbers below the list
- Current page highlighted in gold
- Clicking a page number fetches that page's data

---

## 9. Edge Cases & Error Handling

### 9.1 Test: Already Subscribed

**Steps:**
1. Complete a subscription (have an active subscription)
2. Try to initialize another payment via the dashboard

**Expected:**
- Backend returns `400: "You already have an active subscription"`
- Modal shows error state with message

### 9.2 Test: Invalid Plan ID

**Steps:**
1. Manually call `POST /subscriptions/initialize` with an invalid `plan_id`

**Expected:**
- Backend returns `422: Validation error`
- Error displayed in modal

### 9.3 Test: Expired/Invalid Reference

**Steps:**
1. Call `POST /subscriptions/verify-and-create` with a fake reference

**Expected:**
- Backend returns `400: "Payment verification failed"`
- Error displayed in modal with retry option

### 9.4 Test: Network Error

**Steps:**
1. Disconnect network (DevTools → Network → Offline)
2. Try to load plans or initialize payment

**Expected:**
- Shows error message: "Failed to load subscription plans"
- Toast notification appears with error

### 9.5 Test: Unauthenticated Access

**Steps:**
1. Log out
2. Navigate to `/dashboard/subscriptions`

**Expected:**
- Auth guard redirects to login page
- API client's 401 interceptor handles redirect

---

## 10. Troubleshooting

### Plans not showing on landing page
| Cause | Solution |
|-------|----------|
| Backend API not running | Start the backend server |
| Wrong API URL | Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local` |
| No plans in database | Create plans via admin endpoint |
| CORS issue | Check backend CORS config |
| Network error | Check browser DevTools → Network tab |

### Paystack checkout issues
| Cause | Solution |
|-------|----------|
| Wrong Paystack public key | Verify backend Paystack config |
| Test mode vs live mode | Use Paystack test card: `4084 0840 8408 4081` |
| Popup blocked | Allow popups for the site |
| Missing callback URL | Check Paystack dashboard settings |

### TypeScript build errors
Run the TypeScript checker:
```bash
npx tsc --noEmit
```
This verifies all types compile. Only pre-existing test file errors (`idempotency.utils.test.ts`) should appear.

### Turbopack cache issues
If the dev server shows CSS-related errors:
```bash
# Clear cache (cmd.exe)
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

# Restart
npx next dev
```

---

## Appendix: Key Files Reference

| File | Purpose |
|------|---------|
| [`src/types/subscription.types.ts`](src/types/subscription.types.ts) | All TypeScript interfaces for subscription data |
| [`src/services/subscription.service.ts`](src/services/subscription.service.ts) | API service with all 11 endpoints |
| [`src/hooks/useSubscription.ts`](src/hooks/useSubscription.ts) | React hook for subscription state & actions |
| [`src/components/subscription/SubscriptionPlansSection.tsx`](src/components/subscription/SubscriptionPlansSection.tsx) | Landing page plan cards |
| [`src/components/subscription/PaystackCheckoutModal.tsx`](src/components/subscription/PaystackCheckoutModal.tsx) | Checkout modal with payment flow |
| [`app/dashboard/subscriptions/page.tsx`](app/dashboard/subscriptions/page.tsx) | Full subscription management dashboard |
| [`app/page.tsx`](app/page.tsx) | Landing page (line 386: SubscriptionPlansSection) |

## Appendix: API Endpoints Reference

| Method | Endpoint | Component/Usage |
|--------|----------|----------------|
| GET | `/subscriptions/plans` | Landing page + dashboard plan cards |
| POST | `/subscriptions/initialize` | Checkout modal step 1 |
| POST | `/subscriptions/verify-and-create` | Checkout modal step 4 |
| GET | `/subscriptions/my-subscription` | Dashboard active subscription view |
| GET | `/subscriptions/history` | Dashboard history section |
| GET | `/subscriptions/remaining-hours` | Dashboard daily hours card |
| POST | `/subscriptions/cancel-auto-renew` | Dashboard cancel action |
| POST | `/subscriptions/paystack/enable` | (Future use) |
| POST | `/subscriptions/paystack/disable` | Dashboard disable action |
| GET | `/subscriptions/paystack/{code}/manage/link` | Dashboard update card action |
| POST | `/subscriptions/paystack/{code}/manage/email` | Dashboard send email action |
