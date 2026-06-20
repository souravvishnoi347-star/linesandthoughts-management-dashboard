'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();
  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden bg-surface-container-highest/90 backdrop-blur-lg docked full-width bottom-0 rounded-t-xl border-t border-outline-variant/30 shadow-2xl fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2">
      <Link href="/dashboard" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 tap-highlight-transparent transition-colors ${isActive('/dashboard') ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant active:bg-surface-variant/50'}`}>
        <span className="material-symbols-outlined" data-weight={isActive('/dashboard') ? "fill" : undefined}>dashboard</span>
        <span className="font-label-sm text-[0.65rem] mt-1">Home</span>
      </Link>
      
      <Link href="/dashboard/projects" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 tap-highlight-transparent transition-colors ${isActive('/dashboard/projects') ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant active:bg-surface-variant/50'}`}>
        <span className="material-symbols-outlined" data-weight={isActive('/dashboard/projects') ? "fill" : undefined}>architecture</span>
        <span className="font-label-sm text-[0.65rem] mt-1">Sites</span>
      </Link>

      <Link href="/dashboard/inventory" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 tap-highlight-transparent transition-colors ${isActive('/dashboard/inventory') ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant active:bg-surface-variant/50'}`}>
        <span className="material-symbols-outlined" data-weight={isActive('/dashboard/inventory') ? "fill" : undefined}>inventory_2</span>
        <span className="font-label-sm text-[0.65rem] mt-1">Material</span>
      </Link>

      <Link href="/dashboard/expenses" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 tap-highlight-transparent transition-colors ${isActive('/dashboard/expenses') ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant active:bg-surface-variant/50'}`}>
        <span className="material-symbols-outlined" data-weight={isActive('/dashboard/expenses') ? "fill" : undefined}>payments</span>
        <span className="font-label-sm text-[0.65rem] mt-1">Expenses</span>
      </Link>

      <Link href="/dashboard/dpr" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 tap-highlight-transparent transition-colors ${isActive('/dashboard/dpr') ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant active:bg-surface-variant/50'}`}>
        <span className="material-symbols-outlined" data-weight={isActive('/dashboard/dpr') ? "fill" : undefined}>description</span>
        <span className="font-label-sm text-[0.65rem] mt-1">DPR</span>
      </Link>
    </nav>
  );
}
