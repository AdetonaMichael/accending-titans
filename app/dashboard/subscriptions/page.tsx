'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Sparkles, Star, Loader2, ArrowRight } from 'lucide-react';

import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { PageSkeleton } from '@/components/shared/SkeletonLoader';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';
import { subscriptionService } from '@/services/subscription.service';
import type { SubscriptionPlan } from '@/types/subscription.types';

export default function SubscriptionPlansPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await subscriptionService.getPlans();
      if (res.success && res.data?.plans) {
        setPlans(res.data.plans);
      }
    } catch (err) {
      showAlert('Failed to load subscription plans', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (plan: SubscriptionPlan) => {
    // Navigate to payment flow or open payment modal
    router.push(`/dashboard/subscriptions/checkout?plan_id=${plan.id}&price=${plan.price}&name=${encodeURIComponent(plan.name)}`);
  };

  if (loading) return <PageSkeleton />;

  const getPlanIcon = (slug: string) => {
    if (slug === 'premium') return <Sparkles className="h-6 w-6 text-[#C9A84C]" />;
    if (slug === 'standard') return <Star className="h-6 w-6 text-[#C9A84C]" />;
    return <CheckCircle className="h-6 w-6 text-[#C9A84C]" />;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Choose Your Plan</h1>
        <p className="mt-2 text-gray-500">Select a subscription plan that works for you</p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isPremium = plan.slug === 'premium';
          const isStandard = plan.slug === 'standard';
          return (
            <Card
              key={plan.id}
              className={`relative rounded-2xl border bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.04)] transition-all hover:shadow-lg ${
                isStandard ? 'ring-2 ring-[#C9A84C] scale-[1.02]' : ''
              }`}
            >
              {isStandard && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="warning" className="text-xs font-bold px-4 py-1">
                    ★ MOST POPULAR
                  </Badge>
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A84C]/10">
                  {getPlanIcon(plan.slug)}
                </div>

                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-3xl font-extrabold text-gray-900">
                  ₦{plan.price.toLocaleString()}
                  <span className="text-sm font-medium text-gray-500">/mo</span>
                </p>

                <div className="mt-2 text-sm text-gray-500">
                  {plan.daily_hours_limit === 0 ? 'Unlimited' : `${plan.daily_hours_limit}h`} daily access
                </div>

                <div className="mt-6 w-full space-y-3">
                  {plan.features?.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {!plan.features?.length && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        <span>{plan.daily_hours_limit === 0 ? 'Unlimited' : `${plan.daily_hours_limit} hours`} daily access</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        <span>Portfolio creation</span>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  onClick={() => handleSubscribe(plan)}
                  className="mt-6 w-full rounded-xl bg-[#C9A84C] py-3 text-sm font-bold text-white hover:bg-[#B8962E] transition"
                >
                  Subscribe <ArrowRight size={16} className="ml-1" />
                </Button>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
