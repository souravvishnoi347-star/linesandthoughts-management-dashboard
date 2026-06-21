'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: 'dashboard', label: 'Home' },
  { href: '/dashboard/projects', icon: 'architecture', label: 'Sites' },
  { href: '/dashboard/expenses', icon: 'payments', label: 'Cash' },
  { href: '/dashboard/dpr', icon: 'description', label: 'DPR' },
  { href: '/dashboard/inventory', icon: 'inventory_2', label: 'Stock' },
];

export function BottomNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest border-t border-outline-variant pb-safe pt-2 px-6 flex justify-between items-center z-50 shadow-2xl">
      {navItems.map((item, index) => {
        // Middle item becomes FAB-style
        if (index === 2) {
          return (
            <div key="fab" className="relative -top-5 flex flex-col items-center min-w-[64px]">
              <Link
                href={item.href}
                className="w-14 h-14 bg-primary-container rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-on-primary-container text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {item.icon}
                </span>
              </Link>
              <span className={`font-label text-label-sm absolute -bottom-5 w-full text-center ${isActive(item.href) ? 'font-bold text-primary' : 'text-on-surface-variant'}`}>
                {item.label}
              </span>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 min-w-[64px] active:scale-95 transition-transform ${
              isActive(item.href)
                ? 'text-primary'
                : 'text-on-surface-variant hover:opacity-80'
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: isActive(item.href) ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className={`font-label text-label-sm ${isActive(item.href) ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
