/**
 * Admin Dashboard Stats Types
 * Based on the GET /api/v1/admin/stats response
 */

export interface DailyCount {
  date: string;
  count: number;
}

export interface MonthlyCount {
  month: string;
  count: number;
}

export interface UserOverview {
  total_users: number;
  active_users: number;
  verified_users: number;
  unverified_users: number;
  phone_verified_users: number;
  deleted_users: number;
  users_with_complete_profile: number;
  user_completion_rate: number;
}

export interface RegistrationTrend {
  daily_30_days: DailyCount[];
  monthly_6_months: MonthlyCount[];
  today: number;
  this_week: number;
  this_month: number;
  last_7_days: number;
}

export interface RoleDistribution {
  admin: number;
  user: number;
  customer: number;
}

export interface LoginAnalytics {
  total_logins: number;
  today: number;
  this_week: number;
  this_month: number;
  by_channel: Record<string, number>;
  trend_14_days: DailyCount[];
}

export interface ActiveUsersMetrics {
  daily_active_users: number;
  weekly_active_users: number;
  monthly_active_users: number;
}

export interface TopReferrer {
  user_id: number;
  name: string;
  email: string;
  total_referrals: number;
}

export interface ReferralAnalytics {
  total_referral_links: number;
  users_with_referral_links: number;
  total_referrals: number;
  referral_conversion_rate: number;
  average_referrals_per_referrer: number;
  today: number;
  this_week: number;
  this_month: number;
  trend_30_days: DailyCount[];
  monthly_6_months: MonthlyCount[];
  top_referrers: TopReferrer[];
}

export interface NotificationAnalytics {
  total_notifications: number;
  unread_notifications: number;
  by_type: Array<{ type: string; count: number }>;
  by_priority: Array<{ priority: string; count: number }>;
  trend_14_days: DailyCount[];
}

export interface VerificationFunnel {
  registered: number;
  email_verified: number;
  phone_verified: number;
  profile_completed: number;
}

export interface VerificationBreakdown {
  both_verified: number;
  only_email_verified: number;
  only_phone_verified: number;
  neither_verified: number;
}

export interface AdminDashboardStatsData {
  user_overview: UserOverview;
  registration_trend: RegistrationTrend;
  role_distribution: RoleDistribution;
  login_analytics: LoginAnalytics;
  active_users_metrics: ActiveUsersMetrics;
  referral_analytics: ReferralAnalytics;
  notification_analytics: NotificationAnalytics;
  verification_funnel: VerificationFunnel;
  verification_breakdown: VerificationBreakdown;
}

export interface AdminStatsResponseData {
  stats: AdminDashboardStatsData;
}
