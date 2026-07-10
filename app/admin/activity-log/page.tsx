'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Filter,
  Eye,
  UserCheck,
  UserX,
  Shield,
  ShieldOff,
  Settings,
  DollarSign,
  Mail,
  Bell,
  LogIn,
  LogOut,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  Clock,
  Globe,
  Smartphone,
  Monitor,
} from 'lucide-react';

import { useAuthStore } from '@/store/auth.store';
import { Card, CardBody, CardHeader } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { FilterPanel, type FilterField } from '@/components/shared/FilterPanel';
import { useFilters } from '@/hooks/useFilters';
import { Modal } from '@/components/shared/Modal';
import { TableSkeleton } from '@/components/shared/SkeletonLoader';
import { formatDate, formatDateTime } from '@/utils/format.utils';
import { clsx } from 'clsx';

// ─── Types ──────────────────────────────────────────────────────────────

interface AuditLogEntry {
  id: string | number;
  actor_id: number;
  actor_name: string;
  actor_email: string;
  action: string;
  resource_type: string;
  resource_id: string | number;
  description: string;
  status: 'success' | 'failure' | 'pending';
  ip_address: string;
  user_agent: string;
  metadata: Record<string, any>;
  created_at: string;
}

interface AuditLogStats {
  total_events: number;
  successful_events: number;
  failed_events: number;
  unique_actors: number;
  events_today: number;
  top_actions: Array<{ action: string; count: number }>;
}

// ─── Dummy Data ─────────────────────────────────────────────────────────

const MOCK_STATS: AuditLogStats = {
  total_events: 15420,
  successful_events: 14890,
  failed_events: 530,
  unique_actors: 124,
  events_today: 847,
  top_actions: [
    { action: 'user.login', count: 3421 },
    { action: 'transaction.create', count: 2890 },
    { action: 'user.update', count: 1256 },
    { action: 'admin.action', count: 876 },
    { action: 'notification.send', count: 654 },
  ],
};

function generateMockLogs(count: number): AuditLogEntry[] {
  const actors = [
    { id: 1, name: 'John Admin', email: 'john@acceding-titans.com' },
    { id: 2, name: 'Sarah Manager', email: 'sarah@acceding-titans.com' },
    { id: 3, name: 'Mike SuperAdmin', email: 'mike@acceding-titans.com' },
    { id: 5, name: 'Emma Support', email: 'emma@acceding-titans.com' },
    { id: 8, name: 'David Operations', email: 'david@acceding-titans.com' },
  ];

  const actions = [
    { action: 'user.login', resource: 'session', desc: 'User logged into the system', status: 'success' as const },
    { action: 'user.logout', resource: 'session', desc: 'User logged out of the system', status: 'success' as const },
    { action: 'user.create', resource: 'user', desc: 'New user account created', status: 'success' as const },
    { action: 'user.update', resource: 'user', desc: 'User profile updated', status: 'success' as const },
    { action: 'user.delete', resource: 'user', desc: 'User account deleted', status: 'success' as const },
    { action: 'user.suspend', resource: 'user', desc: 'User account suspended', status: 'success' as const },
    { action: 'user.verify', resource: 'user', desc: 'User account verified', status: 'success' as const },
    { action: 'user.role.change', resource: 'role', desc: 'User role changed', status: 'success' as const },
    { action: 'transaction.create', resource: 'transaction', desc: 'Transaction initiated', status: 'success' as const },
    { action: 'transaction.complete', resource: 'transaction', desc: 'Transaction completed', status: 'success' as const },
    { action: 'transaction.fail', resource: 'transaction', desc: 'Transaction failed', status: 'failure' as const },
    { action: 'transaction.refund', resource: 'transaction', desc: 'Transaction refunded', status: 'success' as const },
    { action: 'admin.settings.update', resource: 'settings', desc: 'Admin settings updated', status: 'success' as const },
    { action: 'admin.notification.send', resource: 'notification', desc: 'Admin sent notification', status: 'success' as const },
    { action: 'admin.email.send', resource: 'email', desc: 'Admin sent email campaign', status: 'success' as const },
    { action: 'admin.report.generate', resource: 'report', desc: 'Report generated', status: 'success' as const },
    { action: 'security.login.failed', resource: 'session', desc: 'Failed login attempt', status: 'failure' as const },
    { action: 'security.2fa.enabled', resource: 'security', desc: 'Two-factor authentication enabled', status: 'success' as const },
    { action: 'security.password.reset', resource: 'security', desc: 'Password reset requested', status: 'success' as const },
    { action: 'offer_code.create', resource: 'offer_code', desc: 'New offer code created', status: 'success' as const },
    { action: 'offer_code.redeem', resource: 'offer_code', desc: 'Offer code redeemed', status: 'success' as const },
    { action: 'reward.payout', resource: 'reward', desc: 'Reward payout processed', status: 'success' as const },
    { action: 'kyc.submit', resource: 'kyc', desc: 'KYC documentation submitted', status: 'pending' as const },
    { action: 'kyc.approve', resource: 'kyc', desc: 'KYC application approved', status: 'success' as const },
    { action: 'kyc.reject', resource: 'kyc', desc: 'KYC application rejected', status: 'failure' as const },
  ];

  const ips = ['192.168.1.1', '10.0.0.1', '172.16.0.1', '203.0.113.1', '198.51.100.1'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148',
    'Mozilla/5.0 (Linux; Android 14) Chrome/120.0.0.0 Mobile',
    'PostmanRuntime/7.36.0',
  ];

  const devices: ('web' | 'mobile' | 'api')[] = ['web', 'mobile', 'api'];

  return Array.from({ length: count }, (_, i) => {
    const actor = actors[Math.floor(Math.random() * actors.length)];
    const actionData = actions[Math.floor(Math.random() * actions.length)];
    const ip = ips[Math.floor(Math.random() * ips.length)];
    const ua = userAgents[Math.floor(Math.random() * userAgents.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];

    // Random date within the last 7 days
    const date = new Date();
    date.setDate(date.getDate() - Math.random() * 7);
    date.setHours(date.getHours() - Math.random() * 24);

    return {
      id: `log-${Date.now()}-${i}`,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_email: actor.email,
      action: actionData.action,
      resource_type: actionData.resource,
      resource_id: Math.floor(Math.random() * 10000) + 1,
      description: actionData.desc,
      status: actionData.status,
      ip_address: ip,
      user_agent: ua,
      metadata: { device, browser: ua.split('/')[0] },
      created_at: date.toISOString(),
    };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// ─── Action Helpers ─────────────────────────────────────────────────────

function getActionIcon(action: string): React.ElementType {
  if (action.startsWith('user.login')) return LogIn;
  if (action.startsWith('user.logout')) return LogOut;
  if (action.startsWith('user.create')) return UserCheck;
  if (action.startsWith('user.delete')) return UserX;
  if (action.startsWith('user.suspend')) return ShieldOff;
  if (action.startsWith('user.verify') || action.startsWith('user.role')) return Shield;
  if (action.startsWith('transaction')) return DollarSign;
  if (action.startsWith('admin.settings')) return Settings;
  if (action.startsWith('admin.notification')) return Bell;
  if (action.startsWith('admin.email')) return Mail;
  if (action.startsWith('admin.report')) return Activity;
  if (action.startsWith('security')) return AlertTriangle;
  if (action.startsWith('kyc')) return CheckCircle;
  if (action.startsWith('offer_code')) return Activity;
  if (action.startsWith('reward')) return DollarSign;
  return Activity;
}

function getActionColor(action: string): string {
  if (action.startsWith('user.login') || action.startsWith('user.logout')) return 'text-blue-600 bg-blue-50';
  if (action.startsWith('user.create') || action.startsWith('user.verify')) return 'text-emerald-600 bg-emerald-50';
  if (action.startsWith('user.delete') || action.startsWith('user.suspend')) return 'text-red-600 bg-red-50';
  if (action.startsWith('user.role')) return 'text-purple-600 bg-purple-50';
  if (action.startsWith('transaction.complete')) return 'text-green-600 bg-green-50';
  if (action.startsWith('transaction.fail') || action.startsWith('transaction.refund')) return 'text-orange-600 bg-orange-50';
  if (action.startsWith('transaction')) return 'text-cyan-600 bg-cyan-50';
  if (action.startsWith('admin.settings')) return 'text-gray-600 bg-gray-50';
  if (action.startsWith('admin.notification') || action.startsWith('admin.email')) return 'text-amber-600 bg-amber-50';
  if (action.startsWith('security') || action.startsWith('kyc.reject')) return 'text-rose-600 bg-rose-50';
  if (action.startsWith('kyc')) return 'text-indigo-600 bg-indigo-50';
  return 'text-slate-600 bg-slate-50';
}

function getStatusVariant(status: string): 'success' | 'danger' | 'warning' | 'info' {
  const map: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
    success: 'success',
    failure: 'danger',
    pending: 'warning',
  };
  return map[status] || 'info';
}

function getDeviceIcon(device?: string): React.ElementType {
  if (device === 'mobile') return Smartphone;
  if (device === 'api') return Globe;
  return Monitor;
}

function formatActionLabel(action: string): string {
  return action
    .replace(/\./g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Filter Fields ──────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
  {
    id: 'search',
    label: 'Search',
    type: 'text',
    placeholder: 'Actor, action, description...',
    helpText: 'Search across actors, actions, and descriptions',
  },
  {
    id: 'action',
    label: 'Action Type',
    type: 'select',
    placeholder: 'All Actions',
    options: [
      { value: 'user', label: 'User Actions' },
      { value: 'transaction', label: 'Transactions' },
      { value: 'admin', label: 'Admin Actions' },
      { value: 'security', label: 'Security Events' },
      { value: 'kyc', label: 'KYC Events' },
      { value: 'offer_code', label: 'Offer Codes' },
      { value: 'reward', label: 'Rewards' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'All Statuses',
    options: [
      { value: 'success', label: 'Success' },
      { value: 'failure', label: 'Failure' },
      { value: 'pending', label: 'Pending' },
    ],
  },
  {
    id: 'date_from',
    label: 'From Date',
    type: 'date',
    helpText: 'Filter events from this date',
  },
  {
    id: 'date_to',
    label: 'To Date',
    type: 'date',
    helpText: 'Filter events to this date',
  },
];

// ─── Component ──────────────────────────────────────────────────────────

export default function AdminActivityLogPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<AuditLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const perPage = 20;

  const isAdmin = useMemo(
    () => Boolean(user?.roles?.some((role) => role === 'admin')),
    [user]
  );

  const {
    isOpen,
    filters,
    hasActiveFilters,
    getActiveFilterCount,
    openFilters,
    closeFilters,
    applyFilters,
    resetFilters,
  } = useFilters({
    fields: FILTER_FIELDS,
    onFiltersChange: () => setCurrentPage(1),
  });

  useEffect(() => {
    if (user && !isAdmin) {
      router.push('/dashboard');
    }
  }, [user, isAdmin, router]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual service
      await new Promise((r) => setTimeout(r, 600));
      const mockLogs = generateMockLogs(150);
      setLogs(mockLogs);
      setStats(MOCK_STATS);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadLogs();
  }, [isAdmin]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh || !isAdmin) return;
    const interval = setInterval(loadLogs, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, isAdmin]);

  const filteredLogs = useMemo(() => {
    let result = [...logs];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.actor_name.toLowerCase().includes(q) ||
          l.actor_email.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.ip_address.includes(q)
      );
    }

    if (filters.action) {
      result = result.filter((l) => l.action.startsWith(filters.action));
    }

    if (filters.status) {
      result = result.filter((l) => l.status === filters.status);
    }

    if (filters.date_from) {
      const from = new Date(filters.date_from);
      result = result.filter((l) => new Date(l.created_at) >= from);
    }

    if (filters.date_to) {
      const to = new Date(filters.date_to);
      to.setHours(23, 59, 59, 999);
      result = result.filter((l) => new Date(l.created_at) <= to);
    }

    return result;
  }, [logs, filters]);

  const totalPages = Math.ceil(filteredLogs.length / perPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleViewDetails = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  if (!isAdmin) return null;

  // ─── Render ──────────────────────────────────────────────────────────

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="min-h-screen px-4 py-6 sm:px-6 lg:px-8"
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── Header ─────────────────────────────────────── */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-600 shadow-sm">
          <Activity className="h-3.5 w-3.5 text-[#C9A84C]" />
          Audit Trail
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              Activity Log
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Monitor all system events, admin actions, and security-related activities
              across the platform.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="sr-only peer"
              />
              <div className="h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:bg-[#C9A84C] peer-checked:after:translate-x-full relative" />
              <span className="text-xs font-semibold text-gray-500">Auto-refresh</span>
            </label>
            <Button
              onClick={loadLogs}
              variant="secondary"
              size="sm"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────── */}
      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: 'Total Events', value: stats.total_events.toLocaleString(), icon: Activity, color: 'text-blue-600 bg-blue-50' },
            { label: 'Successful', value: stats.successful_events.toLocaleString(), icon: CheckCircle, color: 'text-green-600 bg-green-50' },
            { label: 'Failed', value: stats.failed_events.toLocaleString(), icon: XCircle, color: 'text-red-600 bg-red-50' },
            { label: 'Today', value: stats.events_today.toLocaleString(), icon: Clock, color: 'text-amber-600 bg-amber-50' },
            { label: 'Unique Actors', value: stats.unique_actors.toString(), icon: Activity, color: 'text-purple-600 bg-purple-50' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
                    <p className="mt-1.5 text-xl font-black text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`rounded-xl ${stat.color} p-2 shrink-0`}>
                    <Icon size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Filters ─────────────────────────────────────── */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {hasActiveFilters ? (
            <span>
              Showing <strong className="text-gray-900">{filteredLogs.length}</strong> of{' '}
              <strong className="text-gray-900">{logs.length}</strong> events
            </span>
          ) : (
            <span>
              <strong className="text-gray-900">{logs.length}</strong> events recorded
            </span>
          )}
        </div>
        <Button
          onClick={openFilters}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            hasActiveFilters
              ? 'bg-[#C9A84C] text-white shadow-lg shadow-[#C9A84C]/20'
              : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter size={15} />
          Filters {hasActiveFilters && `(${getActiveFilterCount()})`}
        </Button>
      </div>

      <FilterPanel
        title="Filter Activity Log"
        description="Narrow down events by action type, status, date range, or search term"
        fields={FILTER_FIELDS}
        isOpen={isOpen}
        onClose={closeFilters}
        onApply={applyFilters}
        onReset={resetFilters}
        position="right"
        mobilePosition="auto"
      />

      {/* ── Logs Table ──────────────────────────────────── */}
      <Card className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <TableSkeleton rows={10} cols={6} />
        ) : paginatedLogs.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-gray-200 bg-gray-50">
              <Activity className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="mt-5 text-xl font-black text-gray-900">No events found</h3>
            <p className="mt-2 max-w-md text-sm text-gray-500">
              {hasActiveFilters
                ? 'No events match your current filters. Try adjusting your search criteria.'
                : 'No activity events have been recorded yet.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    {['Timestamp', 'Actor', 'Action', 'Description', 'Status', ''].map((h) => (
                      <th
                        key={h}
                        className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 ${
                          h === 'Status' ? 'text-center' : h === '' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedLogs.map((log) => {
                    const ActionIcon = getActionIcon(log.action);
                    const actionColor = getActionColor(log.action);
                    const DeviceIcon = getDeviceIcon(log.metadata?.device);

                    return (
                      <tr
                        key={log.id}
                        className="transition-colors hover:bg-[#FDFAF3]/60 cursor-pointer"
                        onClick={() => handleViewDetails(log)}
                      >
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock size={12} className="text-gray-300" />
                            <span className="text-xs font-mono text-gray-500">
                              {formatDateTime(log.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                              {log.actor_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{log.actor_name}</p>
                              <p className="text-xs text-gray-400">{log.actor_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`rounded-lg ${actionColor} p-1.5`}>
                              <ActionIcon size={14} />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 capitalize">
                              {formatActionLabel(log.action)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-600 max-w-xs truncate">
                            {log.description}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <DeviceIcon size={10} className="text-gray-300" />
                            <span className="text-[10px] font-mono text-gray-300">
                              {log.ip_address}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <Badge variant={getStatusVariant(log.status)} size="sm">
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(log);
                            }}
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-[#C9A84C]"
                            title="View details"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 p-4 lg:hidden">
              {paginatedLogs.map((log) => {
                const ActionIcon = getActionIcon(log.action);
                const actionColor = getActionColor(log.action);
                return (
                  <div
                    key={log.id}
                    className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 cursor-pointer"
                    onClick={() => handleViewDetails(log)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-xl ${actionColor} p-2`}>
                          <ActionIcon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 capitalize">
                            {formatActionLabel(log.action)}
                          </p>
                          <p className="text-xs text-gray-500">{log.actor_name}</p>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(log.status)} size="sm">
                        {log.status}
                      </Badge>
                    </div>
                    <p className="mt-3 text-xs text-gray-600">{log.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-300">
                        {formatDateTime(log.created_at)}
                      </span>
                      <span className="text-[10px] font-mono text-gray-300">
                        {log.ip_address}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {/* ── Pagination ───────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs text-gray-500">
            Page <span className="font-semibold text-gray-700">{currentPage}</span> of{' '}
            <span className="font-semibold text-gray-700">{totalPages}</span>
            {' '}&middot;{' '}
            <span className="font-semibold text-gray-700">{filteredLogs.length}</span> total events
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white disabled:opacity-40 hover:border-[#C9A84C]/40"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white disabled:opacity-40 hover:border-[#C9A84C]/40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Detail Modal ─────────────────────────────────── */}
      {showDetails && selectedLog && (
        <Modal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          title="Event Details"
          size="lg"
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Status Banner */}
            <div
              className={clsx(
                'rounded-2xl p-4',
                selectedLog.status === 'success' && 'bg-green-50 border border-green-200',
                selectedLog.status === 'failure' && 'bg-red-50 border border-red-200',
                selectedLog.status === 'pending' && 'bg-amber-50 border border-amber-200'
              )}
            >
              <div className="flex items-center gap-3">
                {selectedLog.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                {selectedLog.status === 'failure' && <XCircle className="h-5 w-5 text-red-600" />}
                {selectedLog.status === 'pending' && <AlertTriangle className="h-5 w-5 text-amber-600" />}
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedLog.status === 'success' ? 'Action Completed Successfully' :
                     selectedLog.status === 'failure' ? 'Action Failed' : 'Action Pending'}
                  </p>
                  <p className="text-xs text-gray-500">{selectedLog.description}</p>
                </div>
              </div>
            </div>

            {/* Event Info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Event ID</p>
                <p className="mt-1.5 font-mono text-sm font-semibold text-gray-900">{selectedLog.id}</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Timestamp</p>
                <p className="mt-1.5 font-mono text-sm font-semibold text-gray-900">
                  {formatDateTime(selectedLog.created_at)}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Action</p>
                <p className="mt-1.5 text-sm font-semibold text-gray-900 capitalize">
                  {formatActionLabel(selectedLog.action)}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Resource</p>
                <p className="mt-1.5 text-sm font-semibold text-gray-900 capitalize">
                  {selectedLog.resource_type} #{selectedLog.resource_id}
                </p>
              </div>
            </div>

            {/* Actor Info */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Actor</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/10 text-sm font-bold text-[#C9A84C]">
                  {selectedLog.actor_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{selectedLog.actor_name}</p>
                  <p className="text-xs text-gray-500">{selectedLog.actor_email}</p>
                  <p className="text-xs text-gray-400">ID: {selectedLog.actor_id}</p>
                </div>
              </div>
            </div>

            {/* Request Info */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Request Information</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">IP Address</span>
                  <span className="font-mono font-semibold text-gray-900">{selectedLog.ip_address}</span>
                </div>
                <div className="border-t border-gray-200" />
                <div>
                  <span className="text-gray-500">User Agent</span>
                  <p className="mt-1 font-mono text-xs text-gray-700 break-all">{selectedLog.user_agent}</p>
                </div>
                {selectedLog.metadata?.device && (
                  <>
                    <div className="border-t border-gray-200" />
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Device</span>
                      <span className="font-semibold text-gray-900 capitalize">{selectedLog.metadata.device}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Raw Metadata */}
            {Object.keys(selectedLog.metadata).length > 0 && (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Metadata</p>
                <pre className="overflow-auto rounded-lg bg-white p-3 text-xs font-mono text-gray-700 max-h-40 border border-gray-200">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            )}

            {/* Close */}
            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowDetails(false)}
                className="rounded-xl bg-gray-900 px-6 text-white hover:bg-gray-800"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
