'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Wallet,
  BarChart3,
  UserCheck,
  Clock,
  DollarSign,
  ExternalLink,
  Copy,
  Search,
  Gift,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
} from 'lucide-react';

import { Card, CardBody, CardHeader } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Spinner } from '@/components/shared/Spinner';
import { rewardService } from '@/services/reward.service';
import { referralService } from '@/services/referral.service';
import { Toast } from '@/utils/toast.utils';
import type { ReferralDashboard } from '@/types/rewards.types';
import type { AdminReferralItem, ReferralProgram } from '@/types/referral.types';
import Link from 'next/link';

// ─── Helpers ───────────────────────────────────────────────

const formatCurrency = (amount: number): string =>
  `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

// ─── Stat Widget ───────────────────────────────────────────

interface StatWidgetProps {
  title: string;
  value: string | number;
  helper: string;
  icon: React.ElementType;
  accent?: 'default' | 'gold' | 'green' | 'blue' | 'purple' | 'amber';
}

const accentStyles: Record<string, string> = {
  default: 'bg-gray-50 text-gray-600 border-gray-200',
  gold: 'bg-[#C9A84C]/5 text-[#C9A84C] border-[#C9A84C]/10',
  green: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
};

function StatWidget({ title, value, helper, icon: Icon, accent = 'default' }: StatWidgetProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gray-50/50 transition-all duration-300 group-hover:scale-125" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {title}
          </p>
          <p className="mt-2 text-2xl font-black tracking-tight text-gray-900">
            {value}
          </p>
          <p className="mt-1 text-xs font-medium text-gray-400">{helper}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${accentStyles[accent]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-gray-100 ${className}`} />;
}

// ─── Main Page ────────────────────────────────────────────

export default function AdminReferralDashboardPage() {
  // ─── Analytics (from reward service) ─────────────────
  const [dashboard, setDashboard] = useState<ReferralDashboard | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [errorAnalytics, setErrorAnalytics] = useState('');

  // ─── All Referrals (from referral service) ────────────
  const [referrals, setReferrals] = useState<AdminReferralItem[]>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(true);
  const [errorReferrals, setErrorReferrals] = useState('');

  // ─── Programs ─────────────────────────────────────────
  const [programs, setPrograms] = useState<ReferralProgram[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  // ─── UI States ────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // ─── Fetch ──────────────────────────────────────────────

  const loadAnalytics = useCallback(async () => {
    try {
      setLoadingAnalytics(true);
      setErrorAnalytics('');
      const data = await rewardService.getReferralDashboard();
      setDashboard(data);
    } catch (err) {
      setErrorAnalytics(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  const loadReferrals = useCallback(async () => {
    try {
      setLoadingReferrals(true);
      setErrorReferrals('');
      const data = await referralService.getAllReferrals();
      setReferrals(data);
    } catch (err) {
      setErrorReferrals(err instanceof Error ? err.message : 'Failed to load referrals');
    } finally {
      setLoadingReferrals(false);
    }
  }, []);

  const loadPrograms = useCallback(async () => {
    try {
      setLoadingPrograms(true);
      const data = await referralService.getPrograms();
      setPrograms(data);
    } catch {
      // Non-critical
    } finally {
      setLoadingPrograms(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
    loadReferrals();
    loadPrograms();
  }, [loadAnalytics, loadReferrals, loadPrograms]);

  // ─── Handlers ────────────────────────────────────────────

  const toggleRow = (userId: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const handleCopy = async (text: string, key: string) => {
    const ok = await referralService.copyToClipboard(text);
    if (ok) {
      setCopiedCode(key);
      Toast.success('Copied!');
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  // ─── Filtered referrals ──────────────────────────────────

  const filteredReferrals = referrals.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.user.name.toLowerCase().includes(q) ||
      item.user.email.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q)
    );
  });

  // ─── Derived metrics ────────────────────────────────────

  const totalReferralsCount = referrals.reduce((sum, r) => sum + (r.referrals_count || 0), 0);
  const totalReferrers = referrals.length;
  const avgReferralsPerUser = totalReferrers > 0 ? (totalReferralsCount / totalReferrers).toFixed(1) : '0';

  // ─── Render ──────────────────────────────────────────────

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="min-h-screen bg-gray-50/50 px-4 py-6 text-gray-900 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ─── Header ──────────────────────────────────── */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <Sparkles className="h-3.5 w-3.5 text-[#C9A84C]" />
                Referral Control Center
              </div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                Referral Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
                Track referral performance, qualification progress, payout status,
                commission distribution, and milestone completion rates.
              </p>
            </div>
            <Button
              onClick={() => { loadAnalytics(); loadReferrals(); }}
              variant="secondary"
              size="sm"
              className="w-full rounded-xl border border-gray-200 bg-white px-5 text-gray-700 hover:bg-gray-100 sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </section>

        {/* ─── Reward Dashboard Analytics ──────────────── */}
        {loadingAnalytics ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
        ) : errorAnalytics ? (
          <Card className="rounded-3xl border border-red-200 bg-red-50 shadow-sm">
            <CardBody>
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <h3 className="text-sm font-bold text-red-800">Analytics Unavailable</h3>
                  <p className="mt-1 text-sm text-red-600">{errorAnalytics}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ) : dashboard ? (
          <>
            {/* Main Metrics */}
            <Card className="rounded-3xl border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Referral Overview
                    </p>
                    <h3 className="mt-1 text-xl font-black text-gray-900">Program Performance</h3>
                  </div>
                  <Badge variant="success" className="w-fit">Live Data</Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  <StatWidget
                    title="Total Referrals"
                    value={dashboard.total_referrals ?? 0}
                    helper="Active participants"
                    icon={Users}
                    accent="gold"
                  />
                  <StatWidget
                    title="Qualified for Payout"
                    value={dashboard.qualified_for_payout ?? 0}
                    helper="Ready for distribution"
                    icon={UserCheck}
                    accent="green"
                  />
                  <StatWidget
                    title="Pending Payout"
                    value={dashboard.pending_payout ?? 0}
                    helper="In progress"
                    icon={Clock}
                    accent="amber"
                  />
                  <StatWidget
                    title="Completed Payouts"
                    value={dashboard.completed_payouts ?? 0}
                    helper="Successfully distributed"
                    icon={CheckCircle}
                    accent="blue"
                  />
                </div>
              </CardBody>
            </Card>

            {/* Financial & Status Metrics */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <StatWidget
                title="Total Paid Out"
                value={formatCurrency(dashboard.total_paid_out ?? 0)}
                helper="Cumulative disbursements"
                icon={Wallet}
                accent="green"
              />
              <StatWidget
                title="Outstanding Balance"
                value={formatCurrency(dashboard.outstanding_balance ?? 0)}
                helper="Pending disbursement"
                icon={DollarSign}
                accent="amber"
              />
              <StatWidget
                title="Average Referral Value"
                value={formatCurrency(dashboard.average_referral_value ?? 0)}
                helper="Per referral average"
                icon={BarChart3}
                accent="blue"
              />
            </div>

            {/* Status Distribution */}
            {dashboard.referrals_by_status && (
              <Card className="rounded-3xl border border-gray-200 bg-white shadow-sm">
                <CardHeader>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Referral Status</p>
                  <h3 className="mt-1 text-xl font-black text-gray-900">Status Distribution</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {[
                      { label: 'Pending Milestones', value: dashboard.referrals_by_status.pending_milestone ?? 0, accent: 'amber' },
                      { label: 'Ready for Payout', value: dashboard.referrals_by_status.ready_for_payout ?? 0, accent: 'blue' },
                      { label: 'Completed', value: dashboard.referrals_by_status.completed ?? 0, accent: 'green' },
                    ].map(({ label, value, accent }) => (
                      <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                        <p className="text-sm font-semibold text-gray-500">{label}</p>
                        <p className="mt-2 text-3xl font-black text-gray-900">
                          {value.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Milestone Completion Rates */}
            {dashboard.milestone_completion_rates && (
              <Card className="rounded-3xl border border-gray-200 bg-white shadow-sm">
                <CardHeader>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Milestone Tracking</p>
                  <h3 className="mt-1 text-xl font-black text-gray-900">Milestone Completion Rates</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-5 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    {[
                      { label: 'Email Verified', rate: dashboard.milestone_completion_rates.email_verified ?? 0 },
                      { label: 'Phone Verified', rate: dashboard.milestone_completion_rates.phone_verified ?? 0 },
                      { label: 'Wallet Funded', rate: dashboard.milestone_completion_rates.wallet_funded ?? 0 },
                      { label: 'First Transaction', rate: dashboard.milestone_completion_rates.first_transaction ?? 0 },
                    ].map(({ label, rate }) => {
                      const safeRate = Math.min(Math.max(rate || 0, 0), 100);
                      return (
                        <div key={label}>
                          <div className="mb-2 flex items-center justify-between gap-4">
                            <span className="text-sm font-semibold text-gray-600">{label}</span>
                            <span className="text-sm font-black text-gray-900">{safeRate.toFixed(1)}%</span>
                          </div>
                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#D4B85C] transition-all duration-500"
                              style={{ width: `${safeRate}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            )}
          </>
        ) : null}

        {/* ─── All Referrals Table ─────────────────────────── */}
        <Card className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  All Referral Links
                </p>
                <h3 className="mt-1 text-xl font-black text-gray-900">
                  Referrer Overview
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {totalReferrers} referrers &middot; {totalReferralsCount} total referrals
                  &middot; {avgReferralsPerUser} avg per referrer
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search referrers..."
                  className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm font-medium text-gray-900 outline-none transition focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10"
                />
              </div>
            </div>
          </CardHeader>

          <CardBody>
            {loadingReferrals ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
              </div>
            ) : errorReferrals ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <div>
                    <p className="text-sm font-bold text-red-800">Failed to load referrals</p>
                    <p className="mt-1 text-sm text-red-600">{errorReferrals}</p>
                  </div>
                </div>
              </div>
            ) : filteredReferrals.length > 0 ? (
              <div className="space-y-3">
                {filteredReferrals.map((item) => {
                  const isExpanded = expandedRows.has(item.user.id);
                  return (
                    <div
                      key={item.user.id}
                      className="rounded-2xl border border-gray-100 bg-white transition hover:border-gray-200"
                    >
                      {/* Main Row */}
                      <div className="flex items-center gap-4 p-4">
                        {/* Avatar */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C9A84C]/10 text-sm font-black text-[#C9A84C]">
                          {getInitials(item.user.name)}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-gray-900">
                            {item.user.name}
                          </p>
                          <p className="truncate text-xs text-gray-500">{item.user.email}</p>
                        </div>

                        {/* Code */}
                        <div className="hidden md:block">
                          <div className="flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5">
                            <code className="text-xs font-mono font-bold text-gray-700">
                              {item.code}
                            </code>
                            <button
                              onClick={() => handleCopy(item.code, `code-${item.code}`)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Referrals Count */}
                        <div className="text-center">
                          <p className="text-lg font-black text-gray-900">
                            {item.referrals_count ?? 0}
                          </p>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            referrals
                          </p>
                        </div>

                        {/* Earnings (display only - ₦500 per referral hardcoded) */}
                        <div className="hidden text-right sm:block">
                          <p className="text-sm font-black text-[#C9A84C]">
                            {formatCurrency((item.referrals_count ?? 0) * 500)}
                          </p>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            estimated
                          </p>
                        </div>

                        {/* View Link + Toggle */}
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/referrals/${item.user.id}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-gray-300 hover:text-gray-600"
                            title="View details"
                          >
                            <ExternalLink size={14} />
                          </Link>
                          {item.referrals && item.referrals.length > 0 && (
                            <button
                              onClick={() => toggleRow(item.user.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-gray-300 hover:text-gray-600"
                              title={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expanded: Referred Users */}
                      {isExpanded && item.referrals && item.referrals.length > 0 && (
                        <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Referred Users
                          </p>
                          <div className="space-y-2">
                            {item.referrals.map((ref, idx) => (
                              <div key={idx} className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5 shadow-sm">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] font-bold text-gray-600">
                                    {getInitials(ref.user.name)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-900">
                                      {ref.user.name}
                                    </p>
                                    <p className="truncate text-xs text-gray-500">
                                      {ref.user.email}
                                    </p>
                                  </div>
                                </div>
                                <span className="shrink-0 text-xs text-gray-400">
                                  {formatDate(ref.referred_at)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
                <Gift className="mx-auto h-10 w-10 text-gray-300" />
                <h3 className="mt-4 text-base font-bold text-gray-900">
                  {searchQuery ? 'No matching referrers' : 'No referral data yet'}
                </h3>
                <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                  {searchQuery
                    ? 'Try a different search term.'
                    : 'Referral data will appear here once users start sharing their links.'
                  }
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* ─── Programs ────────────────────────────────────── */}
        {!loadingPrograms && programs.length > 0 && (
          <Card className="rounded-3xl border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Programs</p>
              <h3 className="mt-1 text-xl font-black text-gray-900">Referral Programs</h3>
            </CardHeader>
            <CardBody>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A84C]/10 text-[#C9A84C]">
                      <Gift size={18} />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">{program.name}</h4>
                    <p className="mt-1 text-xs text-gray-500">
                      Duration: {Math.round(program.lifetime_minutes / 1440)} days
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      URL: /{program.url}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* ─── Empty Fallback ────────────────────────────── */}
        {!dashboard && !errorAnalytics && !loadingAnalytics && (
          <Card className="rounded-3xl border border-gray-200 bg-white shadow-sm">
            <CardBody>
              <div className="flex flex-col items-center py-14 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-gray-200 bg-gray-50">
                  <BarChart3 className="h-7 w-7 text-gray-400" />
                </div>
                <h3 className="mt-5 text-xl font-black text-gray-900">
                  No Referral Data Available
                </h3>
                <p className="mt-2 max-w-md text-sm text-gray-500">
                  Referral metrics will appear here once dashboard data is available.
                </p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
