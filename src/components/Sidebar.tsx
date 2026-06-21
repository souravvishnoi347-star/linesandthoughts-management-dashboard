'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="hidden md:flex flex-col h-screen fixed bg-primary-container/80 backdrop-blur-xl docked w-sidebar-width left-0 border-r border-outline-variant/20 shadow-xl py-base z-50">
      <div className="px-gutter mb-8 mt-2 flex items-center justify-center pt-4">
        <Image src="/logo.png" alt="Lines & Thoughts logo" width={220} height={80} className="object-contain" priority />
      </div>

      <nav className="flex-1 overflow-y-auto px-base space-y-1">
        <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/dashboard') ? 'border-l-4 border-on-primary-container text-on-primary-container font-extrabold bg-white/20 scale-98' : 'text-on-primary-container/70 hover:text-on-primary-container hover:bg-white/10'}`}>
          <span className="material-symbols-outlined" data-weight={isActive('/dashboard') ? 'fill' : 'regular'}>dashboard</span>
          <span className="font-label-md">Overview</span>
        </Link>
        <Link href="/dashboard/projects" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/dashboard/projects') ? 'border-l-4 border-on-primary-container text-on-primary-container font-extrabold bg-white/20 scale-98' : 'text-on-primary-container/70 hover:text-on-primary-container hover:bg-white/10'}`}>
          <span className="material-symbols-outlined" data-weight={isActive('/dashboard/projects') ? 'fill' : 'regular'}>architecture</span>
          <span className="font-label-md">Projects / Sites</span>
        </Link>
        <Link href="/dashboard/parties" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/dashboard/parties') ? 'border-l-4 border-on-primary-container text-on-primary-container font-extrabold bg-white/20 scale-98' : 'text-on-primary-container/70 hover:text-on-primary-container hover:bg-white/10'}`}>
          <span className="material-symbols-outlined" data-weight={isActive('/dashboard/parties') ? 'fill' : 'regular'}>groups</span>
          <span className="font-label-md">Parties / Clients</span>
        </Link>
        <Link href="/dashboard/vendors" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/dashboard/vendors') ? 'border-l-4 border-on-primary-container text-on-primary-container font-extrabold bg-white/20 scale-98' : 'text-on-primary-container/70 hover:text-on-primary-container hover:bg-white/10'}`}>
          <span className="material-symbols-outlined" data-weight={isActive('/dashboard/vendors') ? 'fill' : 'regular'}>store</span>
          <span className="font-label-md">Vendors</span>
        </Link>
        <Link href="/dashboard/inventory" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/dashboard/inventory') ? 'border-l-4 border-on-primary-container text-on-primary-container font-extrabold bg-white/20 scale-98' : 'text-on-primary-container/70 hover:text-on-primary-container hover:bg-white/10'}`}>
          <span className="material-symbols-outlined" data-weight={isActive('/dashboard/inventory') ? 'fill' : 'regular'}>inventory_2</span>
          <span className="font-label-md">Material Inventory</span>
        </Link>
        <Link href="/dashboard/expenses" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/dashboard/expenses') ? 'border-l-4 border-on-primary-container text-on-primary-container font-extrabold bg-white/20 scale-98' : 'text-on-primary-container/70 hover:text-on-primary-container hover:bg-white/10'}`}>
          <span className="material-symbols-outlined" data-weight={isActive('/dashboard/expenses') ? 'fill' : 'regular'}>payments</span>
          <span className="font-label-md">Petty Cash</span>
        </Link>
        <Link href="/dashboard/dpr" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/dashboard/dpr') ? 'border-l-4 border-on-primary-container text-on-primary-container font-extrabold bg-white/20 scale-98' : 'text-on-primary-container/70 hover:text-on-primary-container hover:bg-white/10'}`}>
          <span className="material-symbols-outlined" data-weight={isActive('/dashboard/dpr') ? 'fill' : 'regular'}>description</span>
          <span className="font-label-md">DPR</span>
        </Link>
        <Link href="/dashboard/import" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/dashboard/import') ? 'border-l-4 border-on-primary-container text-on-primary-container font-extrabold bg-white/20 scale-98' : 'text-on-primary-container/70 hover:text-on-primary-container hover:bg-white/10'}`}>
          <span className="material-symbols-outlined" data-weight={isActive('/dashboard/import') ? 'fill' : 'regular'}>cloud_upload</span>
          <span className="font-label-md">Import Data</span>
        </Link>
      </nav>

      <div className="px-gutter mt-auto pt-4 pb-4">
        <Link href="/dashboard/projects" className="w-full bg-surface-container-lowest text-primary-container font-label-md text-label-md py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Project
        </Link>
        
        <form action="/auth/signout" method="post" className="mt-4">
          <button type="submit" className="w-full text-on-primary-container/70 hover:text-error transition-colors flex items-center justify-center gap-2 py-2 font-label-sm">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
