import React from 'react';
import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <Sidebar />
      <main className="app-main" style={{ flex: 1, padding: '2rem', transition: 'all 0.3s ease' }}>
        {children}
      </main>
    </div>
  );
}
