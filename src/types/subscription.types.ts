/**
 * Subscription Types
 * Based on backend subscription system
 */

export interface SubscriptionPlan {
  id: number;
  name: string;           // "Basic" | "Standard" | "Premium"
  slug: string;           // "basic" | "standard" | "premium"
  price: number;
  daily_hours_limit: number; // 6, 12, or 0 for unlimited
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
  payment_status: string; // "paid" | "pending" | "failed"
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
  limit: number;              // 0 = unlimited
  limit_minutes: number;
  used_minutes: number;
  remaining_minutes: number;  // -1 = unlimited
}

export interface SubscribeRequest {
  plan_id: number;
  payment_reference: string;
  auto_renew?: boolean;
}

export interface SubscriptionHistory {
  id: number;
  plan_name: string;
  price: number;
  start_date: string;
  end_date: string;
  payment_status: string;
  created_at: string;
}

// Admin types
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
  price: number;
  daily_hours_limit: number;
  duration_days: number;
  features?: string[];
}

export interface UpdatePlanRequest {
  name?: string;
  price?: number;
  daily_hours_limit?: number;
  duration_days?: number;
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
