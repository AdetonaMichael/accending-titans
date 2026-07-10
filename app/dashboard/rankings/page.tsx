'use client';

import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Award, Medal, Loader2 } from 'lucide-react';

import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { PageSkeleton } from '@/components/shared/SkeletonLoader';
import { rankingService } from '@/services/ranking.service';
import type { MemberRanking, LeaderboardEntry } from '@/types/ranking.types';

export default function RankingsPage() {
  const [ranking, setRanking] = useState<MemberRanking | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [myRes, lbRes] = await Promise.all([
        rankingService.getMy(),
        rankingService.getLeaderboard(),
      ]);

      if (myRes.success && myRes.data) {
        setRanking((myRes.data as any).ranking ?? null);
      }

      if (lbRes.success && lbRes.data) {
        const lbData = (lbRes.data as any).leaderboard ?? [];
        setLeaderboard(lbData);
      }
    } catch (err) {
      console.error('Error fetching rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: string | null) => {
    const map: Record<string, string> = {
      vvip: '👑',
      vip: '⭐',
      regular: '🌱',
    };
    return map[rank?.toLowerCase() || ''] || '📋';
  };

  const getRankBadgeVariant = (rank: string | null) => {
    const map: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
      vvip: 'success',
      vip: 'warning',
      regular: 'info',
    };
    return map[rank?.toLowerCase() || ''] || 'default';
  };

  const getLeaderboardRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return null;
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-[#C9A84C]" /> Rankings
        </h1>
        <p className="text-sm text-gray-500">Your rank and member leaderboard</p>
      </section>

      {/* My Rank */}
      {ranking && (
        <Card className="rounded-2xl border border-[#e5e7eb] bg-gradient-to-br from-[#C9A84C]/5 to-[#FDFAF3] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Your Rank</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-3xl">{getRankIcon(ranking.current_rank)}</span>
                <div>
                  <p className="text-2xl font-extrabold text-gray-900 capitalize">{ranking.current_rank || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{ranking.total_months_subscribed} months subscribed</p>
                </div>
              </div>
            </div>
            <Badge variant={getRankBadgeVariant(ranking.current_rank)} size="md" className="capitalize">
              {ranking.current_rank || 'N/A'}
            </Badge>
          </div>

          {ranking.next_rank_info?.next_rank && (
            <div className="mt-5 rounded-xl bg-white border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">
                  Next Rank: <span className="capitalize text-[#C9A84C]">{ranking.next_rank_info.next_rank}</span>
                </span>
                <span className="text-xs text-gray-500">
                  {ranking.next_rank_info.months_remaining} months remaining
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#D4B85A] transition-all"
                  style={{ width: `${Math.min(ranking.next_rank_info.progress_percentage, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-right">
                {ranking.next_rank_info.progress_percentage.toFixed(0)}% complete
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Leaderboard */}
      <Card className="rounded-2xl border border-[#e5e7eb] bg-white p-0 shadow-[0_10px_35px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#C9A84C]" /> Leaderboard
          </h2>
        </div>

        {leaderboard.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Award className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-gray-500">No leaderboard data available yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {leaderboard.map((entry) => (
              <div key={entry.user_id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center">
                    {getLeaderboardRankIcon(entry.rank) || (
                      <span className="text-sm font-bold text-gray-400">#{entry.rank}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{entry.name}</p>
                    {entry.business_name && (
                      <p className="text-xs text-gray-500">{entry.business_name}</p>
                    )}
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <Badge variant={getRankBadgeVariant(entry.current_rank)} size="sm" className="capitalize">
                    {entry.current_rank}
                  </Badge>
                  <span className="text-xs text-gray-500">{entry.total_months_subscribed}mo</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
