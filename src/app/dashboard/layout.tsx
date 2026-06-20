import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { BottomNav } from '@/components/BottomNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 md:ml-sidebar-width flex flex-col min-h-screen pb-24 md:pb-0">
        <Topbar />
        {children}
      </main>
      <BottomNav />
    </>
  );
}
