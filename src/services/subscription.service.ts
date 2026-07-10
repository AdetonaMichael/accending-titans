import { apiClient } from './api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  SubscriptionPlan,
  ActiveSubscription,
  SubscribeRequest,
  SubscriptionHistory,
  AdminSubscriptionPlan,
  CreatePlanRequest,
  UpdatePlanRequest,
  AdminSubscriptionList,
} from '@/types/subscription.types';

class SubscriptionService {
  // ── User endpoints ────────────────────────────────────────────────

  /** GET /subscriptions/plans */
  async getPlans(): Promise<ApiResponse<{ plans: SubscriptionPlan[] }>> {
    return apiClient.get('/subscriptions/plans');
  }

  /** POST /subscriptions/subscribe */
  async subscribe(data: SubscribeRequest): Promise<ApiResponse<{ subscription: ActiveSubscription }>> {
    return apiClient.post('/subscriptions/subscribe', data);
  }

  /** GET /subscriptions/my-subscription */
  async getMySubscription(): Promise<ApiResponse<{ subscription: ActiveSubscription | null }>> {
    return apiClient.get('/subscriptions/my-subscription');
  }

  /** GET /subscriptions/history */
  async getHistory(page = 1, per_page = 20): Promise<ApiResponse<PaginatedResponse<SubscriptionHistory>>> {
    return apiClient.get(`/subscriptions/history?page=${page}&per_page=${per_page}`);
  }

  /** POST /subscriptions/cancel-auto-renew */
  async cancelAutoRenew(): Promise<ApiResponse<{ auto_renew: boolean }>> {
    return apiClient.post('/subscriptions/cancel-auto-renew');
  }

  /** GET /subscriptions/remaining-hours */
  async getRemainingHours(): Promise<ApiResponse<{ daily_hours: { remaining_minutes: number; limit_minutes: number; used_minutes: number } }>> {
    return apiClient.get('/subscriptions/remaining-hours');
  }

  // ── Admin endpoints ───────────────────────────────────────────────

  /** GET /admin/subscriptions */
  async adminGetAll(page = 1, per_page = 20): Promise<ApiResponse<PaginatedResponse<AdminSubscriptionList>>> {
    return apiClient.get(`/admin/subscriptions?page=${page}&per_page=${per_page}`);
  }

  /** POST /admin/subscriptions/plans */
  async adminCreatePlan(data: CreatePlanRequest): Promise<ApiResponse<{ plan: AdminSubscriptionPlan }>> {
    return apiClient.post('/admin/subscriptions/plans', data);
  }

  /** PUT /admin/subscriptions/plans/{id} */
  async adminUpdatePlan(id: number, data: UpdatePlanRequest): Promise<ApiResponse<{ plan: AdminSubscriptionPlan }>> {
    return apiClient.put(`/admin/subscriptions/plans/${id}`, data);
  }

  /** DELETE /admin/subscriptions/plans/{id} */
  async adminDeletePlan(id: number): Promise<ApiResponse<null>> {
    return apiClient.delete(`/admin/subscriptions/plans/${id}`);
  }
}

export const subscriptionService = new SubscriptionService();
