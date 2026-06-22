'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map paths to page titles for mobile header
const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/projects': 'Projects / Sites',
  '/dashboard/parties': 'Parties & Clients',
  '/dashboard/vendors': 'Vendors',
  '/dashboard/inventory': 'Material Stock',
  '/dashboard/expenses': 'Petty Cash',
  '/dashboard/dpr': 'Daily Progress',
  '/dashboard/import': 'Import Data',
};

export function Topbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] ?? 'Dashboard';

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-gutter h-16 sticky top-0 z-40 bg-surface backdrop-blur-md border-b border-outline-variant/10 duration-150 ease-in-out">
      
      {/* Mobile: Logo on left */}
      <div className="md:hidden flex items-center">
        <Image src="/logo.png" alt="Logo" width={130} height={42} className="object-contain" priority />
      </div>

      {/* Desktop: Search on left */}
      <div className="hidden md:flex items-center gap-4 flex-1">
        <div className="flex items-center bg-surface-container-low rounded-full px-4 py-2 w-96 border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
          <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
          <input type="text" placeholder="Search projects, vendors, or materials..." className="bg-transparent border-none outline-none text-on-surface font-body-md w-full placeholder-on-surface-variant focus:ring-0 p-0 text-sm" />
        </div>
      </div>

      {/* Right side: actions */}
      <div className="flex items-center gap-1 relative">

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors relative active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl z-50 py-2">
              <div className="px-4 py-2 border-b border-outline-variant/20">
                <h3 className="font-semibold text-on-surface">Notifications</h3>
              </div>
              <div className="p-4 text-center">
                <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-2 text-on-surface-variant">
                  <span className="material-symbols-outlined">done_all</span>
                </div>
                <p className="font-semibold text-sm text-on-surface">You&apos;re all caught up!</p>
                <p className="text-on-surface-variant text-xs mt-1">No new alerts.</p>
              </div>
            </div>
          )}
        </div>

        {/* Settings - desktop only */}
        <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors hidden md:block">
          <span className="material-symbols-outlined">settings</span>
        </button>

        {/* Profile avatar */}
        <div className="relative">
          <div
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className="h-8 w-8 ml-2 rounded-full cursor-pointer bg-surface-variant flex items-center justify-center text-on-surface hover:opacity-80 transition-opacity border border-outline-variant overflow-hidden"
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl z-50 py-1">
              <div className="px-4 py-3 border-b border-outline-variant/20">
                <p className="font-semibold text-sm text-on-surface">Admin User</p>
                <p className="text-on-surface-variant text-xs mt-0.5">Lines & Thoughts</p>
              </div>
              <div className="py-1">
                <Link href="/dashboard" className="w-full text-left px-4 py-2.5 hover:bg-surface-container-low text-on-surface text-sm flex items-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">account_circle</span>
                  My Profile
                </Link>
                <button 
                  onClick={async () => {
                    const { supabase } = await import('@/lib/supabase');
                    await supabase.auth.signOut();
                    window.location.href = '/login';
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-error-container/30 text-error text-sm flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
