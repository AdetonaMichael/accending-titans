'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  KeyRound,
  Plus,
  Edit3,
  Trash2,
  ShieldPlus,
  Search,
} from 'lucide-react';

import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Modal } from '@/components/shared/Modal';
import { Input } from '@/components/shared/Input';
import { TableSkeleton } from '@/components/shared/SkeletonLoader';
import { Spinner } from '@/components/shared/Spinner';
import { useAuthStore } from '@/store/auth.store';
import { useAlert } from '@/hooks/useAlert';
import { adminService } from '@/services/admin.service';
import { formatDate } from '@/utils/format.utils';
import type { Permission } from '@/types/role.types';

// ─── Constants ────────────────────────────────────────────────────────────────

const PERMISSION_LABELS: Record<string, string> = {
  manage_users: 'Manage Users',
  manage_roles: 'Manage Roles',
  manage_permissions: 'Manage Permissions',
  manage_customers: 'Manage Customers',
  manage_transactions: 'Manage Transactions',
  perform_transactions: 'Perform Transactions',
  navigate_application: 'Navigate Application',
  view_ledger: 'View Ledger',
  manage_ledger: 'Manage Ledger',
  approve_ledger: 'Approve Ledger',
  view_reports: 'View Reports',
};

const PERMISSION_GROUP: Record<string, string> = {
  manage_users: 'User Management',
  manage_roles: 'Role Management',
  manage_permissions: 'Permission Management',
  manage_customers: 'Customer Management',
  manage_transactions: 'Transaction Management',
  perform_transactions: 'Transactions',
  navigate_application: 'General',
  view_ledger: 'Ledger',
  manage_ledger: 'Ledger',
  approve_ledger: 'Ledger',
  view_reports: 'Reports',
};

const GROUP_COLORS: Record<string, string> = {
  'User Management': 'bg-blue-50 text-blue-700 border-blue-200',
  'Role Management': 'bg-purple-50 text-purple-700 border-purple-200',
  'Permission Management': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Customer Management': 'bg-green-50 text-green-700 border-green-200',
  'Transaction Management': 'bg-orange-50 text-orange-700 border-orange-200',
  Transactions: 'bg-teal-50 text-teal-700 border-teal-200',
  General: 'bg-gray-50 text-gray-700 border-gray-200',
  Ledger: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Reports: 'bg-rose-50 text-rose-700 border-rose-200',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPermissionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showAlert } = useAlert();

  // ── State - Data ──────────────────────────────────────────────────────────
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  // ── State - Modals ────────────────────────────────────────────────────────
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  // ── State - Form ──────────────────────────────────────────────────────────
  const [formName, setFormName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  // ── Auth guard ────────────────────────────────────────────────────────────
  const isAdmin = useMemo(
    () => Boolean(user?.roles?.some((r) => r === 'admin')),
    [user]
  );

  useEffect(() => {
    if (user && !isAdmin) router.push('/dashboard');
  }, [user, isAdmin, router]);

  // ── Data fetching ─────────────────────────────────────────────────────────
  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPermissions();

      if (res.success && res.data?.permissions) {
        setPermissions(res.data.permissions);
      } else if (Array.isArray(res.data)) {
        setPermissions(res.data as unknown as Permission[]);
      } else {
        setPermissions([]);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      showAlert('Failed to load permissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filtered & grouped permissions ────────────────────────────────────────
  const filteredPermissions = useMemo(() => {
    if (!searchQuery.trim()) return permissions;
    const q = searchQuery.toLowerCase();
    return permissions.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (PERMISSION_LABELS[p.name] || '').toLowerCase().includes(q)
    );
  }, [permissions, searchQuery]);

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    filteredPermissions.forEach((perm) => {
      const group = PERMISSION_GROUP[perm.name] || 'Other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(perm);
    });
    return groups;
  }, [filteredPermissions]);

  // ── Handlers - Create ─────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setFormName('');
    setShowCreateModal(true);
  };

  const handleCreatePermission = async () => {
    if (!formName.trim()) {
      showAlert('Permission name is required', 'warning');
      return;
    }

    try {
      setLoadingAction(true);
      const res = await adminService.createPermission({
        name: formName.trim().toLowerCase().replace(/\s+/g, '_'),
        guard_name: 'api',
      });

      if (res.success) {
        showAlert('Permission created successfully', 'success');
        setShowCreateModal(false);
        fetchPermissions();
      } else {
        showAlert(res.message || 'Failed to create permission', 'error');
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to create permission';
      showAlert(msg, 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  // ── Handlers - Edit ───────────────────────────────────────────────────────
  const handleOpenEdit = (perm: Permission) => {
    setSelectedPermission(perm);
    setFormName(perm.name);
    setShowEditModal(true);
  };

  const handleEditPermission = async () => {
    if (!selectedPermission || !formName.trim()) {
      showAlert('Permission name is required', 'warning');
      return;
    }

    try {
      setLoadingAction(true);
      const res = await adminService.updatePermission(selectedPermission.id, {
        name: formName.trim().toLowerCase().replace(/\s+/g, '_'),
      });

      if (res.success) {
        showAlert('Permission updated successfully', 'success');
        setShowEditModal(false);
        setSelectedPermission(null);
        fetchPermissions();
      } else {
        showAlert(res.message || 'Failed to update permission', 'error');
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to update permission';
      showAlert(msg, 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  // ── Handlers - Delete ─────────────────────────────────────────────────────
  const handleOpenDelete = (perm: Permission) => {
    setSelectedPermission(perm);
    setShowDeleteModal(true);
  };

  const handleDeletePermission = async () => {
    if (!selectedPermission) return;

    try {
      setLoadingAction(true);
      const res = await adminService.deletePermission(selectedPermission.id);

      if (res.success) {
        showAlert('Permission deleted successfully', 'success');
        setShowDeleteModal(false);
        setSelectedPermission(null);
        fetchPermissions();
      } else {
        showAlert(res.message || 'Failed to delete permission', 'error');
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to delete permission';
      showAlert(msg, 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  // ── Guard render ──────────────────────────────────────────────────────────
  if (!isAdmin) return null;

  if (loading) {
    return <TableSkeleton rows={6} cols={4} />;
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="min-h-screen space-y-6 bg-[radial-gradient(circle_at_top_right,rgba(215,25,39,0.12),transparent_32%),#f8f8f8] px-4 py-6 text-slate-950 sm:px-6 lg:px-8"
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}</style>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
            Permissions Management
          </h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            View and manage all system permissions
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-[#c9a84c] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#c9a84c]/20 transition hover:bg-[#b8962e]"
        >
          <Plus size={18} />
          Create Permission
        </Button>
      </section>

      {/* ── Search ───────────────────────────────────────────────────────── */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"
        />
        <input
          type="text"
          placeholder="Search permissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-[#d1d5db] bg-white py-3 pl-11 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#c9a84c] focus:ring-4 focus:ring-[#c9a84c]/10"
        />
      </div>

      {/* ── Summary Card ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-indigo-50 p-3">
              <KeyRound className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                Total Permissions
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#111827]">
                {permissions.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-purple-50 p-3">
              <ShieldPlus className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                Groups
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#111827]">
                {Object.keys(groupedPermissions).length}
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* ── Permissions by Group ─────────────────────────────────────────── */}
      {Object.entries(groupedPermissions).length === 0 ? (
        <Card className="rounded-[28px] border border-[#e5e7eb] bg-white p-8 shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
          <div className="py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#eef2ff]">
              <KeyRound className="h-8 w-8 text-[#4a5ff7]" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-[#111827]">
              No permissions found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#6b7280]">
              {searchQuery
                ? 'No permissions match your search criteria.'
                : 'No permissions are configured in the system.'}
            </p>
          </div>
        </Card>
      ) : (
        Object.entries(groupedPermissions).map(([group, perms]) => (
          <Card
            key={group}
            className="overflow-hidden rounded-[28px] border border-[#e5e7eb] bg-white p-0 shadow-[0_10px_35px_rgba(0,0,0,0.04)]"
          >
            <div className="border-b border-[#f1f5f9] px-6 py-4">
              <span
                className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${GROUP_COLORS[group] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
              >
                {group}
              </span>
              <span className="ml-2 text-sm text-[#6b7280]">
                {perms.length} permission{perms.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#fcfcfd]">
                    {['Permission Name', 'Slug', 'Guard', 'Created', 'Actions'].map(
                      (h) => (
                        <th
                          key={h}
                          className={`px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b7280] ${
                            h === 'Actions' ? 'text-right' : 'text-left'
                          }`}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {perms.map((perm) => (
                    <tr
                      key={perm.id}
                      className="border-b border-[#f8fafc] transition-colors hover:bg-[#fafafa]"
                    >
                      {/* Display Name */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-[#111827]">
                          {PERMISSION_LABELS[perm.name] || perm.name}
                        </span>
                      </td>

                      {/* Slug */}
                      <td className="px-6 py-4">
                        <code className="rounded-md bg-[#f1f5f9] px-2 py-1 text-xs font-mono text-[#6b7280]">
                          {perm.name}
                        </code>
                      </td>

                      {/* Guard */}
                      <td className="px-6 py-4">
                        <code className="rounded-md bg-[#f1f5f9] px-2 py-1 text-xs font-mono text-[#6b7280]">
                          {perm.guard_name}
                        </code>
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4 text-sm text-[#6b7280]">
                        {formatDate(perm.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(perm)}
                            title="Edit Permission"
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-[#4a5ff7] transition hover:bg-[#eef2ff]"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(perm)}
                            title="Delete Permission"
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 p-4 xl:hidden">
              {perms.map((perm) => (
                <div
                  key={perm.id}
                  className="rounded-[22px] border border-[#edf2f7] bg-[#fcfcfd] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-bold text-[#111827]">
                        {PERMISSION_LABELS[perm.name] || perm.name}
                      </p>
                      <code className="mt-1 inline-block rounded bg-[#f1f5f9] px-2 py-0.5 text-xs font-mono text-[#6b7280]">
                        {perm.name}
                      </code>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenEdit(perm)}
                        className="rounded-lg p-2 text-[#4a5ff7] transition hover:bg-[#eef2ff]"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(perm)}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-[#6b7280]">
                      Guard: <code className="rounded bg-[#f1f5f9] px-1.5 py-0.5 font-mono">{perm.guard_name}</code>
                    </span>
                    <span className="text-xs text-[#6b7280]">
                      {formatDate(perm.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))
      )}

      {/* ── Create Permission Modal ─────────────────────────────────────────── */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Permission"
        size="sm"
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Permission Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g., export_reports"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
            <p className="mt-1 text-xs text-[#6b7280]">
              Will be auto-formatted to snake_case
            </p>
          </div>

          <div className="rounded-lg bg-[#f8fafc] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
              Guard
            </p>
            <p className="mt-1 text-sm font-medium text-[#111827]">api</p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#e5e7eb]">
            <Button
              variant="primary"
              size="md"
              onClick={handleCreatePermission}
              disabled={loadingAction || !formName.trim()}
              className="flex-1"
            >
              {loadingAction ? (
                <>
                  <Spinner />
                  Creating...
                </>
              ) : (
                'Create Permission'
              )}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Edit Permission Modal ───────────────────────────────────────────── */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Permission${selectedPermission ? `: ${PERMISSION_LABELS[selectedPermission.name] || selectedPermission.name}` : ''}`}
        size="sm"
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Permission Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Permission slug"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#e5e7eb]">
            <Button
              variant="primary"
              size="md"
              onClick={handleEditPermission}
              disabled={loadingAction || !formName.trim()}
              className="flex-1"
            >
              {loadingAction ? (
                <>
                  <Spinner />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowEditModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirmation Modal ───────────────────────────────────────── */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Permission"
        size="sm"
      >
        <div className="space-y-5">
          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <Trash2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <div>
                <p className="font-semibold text-red-800">
                  Are you sure you want to delete this permission?
                </p>
                {selectedPermission && (
                  <p className="mt-2 text-sm text-red-600">
                    Permission: <strong>{PERMISSION_LABELS[selectedPermission.name] || selectedPermission.name}</strong>
                    <br />
                    <code className="text-xs">{selectedPermission.name}</code>
                    <br />
                    This action cannot be undone. Roles using this permission will
                    lose it.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="danger"
              size="md"
              onClick={handleDeletePermission}
              disabled={loadingAction}
              className="flex-1"
            >
              {loadingAction ? (
                <>
                  <Spinner />
                  Deleting...
                </>
              ) : (
                'Delete Permission'
              )}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
