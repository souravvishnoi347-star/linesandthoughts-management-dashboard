'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { Plus, IndianRupee, Search, Calendar } from 'lucide-react';

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>Petty Cash / Expenses</h1>
          <p className="text-muted">Track day-to-day site expenses and miscellaneous costs</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          {showAddForm ? 'Cancel' : 'Log Expense'}
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="metric-card bg-gradient-3">
          <p style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 500, marginBottom: '0.25rem' }}>Total Petty Cash Spent</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>₹{totalExpense.toLocaleString('en-IN')}</p>
        </div>
        <div className="metric-card bg-gradient-1">
          <p style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 500, marginBottom: '0.25rem' }}>Transactions Logged</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>{expenses.length}</p>
        </div>
      </div>

      {showAddForm && (
        <Card glass style={{ padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IndianRupee size={20} color="var(--primary)" /> Log Daily Expense
          </h2>
          <form onSubmit={handleAddExpense} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Input 
                label="Expense Description (What was it for?)" 
                required 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="e.g. Tea/Snacks for labor, Site travel auto fare"
              />
            </div>
            
            <Input 
              label="Amount (₹)" 
              type="number" 
              required 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category</label>
              <select 
                className="input-field" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                style={{ height: '42px' }}
              >
                <option>Food & Refreshments</option>
                <option>Fuel / Travel</option>
                <option>Small Tools / Hardware</option>
                <option>Daily Wage Labor</option>
                <option>Stationery & Print</option>
                <option>Other</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Project / Site</label>
              <select 
                className="input-field" 
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)}
                style={{ height: '42px' }}
                required={projects.length > 0}
                disabled={projects.length === 0}
              >
                {projects.length === 0 ? (
                  <option value="">No projects available (Global)</option>
                ) : (
                  <option value="" disabled>Select a project</option>
                )}
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <Input 
              label="Date" 
              type="date" 
              required 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Expense'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card glass style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Expenses</h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search expenses..." 
              className="input-field"
              style={{ paddingLeft: '2.2rem', padding: '0.5rem 0.5rem 0.5rem 2.2rem', width: '250px' }}
            />
          </div>
        </div>
        
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <IndianRupee size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
            <p>No petty cash expenses logged yet.</p>
            <Button variant="secondary" onClick={() => setShowAddForm(true)} style={{ marginTop: '1rem' }}>
              Log First Expense
            </Button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', text: 'uppercase' }}>Site</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        {new Date(exp.date).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {exp.description}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                      {exp.category}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem' }}>
                      <span style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {exp.projects?.name || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--danger)', textAlign: 'right' }}>
                      - ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
