'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  CreditCard,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  Eye,
  Trash2,
  Loader2,
  Star,
  Clock,
  Infinity,
  Crown,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminModal } from '@/components/admin/AdminModal';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { useAlert } from '@/hooks/useAlert';
import { subscriptionService } from '@/services/subscription.service';
import { formatDate } from '@/utils/format.utils';
import type { SubscriptionPlan, AdminSubscriptionPlan, AdminSubscriptionList } from '@/types/subscription.types';

// ─── Types ──────────────────────────────────────────────────────────────

type TabView = 'subscriptions' | 'plans';

type BillingInterval = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannually' | 'annually';

const BILLING_INTERVALS: { value: BillingInterval; label: string }[] = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'biannually', label: 'Biannually' },
  { value: 'annually', label: 'Annually' },
];

interface PlanFormData {
  name: string;
  slug: string;
  price: number;
  daily_hours_limit: number;
  duration_days: number;
  interval: BillingInterval;
  currency: string;
  description: string;
  send_invoices: boolean;
  send_sms: boolean;
  invoice_limit: number;
  features: string;
}

interface SubscriptionStats {
  total: number;
  active: number;
  cancelled: number;
  totalRevenue: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────

function getPaymentBadgeVariant(status: string): 'success' | 'danger' | 'warning' | 'info' {
  const map: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
    paid: 'success',
    active: 'success',
    failed: 'danger',
    pending: 'warning',
    cancelled: 'info',
  };
  return map[status?.toLowerCase()] ?? 'info';
}

function formatPrice(price: number | null | undefined): string {
  return `₦${(price ?? 0).toLocaleString()}`;
}

function parseFeatures(features: unknown): string[] {
  if (!features) return [];
  if (Array.isArray(features)) return features.filter((f): f is string => typeof f === 'string');
  if (typeof features === 'string') {
    for (let i = 0; i < 3; i++) {
      const trimmed = features.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{') || trimmed.startsWith('"')) {
        try {
          const parsed = JSON.parse(features);
          return parseFeatures(parsed);
        } catch {
          break;
        }
      } else {
        break;
      }
    }
    return features.trim() ? [features.trim()] : [];
  }
  return [];
}

const FEATURES_PLACEHOLDER = `One per line, e.g.:
6 hours daily access
Portfolio creation
Email support`;

// ─── Default Plan Form ──────────────────────────────────────────────────

const EMPTY_PLAN_FORM: PlanFormData = {
  name: '',
  slug: '',
  price: 2000,
  daily_hours_limit: 6,
  duration_days: 30,
  interval: 'monthly',
  currency: 'NGN',
  description: '',
  send_invoices: true,
  send_sms: true,
  invoice_limit: 12,
  features: '',
};

// ─── Page Component ─────────────────────────────────────────────────────

export default function AdminSubscriptionsPage() {
  const { showAlert } = useAlert();

  // Tab state
  const [activeTab, setActiveTab] = useState<TabView>('subscriptions');

  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState<AdminSubscriptionList[]>([]);
  const [subsLoading, setSubsLoading] = useState(true);
  const [subsPage, setSubsPage] = useState(1);
  const [subsTotalPages, setSubsTotalPages] = useState(1);
  const [subsTotal, setSubsTotal] = useState(0);
  const [stats, setStats] = useState<SubscriptionStats>({
    total: 0,
    active: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  // Plans state
  const [plans, setPlans] = useState<AdminSubscriptionPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  // Detail modal state
  const [selectedSub, setSelectedSub] = useState<AdminSubscriptionList | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Plan form modal state
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planForm, setPlanForm] = useState<PlanFormData>(EMPTY_PLAN_FORM);
  const [editingPlan, setEditingPlan] = useState<AdminSubscriptionPlan | null>(null);
  const [planFormSaving, setPlanFormSaving] = useState(false);

  // Delete confirm state
  const [deletingPlan, setDeletingPlan] = useState<AdminSubscriptionPlan | null>(null);
  const [deleting, setDeleting] = useState(false);

  const PER_PAGE = 20;

  // ── Data Loading ────────────────────────────────────────────────────

  const loadSubscriptions = useCallback(async (page = 1) => {
    setSubsLoading(true);
    try {
      const res = await subscriptionService.adminGetAll(page, PER_PAGE);
      // API returns { subscriptions: [...], pagination: {...} } inside data
      if (res.success && res.data) {
        const subs = res.data.subscriptions ?? [];
        const pagination = res.data.pagination;
        setSubscriptions(subs);
        setSubsTotalPages(pagination?.last_page || 1);
        setSubsTotal(pagination?.total || 0);
        computeStats(subs);
      }
    } catch {
      showAlert('Failed to load subscriptions', 'error');
    } finally {
      setSubsLoading(false);
    }
  }, [showAlert]);

  const loadPlans = useCallback(async () => {
    setPlansLoading(true);
    try {
      const res = await subscriptionService.getPlans();
      if (res.success && res.data?.plans) {
        // Map to AdminSubscriptionPlan shape with is_active default
        setPlans(
          res.data.plans.map((p) => ({
            ...p,
            is_active: true,
          })) as AdminSubscriptionPlan[]
        );
      }
    } catch {
      // Silently fail — plans are supplementary
    } finally {
      setPlansLoading(false);
    }
  }, []);

  const computeStats = (data: AdminSubscriptionList[]) => {
    const active = data.filter(
      (s) => s.payment_status === 'paid' || s.payment_status === 'active'
    ).length;
    const cancelled = data.filter(
      (s) => s.payment_status === 'cancelled'
    ).length;
    const revenue = data.reduce((sum, s) => sum + (s.price || 0), 0);
    setStats({
      total: data.length,
      active,
      cancelled,
      totalRevenue: revenue,
    });
  };

  useEffect(() => {
    loadSubscriptions(1);
    loadPlans();
  }, [loadSubscriptions, loadPlans]);

  // ── Handlers ────────────────────────────────────────────────────────

  const handleViewSubscription = (sub: AdminSubscriptionList) => {
    setSelectedSub(sub);
    setShowDetail(true);
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setPlanForm(EMPTY_PLAN_FORM);
    setShowPlanForm(true);
  };

  const handleEditPlan = (plan: AdminSubscriptionPlan) => {
    const p = plan as any;
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      slug: plan.slug,
      price: plan.price,
      daily_hours_limit: plan.daily_hours_limit,
      duration_days: plan.duration_days,
      interval: p.interval || 'monthly',
      currency: p.currency || 'NGN',
      description: p.description || '',
      send_invoices: p.send_invoices ?? true,
      send_sms: p.send_sms ?? true,
      invoice_limit: p.invoice_limit ?? 12,
      features: parseFeatures(plan.features).join('\n'),
    });
    setShowPlanForm(true);
  };

  const handleSavePlan = async () => {
    // Validate
    if (!planForm.name.trim()) {
      showAlert('Plan name is required', 'error');
      return;
    }
    if (!planForm.slug.trim()) {
      showAlert('Plan slug is required', 'error');
      return;
    }
    if (planForm.price <= 0) {
      showAlert('Price must be greater than 0', 'error');
      return;
    }

    setPlanFormSaving(true);
    try {
      const features = planForm.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      if (editingPlan) {
        const res = await subscriptionService.adminUpdatePlan(editingPlan.id, {
          name: planForm.name,
          slug: planForm.slug,
          price: planForm.price,
          daily_hours_limit: planForm.daily_hours_limit,
          duration_days: planForm.duration_days,
          interval: planForm.interval,
          currency: planForm.currency,
          description: planForm.description || undefined,
          send_invoices: planForm.send_invoices,
          send_sms: planForm.send_sms,
          invoice_limit: planForm.invoice_limit,
          features,
        });
        if (res.success) {
          showAlert('Plan updated successfully', 'success');
          setShowPlanForm(false);
          loadPlans();
        } else {
          showAlert(res.message || 'Failed to update plan', 'error');
        }
      } else {
        const res = await subscriptionService.adminCreatePlan({
          name: planForm.name,
          slug: planForm.slug,
          price: planForm.price,
          daily_hours_limit: planForm.daily_hours_limit,
          duration_days: planForm.duration_days,
          interval: planForm.interval,
          currency: planForm.currency,
          description: planForm.description || undefined,
          send_invoices: planForm.send_invoices,
          send_sms: planForm.send_sms,
          invoice_limit: planForm.invoice_limit,
          features,
        });
        if (res.success) {
          showAlert('Plan created successfully', 'success');
          setShowPlanForm(false);
          loadPlans();
        } else {
          showAlert(res.message || 'Failed to create plan', 'error');
        }
      }
    } catch {
      showAlert('Failed to save plan', 'error');
    } finally {
      setPlanFormSaving(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!deletingPlan) return;
    setDeleting(true);
    try {
      const res = await subscriptionService.adminDeletePlan(deletingPlan.id);
      if (res.success) {
        showAlert('Plan deactivated successfully', 'success');
        setDeletingPlan(null);
        loadPlans();
      } else {
        showAlert(res.message || 'Failed to deactivate plan', 'error');
      }
    } catch {
      showAlert('Failed to deactivate plan', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // ── Table Columns ───────────────────────────────────────────────────

  const subscriptionColumns = [
    { key: 'id', label: 'ID', width: '60px' },
    {
      key: 'user_name',
      label: 'User',
      render: (_: any, row: AdminSubscriptionList) => (
        <div>
          <p className="font-medium text-gray-900">{row.user_name}</p>
          <p className="text-xs text-gray-500">{row.user_email}</p>
        </div>
      ),
    },
    { key: 'plan_name', label: 'Plan' },
    {
      key: 'price',
      label: 'Amount',
      render: (v: number) => (
        <span className="font-semibold">{formatPrice(v)}</span>
      ),
    },
    {
      key: 'payment_status',
      label: 'Status',
      render: (v: string) => (
        <Badge variant={getPaymentBadgeVariant(v)} size="sm">
          {v}
        </Badge>
      ),
    },
    {
      key: 'auto_renew',
      label: 'Auto-Renew',
      render: (v: boolean) => (
        <span className={v ? 'text-green-600' : 'text-gray-400'}>
          {v ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'start_date',
      label: 'Start',
      render: (v: string) => (
        <span className="text-sm text-gray-600">{formatDate(v)}</span>
      ),
    },
    {
      key: 'end_date',
      label: 'End',
      render: (v: string) => (
        <span className="text-sm text-gray-600">{formatDate(v)}</span>
      ),
    },
    {
      key: 'days_remaining',
      label: 'Days Left',
      align: 'center' as const,
      render: (v: number) => (
        <span
          className={`font-semibold ${
            v <= 3 ? 'text-red-600' : v <= 7 ? 'text-amber-600' : 'text-gray-700'
          }`}
        >
          {v}d
        </span>
      ),
    },
    {
      key: 'actions' as any,
      label: '',
      width: '60px',
      render: (_: any, row: AdminSubscriptionList) => (
        <button
          onClick={() => handleViewSubscription(row)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
          title="View details"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  const planColumns = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    {
      key: 'price',
      label: 'Price',
      render: (v: number) => (
        <span className="font-semibold">{formatPrice(v)}</span>
      ),
    },
    {
      key: 'daily_hours_limit',
      label: 'Daily Limit',
      render: (v: number) => (
        <span className="inline-flex items-center gap-1">
          {v === 0 ? (
            <><Infinity size={14} className="text-[#C9A84C]" /> Unlimited</>
          ) : (
            <><Clock size={14} className="text-gray-400" /> {v}h</>
          )}
        </span>
      ),
    },
    { key: 'duration_days', label: 'Duration', render: (v: number) => `${v}d` },
    {
      key: 'interval' as any,
      label: 'Interval',
      render: (v: any, row: any) => {
        const interval = row.interval || 'monthly';
        return (
          <span className="capitalize text-sm text-gray-700">{interval}</span>
        );
      },
    },
    {
      key: 'features',
      label: 'Features',
      render: (v: any) => {
        const list = parseFeatures(v);
        return (
          <span className="text-sm text-gray-500">
            {list.length} feature{list.length !== 1 ? 's' : ''}
          </span>
        );
      },
    },
    {
      key: 'is_active',
      label: 'Active',
      render: (v: boolean) => (
        <Badge variant={v ? 'success' : 'danger'} size="sm">
          {v ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      key: 'actions' as any,
      label: '',
      width: '100px',
      render: (_: any, row: AdminSubscriptionPlan) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleEditPlan(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit plan"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => setDeletingPlan(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Deactivate plan"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader
        title="Subscriptions"
        description="Manage subscription plans and view all user subscriptions"
        action={{
          label: 'Create Plan',
          onClick: handleCreatePlan,
        }}
      />

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-5 py-3 text-sm font-bold transition-colors border-b-2 -mb-px ${
            activeTab === 'subscriptions'
              ? 'border-[#C9A84C] text-[#C9A84C]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={16} className="inline mr-2 -mt-0.5" />
          Subscriptions
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-5 py-3 text-sm font-bold transition-colors border-b-2 -mb-px ${
            activeTab === 'plans'
              ? 'border-[#C9A84C] text-[#C9A84C]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Star size={16} className="inline mr-2 -mt-0.5" />
          Plans
        </button>
      </div>

      {/* ── TAB: Subscriptions ── */}
      {activeTab === 'subscriptions' && (
        <>
          {/* Stats */}
          <AdminStats
            stats={[
              {
                title: 'Total Subscriptions',
                value: stats.total,
                icon: <CreditCard size={20} />,
              },
              {
                title: 'Active',
                value: stats.active,
                icon: <CheckCircle2 size={20} className="text-green-600" />,
              },
              {
                title: 'Cancelled',
                value: stats.cancelled,
                icon: <XCircle size={20} className="text-red-500" />,
              },
              {
                title: 'Total Revenue',
                value: formatPrice(stats.totalRevenue),
                icon: <CreditCard size={20} />,
              },
            ]}
          />

          {/* Subscriptions Table */}
          <AdminTable
            columns={subscriptionColumns}
            data={subscriptions}
            loading={subsLoading}
            currentPage={subsPage}
            totalPages={subsTotalPages}
            total={subsTotal}
            onPageChange={(page) => {
              setSubsPage(page);
              loadSubscriptions(page);
            }}
            emptyMessage="No subscriptions found"
          />
        </>
      )}

      {/* ── TAB: Plans ── */}
      {activeTab === 'plans' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {plans.length} plan{plans.length !== 1 ? 's' : ''} configured
            </p>
            <Button variant="primary" size="sm" onClick={handleCreatePlan}>
              <Plus size={16} />
              New Plan
            </Button>
          </div>

          {plansLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" />
            </div>
          ) : (
            <AdminTable
              columns={planColumns}
              data={plans}
              loading={false}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
              emptyMessage="No plans created yet. Create your first plan to get started."
            />
          )}
        </div>
      )}

      {/* ── Subscription Detail Modal ── */}
      <AdminModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title="Subscription Details"
        icon={CreditCard}
        size="lg"
      >
        {selectedSub && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">User</p>
                <p className="mt-1 font-medium text-gray-900">{selectedSub.user_name}</p>
                <p className="text-sm text-gray-500">{selectedSub.user_email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Plan</p>
                <p className="mt-1 font-medium text-gray-900">{selectedSub.plan_name}</p>
                <p className="text-sm text-gray-500">{formatPrice(selectedSub.price)}/month</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</p>
                <div className="mt-1">
                  <Badge variant={getPaymentBadgeVariant(selectedSub.payment_status)}>
                    {selectedSub.payment_status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Auto-Renew</p>
                <p className="mt-1 font-medium text-gray-900">
                  {selectedSub.auto_renew ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Start Date</p>
                <p className="mt-1 font-medium text-gray-900">{formatDate(selectedSub.start_date)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">End Date</p>
                <p className="mt-1 font-medium text-gray-900">{formatDate(selectedSub.end_date)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Days Remaining</p>
                <p className="mt-1 font-medium text-gray-900">{selectedSub.days_remaining}d</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</p>
                <p className="mt-1 font-medium text-gray-900">{formatDate(selectedSub.created_at)}</p>
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      {/* ── Plan Form Modal ── */}
      <AdminModal
        isOpen={showPlanForm}
        onClose={() => setShowPlanForm(false)}
        title={editingPlan ? 'Edit Plan' : 'Create Plan'}
        subtitle={editingPlan ? `Editing "${editingPlan.name}"` : 'Define a new subscription tier'}
        icon={editingPlan ? undefined : Plus}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowPlanForm(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSavePlan}
              disabled={planFormSaving}
            >
              {planFormSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingPlan ? (
                'Update Plan'
              ) : (
                'Create Plan'
              )}
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          {/* Name & Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Plan Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={planForm.name}
                onChange={(e) =>
                  setPlanForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none placeholder-gray-500"
                placeholder="e.g. Basic Plan"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={planForm.slug}
                onChange={(e) =>
                  setPlanForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none placeholder-gray-500"
                placeholder="e.g. basic"
              />
            </div>
          </div>

          {/* Price & Duration & Interval */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Price (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={planForm.price}
                onChange={(e) =>
                  setPlanForm((prev) => ({ ...prev, price: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Duration (days)
              </label>
              <input
                type="number"
                value={planForm.duration_days}
                onChange={(e) =>
                  setPlanForm((prev) => ({ ...prev, duration_days: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none"
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Billing Interval <span className="text-red-500">*</span>
              </label>
              <select
                value={planForm.interval}
                onChange={(e) =>
                  setPlanForm((prev) => ({ ...prev, interval: e.target.value as BillingInterval }))
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none bg-white"
              >
                {BILLING_INTERVALS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Currency & Invoice Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                value={planForm.currency}
                onChange={(e) =>
                  setPlanForm((prev) => ({ ...prev, currency: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none bg-white"
              >
                <option value="NGN">NGN — Nigerian Naira</option>
                <option value="USD">USD — US Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Invoice Limit <span className="text-gray-400 font-normal">(max payments)</span>
              </label>
              <input
                type="number"
                value={planForm.invoice_limit}
                onChange={(e) =>
                  setPlanForm((prev) => ({ ...prev, invoice_limit: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none"
                min={1}
                placeholder="e.g. 12"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description <span className="text-gray-400 font-normal">(sent to Paystack)</span>
            </label>
            <input
              type="text"
              value={planForm.description}
              onChange={(e) =>
                setPlanForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none placeholder-gray-500"
              placeholder="e.g. 6 hours daily access for 30 days"
            />
          </div>

          {/* Send Invoices & Send SMS */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={planForm.send_invoices}
                onChange={(e) =>
                  setPlanForm((prev) => ({ ...prev, send_invoices: e.target.checked }))
                }
                className="w-4 h-4 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
              />
              <div>
                <p className="text-sm font-semibold text-gray-700">Send Invoices</p>
                <p className="text-xs text-gray-400">Email invoices to customers</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={planForm.send_sms}
                onChange={(e) =>
                  setPlanForm((prev) => ({ ...prev, send_sms: e.target.checked }))
                }
                className="w-4 h-4 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
              />
              <div>
                <p className="text-sm font-semibold text-gray-700">Send SMS</p>
                <p className="text-xs text-gray-400">SMS notifications to customers</p>
              </div>
            </label>
          </div>

          {/* Daily Hours Limit */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Daily Hours Limit <span className="text-gray-400 font-normal">(0 = unlimited)</span>
            </label>
            <input
              type="number"
              value={planForm.daily_hours_limit}
              onChange={(e) =>
                setPlanForm((prev) => ({
                  ...prev,
                  daily_hours_limit: Number(e.target.value),
                }))
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none"
              min={0}
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Features
            </label>
            <textarea
              value={planForm.features}
              onChange={(e) =>
                setPlanForm((prev) => ({ ...prev, features: e.target.value }))
              }
              rows={5}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none resize-y placeholder-gray-500"
              placeholder={FEATURES_PLACEHOLDER}
            />
            <p className="mt-1 text-xs text-gray-400">
              Enter one feature per line
            </p>
          </div>
        </div>
      </AdminModal>

      {/* ── Delete Confirm Modal ── */}
      <AdminModal
        isOpen={!!deletingPlan}
        onClose={() => setDeletingPlan(null)}
        title="Deactivate Plan"
        subtitle={
          deletingPlan
            ? `Are you sure you want to deactivate "${deletingPlan.name}"?`
            : ''
        }
        icon={Trash2}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeletingPlan(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeletePlan}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deactivating...
                </>
              ) : (
                'Deactivate'
              )}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600">
          This will mark the plan as inactive. Existing subscribers will not be
          affected, but new subscriptions to this plan will be blocked.
        </p>
      </AdminModal>
    </div>
  );
}
