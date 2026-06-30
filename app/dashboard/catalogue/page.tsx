'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowUpDown,
  Briefcase,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Grid3x3,
  Image as ImageIcon,
  List,
  Loader2,
  MoreVertical,
  Package,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  Store,
  Tag,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';

// ── Types ────────────────────────────────────────────────────────────────────
type ItemStatus = 'active' | 'draft' | 'out_of_stock';
type ItemType = 'product' | 'service';
type ViewMode = 'grid' | 'list';
type SortKey = 'newest' | 'oldest' | 'name_asc' | 'price_high' | 'price_low';

interface CatalogueItem {
  id: string;
  name: string;
  description: string;
  category: string;
  type: ItemType;
  price: number;
  status: ItemStatus;
  imageUrl: string | null;
  createdAt: string;
}

interface StatusConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  dot: string;
}

const STATUS_CONFIG: Record<ItemStatus, StatusConfig> = {
  active: { label: 'Active', badgeBg: 'bg-green-50 border-green-100', badgeText: 'text-green-700', dot: 'bg-green-500' },
  draft: { label: 'Draft', badgeBg: 'bg-gray-50 border-gray-200', badgeText: 'text-gray-500', dot: 'bg-gray-300' },
  out_of_stock: { label: 'Out of stock', badgeBg: 'bg-red-50 border-red-100', badgeText: 'text-red-600', dot: 'bg-red-400' },
};

const SORT_LABELS: Record<SortKey, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  name_asc: 'Name (A–Z)',
  price_high: 'Price (high to low)',
  price_low: 'Price (low to high)',
};

// ── Mock data — swap with real fetch ────────────────────────────────────────
const MOCK_ITEMS: CatalogueItem[] = [
  {
    id: '1',
    name: 'Premium Leather Bag',
    description: 'Handcrafted full-grain leather tote, made to order.',
    category: 'Fashion',
    type: 'product',
    price: 45000,
    status: 'active',
    imageUrl: null,
    createdAt: '2026-06-20T10:00:00Z',
  },
  {
    id: '2',
    name: 'Brand Identity Design',
    description: 'Complete logo, palette, and brand guideline package.',
    category: 'Design',
    type: 'service',
    price: 120000,
    status: 'active',
    imageUrl: null,
    createdAt: '2026-06-15T10:00:00Z',
  },
  {
    id: '3',
    name: 'Organic Skincare Set',
    description: 'Three-piece face care bundle with natural ingredients.',
    category: 'Beauty',
    type: 'product',
    price: 18500,
    status: 'out_of_stock',
    imageUrl: null,
    createdAt: '2026-06-10T10:00:00Z',
  },
  {
    id: '4',
    name: 'Bookkeeping Service',
    description: 'Monthly financial record-keeping for small businesses.',
    category: 'Finance',
    type: 'service',
    price: 35000,
    status: 'draft',
    imageUrl: null,
    createdAt: '2026-06-05T10:00:00Z',
  },
];

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#C9A84C] focus:bg-white focus:ring-2 focus:ring-[#C9A84C]/10';

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);

// ── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: ItemStatus }> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${config.badgeBg} ${config.badgeText}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

// ── Stat card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon: Icon, iconBg, iconColor }) => (
  <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-400">{label}</p>
        <p className="mt-2 text-2xl font-black text-gray-900">{value}</p>
        <p className="mt-1 text-xs text-gray-400">{sub}</p>
      </div>
      <div className={`rounded-xl ${iconBg} p-2.5`}>
        <Icon size={18} className={iconColor} />
      </div>
    </div>
  </div>
);

// ── Item card (grid view) ───────────────────────────────────────────────────
interface ItemCardProps {
  item: CatalogueItem;
  onEdit: (item: CatalogueItem) => void;
  onDelete: (item: CatalogueItem) => void;
  onToggleStatus: (item: CatalogueItem) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onDelete, onToggleStatus }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#C9A84C]/30 hover:shadow-md">
      {/* Image */}
      <div className="relative h-40 flex-shrink-0 overflow-hidden bg-gray-50">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon size={28} className="text-gray-200" />
          </div>
        )}

        {/* Type badge */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-2.5 py-1 text-[10px] font-semibold capitalize text-gray-600 backdrop-blur-sm">
          {item.type === 'product' ? <Package size={11} /> : <Briefcase size={11} />}
          {item.type}
        </span>

        {/* Menu */}
        <div className="absolute right-3 top-3">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-500 backdrop-blur-sm transition hover:text-gray-900"
            aria-label="Item actions"
          >
            <MoreVertical size={13} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-1.5 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  onClick={() => { onEdit(item); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  <Pencil size={12} /> Edit item
                </button>
                <button
                  onClick={() => { onToggleStatus(item); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  {item.status === 'draft' ? <Eye size={12} /> : <EyeOff size={12} />}
                  {item.status === 'draft' ? 'Publish' : 'Unpublish'}
                </button>
                <button
                  onClick={() => { onDelete(item); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-semibold text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <h3 className="text-sm font-black leading-tight text-gray-900">{item.name}</h3>
        </div>

        <p className="mb-3 line-clamp-2 flex-1 text-xs text-gray-400 leading-relaxed">
          {item.description}
        </p>

        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
            <Tag size={9} />
            {item.category}
          </span>
          <StatusBadge status={item.status} />
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-sm font-black text-gray-900">{formatCurrency(item.price)}</span>
          <button
            onClick={() => onEdit(item)}
            className="text-xs font-semibold text-[#C9A84C] transition hover:text-[#B8962E]"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Item row (list view) ────────────────────────────────────────────────────
const ItemRow: React.FC<ItemCardProps> = ({ item, onEdit, onDelete, onToggleStatus }) => (
  <div className="flex items-center gap-4 border-b border-gray-50 px-5 py-4 transition hover:bg-[#FDFAF3]/40">
    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
      ) : (
        <ImageIcon size={16} className="text-gray-200" />
      )}
    </div>

    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-black text-gray-900">{item.name}</p>
      <p className="truncate text-xs text-gray-400">{item.category} · {item.type}</p>
    </div>

    <StatusBadge status={item.status} />

    <span className="w-28 flex-shrink-0 text-right text-sm font-black text-gray-900">
      {formatCurrency(item.price)}
    </span>

    <div className="flex flex-shrink-0 items-center gap-1">
      <button
        onClick={() => onEdit(item)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-[#FDFAF3] hover:text-[#C9A84C]"
        aria-label="Edit"
      >
        <Pencil size={14} />
      </button>
      <button
        onClick={() => onToggleStatus(item)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        aria-label="Toggle status"
      >
        {item.status === 'draft' ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
      <button
        onClick={() => onDelete(item)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
        aria-label="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);

// ── Empty state ──────────────────────────────────────────────────────────────
const EmptyState: React.FC<{ onAdd: () => void; hasFilters: boolean; onClearFilters: () => void }> = ({
  onAdd,
  hasFilters,
  onClearFilters,
}) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-white px-6 py-20 text-center shadow-sm">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C9A84C]/20 bg-[#FDFAF3]">
      <Store size={26} className="text-[#C9A84C]" />
    </div>
    <h3 className="text-lg font-black text-gray-900">
      {hasFilters ? 'No items match your filters' : 'Your catalogue is empty'}
    </h3>
    <p className="mt-1.5 max-w-sm text-sm text-gray-400">
      {hasFilters
        ? 'Try adjusting your search or filters to find what you\'re looking for.'
        : 'Start building your storefront by adding your first product or service.'}
    </p>
    <button
      onClick={hasFilters ? onClearFilters : onAdd}
      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#C9A84C]/20 transition hover:bg-[#B8962E]"
    >
      {hasFilters ? <X size={14} /> : <Plus size={14} />}
      {hasFilters ? 'Clear filters' : 'Add your first item'}
    </button>
  </div>
);

// ── Add/Edit modal ───────────────────────────────────────────────────────────
interface ItemModalProps {
  isOpen: boolean;
  item: CatalogueItem | null;
  onClose: () => void;
  onSave: (item: CatalogueItem) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, item, onClose, onSave }) => {
  const [form, setForm] = useState<{
    name: string;
    description: string;
    category: string;
    type: ItemType;
    price: string;
    status: ItemStatus;
  }>({
    name: item?.name ?? '',
    description: item?.description ?? '',
    category: item?.category ?? '',
    type: item?.type ?? 'product',
    price: item ? String(item.price) : '',
    status: item?.status ?? 'draft',
  });
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setForm({
      name: item?.name ?? '',
      description: item?.description ?? '',
      category: item?.category ?? '',
      type: item?.type ?? 'product',
      price: item ? String(item.price) : '',
      status: item?.status ?? 'draft',
    });
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));

    const payload: CatalogueItem = {
      id: item?.id ?? String(Date.now()),
      name: form.name,
      description: form.description,
      category: form.category,
      type: form.type,
      price: Number(form.price) || 0,
      status: form.status,
      imageUrl: item?.imageUrl ?? null,
      createdAt: item?.createdAt ?? new Date().toISOString(),
    };

    setSaving(false);
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl border border-gray-200/80 bg-white shadow-xl sm:max-w-lg sm:rounded-2xl">
        <div className="h-[3px] flex-shrink-0 bg-gradient-to-r from-[#C9A84C]/30 via-[#C9A84C] to-[#C9A84C]/30" />

        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-black text-gray-900">
            {item ? 'Edit item' : 'Add new item'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
          {/* Image upload placeholder */}
          <div className="mb-5 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/70 py-8 transition hover:border-[#C9A84C]/40">
            <div className="text-center">
              <Upload size={20} className="mx-auto mb-2 text-gray-300" />
              <p className="text-xs font-semibold text-gray-500">Click to upload image</p>
              <p className="mt-0.5 text-[11px] text-gray-300">PNG, JPG up to 5MB</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Item name <span className="text-[#C9A84C]">*</span>
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Premium Leather Bag"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className={`${inputClass} resize-none`}
                placeholder="Briefly describe this item…"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Category</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Fashion"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ItemType }))}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  Price (₦) <span className="text-[#C9A84C]">*</span>
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className={inputClass}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ItemStatus }))}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="out_of_stock">Out of stock</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#C9A84C]/20 transition hover:bg-[#B8962E] disabled:opacity-70"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {saving ? 'Saving…' : item ? 'Save changes' : 'Add item'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CataloguePage() {
  const [items, setItems] = useState<CatalogueItem[]>(MOCK_ITEMS);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<ItemType | ''>('');
  const [sortKey, setSortKey] = useState<SortKey>('newest');
  const [sortOpen, setSortOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogueItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CatalogueItem | null>(null);

  const hasFilters = Boolean(search || statusFilter || typeFilter);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
      );
    }
    if (statusFilter) result = result.filter((i) => i.status === statusFilter);
    if (typeFilter) result = result.filter((i) => i.type === typeFilter);

    switch (sortKey) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
    }

    return result;
  }, [items, search, statusFilter, typeFilter, sortKey]);

  const stats = useMemo(
    () => ({
      total: items.length,
      active: items.filter((i) => i.status === 'active').length,
      draft: items.filter((i) => i.status === 'draft').length,
      value: items.reduce((sum, i) => sum + i.price, 0),
    }),
    [items]
  );

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('');
  };

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: CatalogueItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSave = (item: CatalogueItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      return exists ? prev.map((i) => (i.id === item.id ? item : i)) : [item, ...prev];
    });
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleToggleStatus = (item: CatalogueItem) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, status: i.status === 'draft' ? 'active' : 'draft' as ItemStatus }
          : i
      )
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <ProtectedPageWrapper>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight text-gray-900">
              Business Catalogue
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Showcase and manage your products and services.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#C9A84C]/20 transition hover:bg-[#B8962E]"
          >
            <Plus size={16} />
            Add item
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            label="Total items"
            value={stats.total}
            sub="In your catalogue"
            icon={ShoppingBag}
            iconBg="bg-[#FDFAF3]"
            iconColor="text-[#C9A84C]"
          />
          <StatCard
            label="Active"
            value={stats.active}
            sub="Visible to customers"
            icon={Eye}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            label="Drafts"
            value={stats.draft}
            sub="Not yet published"
            icon={Pencil}
            iconBg="bg-gray-50"
            iconColor="text-gray-400"
          />
          <StatCard
            label="Catalogue value"
            value={formatCurrency(stats.value)}
            sub="Combined listed price"
            icon={Tag}
            iconBg="bg-[#FDFAF3]"
            iconColor="text-[#C9A84C]"
          />
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items…"
              className={`${inputClass} pl-9`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ItemStatus | '')}
              className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 outline-none transition hover:border-[#C9A84C]/30 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out_of_stock">Out of stock</option>
            </select>

            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ItemType | '')}
              className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 outline-none transition hover:border-[#C9A84C]/30 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10"
            >
              <option value="">All types</option>
              <option value="product">Products</option>
              <option value="service">Services</option>
            </select>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 transition hover:border-[#C9A84C]/30"
              >
                <ArrowUpDown size={12} />
                {SORT_LABELS[sortKey]}
                <ChevronDown size={12} className="text-gray-400" />
              </button>

              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                    {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => { setSortKey(key); setSortOpen(false); }}
                        className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-xs font-semibold transition ${
                          sortKey === key ? 'text-[#C9A84C]' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {SORT_LABELS[key]}
                        {sortKey === key && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-0.5 rounded-xl border border-gray-200 bg-gray-50 p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-white text-[#C9A84C] shadow-sm' : 'text-gray-400'
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  viewMode === 'list' ? 'bg-white text-[#C9A84C] shadow-sm' : 'text-gray-400'
                }`}
                aria-label="List view"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        {filteredItems.length === 0 ? (
          <EmptyState onAdd={handleAdd} hasFilters={hasFilters} onClearFilters={clearFilters} />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
            {filteredItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}

        {/* ── Add/Edit modal ── */}
        <ItemModal
          isOpen={modalOpen}
          item={editingItem}
          onClose={() => { setModalOpen(false); setEditingItem(null); }}
          onSave={handleSave}
        />

        {/* ── Delete confirmation ── */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xl">
              <div className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-100 bg-red-50">
                  <AlertCircle size={20} className="text-red-500" />
                </div>
                <h3 className="text-base font-black text-gray-900">Delete this item?</h3>
                <p className="mt-1.5 text-sm text-gray-400">
                  "{deleteTarget.name}" will be permanently removed from your catalogue. This can't be undone.
                </p>
              </div>
              <div className="flex gap-3 border-t border-gray-100 p-4">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ProtectedPageWrapper>
  );
}