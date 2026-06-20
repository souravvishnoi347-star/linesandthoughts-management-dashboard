'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  project_id: string;
  projects?: { name: string };
}

interface Project {
  id: string;
  name: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Fuel / Travel');
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    const { data: expensesData } = await supabase
      .from('expenses')
      .select('*, projects(name)')
      .order('date', { ascending: false });
      
    const { data: projectsData } = await supabase
      .from('projects')
      .select('id, name')
      .order('name');

    if (expensesData) setExpenses(expensesData);
    if (projectsData) {
      setProjects(projectsData);
      if (projectsData.length > 0) {
        setProjectId(projectsData[0].id);
      }
    }
    
    setLoading(false);
  }

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('expenses').insert([
      {
        description,
        amount: parseFloat(amount),
        category,
        project_id: projectId || null,
        date,
      }
    ]);

    if (!error) {
      setDescription('');
      setAmount('');
      setShowAddForm(false);
      fetchData();
    } else {
      alert('Error adding expense: ' + error.message);
    }
    setSubmitting(false);
  }

  const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const getCategoryIcon = (cat: string) => {
    if (cat.includes('Food') || cat.includes('Meal')) return 'restaurant';
    if (cat.includes('Fuel') || cat.includes('Travel')) return 'local_gas_station';
    if (cat.includes('Tool') || cat.includes('Hardware')) return 'hardware';
    if (cat.includes('Labor')) return 'engineering';
    return 'receipt_long';
  };

  return (
    <div className="p-container-padding flex-1 overflow-x-hidden flex flex-col gap-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2 mb-2">
        <div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg font-black text-on-surface tracking-tight">Petty Cash</h2>
          <p className="text-on-surface-variant mt-1">Track day-to-day site expenses and miscellaneous costs.</p>
        </div>
      </div>

      {/* Prominent Total Display */}
      <section className="bg-surface-container-lowest/70 backdrop-blur-md border border-outline-variant/30 rounded-xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-error-container/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Total Expenses Logged</p>
            <h3 className="font-display-lg text-display-lg text-error tracking-tight">₹{totalExpense.toLocaleString('en-IN')}</h3>
          </div>
          <div className="flex gap-3">
            <div className="bg-surface-container px-4 py-2 rounded-lg border border-outline-variant/20">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Transactions</p>
              <p className="font-headline-md text-headline-md text-on-surface">{expenses.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Split Layout for Desktop, Stacked for Mobile */}
      <div className="flex flex-col md:flex-row gap-6 flex-1">
        
        {/* Left Form (or Mobile Top) */}
        <aside className="md:w-1/3 bg-surface-container-lowest md:rounded-xl border border-outline-variant/20 p-6 shadow-sm rounded-xl h-fit">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-headline-md text-headline-md text-on-surface">Log Expense</h4>
          </div>
          <form onSubmit={handleAddExpense} className="space-y-5">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-lg text-body-lg">₹</span>
                <input required type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-surface pl-8 pr-4 py-3 rounded-lg border border-outline-variant/50 focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-lg text-body-lg text-on-surface transition-colors" placeholder="0.00" />
              </div>
            </div>
            
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Description</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-surface px-4 py-3 rounded-lg border border-outline-variant/50 focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md text-on-surface transition-colors resize-none" placeholder="What was this for?" rows={2}></textarea>
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Category</label>
              <div className="relative">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-surface pl-4 pr-10 py-3 rounded-lg border border-outline-variant/50 focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md text-on-surface appearance-none transition-colors h-[50px]">
                  <option>Food & Refreshments</option>
                  <option>Fuel / Travel</option>
                  <option>Small Tools / Hardware</option>
                  <option>Daily Wage Labor</option>
                  <option>Stationery & Print</option>
                  <option>Other</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Project / Site</label>
              <div className="relative">
                <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full bg-surface pl-4 pr-10 py-3 rounded-lg border border-outline-variant/50 focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md text-on-surface appearance-none transition-colors h-[50px]">
                  {projects.length === 0 ? <option value="">No projects available (Global)</option> : <option value="" disabled>Select a project</option>}
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Date</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-surface px-4 py-3 rounded-lg border border-outline-variant/50 focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md text-on-surface transition-colors" />
            </div>

            <button type="submit" disabled={submitting} className="w-full py-3.5 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container/90 transition-colors mt-6 shadow-md">
              {submitting ? 'Saving...' : 'Save Expense'}
            </button>
          </form>
        </aside>

        {/* Right: Recent Spends List */}
        <section className="md:w-2/3 bg-surface-container-lowest/70 backdrop-blur-md rounded-xl flex flex-col h-full min-h-[500px] border border-outline-variant/30 shadow-sm">
          <div className="px-6 py-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/50 rounded-t-xl">
            <h4 className="font-headline-md text-headline-md text-on-surface">Recent Activity</h4>
            <div className="relative w-48 hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-secondary" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="p-8 text-center text-on-surface-variant">Loading expenses...</div>
            ) : expenses.length === 0 ? (
              <div className="p-16 text-center text-on-surface-variant flex flex-col items-center">
                 <span className="material-symbols-outlined text-[48px] opacity-20 mb-4">payments</span>
                 <p>No petty cash expenses logged yet.</p>
              </div>
            ) : (
              <>
                {/* Table Header (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-surface-container-low rounded-lg mb-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  <div className="col-span-2">Date</div>
                  <div className="col-span-5">Description & Site</div>
                  <div className="col-span-3">Category</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>

                {/* List Items */}
                <div className="space-y-1">
                  {expenses.map(exp => (
                    <div key={exp.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-4 md:py-3 hover:bg-surface-variant/30 rounded-lg transition-colors border-b border-outline-variant/10 md:border-none items-center relative group">
                      <div className="col-span-1 md:col-span-2 font-label-sm text-label-sm text-on-surface-variant md:text-on-surface order-2 md:order-1">
                        {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      
                      <div className="col-span-1 md:col-span-5 flex flex-col order-1 md:order-2">
                        <span className="font-body-md text-body-md text-on-surface font-medium">{exp.description}</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{exp.projects?.name || 'Central / Generic'}</span>
                      </div>
                      
                      <div className="col-span-1 md:col-span-3 order-3 mt-1 md:mt-0">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-surface-container border border-outline-variant/20 font-label-sm text-label-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-[14px] mr-1">{getCategoryIcon(exp.category)}</span> {exp.category}
                        </span>
                      </div>
                      
                      <div className="col-span-1 md:col-span-2 text-right font-label-md text-label-md text-error order-4 md:order-4 absolute md:relative right-4 md:right-0 mt-1 md:mt-0">
                        -₹{exp.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
