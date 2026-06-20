'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { Plus, FileText, Calendar, Users, AlertCircle, ArrowRight } from 'lucide-react';

interface DPR {
  id: string;
  project_id: string;
  date: string;
  labor_count: number;
  work_done: string;
  issues: string;
  next_day_plan: string;
  projects?: { name: string };
}

interface Project {
  id: string;
  name: string;
}

export default function DPRPage() {
  const [dprs, setDprs] = useState<DPR[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [laborCount, setLaborCount] = useState('');
  const [workDone, setWorkDone] = useState('');
  const [issues, setIssues] = useState('');
  const [nextDayPlan, setNextDayPlan] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    const { data: dprData } = await supabase
      .from('dpr')
      .select('*, projects(name)')
      .order('date', { ascending: false });
      
    const { data: projectsData } = await supabase
      .from('projects')
      .select('id, name')
      .order('name');

    if (dprData) setDprs(dprData);
    if (projectsData) {
      setProjects(projectsData);
      if (projectsData.length > 0) {
        setProjectId(projectsData[0].id);
      }
    }
    
    setLoading(false);
  }

  async function handleAddDPR(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('dpr').insert([
      {
        project_id: projectId || null,
        date,
        labor_count: parseInt(laborCount) || 0,
        work_done: workDone,
        issues: issues,
        next_day_plan: nextDayPlan,
      }
    ]);

    if (!error) {
      setLaborCount('');
      setWorkDone('');
      setIssues('');
      setNextDayPlan('');
      setShowAddForm(false);
      fetchData();
    } else {
      alert('Error submitting DPR: ' + error.message);
    }
    setSubmitting(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>Daily Progress Reports (DPR)</h1>
          <p className="text-muted">Log site activities, labor count, and blockers daily</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          {showAddForm ? 'Cancel' : 'Submit New DPR'}
        </Button>
      </div>

      {showAddForm && (
        <Card glass style={{ padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--primary)" /> Write Today's Report
          </h2>
          <form onSubmit={handleAddDPR} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
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

            <Input 
              label="Total Labor Count (Workers on site today)" 
              type="number" 
              required 
              value={laborCount} 
              onChange={(e) => setLaborCount(e.target.value)} 
              placeholder="e.g. 15"
            />

            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Work Done Today</label>
              <textarea 
                className="input-field" 
                required 
                rows={4}
                value={workDone} 
                onChange={(e) => setWorkDone(e.target.value)} 
                placeholder="Describe what was accomplished today..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Issues / Blockers (Optional)</label>
              <textarea 
                className="input-field" 
                rows={2}
                value={issues} 
                onChange={(e) => setIssues(e.target.value)} 
                placeholder="Any material shortages, delays, or issues?"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Plan for Tomorrow (Optional)</label>
              <textarea 
                className="input-field" 
                rows={2}
                value={nextDayPlan} 
                onChange={(e) => setNextDayPlan(e.target.value)} 
                placeholder="What is the target for tomorrow?"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit DPR'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading reports...</div>
      ) : dprs.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FileText size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
          <p>No DPRs submitted yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {dprs.map(dpr => (
            <Card key={dpr.id} glass style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>
                    <Calendar size={18} />
                    {new Date(dpr.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <span style={{ backgroundColor: 'white', border: '1px solid var(--border)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {dpr.projects?.name || 'Global Site'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Users size={16} />
                  {dpr.labor_count} Laborers
                </div>
              </div>
              
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem' }}>Work Executed</h4>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{dpr.work_done}</p>
                </div>
                
                {(dpr.issues || dpr.next_day_plan) && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.5rem' }}>
                    {dpr.issues && (
                      <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--danger)' }}>
                        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--danger)', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <AlertCircle size={14} /> Issues / Blockers
                        </h4>
                        <p style={{ fontSize: '0.9rem' }}>{dpr.issues}</p>
                      </div>
                    )}
                    
                    {dpr.next_day_plan && (
                      <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--success)' }}>
                        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--success)', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ArrowRight size={14} /> Next Day Plan
                        </h4>
                        <p style={{ fontSize: '0.9rem' }}>{dpr.next_day_plan}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
