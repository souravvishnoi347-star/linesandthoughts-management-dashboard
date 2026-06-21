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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/30 flex items-center justify-around px-2 pb-safe shadow-2xl">
      {navItems.map((item, index) => {
        // Middle item becomes FAB-style
        if (index === 2) {
          return (
            <div key="fab" className="flex flex-col items-center -mt-6">
              <Link
                href={item.href}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary-container shadow-primary-container/40 scale-110'
                    : 'bg-primary-container hover:scale-105'
                }`}
              >
                <span className="material-symbols-outlined text-on-primary-container text-[24px]" data-weight="fill">
                  {item.icon}
                </span>
              </Link>
              <span className={`text-[10px] font-semibold mt-1 ${isActive(item.href) ? 'text-primary-container' : 'text-on-surface-variant'}`}>
                {item.label}
              </span>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 min-w-[56px] ${
              isActive(item.href)
                ? 'text-primary-container'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] transition-all duration-200 ${isActive(item.href) ? 'scale-110' : ''}`}
              data-weight={isActive(item.href) ? 'fill' : 'regular'}
            >
              {item.icon}
            </span>
            <span className={`text-[10px] font-semibold ${isActive(item.href) ? 'font-bold' : ''}`}>
              {item.label}
            </span>
            {isActive(item.href) && (
              <span className="w-1 h-1 rounded-full bg-primary-container mt-0.5" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
