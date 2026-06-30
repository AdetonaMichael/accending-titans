'use client';

import React, { useState, useRef } from 'react';
import {
  Bell,
  Camera,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Key,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  Trash2,
  Upload,
  User,
  UserCircle,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
type Tab = 'details' | 'profile' | 'password' | 'notifications' | 'security';

interface TabConfig {
  id: Tab;
  label: string;
  icon: React.ElementType;
}

// ── Constants ────────────────────────────────────────────────────────────────
const TABS: TabConfig[] = [
  { id: 'details', label: 'My details', icon: User },
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'password', label: 'Password', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

// ── Sub-components ───────────────────────────────────────────────────────────

interface FieldRowProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

const FieldRow: React.FC<FieldRowProps> = ({ label, required, hint, children }) => (
  <div className="grid grid-cols-1 gap-3 border-b border-gray-100 py-5 sm:grid-cols-[220px_1fr] sm:items-start">
    <div className="flex-shrink-0">
      <label className="text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-[#C9A84C]">*</span>}
      </label>
      {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
    </div>
    <div className="min-w-0">{children}</div>
  </div>
);

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#C9A84C] focus:bg-white focus:ring-2 focus:ring-[#C9A84C]/10';

const SectionHeader: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="mb-2 pt-1">
    <h2 className="text-base font-black text-gray-900">{title}</h2>
    <p className="mt-0.5 text-sm text-gray-400">{description}</p>
  </div>
);

// ── Tab panels ───────────────────────────────────────────────────────────────

const MyDetailsTab: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <SectionHeader
        title="Personal information"
        description="Update your name, contact details, and location."
      />

      <FieldRow label="Full name" required>
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} placeholder="First name" defaultValue="John" />
          <input className={inputClass} placeholder="Last name" defaultValue="Doe" />
        </div>
      </FieldRow>

      <FieldRow label="Email address" required>
        <div className="relative">
          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            className={`${inputClass} pl-9`}
            placeholder="you@example.com"
            defaultValue="john.doe@example.com"
          />
        </div>
      </FieldRow>

      <FieldRow label="Phone number" hint="Used for account recovery">
        <div className="relative">
          <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            className={`${inputClass} pl-9`}
            placeholder="+234 800 000 0000"
          />
        </div>
      </FieldRow>

      <FieldRow label="Country / Region">
        <div className="relative">
          <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <select className={`${inputClass} pl-9 cursor-pointer`}>
            <option>Nigeria</option>
            <option>Ghana</option>
            <option>Kenya</option>
            <option>South Africa</option>
          </select>
        </div>
      </FieldRow>

      <FieldRow label="City">
        <div className="relative">
          <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className={`${inputClass} pl-9`} placeholder="Lagos" />
        </div>
      </FieldRow>

      <div className="flex items-center justify-end gap-3 pt-5">
        <button className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-50">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#C9A84C]/20 transition hover:bg-[#B8962E] disabled:opacity-70"
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : saved ? (
            <Check size={14} />
          ) : (
            <Save size={14} />
          )}
          {saving ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  );
};

const ProfileTab: React.FC = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <SectionHeader
        title="Public profile"
        description="This information will be shown on your public business catalogue."
      />

      <FieldRow label="Profile photo" hint="JPG, PNG or GIF. Max 5 MB.">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 flex-shrink-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C9A84C]/20 bg-[#FDFAF3] text-xl font-black text-[#C9A84C]">
              JD
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#C9A84C] text-white shadow"
            >
              <Camera size={10} />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:border-[#C9A84C]/30 hover:text-[#C9A84C]"
            >
              <Upload size={12} />
              Upload
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-100">
              <Trash2 size={12} />
              Remove
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" />
        </div>
      </FieldRow>

      <FieldRow label="Display name" required>
        <input className={inputClass} placeholder="How others see your name" defaultValue="John Doe" />
      </FieldRow>

      <FieldRow label="Bio" hint="Max 160 characters">
        <textarea
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Tell the community a little about yourself…"
        />
      </FieldRow>

      <FieldRow label="Business / Role">
        <input
          className={inputClass}
          placeholder="e.g. Software Engineer at Acme Ltd"
        />
      </FieldRow>

      <FieldRow label="Website">
        <div className="relative">
          <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="url"
            className={`${inputClass} pl-9`}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </FieldRow>

      <div className="flex items-center justify-end gap-3 pt-5">
        <button className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-50">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#C9A84C]/20 transition hover:bg-[#B8962E] disabled:opacity-70"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saving ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  );
};

const PasswordTab: React.FC = () => {
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (field: keyof typeof show) =>
    setShow((s) => ({ ...s, [field]: !s[field] }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const PasswordField = ({
    label,
    field,
    hint,
  }: {
    label: string;
    field: keyof typeof show;
    hint?: string;
  }) => (
    <FieldRow label={label} required>
      <div>
        <div className="relative">
          <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={show[field] ? 'text' : 'password'}
            placeholder="••••••••"
            className={`${inputClass} pl-9 pr-10`}
          />
          <button
            type="button"
            onClick={() => toggle(field)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
          >
            {show[field] ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {hint && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-400">
            <Check size={11} className="text-gray-300" />
            {hint}
          </p>
        )}
      </div>
    </FieldRow>
  );

  return (
    <div>
      <SectionHeader
        title="Change password"
        description="Please enter your current password to update it."
      />

      <PasswordField label="Current password" field="current" />
      <PasswordField
        label="New password"
        field="next"
        hint="Must be at least 8 characters"
      />
      <PasswordField label="Confirm new password" field="confirm" />

      <div className="flex items-center justify-end gap-3 pt-5">
        <button className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-50">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#C9A84C]/20 transition hover:bg-[#B8962E] disabled:opacity-70"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Key size={14} />}
          {saving ? 'Updating…' : saved ? 'Updated' : 'Update password'}
        </button>
      </div>
    </div>
  );
};

const NotificationsTab: React.FC = () => {
  const [prefs, setPrefs] = useState({
    transactions: true,
    promotions: false,
    system: true,
    alerts: true,
    email: true,
    push: false,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const Toggle: React.FC<{ active: boolean; onChange: () => void }> = ({
    active,
    onChange,
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onChange}
      className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200"
      style={{ backgroundColor: active ? '#C9A84C' : '#e5e7eb' }}
    >
      <span
        className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: active ? 'translateX(18px)' : 'translateX(3px)' }}
      />
    </button>
  );

  const rows: Array<{ key: keyof typeof prefs; label: string; desc: string }> = [
    { key: 'transactions', label: 'Transactions', desc: 'Payments, transfers and wallet activity' },
    { key: 'promotions', label: 'Promotions', desc: 'Offers, campaigns and rewards' },
    { key: 'system', label: 'System updates', desc: 'Maintenance and platform announcements' },
    { key: 'alerts', label: 'Security alerts', desc: 'Login attempts and suspicious activity' },
    { key: 'email', label: 'Email notifications', desc: 'Receive summaries via email' },
    { key: 'push', label: 'Push notifications', desc: 'Instant alerts on your device' },
  ];

  return (
    <div>
      <SectionHeader
        title="Notification preferences"
        description="Choose what you're notified about and how."
      />

      <div className="mt-1 divide-y divide-gray-100">
        {rows.map(({ key, label, desc }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 py-4"
          >
            <div>
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              <p className="mt-0.5 text-xs text-gray-400">{desc}</p>
            </div>
            <Toggle active={prefs[key]} onChange={() => toggle(key)} />
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-5">
        <button className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[#C9A84C]/20 transition hover:bg-[#B8962E]">
          <Save size={14} />
          Save preferences
        </button>
      </div>
    </div>
  );
};

const SecurityTab: React.FC = () => {
  const sessions = [
    { device: 'Chrome · Windows', location: 'Lagos, NG', time: 'Active now', current: true },
    { device: 'Safari · iPhone', location: 'Abuja, NG', time: '2 hours ago', current: false },
    { device: 'Firefox · macOS', location: 'Lagos, NG', time: 'Yesterday', current: false },
  ];

  return (
    <div>
      <SectionHeader
        title="Security settings"
        description="Manage your account security and active sessions."
      />

      {/* 2FA */}
      <div className="mt-1 rounded-xl border border-gray-100 bg-gray-50/70 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-[#C9A84C]/20 bg-[#FDFAF3]">
              <Shield size={16} className="text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">Two-factor authentication</p>
              <p className="mt-0.5 text-xs text-gray-400">
                Add an extra layer of security to your account.
              </p>
            </div>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-[#C9A84C]/25 bg-[#FDFAF3] px-4 py-2 text-xs font-semibold text-[#C9A84C] transition hover:bg-[#C9A84C]/10 whitespace-nowrap">
            Enable 2FA
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Active sessions */}
      <div className="mt-6">
        <p className="mb-3 text-sm font-black text-gray-900">Active sessions</p>
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-200/80 bg-white overflow-hidden">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-800">{s.device}</p>
                  {s.current && (
                    <span className="rounded-full border border-[#C9A84C]/20 bg-[#FDFAF3] px-2 py-0.5 text-[10px] font-semibold text-[#C9A84C]">
                      This device
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-gray-400">
                  {s.location} · {s.time}
                </p>
              </div>
              {!s.current && (
                <button className="text-xs font-semibold text-red-500 transition hover:text-red-700">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="mt-6 rounded-xl border border-red-100 bg-red-50/60 p-5">
        <p className="text-sm font-black text-red-800">Danger zone</p>
        <p className="mt-0.5 text-xs text-red-500">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <button className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100">
          <Trash2 size={12} />
          Delete account
        </button>
      </div>
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('details');

  const tabContent: Record<Tab, React.ReactNode> = {
    details: <MyDetailsTab />,
    profile: <ProfileTab />,
    password: <PasswordTab />,
    notifications: <NotificationsTab />,
    security: <SecurityTab />,
  };

  return (
    <div className="space-y-6">

      {/* ── Profile hero card ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        {/* Cover banner */}
        <div className="relative h-28 sm:h-36 bg-gradient-to-br from-[#FDFAF3] via-[#f5efd4] to-[#e8d9a0]">
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 80% 50%, #C9A84C 0%, transparent 60%)',
            }}
          />
          <div className="h-[3px] bg-gradient-to-r from-[#C9A84C]/30 via-[#C9A84C] to-[#C9A84C]/30" />
        </div>

        {/* Avatar + info */}
        <div className="relative px-6 pb-6 sm:px-8">
          {/* Avatar */}
          <div className="relative -mt-10 mb-4 inline-block">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-[#FDFAF3] text-2xl font-black text-[#C9A84C] shadow-sm">
              JD
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#C9A84C]">
              <Check size={11} className="text-white" />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900">
                John Doe
              </h1>
              <p className="mt-0.5 text-sm text-gray-400">john.doe@example.com</p>
            </div>

            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-[#C9A84C]/30 hover:bg-[#FDFAF3] hover:text-[#C9A84C]">
                <UserCircle size={14} />
                View profile
              </button>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="border-t border-gray-100 px-6 sm:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex flex-shrink-0 items-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors ${
                    active
                      ? 'text-[#C9A84C]'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <Icon size={14} className="flex-shrink-0" />
                  {tab.label}
                  {/* Active underline */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all ${
                      active ? 'bg-[#C9A84C]' : 'bg-transparent group-hover:bg-gray-200'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white px-6 py-6 shadow-sm sm:px-8">
        {tabContent[activeTab]}
      </div>
    </div>
  );
}