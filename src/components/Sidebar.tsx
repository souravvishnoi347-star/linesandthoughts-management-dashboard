import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, IndianRupee, FileText, FileUp, Settings, LogOut, Users, Briefcase, Building2 } from 'lucide-react';
import Image from 'next/image';

export function Sidebar() {
  return (
    <aside className="app-sidebar" style={{ 
      width: '280px', 
      borderRight: '1px solid rgba(0,0,0,0.05)', 
      background: 'rgba(255, 255, 255, 0.8)', 
      backdropFilter: 'blur(20px)',
      padding: '2rem 1.5rem', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '2.5rem',
      boxShadow: '4px 0 24px rgba(0,0,0,0.02)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '1.5rem', paddingTop: '0.5rem' }}>
        {/* Next.js will look for this file inside the 'public' folder */}
        <Image 
          src="/logo.png" 
          alt="Lines & Thoughts" 
          width={220} 
          height={85} 
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', paddingLeft: '0.75rem' }}>Menu</p>
        
        <Link href="/dashboard" className="nav-item">
          <LayoutDashboard size={18} />
          <span>Overview</span>
        </Link>
        <Link href="/dashboard/projects" className="nav-item">
          <Building2 size={18} />
          <span>Projects / Sites</span>
        </Link>
        <Link href="/dashboard/parties" className="nav-item">
          <Users size={18} />
          <span>Parties / Clients</span>
        </Link>
        <Link href="/dashboard/vendors" className="nav-item">
          <Briefcase size={18} />
          <span>Vendors / Contractors</span>
        </Link>
        <Link href="/dashboard/inventory" className="nav-item">
          <Package size={18} />
          <span>Material Inventory</span>
        </Link>
        <Link href="/dashboard/expenses" className="nav-item">
          <IndianRupee size={18} />
          <span>Petty Cash</span>
        </Link>
        <Link href="/dashboard/dpr" className="nav-item">
          <FileText size={18} />
          <span>Daily Progress (DPR)</span>
        </Link>
        
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '1.5rem', marginBottom: '0.5rem', paddingLeft: '0.75rem' }}>Tools</p>
        
        <Link href="/dashboard/import" className="nav-item">
          <FileUp size={18} />
          <span>Import Data</span>
        </Link>
      </nav>

      <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem' }}>
        <button className="nav-item text-danger" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
