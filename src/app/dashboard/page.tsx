'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { Building2, Package, IndianRupee, FileText } from 'lucide-react';

export default function DashboardOverview() {
  const [stats, setStats] = useState({ projects: 0, materials: 0, expenses: 0, dprs: 0 });
  const [recentExpenses, setRecentExpenses] = useState<{ id: string; description: string; amount: number; date: string }[]>([]);
  const [recentDprs, setRecentDprs] = useState<{ id: string; summary: string; date: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [
        { count: projCount },
        { count: matCount },
        { data: expData },
        { count: dprCount },
        { data: recentDprData },
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('materials').select('*', { count: 'exact', head: true }),
        supabase.from('expenses').select('amount, description, date, id').order('date', { ascending: false }).limit(5),
        supabase.from('dpr').select('*', { count: 'exact', head: true }),
        supabase.from('dpr').select('id, summary, date').order('date', { ascending: false }).limit(3),
      ]);

      const totalExpenses = (expData || []).reduce((sum, e) => sum + e.amount, 0);
      setStats({ projects: projCount || 0, materials: matCount || 0, expenses: totalExpenses, dprs: dprCount || 0 });
      setRecentExpenses(expData || []);
      setRecentDprs(recentDprData || []);
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>Dashboard Overview</h1>
        <p className="text-muted">Welcome to Lines & Thoughts Operations Center</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div className="metric-card bg-gradient-1">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 500, marginBottom: '0.25rem' }}>Active Projects</p>
                  <p style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>{stats.projects}</p>
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                  <Building2 size={24} color="white" />
                </div>
              </div>
            </div>

            <div className="metric-card bg-gradient-2">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 500, marginBottom: '0.25rem' }}>Material Entries</p>
                  <p style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>{stats.materials}</p>
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                  <Package size={24} color="white" />
                </div>
              </div>
            </div>

            <div className="metric-card bg-gradient-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 500, marginBottom: '0.25rem' }}>Total Expenses</p>
                  <p style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>₹{stats.expenses.toLocaleString('en-IN')}</p>
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                  <IndianRupee size={24} color="white" />
                </div>
              </div>
            </div>

            <div className="metric-card bg-gradient-4">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 500, marginBottom: '0.25rem' }}>DPRs Submitted</p>
                  <p style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>{stats.dprs}</p>
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                  <FileText size={24} color="white" />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
            <Card glass style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '8px', color: 'var(--danger)' }}>
                  <IndianRupee size={20} />
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Expenses</h2>
              </div>
              
              {recentExpenses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  <p>No expenses logged yet.</p>
                </div>
              ) : (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recentExpenses.map(exp => (
                    <li key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{exp.description}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(exp.date).toLocaleDateString('en-IN')}</span>
                      </div>
                      <span style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '1.1rem', backgroundColor: 'rgba(244, 63, 94, 0.05)', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                        - ₹{exp.amount.toLocaleString('en-IN')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card glass style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: 'var(--success)' }}>
                  <FileText size={20} />
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Latest Progress Reports</h2>
              </div>

              {recentDprs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  <p>No DPRs submitted yet.</p>
                </div>
              ) : (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recentDprs.map(dpr => (
                    <li key={dpr.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {new Date(dpr.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {dpr.summary}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
