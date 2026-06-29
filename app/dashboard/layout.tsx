'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  Award,
  FileText,
  Gift,
  Home,
  LogOut,
  Menu,
  Send,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';

import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { Topbar } from '@/components/shared/Topbar';
import { AuthProtected } from '@/components/AuthProtected';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuth();
  const { activeRole } = useAuthStore();
  const { sidebarOpen } = useUIStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(true);
      return;
    }

    if (!user.isEmailVerified) {
      router.replace(`/auth/verify-email?email=${encodeURIComponent(user.email)}`);
      return;
    }

    const dashboardSpecificPages = ['/dashboard/profile', '/dashboard/catalogue'];
    const isDashboardSpecificPage = dashboardSpecificPages.some((page) =>
      pathname?.startsWith(page)
    );

    if (isDashboardSpecificPage) {
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [user, router, pathname]);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/profile', label: 'My Profile', icon: Users },
    { href: '/dashboard/catalogue', label: 'Business Catalogue', icon: FileText },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Activity },
    { href: '/dashboard/messages', label: 'Messages', icon: Send },
    { href: '/dashboard/rewards', label: 'Birthday Rewards', icon: Gift },
    { href: '/dashboard/referral', label: 'Referral Program', icon: Users },
    { href: '/dashboard/opportunities', label: 'Opportunities', icon: Award },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => pathname === href;

  const initials = user?.first_name
    ? user.first_name.slice(0, 1).toUpperCase() + (user?.last_name?.slice(0, 1).toUpperCase() ?? '')
    : 'AT';

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Logo */}
      <div className="border-b border-gray-100 px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C9A84C]/25 bg-[#FDFAF3] flex-shrink-0">
            <div className="h-[14px] w-[14px] rounded-[4px] bg-[#C9A84C]" />
          </div>
          {(sidebarOpen || mobile) && (
            <div>
              <p className="text-sm font-black tracking-tight text-gray-900 leading-tight">
                Accending titans
              </p>
              <p className="text-[11px] font-semibold text-gray-400 leading-tight">
                Payment Wallet
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobile && setMobileMenuOpen(false)}
              className={clsx(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                active
                  ? 'bg-[#C9A84C] text-white shadow-sm shadow-[#C9A84C]/20'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon
                size={17}
                className={clsx(
                  'flex-shrink-0',
                  active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                )}
              />
              {(sidebarOpen || mobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 p-3 space-y-1">
        {(sidebarOpen || mobile) && (
          <div className="mb-2 rounded-xl border border-[#C9A84C]/15 bg-[#FDFAF3] px-3.5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A84C]/70">
              Signed in as
            </p>
            <p className="mt-0.5 truncate text-sm font-black text-gray-900">
              {user?.first_name || 'Accending titans User'}
            </p>
          </div>
        )}

        <button
          onClick={() => {
            logout();
            if (mobile) setMobileMenuOpen(false);
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={17} className="flex-shrink-0" />
          {(sidebarOpen || mobile) && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <AuthProtected requireAuth>
      <div className="flex h-screen overflow-hidden bg-[#f8f8f8] text-gray-900">

        {/* Desktop Sidebar */}
        <aside
          className={clsx(
            'hidden shrink-0 flex-col border-r border-gray-100 bg-white transition-all duration-300 md:flex',
            sidebarOpen ? 'w-64' : 'w-[72px]'
          )}
        >
          <SidebarContent />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 md:hidden"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <p className="hidden text-sm font-medium text-gray-400 sm:block">
                Good day, {user?.first_name || 'there'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A84C]/25 bg-[#FDFAF3] text-xs font-black text-[#B8962E]">
                {initials}
              </div>
            </div>
          </header>

          {/* Mobile overlay */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Mobile Sidebar */}
          <aside
            className={clsx(
              'fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-100 bg-white transition-transform duration-300 md:hidden',
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C9A84C]/25 bg-[#FDFAF3] flex-shrink-0">
                  <div className="h-[14px] w-[14px] rounded-[4px] bg-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-sm font-black tracking-tight text-gray-900 leading-tight">
                    Accending titans
                  </p>
                  <p className="text-[11px] font-semibold text-gray-400 leading-tight">
                    Payment Wallet
                  </p>
                </div>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-50"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                      active
                        ? 'bg-[#C9A84C] text-white shadow-sm shadow-[#C9A84C]/20'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon
                      size={17}
                      className={clsx(
                        'flex-shrink-0',
                        active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-gray-100 p-3 space-y-1">
              <div className="mb-2 rounded-xl border border-[#C9A84C]/15 bg-[#FDFAF3] px-3.5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A84C]/70">
                  Signed in as
                </p>
                <p className="mt-0.5 truncate text-sm font-black text-gray-900">
                  {user?.first_name || 'Accending titans User'}
                </p>
              </div>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto bg-[#f8f8f8] p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProtected>
  );
};

export default DashboardLayout;