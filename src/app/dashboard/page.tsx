'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import * as XLSX from 'xlsx';

type DateFilter = 'All Time' | 'This Month' | 'This Week';

export default function DashboardOverview() {
  const [stats, setStats] = useState({ projects: 0, materials: 0, expenses: 0, dprs: 0 });
  const [recentExpenses, setRecentExpenses] = useState<{ id: string; description: string; amount: number; date: string }[]>([]);
  const [recentDprs, setRecentDprs] = useState<{ id: string; summary: string; date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>('All Time');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      
      let dateThreshold = new Date(0).toISOString();
      const now = new Date();
      if (dateFilter === 'This Week') {
        const lastWeek = new Date(now.setDate(now.getDate() - 7));
        dateThreshold = lastWeek.toISOString();
      } else if (dateFilter === 'This Month') {
        const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
        dateThreshold = lastMonth.toISOString();
      }

      const [
        { count: projCount },
        { count: matCount },
        { data: expData },
        { count: dprCount },
        { data: recentDprData },
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }).gte('created_at', dateThreshold),
        supabase.from('materials').select('*', { count: 'exact', head: true }).gte('created_at', dateThreshold),
        supabase.from('expenses').select('amount, description, date, id').gte('date', dateThreshold).order('date', { ascending: false }).limit(5),
        supabase.from('dpr').select('*', { count: 'exact', head: true }).gte('date', dateThreshold),
        supabase.from('dpr').select('id, summary, date').gte('date', dateThreshold).order('date', { ascending: false }).limit(3),
      ]);

      const totalExpenses = (expData || []).reduce((sum, e) => sum + e.amount, 0);
      setStats({ projects: projCount || 0, materials: matCount || 0, expenses: totalExpenses, dprs: dprCount || 0 });
      setRecentExpenses(expData || []);
      setRecentDprs(recentDprData || []);
      setLoading(false);
    }
    fetchStats();
  }, [dateFilter]);

  const handleGenerateReport = () => {
    const wb = XLSX.utils.book_new();
    
    // Summary Sheet
    const summaryData = [
      ['Metric', 'Value'],
      ['Total Active Sites', stats.projects],
      ['Material Entries', stats.materials],
      ['Petty Cash Spent (₹)', stats.expenses],
      ['DPRs Submitted', stats.dprs]
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    // Recent Expenses Sheet
    const wsExpenses = XLSX.utils.json_to_sheet(recentExpenses.map(e => ({ Date: e.date, Description: e.description, Amount: e.amount })));
    XLSX.utils.book_append_sheet(wb, wsExpenses, 'Recent Expenses');

    // Recent DPRs Sheet
    const wsDprs = XLSX.utils.json_to_sheet(recentDprs.map(d => ({ Date: d.date, Summary: d.summary })));
    XLSX.utils.book_append_sheet(wb, wsDprs, 'Recent DPRs');

    XLSX.writeFile(wb, `Dashboard_Report_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.xlsx`);
  };

  if (loading && Object.values(stats).every(v => v === 0)) {
    return (
      <div className="flex justify-center items-center p-16 h-full flex-1">
        <div className="w-10 h-10 border-4 border-surface-container border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-container-padding space-y-6 flex-1 overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-1">Dashboard Overview</h2>
          <p className="text-on-surface-variant font-body-md">Real-time metrics and recent activities across all sites.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="px-4 py-2 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              {dateFilter}
            </button>
            {showDateDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-lg z-50 py-1">
                {(['All Time', 'This Month', 'This Week'] as DateFilter[]).map(filter => (
                  <button 
                    key={filter} 
                    onClick={() => { setDateFilter(filter); setShowDateDropdown(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-surface-container-low text-on-surface font-body-md ${dateFilter === filter ? 'bg-surface-variant/20 font-bold' : ''}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-primary-container text-on-primary font-label-md text-label-md rounded-lg hover:bg-inverse-surface transition-colors shadow-sm hidden sm:flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Generate Report
          </button>
        </div>
      </div>

      {/* Bento Grid: Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Active Sites (Slate) */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/5 rounded-full blur-xl group-hover:bg-primary-container/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 z-10">
            <div className="p-2 bg-surface-container-low text-primary-container rounded-lg">
              <span className="material-symbols-outlined">architecture</span>
            </div>
            <span className="text-secondary font-label-md text-label-md flex items-center gap-1 bg-secondary-container/30 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> Active
            </span>
          </div>
          <div className="z-10">
            <p className="text-on-surface-variant font-label-sm text-label-sm mb-1 uppercase tracking-wider">Total Active Sites</p>
            <h3 className="font-display-lg text-display-lg text-on-surface">{stats.projects}</h3>
          </div>
        </div>

        {/* Metric 2: Material Entries */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-dim/30 rounded-full blur-xl group-hover:bg-surface-dim/50 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 z-10">
            <div className="p-2 bg-surface-container text-on-surface rounded-lg">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
          </div>
          <div className="z-10">
            <p className="text-on-surface-variant font-label-sm text-label-sm mb-1 uppercase tracking-wider">Material Entries</p>
            <h3 className="font-display-lg text-display-lg text-on-surface">{stats.materials}</h3>
          </div>
        </div>

        {/* Metric 3: Petty Cash Spent (Rose/Error) */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-error-container/30 rounded-full blur-xl group-hover:bg-error-container/50 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 z-10">
            <div className="p-2 bg-error-container text-on-error-container rounded-lg">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-error font-label-md text-label-md flex items-center gap-1 bg-error-container/30 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">warning</span> Total
            </span>
          </div>
          <div className="z-10">
            <p className="text-on-surface-variant font-label-sm text-label-sm mb-1 uppercase tracking-wider">Petty Cash Spent</p>
            <h3 className="font-headline-lg text-headline-lg text-on-surface mt-2">₹{stats.expenses.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        {/* Metric 4: DPRs Submitted */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-fixed/30 rounded-full blur-xl group-hover:bg-tertiary-fixed/50 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 z-10">
            <div className="p-2 bg-tertiary-fixed text-on-tertiary-fixed rounded-lg">
              <span className="material-symbols-outlined">description</span>
            </div>
          </div>
          <div className="z-10">
            <p className="text-on-surface-variant font-label-sm text-label-sm mb-1 uppercase tracking-wider">DPRs Submitted</p>
            <h3 className="font-display-lg text-display-lg text-on-surface">{stats.dprs}</h3>
          </div>
        </div>
      </div>

      {/* Complex Layout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Activities Table Area */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-0 flex flex-col shadow-sm overflow-hidden">
          <div className="p-5 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/50">
            <h3 className="font-headline-md text-headline-md text-on-surface">Recent Expenses</h3>
            <button className="text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            {recentExpenses.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant font-body-md">No expenses logged yet.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-bright text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/20">
                    <th className="py-3 px-5 font-medium">Description</th>
                    <th className="py-3 px-5 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-body-md font-body-md">
                  {recentExpenses.map(exp => (
                    <tr key={exp.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors group">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[16px]">payments</span>
                          </div>
                          <div>
                            <p className="text-on-surface font-medium truncate w-40 md:w-56">{exp.description}</p>
                            <p className="text-on-surface-variant text-label-sm">{new Date(exp.date).toLocaleDateString('en-IN')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-right text-error font-bold">
                        -₹{exp.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="p-3 border-t border-outline-variant/20 bg-surface-bright text-center">
            <Link href="/dashboard/expenses" className="text-primary-container font-label-sm text-label-sm font-semibold hover:underline">View All Expenses</Link>
          </div>
        </div>

        {/* Latest Progress Reports */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-0 flex flex-col shadow-sm overflow-hidden">
          <div className="p-5 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/50">
            <h3 className="font-headline-md text-headline-md text-on-surface">Latest DPRs</h3>
            <button className="text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div className="p-0">
            {recentDprs.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant font-body-md">No DPRs submitted yet.</div>
            ) : (
              <div className="flex flex-col">
                {recentDprs.map(dpr => (
                  <div key={dpr.id} className="p-5 border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors flex gap-4">
                    <div className="w-8 h-8 rounded bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-1">
                      <span className="material-symbols-outlined text-[16px]">description</span>
                    </div>
                    <div>
                      <p className="text-on-surface font-medium mb-1">{new Date(dpr.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <p className="text-on-surface-variant text-sm line-clamp-2">{dpr.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-3 border-t border-outline-variant/20 bg-surface-bright text-center mt-auto">
            <Link href="/dashboard/dpr" className="text-primary-container font-label-sm text-label-sm font-semibold hover:underline">View All DPRs</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
