'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Settings } from 'lucide-react';
import { NotificationsList } from '@/components/dashboard/NotificationsList';

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <div className="h-[3px] bg-gradient-to-r from-[#C9A84C]/30 via-[#C9A84C] to-[#C9A84C]/30" />
        <div className="flex items-center justify-between p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#C9A84C]/25 bg-[#FDFAF3]">
              <Bell size={18} className="text-[#C9A84C]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900">
                Notifications
              </h1>
              <p className="mt-0.5 text-sm text-gray-400">
                Manage and review all your notifications.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/dashboard/settings/notifications')}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-500 transition hover:border-[#C9A84C]/30 hover:bg-[#FDFAF3] hover:text-[#C9A84C]"
            title="Notification settings"
          >
            <Settings size={15} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      <NotificationsList limit={20} />
    </div>
  );
}