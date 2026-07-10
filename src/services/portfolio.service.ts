import { apiClient } from './api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  Portfolio,
  PortfolioItem,
  PortfolioCategory,
  UpsertPortfolioRequest,
  AddPortfolioItemRequest,
  UpdatePortfolioItemRequest,
  PortfolioBrowseParams,
  AdminPortfolioUpdateRequest,
} from '@/types/portfolio.types';

class PortfolioService {
  // ── Public endpoints ──────────────────────────────────────────────

  /** GET /portfolios */
  async browse(params?: PortfolioBrowseParams): Promise<ApiResponse<PaginatedResponse<Portfolio>>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const qs = searchParams.toString();
    return apiClient.get(`/portfolios${qs ? `?${qs}` : ''}`);
  }

  /** GET /portfolios/categories */
  async getCategories(): Promise<ApiResponse<{ categories: PortfolioCategory[] }>> {
    return apiClient.get('/portfolios/categories');
  }

  /** GET /portfolios/{id} */
  async getPortfolio(id: number): Promise<ApiResponse<{ portfolio: Portfolio }>> {
    return apiClient.get(`/portfolios/${id}`);
  }

  // ── Authenticated user endpoints ──────────────────────────────────

  /** GET /portfolios/my */
  async getMy(): Promise<ApiResponse<{ portfolio: Portfolio | null }>> {
    return apiClient.get('/portfolios/my');
  }

  /** POST /portfolios */
  async upsert(data: UpsertPortfolioRequest): Promise<ApiResponse<{ portfolio: Portfolio }>> {
    return apiClient.post('/portfolios', data);
  }

  /** POST /portfolios/items */
  async addItem(data: AddPortfolioItemRequest): Promise<ApiResponse<{ item: PortfolioItem }>> {
    return apiClient.post('/portfolios/items', data);
  }

  /** PUT /portfolios/items/{id} */
  async updateItem(id: number, data: UpdatePortfolioItemRequest): Promise<ApiResponse<{ item: PortfolioItem }>> {
    return apiClient.put(`/portfolios/items/${id}`, data);
  }

  /** DELETE /portfolios/items/{id} */
  async deleteItem(id: number): Promise<ApiResponse<null>> {
    return apiClient.delete(`/portfolios/items/${id}`);
  }

  // ── Admin endpoints ───────────────────────────────────────────────

  /** GET /admin/portfolios */
  async adminGetAll(status?: string, page = 1, per_page = 20): Promise<ApiResponse<PaginatedResponse<Portfolio>>> {
    const params = new URLSearchParams({ page: String(page), per_page: String(per_page) });
    if (status) params.append('status', status);
    return apiClient.get(`/admin/portfolios?${params.toString()}`);
  }

  /** PUT /admin/portfolios/{id} */
  async adminUpdate(id: number, data: AdminPortfolioUpdateRequest): Promise<ApiResponse<{ portfolio: Portfolio }>> {
    return apiClient.put(`/admin/portfolios/${id}`, data);
  }
}

export const portfolioService = new PortfolioService();
