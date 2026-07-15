'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Sparkles,
  Star,
  Loader2,
  ArrowRight,
  Crown,
  Clock,
  Infinity,
  AlertCircle,
  CreditCard,
  RefreshCw,
  Ban,
  Mail,
  ExternalLink,
  Calendar,
  TrendingUp,
  Zap,
  History,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardBody, CardHeader, CardFooter } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { PageSkeleton } from '@/components/shared/SkeletonLoader';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';
import { useSubscription } from '@/hooks/useSubscription';
import { subscriptionService } from '@/services/subscription.service';
import { PaystackCheckoutModal } from '@/components/subscription/PaystackCheckoutModal';
import type { SubscriptionPlan, ActiveSubscription } from '@/types/subscription.types';

// ── Utility helpers ────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatPrice(price: number | null | undefined): string {
  return `₦${(price ?? 0).toLocaleString()}`;
}

function getPlanIcon(slug: string) {
  switch (slug) {
    case 'premium':
      return Crown;
    case 'standard':
      return Sparkles;
    default:
      return Star;
  }
}

function getPlanBadgeVariant(
  slug: string
): 'default' | 'success' | 'warning' | 'info' {
  switch (slug) {
    case 'premium':
      return 'warning';
    case 'standard':
      return 'info';
    default:
      return 'default';
  }
}

function getStatusBadgeVariant(
  status: string
): 'default' | 'success' | 'danger' | 'warning' {
  switch (status) {
    case 'paid':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'danger';
    default:
      return 'default';
  }
}

function getMinutesDisplay(remaining: number): string {
  if (remaining === -1) return 'Unlimited';
  const hours = Math.floor(remaining / 60);
  const mins = remaining % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function parseFeatures(features: unknown): string[] {
  if (!features) return [];
  if (Array.isArray(features)) return features.filter((f): f is string => typeof f === 'string');
  if (typeof features === 'string') {
    // Try unwrapping JSON-encoded strings (including deeply nested ones)
    let current: string = features;
    for (let i = 0; i < 3; i++) {
      const trimmed = current.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{') || trimmed.startsWith('"')) {
        try {
          const parsed = JSON.parse(current);
          return parseFeatures(parsed);
        } catch {
          break;
        }
      } else {
        break;
      }
    }
    // Plain string — treat as a single feature if non-empty
    return features.trim() ? [features.trim()] : [];
  }
  return [];
}

// ── Usage Progress Bar ──────────────────────────────────────────────────────

function UsageProgressBar({
  used,
  limit,
  label,
}: {
  used: number;
  limit: number;
  label: string;
}) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isUnlimited = limit === 0;
  const isWarning = percentage >= 80;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">
          {isUnlimited ? 'Unlimited' : `${getMinutesDisplay(used)} / ${getMinutesDisplay(limit)}`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isWarning
                ? 'bg-gradient-to-r from-amber-400 to-red-500'
                : 'bg-gradient-to-r from-[#C9A84C] to-[#B8962E]'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ── Daily Hours Card ───────────────────────────────────────────────────────

function DailyHoursCard({ subscription: sub }: { subscription: ActiveSubscription }) {
  const hours = sub.daily_hours;
  if (!hours) return null;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Clock size={16} className="text-[#C9A84C]" />
          Today's Usage
        </h4>
        <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
          {sub.plan_name}
        </span>
      </div>

      <UsageProgressBar
        used={hours.used_minutes}
        limit={hours.limit_minutes}
        label="Daily Access"
      />

      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-amber-200/40">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">
            {hours.limit === 0 ? '∞' : getMinutesDisplay(hours.limit_minutes)}
          </p>
          <p className="text-xs text-gray-500">Daily Limit</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#C9A84C]">
            {getMinutesDisplay(hours.used_minutes)}
          </p>
          <p className="text-xs text-gray-500">Used Today</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">
            {hours.remaining_minutes === -1
              ? '∞'
              : getMinutesDisplay(hours.remaining_minutes)}
          </p>
          <p className="text-xs text-gray-500">Remaining</p>
        </div>
      </div>
    </div>
  );
}

// ── Active Subscription Card ───────────────────────────────────────────────

function ActiveSubscriptionCard({
  subscription: sub,
  onCancelAutoRenew,
  onUpdateCard,
  onDisable,
  actionLoading,
}: {
  subscription: ActiveSubscription;
  onCancelAutoRenew: () => void;
  onUpdateCard: () => void;
  onDisable: () => void;
  actionLoading: boolean;
}) {
  const PlanIcon = getPlanIcon(sub.plan_slug);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header gradient */}
      <div className="bg-gradient-to-r from-[#C9A84C]/10 to-[#C9A84C]/5 px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#C9A84C]/15">
              <PlanIcon className="w-6 h-6 text-[#C9A84C]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {sub.plan_name}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={getStatusBadgeVariant(sub.payment_status)} size="sm">
                  {sub.payment_status.charAt(0).toUpperCase() + sub.payment_status.slice(1)}
                </Badge>
                <Badge variant={getPlanBadgeVariant(sub.plan_slug)} size="sm">
                  {sub.plan_slug}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#C9A84C]">
              {formatPrice(sub.price)}
            </p>
            <p className="text-xs text-gray-500">/month</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Status grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Calendar size={13} />
              Start Date
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(sub.start_date)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Calendar size={13} />
              End Date
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(sub.end_date)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Clock size={13} />
              Days Left
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {sub.days_remaining}d
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <RefreshCw size={13} />
              Auto-Renew
            </div>
            <p
              className={`text-sm font-semibold ${
                sub.auto_renew ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {sub.auto_renew ? 'Active' : 'Cancelled'}
            </p>
          </div>
        </div>

        {/* Daily hours */}
        <DailyHoursCard subscription={sub} />

        {/* Next payment */}
        {sub.next_payment_date && sub.auto_renew && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
            <CreditCard size={15} className="text-blue-500 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Next payment of <strong>{formatPrice(sub.price)}</strong> on{' '}
              {formatDate(sub.next_payment_date)}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
          {sub.auto_renew && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelAutoRenew}
              disabled={actionLoading}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Ban size={14} />
              )}
              Cancel Auto-Renew
            </Button>
          )}

          {sub.paystack_subscription_code && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onUpdateCard}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard size={14} />
                )}
                Update Card
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDisable}
                disabled={actionLoading}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck size={14} />
                )}
                Disable Subscription
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Plan Selection Card ────────────────────────────────────────────────────

function PlanSelectionCard({
  plan,
  isRecommended,
  onSelect,
}: {
  plan: SubscriptionPlan;
  isRecommended: boolean;
  onSelect: (plan: SubscriptionPlan) => void;
}) {
  const PlanIcon = getPlanIcon(plan.slug);

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white transition-all duration-300 ${
        isRecommended
          ? 'border-[#C9A84C] shadow-lg shadow-[#C9A84C]/10 scale-[1.02] md:scale-105 z-10'
          : 'border-gray-200 shadow-sm hover:shadow-lg hover:border-[#C9A84C]/30'
      }`}
    >
      {isRecommended && (
        <>
          <div className="absolute -top-0.5 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C9A84C]/35 via-[#C9A84C] to-[#C9A84C]/35 rounded-t-2xl" />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#B8962E] text-white text-xs font-bold shadow-lg shadow-[#C9A84C]/30">
              <Star size={13} />
              Most Popular
            </span>
          </div>
        </>
      )}

      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-xl ${
              isRecommended ? 'bg-[#C9A84C]/15' : 'bg-gray-100'
            }`}
          >
            <PlanIcon
              className={`w-6 h-6 ${
                isRecommended ? 'text-[#C9A84C]' : 'text-gray-500'
              }`}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
            <p className="text-xs text-gray-500">
              {plan.daily_hours_limit === 0
                ? 'Unlimited daily access'
                : `${plan.daily_hours_limit}h daily access`}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(plan.price)}
          </span>
          <span className="text-sm text-gray-500 ml-1.5">/month</span>
        </div>

        <div className="space-y-2.5 flex-1">
          {parseFeatures(plan.features).map((feature, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
          {parseFeatures(plan.features).length === 0 && (
            <>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  {plan.daily_hours_limit === 0
                    ? 'Unlimited daily access'
                    : `${plan.daily_hours_limit}h daily access`}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  {plan.duration_days}-day subscription
                </span>
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => onSelect(plan)}
          className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 mt-6 inline-flex items-center justify-center gap-2 ${
            isRecommended
              ? 'bg-gradient-to-r from-[#C9A84C] to-[#B8962E] text-white shadow-md shadow-[#C9A84C]/20 hover:shadow-lg hover:shadow-[#C9A84C]/30'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          Subscribe Now
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function SubscriptionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const {
    plans,
    plansLoading,
    fetchPlans,
    subscription,
    hasActiveSubscription,
    subscriptionLoading,
    fetchSubscription,
    history,
    historyLoading,
    historyPagination,
    fetchHistory,
    cancelAutoRenew,
    getCardUpdateLink,
    disableSubscription,
    actionLoading,
  } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [emailTokenInput, setEmailTokenInput] = useState('');

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory, fetchHistory]);

  // ── Plan selection handler ──

  const handleSelectPlan = useCallback((plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  }, []);

  // ── Cancel auto-renew ──

  const handleCancelAutoRenew = useCallback(async () => {
    await cancelAutoRenew();
  }, [cancelAutoRenew]);

  // ── Update card ──

  const handleUpdateCard = useCallback(async () => {
    if (!subscription?.paystack_subscription_code) {
      showAlert('No active subscription found', 'error');
      return;
    }
    const link = await getCardUpdateLink(
      subscription.paystack_subscription_code
    );
    if (link) {
      window.open(link, '_blank');
    }
  }, [subscription, getCardUpdateLink, showAlert]);

  // ── Disable subscription ──

  const handleDisable = useCallback(async () => {
    if (!subscription?.paystack_subscription_code) {
      showAlert('No active subscription found', 'error');
      return;
    }

    // Prompt for email token
    const token = window.prompt(
      'Enter your email token to disable this subscription:'
    );
    if (!token) return;

    await disableSubscription(
      subscription.paystack_subscription_code,
      token
    );
  }, [subscription, disableSubscription, showAlert]);

  // ── Loading state ──

  if (subscriptionLoading && plansLoading) {
    return <PageSkeleton />;
  }

  const recommendedSlug =
    plans.find((p) => p.slug === 'standard')?.slug ||
    plans[Math.floor(plans.length / 2)]?.slug ||
    '';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page header */}
      <section className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {hasActiveSubscription ? 'My Subscription' : 'Choose Your Plan'}
        </h1>
        <p className="mt-2 text-gray-500">
          {hasActiveSubscription
            ? 'Manage your subscription and track your daily usage'
            : 'Select a plan that works for your business'}
        </p>
      </section>

      {/* Active subscription section */}
      {hasActiveSubscription && subscription && (
        <section>
          <ActiveSubscriptionCard
            subscription={subscription}
            onCancelAutoRenew={handleCancelAutoRenew}
            onUpdateCard={handleUpdateCard}
            onDisable={handleDisable}
            actionLoading={actionLoading}
          />

          {/* View history button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#C9A84C] hover:text-[#B8962E] transition-colors"
            >
              <History size={16} />
              {showHistory ? 'Hide History' : 'View Subscription History'}
            </button>
          </div>

          {/* History section */}
          {showHistory && (
            <div className="mt-4">
              <Card>
                <CardHeader>
                  <h3 className="text-base font-semibold text-gray-900">
                    Subscription History
                  </h3>
                </CardHeader>
                <CardBody>
                  {historyLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#C9A84C]" />
                    </div>
                  ) : history.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      No subscription history found
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.plan}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(item.start_date)} -{' '}
                              {formatDate(item.end_date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatPrice(item.amount)}
                            </p>
                            <Badge
                              variant={getStatusBadgeVariant(item.payment_status)}
                              size="sm"
                            >
                              {item.payment_status}
                            </Badge>
                          </div>
                        </div>
                      ))}

                      {/* Pagination */}
                      {historyPagination.last_page > 1 && (
                        <div className="flex justify-center gap-2 pt-2">
                          {Array.from(
                            { length: historyPagination.last_page },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => fetchHistory(page)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                page === historyPagination.current_page
                                  ? 'bg-[#C9A84C] text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          )}
        </section>
      )}

      {/* Plan selection section — shown when no active subscription */}
      {!hasActiveSubscription && !subscriptionLoading && (
        <section>
          {plansLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No plans available at the moment</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanSelectionCard
                  key={plan.id}
                  plan={plan}
                  isRecommended={plan.slug === recommendedSlug}
                  onSelect={handleSelectPlan}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Checkout modal */}
      <PaystackCheckoutModal
        isOpen={showCheckout}
        onClose={() => {
          setShowCheckout(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
      />
    </div>
  );
}
