import { apiClient } from './api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  ContentSubmission,
  SubmitContentRequest,
  AdminContentSubmission,
  RejectContentRequest,
} from '@/types/content.types';

class ContentService {
  // ── User endpoints ────────────────────────────────────────────────

  /** POST /content/submit */
  async submit(data: SubmitContentRequest): Promise<ApiResponse<{ submission: ContentSubmission }>> {
    return apiClient.post('/content/submit', data);
  }

  /** GET /content/my-submissions */
  async getMySubmissions(page = 1, per_page = 20): Promise<ApiResponse<PaginatedResponse<ContentSubmission>>> {
    return apiClient.get(`/content/my-submissions?page=${page}&per_page=${per_page}`);
  }

  /** GET /content/submission/{id} */
  async getSubmission(id: number): Promise<ApiResponse<{ submission: ContentSubmission }>> {
    return apiClient.get(`/content/submission/${id}`);
  }

  // ── Admin endpoints ───────────────────────────────────────────────

  /** GET /admin/content/pending */
  async adminGetPending(page = 1, per_page = 20): Promise<ApiResponse<PaginatedResponse<AdminContentSubmission>>> {
    return apiClient.get(`/admin/content/pending?page=${page}&per_page=${per_page}`);
  }

  /** GET /admin/content/all */
  async adminGetAll(status?: string, page = 1, per_page = 20): Promise<ApiResponse<PaginatedResponse<AdminContentSubmission>>> {
    const params = new URLSearchParams({ page: String(page), per_page: String(per_page) });
    if (status) params.append('status', status);
    return apiClient.get(`/admin/content/all?${params.toString()}`);
  }

  /** POST /admin/content/{id}/approve */
  async adminApprove(id: number): Promise<ApiResponse<{ submission: AdminContentSubmission }>> {
    return apiClient.post(`/admin/content/${id}/approve`);
  }

  /** POST /admin/content/{id}/reject */
  async adminReject(id: number, data: RejectContentRequest): Promise<ApiResponse<{ submission: AdminContentSubmission }>> {
    return apiClient.post(`/admin/content/${id}/reject`, data);
  }
}

export const contentService = new ContentService();
