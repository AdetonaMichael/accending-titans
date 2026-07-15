'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  BadgeCheck,
  Sparkles,
  Star,
  Zap,
  ArrowRight,
  Loader2,
  Crown,
  Clock,
  Infinity,
  Headphones,
  TrendingUp,
  Briefcase,
  Video,
  BarChart3,
  Palette,
  Gem,
} from 'lucide-react';
import { subscriptionService } from '@/services/subscription.service';
import type { SubscriptionPlan } from '@/types/subscription.types';

/** Map plan slugs to relevant icon components */
const PLAN_ICONS: Record<string, React.ElementType> = {
  basic: Star,
  standard: Sparkles,
  premium: Crown,
};

/** Map plan slugs to gradient styles for card headers */
const PLAN_GRADIENTS: Record<
  string,
  { from: string; to: string; badge: string }
> = {
  basic: {
    from: 'from-gray-50',
    to: 'to-white',
    badge: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  standard: {
    from: 'from-amber-50',
    to: 'to-white',
    badge: 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20',
  },
  premium: {
    from: 'from-yellow-50',
    to: 'to-white',
    badge: 'bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30',
  },
};

/** Feature icon map for additional detail */
const FEATURE_ICONS: Record<string, React.ElementType> = {
  'Unlimited': Infinity,
  'unlimited': Infinity,
  'hours': Clock,
  'access': Zap,
  'support': Headphones,
  'Support': Headphones,
  'portfolio': Briefcase,
  'Portfolio': Briefcase,
  'Priority': TrendingUp,
  'priority': TrendingUp,
  'VIP': Gem,
  'VIP ': Gem,
  'Birthday': Star,
  'birthday': Star,
  'Video': Video,
  'video': Video,
  'Premium': Crown,
  'premium': Crown,
  'analytics': BarChart3,
  'Analytics': BarChart3,
  'design': Palette,
  'Design': Palette,
};

function getFeatureIcon(feature: string): React.ElementType {
  const matchedKey = Object.keys(FEATURE_ICONS).find((key) =>
    feature.toLowerCase().includes(key.toLowerCase())
  );
  return matchedKey ? FEATURE_ICONS[matchedKey] : CheckCircle2;
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

function formatPrice(price: number | null | undefined): string {
  return `₦${(price ?? 0).toLocaleString()}`;
}

function getDailyAccessText(hoursLimit: number): string {
  if (hoursLimit === 0) return 'Unlimited daily access';
  return `${hoursLimit}h daily access`;
}

function getPlanDescription(slug: string): string {
  switch (slug) {
    case 'premium':
      return 'For businesses ready to dominate their market';
    case 'standard':
      return 'Perfect for growing your business presence';
    default:
      return 'Great for getting started in the community';
  }
}

interface SubscriptionPlansSectionProps {
  onSelectPlan?: (plan: SubscriptionPlan) => void;
  showViewAll?: boolean;
}

export function SubscriptionPlansSection({
  onSelectPlan,
  showViewAll = true,
}: SubscriptionPlansSectionProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await subscriptionService.getPlans();
      if (res.success && res.data?.plans) {
        setPlans(res.data.plans);
      }
    } catch {
      // Fallback silently — component handles empty state
    } finally {
      setLoading(false);
    }
  };

  // Determine which plan is the "recommended" one (middle tier or standard)
  const getRecommendedSlug = (): string => {
    if (plans.length <= 1) return '';
    const standardIdx = plans.findIndex((p) => p.slug === 'standard');
    if (standardIdx >= 0) return 'standard';
    // Fallback: return the middle plan
    return plans[Math.floor(plans.length / 2)]?.slug || '';
  };

  const recommendedSlug = getRecommendedSlug();

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 sm:py-28 md:py-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" />
          </div>
        </div>
      </section>
    );
  }

  if (plans.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 sm:py-28 md:py-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#C9A84C]/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-14 sm:mb-18 md:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-xs sm:text-sm font-semibold text-[#C9A84C] mb-4">
            <BadgeCheck size={14} />
            Membership Plans
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Choose Your Growth Plan
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Flexible plans designed for every stage of your business journey —
            from getting started to dominating your market
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, idx) => {
            const Icon = PLAN_ICONS[plan.slug] || Star;
            const gradient = PLAN_GRADIENTS[plan.slug] || PLAN_GRADIENTS.basic;
            const isRecommended = plan.slug === recommendedSlug;
            const isPremium = plan.slug === 'premium';

            return (
              <div
                key={plan.id}
                className={`group relative flex flex-col rounded-2xl border bg-white transition-all duration-300 ${
                  isRecommended
                    ? 'border-[#C9A84C] shadow-xl shadow-[#C9A84C]/10 scale-[1.02] md:scale-105 z-10'
                    : 'border-gray-200 shadow-sm hover:shadow-xl hover:border-[#C9A84C]/30'
                }`}
              >
                {/* Recommended badge */}
                {isRecommended && (
                  <>
                    <div className="absolute -top-0.5 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C9A84C]/35 via-[#C9A84C] to-[#C9A84C]/35 rounded-t-2xl" />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#B8962E] text-white text-xs font-bold shadow-lg shadow-[#C9A84C]/30">
                        <BadgeCheck size={13} />
                        Most Popular
                      </span>
                    </div>
                  </>
                )}

                {/* Premium badge */}
                {isPremium && !isRecommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-lg shadow-amber-500/30">
                      <Crown size={13} />
                      Best Value
                    </span>
                  </div>
                )}

                {/* Card content */}
                <div className="p-6 sm:p-8 flex flex-col h-full">
                  {/* Icon + name row */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                        isRecommended
                          ? 'bg-[#C9A84C]/15'
                          : 'bg-gray-100 group-hover:bg-[#C9A84C]/10'
                      } transition-colors`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isRecommended
                            ? 'text-[#C9A84C]'
                            : 'text-gray-500 group-hover:text-[#C9A84C]'
                        } transition-colors`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {getPlanDescription(plan.slug)}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1.5">
                      /month
                    </span>
                  </div>

                  {/* Daily access highlight */}
                  <div className="flex items-center gap-2 mb-6 py-2.5 px-3.5 rounded-lg bg-gray-50 border border-gray-100">
                    <Clock size={15} className="text-[#C9A84C] flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">
                      {getDailyAccessText(plan.daily_hours_limit)}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => onSelectPlan?.(plan)}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 mb-6 inline-flex items-center justify-center gap-2 ${
                      isRecommended
                        ? 'bg-gradient-to-r from-[#C9A84C] to-[#B8962E] text-white shadow-lg shadow-[#C9A84C]/25 hover:shadow-xl hover:shadow-[#C9A84C]/30 hover:scale-[1.02]'
                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isRecommended ? 'Get Started' : 'Choose Plan'}
                    <ArrowRight size={16} />
                  </button>

                  {/* Features */}
                  <div className="space-y-3 flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      What's included
                    </p>
                    {parseFeatures(plan.features).map((feature, i) => {
                      const FeatureIcon = getFeatureIcon(feature);
                      return (
                        <div key={i} className="flex items-start gap-2.5">
                          <FeatureIcon
                            size={16}
                            className="text-[#C9A84C] flex-shrink-0 mt-0.5"
                          />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </div>
                      );
                    })}
                    {parseFeatures(plan.features).length === 0 && (
                      <>
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2
                            size={16}
                            className="text-[#C9A84C] flex-shrink-0 mt-0.5"
                          />
                          <span className="text-sm text-gray-700">
                            {getDailyAccessText(plan.daily_hours_limit)}
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2
                            size={16}
                            className="text-[#C9A84C] flex-shrink-0 mt-0.5"
                          />
                          <span className="text-sm text-gray-700">
                            {plan.duration_days}-day subscription cycle
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all plans CTA */}
        {showViewAll && (
          <div className="text-center mt-10">
            <Link
              href="/dashboard/subscriptions"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9A84C] hover:text-[#B8962E] transition-colors group"
            >
              View all plans & details
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
