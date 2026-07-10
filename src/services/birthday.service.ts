import { apiClient } from './api-client';
import type { ApiResponse } from '@/types/api.types';
import type {
  BirthdayEligibility,
  BirthdayReward,
  UpcomingBirthday,
  AdminBirthdayMember,
  AssignGiftRequest,
} from '@/types/birthday.types';

class BirthdayService {
  // ── User endpoints ────────────────────────────────────────────────

  /** GET /birthdays/upcoming */
  async getUpcoming(): Promise<ApiResponse<{ upcoming: UpcomingBirthday[] }>> {
    return apiClient.get('/birthdays/upcoming');
  }

  /** GET /birthdays/eligibility */
  async getEligibility(): Promise<ApiResponse<{ eligibility: BirthdayEligibility }>> {
    return apiClient.get('/birthdays/eligibility');
  }

  /** GET /birthdays/my-reward */
  async getMyReward(): Promise<ApiResponse<{ reward: BirthdayReward | null }>> {
    return apiClient.get('/birthdays/my-reward');
  }

  // ── Admin endpoints ───────────────────────────────────────────────

  /** GET /admin/birthdays */
  async adminGetAll(month?: string): Promise<ApiResponse<{ members: AdminBirthdayMember[] }>> {
    const params = month ? `?month=${month}` : '';
    return apiClient.get(`/admin/birthdays${params}`);
  }

  /** GET /admin/birthdays/eligible */
  async adminGetEligible(): Promise<ApiResponse<{ members: AdminBirthdayMember[] }>> {
    return apiClient.get('/admin/birthdays/eligible');
  }

  /** POST /admin/birthdays/assign-gift */
  async adminAssignGift(data: AssignGiftRequest): Promise<ApiResponse<{ reward: BirthdayReward }>> {
    return apiClient.post('/admin/birthdays/assign-gift', data);
  }

  /** POST /admin/birthdays/{id}/mark-delivered */
  async adminMarkDelivered(id: number): Promise<ApiResponse<{ reward: BirthdayReward }>> {
    return apiClient.post(`/admin/birthdays/${id}/mark-delivered`);
  }
}

export const birthdayService = new BirthdayService();
