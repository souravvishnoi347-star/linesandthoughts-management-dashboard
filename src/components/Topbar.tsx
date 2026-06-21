'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function Topbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex justify-between items-center w-full px-gutter h-16 sticky top-0 z-40 bg-surface/70 backdrop-blur-md docked border-b border-outline-variant/20 duration-150 ease-in-out">
      <div className="flex items-center gap-4 flex-1">
        <div className="md:hidden flex items-center bg-white p-1 rounded-lg shadow-sm">
          <Image src="/logo.png" alt="Logo" width={140} height={40} className="object-contain" priority />
        </div>
        
        {/* Search on Left (Desktop) */}
        <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-2 w-96 border border-outline-variant/30 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all">
          <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
          <input type="text" placeholder="Search projects, vendors, or materials..." className="bg-transparent border-none outline-none text-on-surface font-body-md w-full placeholder-on-surface-variant focus:ring-0 p-0 text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-2 relative">
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors duration-150 ease-in-out relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl z-50 py-2">
              <div className="px-4 py-2 border-b border-outline-variant/20">
                <h3 className="font-headline-sm text-on-surface">Notifications</h3>
              </div>
              <div className="p-4 text-center">
                <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-2 text-on-surface-variant">
                  <span className="material-symbols-outlined">done_all</span>
                </div>
                <p className="font-label-md text-on-surface">You're all caught up!</p>
                <p className="text-on-surface-variant text-sm mt-1">No new alerts.</p>
              </div>
            </div>
          )}
        </div>

        <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors duration-150 ease-in-out hidden sm:block">
          <span className="material-symbols-outlined">settings</span>
        </button>
        
        <div className="relative">
          <div 
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className="h-8 w-8 ml-2 rounded-full overflow-hidden border border-outline-variant/30 cursor-pointer bg-primary-container flex items-center justify-center text-on-primary-container hover:bg-primary-container/80 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl z-50 py-1">
              <div className="px-4 py-3 border-b border-outline-variant/20">
                <p className="font-label-md text-on-surface">Admin User</p>
                <p className="text-on-surface-variant text-sm">admin@linesandthoughts.com</p>
              </div>
              <div className="py-1">
                <Link href="/dashboard" className="w-full text-left px-4 py-2 hover:bg-surface-container-low text-on-surface font-body-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">account_circle</span>
                  My Profile
                </Link>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="w-full text-left px-4 py-2 hover:bg-error-container hover:text-on-error-container text-error font-body-md flex items-center gap-2 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
