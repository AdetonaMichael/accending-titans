/**
 * Ranking & Leaderboard Types
 */

export interface MemberRanking {
  current_rank: string;           // "regular" | "vip" | "vvip"
  total_months_subscribed: number;
  consecutive_months: number;
  rank_achieved_at: string | null;
  next_rank_info: {
    next_rank: string | null;
    months_remaining: number | null;
    progress_percentage: number;
  };
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  name: string;
  profile_photo_url: string | null;
  current_rank: string;
  total_months_subscribed: number;
  business_name: string | null;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total_count: number;
  user_rank?: LeaderboardEntry;
}
