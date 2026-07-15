/**
 * Subscription Types
 * Based on Paystack Subscription API — Business & Birthdays Backend
 * 
 * @see plans/business-birthdays-implementation-plan.md
 */

// ──────────────────────────────────────────────
// Subscription Plan
// ──────────────────────────────────────────────
export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  price: number;
  daily_hours_limit: number; // 0 = unlimited
  duration_days: number;
  features: string[] | null;
}

// ──────────────────────────────────────────────
// Daily Hours Info
// ──────────────────────────────────────────────
export interface DailyHoursInfo {
  limit: number;              // Daily limit in hours (0 = unlimited)
  limit_minutes: number;      // Daily limit in minutes
  used_minutes: number;       // Minutes used today
  remaining_minutes: number;   // Minutes remaining (-1 = unlimited)
}

// ──────────────────────────────────────────────
// Active Subscription
// ──────────────────────────────────────────────
export interface ActiveSubscription {
  id: number;
  plan_name: string;
  plan_slug: string;
  price: number;
  start_date: string;       // YYYY-MM-DD
  end_date: string;         // YYYY-MM-DD
  days_remaining: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  auto_renew: boolean;
  paystack_subscription_code: string | null;
  next_payment_date: string | null; // YYYY-MM-DD
  daily_hours: DailyHoursInfo;
}

// ──────────────────────────────────────────────
// Subscription History Item
// ──────────────────────────────────────────────
export interface SubscriptionHistoryItem {
  id: number;
  plan: string;
  start_date: string;
  end_date: string;
  amount: number;
  payment_status: string;
  is_active: boolean;
  created_at: string;
}

// ──────────────────────────────────────────────
// Pagination
// ──────────────────────────────────────────────
export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

// ──────────────────────────────────────────────
// API Response Payloads
// ──────────────────────────────────────────────

export interface PlansResponse {
  plans: SubscriptionPlan[];
}

export interface InitializeSubscriptionResponse {
  authorization_url: string;
  reference: string;
  plan: {
    id: number;
    name: string;
    price: number;
  };
}

export interface VerifyAndCreateResponse {
  subscription: {
    id: number;
    plan_name: string;
    start_date: string;
    end_date: string;
    days_remaining: number;
    payment_status: string;
    auto_renew: boolean;
    paystack_subscription_code: string | null;
    next_payment_date: string | null;
  };
}

export interface MySubscriptionResponse {
  has_active_subscription: boolean;
  subscription: ActiveSubscription | null;
}

export interface HistoryResponse {
  subscriptions: SubscriptionHistoryItem[];
  pagination: PaginationInfo;
}

export interface EnableDisableResponse {
  subscription_id: number;
  paystack_status: string;
}

export interface ManageLinkResponse {
  link: string;
  subscription_code: string;
}

export interface RemainingHoursResponse {
  daily_hours: DailyHoursInfo;
}

export interface CancelAutoRenewResponse {
  subscription_id: number;
  auto_renew: boolean;
}

// ──────────────────────────────────────────────
// Request Types
// ──────────────────────────────────────────────

export interface SubscriptionInitializeRequest {
  plan_id: number;
  authorization_code?: string;
}

export interface VerifyAndCreateRequest {
  reference: string;
  plan_id: number;
}

export interface EnableDisableRequest {
  subscription_code: string;
  email_token: string;
}

export interface HistoryQueryParams {
  page?: number;
  per_page?: number;
}

// ──────────────────────────────────────────────
// Admin Types
// ──────────────────────────────────────────────

export interface AdminSubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  price: number;
  daily_hours_limit: number;
  duration_days: number;
  features: string[] | null;
  is_active: boolean;
  subscribers_count?: number;
  total_revenue?: number;
}

export interface CreatePlanRequest {
  name: string;
  slug: string;
  price: number;
  daily_hours_limit: number;
  duration_days: number;
  interval?: string;
  currency?: string;
  description?: string;
  send_invoices?: boolean;
  send_sms?: boolean;
  invoice_limit?: number;
  features?: string[];
}

export interface UpdatePlanRequest {
  name?: string;
  slug?: string;
  price?: number;
  daily_hours_limit?: number;
  duration_days?: number;
  interval?: string;
  currency?: string;
  description?: string;
  send_invoices?: boolean;
  send_sms?: boolean;
  invoice_limit?: number;
  features?: string[];
  is_active?: boolean;
}

export interface AdminSubscriptionList {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  plan_name: string;
  price: number;
  start_date: string;
  end_date: string;
  days_remaining: number;
  payment_status: string;
  auto_renew: boolean;
  created_at: string;
}
