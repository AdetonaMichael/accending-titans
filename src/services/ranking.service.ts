import { apiClient } from './api-client';
import type { ApiResponse } from '@/types/api.types';
import type { MemberRanking, LeaderboardResponse } from '@/types/ranking.types';

class RankingService {
  /** GET /rankings/my */
  async getMy(): Promise<ApiResponse<{ ranking: MemberRanking }>> {
    return apiClient.get('/rankings/my');
  }

  /** GET /rankings/leaderboard */
  async getLeaderboard(page = 1, per_page = 20): Promise<ApiResponse<LeaderboardResponse>> {
    return apiClient.get(`/rankings/leaderboard?page=${page}&per_page=${per_page}`);
  }
}

export const rankingService = new RankingService();
