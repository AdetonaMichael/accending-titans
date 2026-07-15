# Business & Birthdays — Implementation Plan

## Overview

This plan covers the full implementation of the Business & Birthdays module based on the backend API documentation. The work is organized into phases and broken into clear, actionable implementation steps.

---

## Existing Codebase Analysis

### What Already Exists
| Feature | Status | Path |
|---------|--------|------|
| Auth (login, register, verify) | ✅ Complete | [`app/auth/`](app/auth/), [`src/services/auth.service.ts`](src/services/auth.service.ts) |
| Dashboard Layout | ✅ Complete | [`app/dashboard/layout.tsx`](app/dashboard/layout.tsx) |
| Wallet (balance, transactions) | ✅ Partial | [`src/services/wallet.service.ts`](src/services/wallet.service.ts) |
| Referral Program | ✅ Complete | [`app/dashboard/referral/page.tsx`](app/dashboard/referral/page.tsx) |
| Business Catalogue | ✅ Complete (user-side) | [`app/dashboard/catalogue/page.tsx`](app/dashboard/catalogue/page.tsx) |
| Rewards (birthday rewards concept) | ⚠️ Exists but needs rewrite | [`app/dashboard/rewards/page.tsx`](app/dashboard/rewards/page.tsx) |
| Notifications | ✅ Complete | [`src/services/notification.service.ts`](src/services/notification.service.ts) |
| Admin: Users, Roles, Permissions | ✅ Complete | Recently implemented |
| Admin: Dashboard Stats | ✅ Complete | [`app/admin/page.tsx`](app/admin/page.tsx) |
| API Client & Axios Setup | ✅ Complete | [`src/services/api-client.ts`](src/services/api-client.ts) |
| Auth Store (Zustand) | ✅ Complete | [`src/store/auth.store.ts`](src/store/auth.store.ts) |

### What Needs To Be Created
| Feature | Priority | Complexity |
|---------|----------|------------|
| **Subscription Plans** (browse & subscribe) | High | Medium |
| **My Subscription** (active sub, remaining hours) | High | Medium |
| **Session Tracking** (start/end/remaining hours) | High | Medium |
| **Portfolio Management** (Business Catalogueo CRUD) | High | High |
| **Browse Portfolios** (public catalogue) | Medium | Medium |
| **Birthday Rewards** (eligibility/reward display) | High | Medium |
| **Upcoming Birthdays** (public list) | Medium | Low |
| **Content Submission** (submit content for review) | Medium | Medium |
| **My Wallet** (balance + withdraw) | Medium | Low |
| **Member Rankings** (rank info + leaderboard) | Medium | Low |
| **Admin: Subscriptions** (manage plans) | High | Medium |
| **Admin: Content Review** (queue, approve/reject) | High | High |
| **Admin: Birthday Management** (assign gifts) | High | High |
| **Admin: Portfolio Approvals** | Medium | Medium |
| **Admin: Ad Management** | Low | Low |

---

## Plan Structure

### Phase 1: Types & Services Foundation
Create all TypeScript interfaces and API service classes.

### Phase 2: User Dashboard Screens
Build all user-facing screens.

### Phase 3: Admin Dashboard Screens
Build admin management screens.

### Phase 4: Navigation & Route Updates
Update navigation, sidebar, and route guards.

---

## Phase 1: Types & Services Foundation

### Task 1.1 — Create Subscription Types

**File:** [`src/types/subscription.types.ts`](src/types/subscription.types.ts)

```typescript
export interface SubscriptionPlan {
  id: number;
  name: string;          // "Basic" | "Standard" | "Premium"
  slug: string;
  price: number;
  daily_hours_limit: number;
  duration_days: number;
  features: string[] | null;
}

export interface UserSubscriptionInfo {
  plan_name: string;
  plan_slug: string;
  start_date: string;
  end_date: string;
  days_remaining: number;
  daily_hours_limit: number;
  payment_status: string;
}

export interface ActiveSubscription {
  id: number;
  plan_name: string;
  plan_slug: string;
  price: number;
  start_date: string;
  end_date: string;
  days_remaining: number;
  payment_status: string;
  auto_renew: boolean;
  daily_hours: DailyHoursInfo;
}

export interface DailyHoursInfo {
  limit: number;
  limit_minutes: number;
  used_minutes: number;
  remaining_minutes: number;
}

export interface SubscribeRequest {
  plan_id: number;
  payment_reference: string;
  auto_renew?: boolean;
}
```

### Task 1.2 — Create Portfolio Types

**File:** [`src/types/portfolio.types.ts`](src/types/portfolio.types.ts)

```typescript
export interface Portfolio {
  id: number;
  business_name: string;
  business_category: string | null;
  business_description: string | null;
  whatsapp_number: string | null;
  profile_image_url: string | null;
  cover_image_url: string | null;
  is_approved: boolean;
  is_featured: boolean;
  views_count: number;
  user?: { id: number; name: string; profile_photo_url: string | null };
  items: PortfolioItem[];
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string | null;
  price: number | null;
  image_urls: string[] | null;
  whatsapp_dm_link: string | null;
  is_active: boolean;
}

export interface UpsertPortfolioRequest {
  business_name: string;
  business_category?: string;
  business_description?: string;
  whatsapp_number?: string;
  profile_image_url?: string;
  cover_image_url?: string;
}

export interface AddPortfolioItemRequest {
  title: string;
  description?: string;
  price?: number;
  image_urls?: string[];
  whatsapp_dm_link?: string;
}
```

### Task 1.3 — Create Birthday Types

**File:** [`src/types/birthday.types.ts`](src/types/birthday.types.ts)

```typescript
export interface BirthdayEligibility {
  date_of_birth: string | null;
  birthday_this_month: boolean;
  total_subscription_months: number;
  is_eligible_for_reward: boolean;
  is_shoutout_only: boolean;
  current_reward: BirthdayReward | null;
}

export interface BirthdayReward {
  id: number;
  reward_type: string;
  status: string;
  is_shoutout_only: boolean;
  gift_provider?: { id: number; name: string };
  gift_item?: { id: number; title: string; price: number | null };
}

export interface UpcomingBirthday {
  user_id: number;
  name: string;
  profile_photo_url: string | null;
  birth_date: string;
  age: number;
  days_until_birthday: number;
  rank: string | null;
  total_subscription_months: number;
  business: { name: string; category: string } | null;
}
```

### Task 1.4 — Create Content Submission Types

**File:** [`src/types/content.types.ts`](src/types/content.types.ts)

```typescript
export interface ContentSubmission {
  id: number;
  title: string;
  content_type: string;
  status: string;
  media_url: string;
  duration_seconds: number | null;
  submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
  estimated_review_completion: string;
}

export interface SubmitContentRequest {
  title: string;
  content_type: string;
  media_url: string;
  duration_seconds?: number;
  description?: string;
}
```

### Task 1.5 — Create Ranking Types + Update User Types

**File:** [`src/types/ranking.types.ts`](src/types/ranking.types.ts)  
**Modify:** [`src/types/api.types.ts`](src/types/api.types.ts) (add fields to User interface)

Add to User interface:
```typescript
membership_id: string | null;
is_titan_member: boolean;
current_rank: string | null;
total_subscription_months: number;
wallet_balance: number;
subscription: UserSubscriptionInfo | null;
```

### Task 1.6 — Create Subscription Service

**File:** [`src/services/subscription.service.ts`](src/services/subscription.service.ts)

Methods:
- `getPlans()` — GET `/subscriptions/plans`
- `subscribe(data)` — POST `/subscriptions/subscribe`
- `getMySubscription()` — GET `/subscriptions/my-subscription`
- `getHistory()` — GET `/subscriptions/history`
- `cancelAutoRenew()` — POST `/subscriptions/cancel-auto-renew`
- `getRemainingHours()` — GET `/subscriptions/remaining-hours`
- Admin: `getAll()` — GET `/admin/subscriptions`
- Admin: `createPlan(data)` — POST `/admin/subscriptions/plans`
- Admin: `updatePlan(id, data)` — PUT `/admin/subscriptions/plans/{id}`
- Admin: `deletePlan(id)` — DELETE `/admin/subscriptions/plans/{id}`

### Task 1.7 — Create Portfolio Service

**File:** [`src/services/portfolio.service.ts`](src/services/portfolio.service.ts)

Methods:
- `getPortfolios(params?)` — GET `/portfolios`
- `getCategories()` — GET `/portfolios/categories`
- `getPortfolio(id)` — GET `/portfolios/{id}`
- `getMy()` — GET `/portfolios/my`
- `upsert(data)` — POST `/portfolios`
- `addItem(data)` — POST `/portfolios/items`
- `updateItem(id, data)` — PUT `/portfolios/items/{id}`
- `deleteItem(id)` — DELETE `/portfolios/items/{id}`
- Admin: `getAll(status?)` — GET `/admin/portfolios`
- Admin: `update(id, data)` — PUT `/admin/portfolios/{id}`

### Task 1.8 — Create Birthday Service

**File:** [`src/services/birthday.service.ts`](src/services/birthday.service.ts)

Methods:
- `getUpcoming()` — GET `/birthdays/upcoming`
- `getEligibility()` — GET `/birthdays/eligibility`
- `getMyReward()` — GET `/birthdays/my-reward`
- Admin: `getAll(month?)` — GET `/admin/birthdays`
- Admin: `getEligible()` — GET `/admin/birthdays/eligible`
- Admin: `assignGift(data)` — POST `/admin/birthdays/assign-gift`
- Admin: `markDelivered(id)` — POST `/admin/birthdays/{id}/mark-delivered`

### Task 1.9 — Create Content Service

**File:** [`src/services/content.service.ts`](src/services/content.service.ts)

Methods:
- `submit(data)` — POST `/content/submit`
- `getMySubmissions()` — GET `/content/my-submissions`
- `getSubmission(id)` — GET `/content/submission/{id}`
- Admin: `getPending()` — GET `/admin/content/pending`
- Admin: `getAll(status?)` — GET `/admin/content/all`
- Admin: `approve(id)` — POST `/admin/content/{id}/approve`
- Admin: `reject(id, reason)` — POST `/admin/content/{id}/reject`

### Task 1.10 — Create Session Service

**File:** [`src/services/session.service.ts`](src/services/session.service.ts)

Methods:
- `start()` — POST `/sessions/start`
- `end(session_id)` — POST `/sessions/end`
- `getToday()` — GET `/sessions/today`
- `getRemaining()` — GET `/sessions/remaining`

### Task 1.11 — Create Ranking Service

**File:** [`src/services/ranking.service.ts`](src/services/ranking.service.ts)

Methods:
- `getMy()` — GET `/rankings/my`
- `getLeaderboard()` — GET `/rankings/leaderboard`

### Task 1.12 — Update Wallet Service (add withdraw)

**Modify:** [`src/services/wallet.service.ts`](src/services/wallet.service.ts)

Add:
- `withdraw(data)` — POST `/wallet/withdraw`

### Task 1.13 — Update Types Index

**Modify:** [`src/types/index.ts`](src/types/index.ts) — export all new type modules

---

## Phase 2: User Dashboard Screens

### Task 2.1 — Rewrite Dashboard Home

**Modify:** [`app/dashboard/page.tsx`](app/dashboard/page.tsx)

**Data to fetch on mount:**
- `GET /subscriptions/my-subscription`
- `GET /rankings/my`
- `GET /birthdays/upcoming`

**Layout:**
```
┌──────────────────────────────────┐
│  👋 Welcome, {firstName}!        │
│  Membership: TITAN-0042          │
├──────────────────────────────────┤
│  ┌── Active Subscription ──────┐ │
│  │  Plan: Basic - ₦2,000/mo    │ │
│  │  Status bar with days left   │ │
│  │  Hours Today: 3h 45m / 6h   │ │
│  └──────────────────────────────┘ │
├──────────────────────────────────┤
│  ┌── Your Rank ────────────────┐ │
│  │  ⭐ VIP Member              │ │
│  │  10 months subscribed       │ │
│  │  🎯 2 more months to VVIP  │ │
│  └──────────────────────────────┘ │
├──────────────────────────────────┤
│  Quick Actions:                  │
│  [Portfolio] [Catalogue]         │
│  [Wallet: ₦12,500] [Referrals]   │
├──────────────────────────────────┤
│  🎂 Upcoming Birthdays           │
│  • Jane D. - Jul 15              │
│  • Bob S. - Jul 22               │
└──────────────────────────────────┘
```

### Task 2.2 — Subscription Plans Page

**Create:** [`app/dashboard/subscriptions/page.tsx`](app/dashboard/subscriptions/page.tsx)

- Show 3 plan cards (Basic, Standard, Premium)
- Highlight current/popular plan
- Subscribe flow → payment modal → redirect
- Fetch: `GET /subscriptions/plans`

### Task 2.3 — My Subscription Page / Dashboard Section

The active subscription info will be displayed on the dashboard home and also on a dedicated page.

**Create:** [`app/dashboard/subscriptions/my/page.tsx`](app/dashboard/subscriptions/my/page.tsx)

- Show active subscription details
- Show remaining hours with progress bar
- Cancel auto-renew button
- Subscription history

### Task 2.4 — Portfolio Management Page

**Rewrite:** [`app/dashboard/catalogue/page.tsx`](app/dashboard/catalogue/page.tsx)

The existing catalogue page seems to be a portfolio management page already. It needs to be enhanced to match the new API:

- Portfolio form: business name, category, WhatsApp, description
- Portfolio items CRUD: title, price, images, WhatsApp DM link
- Approval status indicator
- Fetch: `GET /portfolios/my`, `POST /portfolios`, `POST /portfolios/items`, etc.

### Task 2.5 — Browse Member Catalogues (Public)

**Create or Update:** [`app/catalogue/page.tsx`](app/catalogue/page.tsx) (public page)

- Search bar for businesses
- Category filter
- Portfolio cards grid
- Click to view portfolio details + items
- WhatsApp DM button on each item

### Task 2.6 — Birthday Rewards Page

**Rewrite:** [`app/dashboard/rewards/page.tsx`](app/dashboard/rewards/page.tsx)

The existing rewards page seems to be for a different reward system. Need to rewrite for birthday rewards:

- Show birthday eligibility
- Show current reward status
- Show upcoming birthdays this month
- Fetch: `GET /birthdays/eligibility`, `GET /birthdays/my-reward`, `GET /birthdays/upcoming`

### Task 2.7 — Content Submission Page

**Create:** [`app/dashboard/content/page.tsx`](app/dashboard/content/page.tsx)

- Form: title, content type, media URL, duration, description
- Submit for review
- Show my submissions list with status
- Auto-approval timer countdown

### Task 2.8 — Wallet Page

**Create:** [`app/dashboard/wallet/page.tsx`](app/dashboard/wallet/page.tsx)

- Balance display
- Transaction history list
- Withdraw button (modal)
- Fetch: `GET /wallet/balance`, `GET /wallet/transactions`

### Task 2.9 — Rankings Page

**Create:** [`app/dashboard/rankings/page.tsx`](app/dashboard/rankings/page.tsx)

- My rank info with progress to next rank
- Leaderboard of top members
- Fetch: `GET /rankings/my`, `GET /rankings/leaderboard`

### Task 2.10 — Update Dashboard Navigation

**Modify:** [`app/dashboard/layout.tsx`](app/dashboard/layout.tsx)

Update `navItems` to include new links:
```
Dashboard (Home)
Business Catalogueo / Catalogue
Subscription Plans
Birthday Rewards
Wallet
Content Submission
Rankings
Referral Program
(Existing: Messages, Opportunities, Settings)
```

---

## Phase 3: Admin Dashboard Screens

### Task 3.1 — Update Admin Dashboard Stats

**Modify:** [`app/admin/page.tsx`](app/admin/page.tsx)

Add new stat sections from API response:
- `subscription_analytics` → total active subs, revenue, by-plan breakdown
- `member_rankings` → titan member count, rank distribution
- `birthday_analytics` → eligible/rewards/pending/delivered
- `content_review` → pending/approved/rejected
- `portfolio_stats` → total/approved/pending

### Task 3.2 — Subscription Management (Admin)

**Create:** [`app/admin/subscriptions/page.tsx`](app/admin/subscriptions/page.tsx)

- Table of all subscriptions
- Plan management: create/edit/deactivate plans
- Recent subscribers list

### Task 3.3 — Content Review Queue (Admin)

**Create:** [`app/admin/content/page.tsx`](app/admin/content/page.tsx)

- Tab navigation: Pending | Approved | Rejected
- Pending queue with auto-approval timers
- Approve/Reject buttons with rejection reason modal
- Preview content capability

### Task 3.4 — Birthday Management (Admin)

**Create:** [`app/admin/birthdays/page.tsx`](app/admin/birthdays/page.tsx)

- Eligible members this month list
- Assign gift modal (select portfolio item from another member)
- Mark as delivered button
- Reward status tracking

### Task 3.5 — Portfolio Approvals (Admin)

**Create:** [`app/admin/portfolios/page.tsx`](app/admin/portfolios/page.tsx)

- Pending/Approved/Featured tabs
- Approve/reject portfolios
- Toggle featured status

### Task 3.6 — Ad Management (Admin)

**Create:** [`app/admin/ads/page.tsx`](app/admin/ads/page.tsx)

- List all ads
- Toggle active/inactive

### Task 3.7 — Update Admin Navigation

**Modify:** [`app/admin/layout.tsx`](app/admin/layout.tsx)

Add new nav items:
```
Community: [Users] [Roles] [Permissions] [Portfolios]
Growth: [...existing...] [Subscriptions]
Engagement: [...existing...] [Content Review] [Birthdays]
System: [...existing...]
```

---

## Phase 4: Route Updates & Navigation

### Task 4.1 — Update PermissionGuard

**Modify:** [`src/hooks/usePermissionGuard.ts`](src/hooks/usePermissionGuard.ts)

Add new permission slugs:
- `manage_subscriptions`
- `review_content`
- `manage_portfolios`
- `manage_birthday_rewards`
- `manage_ads`
- `view_member_rankings`
- `view_wallet`
- `submit_content`
- `manage_own_portfolio`

Add new role slugs:
- `titan_member`
- `content_reviewer`

Add convenience methods:
- `isTitanMember()`
- `canManageSubscriptions()`
- `canReviewContent()`
- `canViewWallet()`
- `canManageOwnPortfolio()`

### Task 4.2 — Add Route Guards

Add permission/role checks on admin routes for:
- `/admin/subscriptions` → `manage_subscriptions`
- `/admin/content` → `review_content`
- `/admin/birthdays` → `manage_birthday_rewards`
- `/admin/portfolios` → `manage_portfolios`
- `/admin/ads` → `manage_ads`

---

## Design System & Styling

All screens should follow the existing design system:

### Color Palette
| Element | Color |
|---------|-------|
| Brand accent | `#C9A84C` (gold) |
| Active nav | `bg-[#C9A84C] text-white` |
| Background | `bg-[#f8f8f8]` |
| Cards | `bg-white` with `border-[#e5e7eb]` |
| Text primary | `text-[#111827]` |
| Text secondary | `text-[#6b7280]` |
| Success | `bg-green-100 text-green-800` |
| Danger | `bg-red-100 text-red-800` |
| Warning | `bg-yellow-100 text-yellow-800` |

### Font
- Plus Jakarta Sans (already configured via global style tags)

### Component Patterns
- Cards: `rounded-2xl border border-[#e5e7eb] bg-white p-5 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.04)]`
- Tables: `overflow-hidden rounded-[28px] border border-[#e5e7eb] bg-white p-0 shadow-[0_10px_35px_rgba(0,0,0,0.04)]`
- Buttons: Gold `bg-[#c9a84c]` for primary, outline for secondary
- Modals: Use `AdminModal` component (newly created)
- Badges: Use shared `Badge` component
- Inputs: Use shared `Input` component
- Forms: Responsive grid layout (`grid grid-cols-1 gap-4 md:grid-cols-2`)

---

## Implementation Order

The tasks should be implemented in this exact order to avoid dependency issues:

```
Phase 1 (Foundation):
  1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 → 1.7 → 1.8 → 1.9 → 1.10 → 1.11 → 1.12 → 1.13

Phase 2 (User Screens):
  2.10 (navigation first) → 2.1 (dashboard home) → 2.2 (subscription plans) → 
  2.3 (my subscription) → 2.4 (portfolio management) → 2.5 (browse catalogues) →
  2.6 (birthday rewards) → 2.7 (content submission) → 2.8 (wallet) → 2.9 (rankings)

Phase 3 (Admin Screens):
  3.1 (dashboard stats) → 3.7 (admin nav) → 3.2 (subscriptions) → 
  3.3 (content review) → 3.4 (birthdays) → 3.5 (portfolios) → 3.6 (ads)

Phase 4 (Guards):
  4.1 (permissions) → 4.2 (route guards)
```

---

## File Summary

### New Files (24 files)
| File | Purpose |
|------|---------|
| `src/types/subscription.types.ts` | Subscription type definitions |
| `src/types/portfolio.types.ts` | Portfolio type definitions |
| `src/types/birthday.types.ts` | Birthday type definitions |
| `src/types/content.types.ts` | Content submission types |
| `src/types/ranking.types.ts` | Ranking types |
| `src/services/subscription.service.ts` | Subscription API service |
| `src/services/portfolio.service.ts` | Portfolio API service |
| `src/services/birthday.service.ts` | Birthday API service |
| `src/services/content.service.ts` | Content API service |
| `src/services/session.service.ts` | Session tracking API service |
| `src/services/ranking.service.ts` | Ranking API service |
| `app/dashboard/subscriptions/page.tsx` | Subscription plans page |
| `app/dashboard/subscriptions/my/page.tsx` | My subscription page |
| `app/dashboard/wallet/page.tsx` | Wallet page |
| `app/dashboard/content/page.tsx` | Content submission page |
| `app/dashboard/rankings/page.tsx` | Rankings page |
| `app/catalogue/page.tsx` | Public browse catalogues page |
| `app/admin/subscriptions/page.tsx` | Admin subscription management |
| `app/admin/content/page.tsx` | Admin content review |
| `app/admin/birthdays/page.tsx` | Admin birthday management |
| `app/admin/portfolios/page.tsx` | Admin portfolio approvals |
| `app/admin/ads/page.tsx` | Admin ad management |

### Modified Files (8 files)
| File | Change |
|------|--------|
| `src/types/api.types.ts` | Add new User fields |
| `src/types/index.ts` | Export new type modules |
| `src/services/wallet.service.ts` | Add withdraw method |
| `src/hooks/usePermissionGuard.ts` | Add new permissions/roles |
| `app/dashboard/layout.tsx` | Update nav items |
| `app/dashboard/page.tsx` | Rewrite dashboard home |
| `app/dashboard/catalogue/page.tsx` | Rewrite as portfolio management |
| `app/dashboard/rewards/page.tsx` | Rewrite as birthday rewards |
| `app/admin/layout.tsx` | Add admin nav items |
| `app/admin/page.tsx` | Add new stat sections |
