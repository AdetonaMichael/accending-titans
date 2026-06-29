'use client';

import React, { useEffect } from 'react';
import { Bell, Check, Mail, Zap } from 'lucide-react';
import { NotificationPreferences } from '@/components/dashboard/NotificationPreferences';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationSettingsPage() {
  const { preferences, fetchPreferences } = useNotifications();

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const stats: Array<{
    label: string;
    value: string;
    active: boolean;
    icon: React.ElementType;
  }> = preferences
    ? [
        {
          label: 'Overall Status',
          value: preferences.enabled ? 'Active' : 'Paused',
          active: preferences.enabled,
          icon: Check,
        },
        {
          label: 'Push Notifications',
          value: preferences.push_notifications ? 'On' : 'Off',
          active: preferences.push_notifications,
          icon: Zap,
        },
        {
          label: 'Email Notifications',
          value: preferences.email_notifications ? 'On' : 'Off',
          active: preferences.email_notifications,
          icon: Mail,
        },
      ]
    : [];

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <div className="h-[3px] bg-gradient-to-r from-[#C9A84C]/30 via-[#C9A84C] to-[#C9A84C]/30" />
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#C9A84C]/25 bg-[#FDFAF3]">
              <Bell size={18} className="text-[#C9A84C]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900">
                Notification Settings
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Customize how and when you receive notifications.
              </p>
            </div>
          </div>

          {/* Status summary cards */}
          {preferences && (
            <div className="mt-6 grid grid-cols-1 gap-3 border-t border-gray-100 pt-6 sm:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3.5"
                  >
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-base font-black text-gray-900">{stat.value}</p>
                    </div>
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        stat.active
                          ? 'border border-[#C9A84C]/25 bg-[#FDFAF3]'
                          : 'border border-gray-200 bg-white'
                      }`}
                    >
                      <Icon
                        size={16}
                        className={stat.active ? 'text-[#C9A84C]' : 'text-gray-300'}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Preferences Form ── */}
      <NotificationPreferences />
    </div>
  );
}