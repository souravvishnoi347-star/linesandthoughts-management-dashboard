'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

  // Filter state
  const [activeSiteFilter, setActiveSiteFilter] = useState<string>('All Sites');

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

  const filteredDprs = activeSiteFilter === 'All Sites' 
    ? dprs 
    : dprs.filter(d => (d.projects?.name || 'Global Site') === activeSiteFilter);

  // Extract unique site names for the filter
  const siteNames = Array.from(new Set(dprs.map(d => d.projects?.name || 'Global Site')));

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-background">
      {/* Header & Controls */}
      <div className="p-container-padding pb-0 sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-1">Daily Progress Report</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Track daily site activities and blockers.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary rounded-lg hover:bg-primary transition-colors font-label-md text-label-md shadow-md">
              <span className="material-symbols-outlined text-[20px]">{showAddForm ? 'close' : 'add'}</span>
              {showAddForm ? 'Cancel' : 'Submit DPR'}
            </button>
          </div>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          <button 
            onClick={() => setActiveSiteFilter('All Sites')}
            className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${activeSiteFilter === 'All Sites' ? 'bg-primary-container text-on-primary' : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            All Sites
          </button>
          {siteNames.map(site => (
             <button 
               key={site}
               onClick={() => setActiveSiteFilter(site)}
               className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${activeSiteFilter === site ? 'bg-primary-container text-on-primary' : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'}`}
             >
               {site}
             </button>
          ))}
        </div>
      </div>

      <div className="px-container-padding py-6 flex-grow overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6 relative">
          
          {showAddForm && (
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 mb-8 shadow-md animate-in fade-in slide-in-from-top-4 relative z-20">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_document</span> Write Today's Report
              </h2>
              <form onSubmit={handleAddDPR} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Project / Site</label>
                  <div className="relative">
                    <select required={projects.length > 0} disabled={projects.length === 0} value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full bg-surface pl-4 pr-10 py-3 rounded-lg border border-outline-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary font-body-md text-body-md text-on-surface appearance-none transition-colors h-[48px]">
                      {projects.length === 0 ? <option value="">No projects available</option> : <option value="" disabled>Select a project</option>}
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-surface px-4 py-3 rounded-lg border border-outline-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary font-body-md text-body-md text-on-surface transition-colors h-[48px]" />
                </div>

                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Total Labor Count</label>
                  <input type="number" required value={laborCount} onChange={(e) => setLaborCount(e.target.value)} placeholder="e.g. 15" className="w-full bg-surface px-4 py-3 rounded-lg border border-outline-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary font-body-md text-body-md text-on-surface transition-colors h-[48px]" />
                </div>

                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Work Done Today</label>
                  <textarea required rows={3} value={workDone} onChange={(e) => setWorkDone(e.target.value)} placeholder="Describe what was accomplished today..." className="w-full bg-surface px-4 py-3 rounded-lg border border-outline-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary font-body-md text-body-md text-on-surface transition-colors resize-y" />
                </div>

                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Issues / Blockers (Optional)</label>
                  <textarea rows={2} value={issues} onChange={(e) => setIssues(e.target.value)} placeholder="Any material shortages, delays, or issues?" className="w-full bg-surface px-4 py-3 rounded-lg border border-outline-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary font-body-md text-body-md text-on-surface transition-colors resize-y" />
                </div>

                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Plan for Tomorrow (Optional)</label>
                  <textarea rows={2} value={nextDayPlan} onChange={(e) => setNextDayPlan(e.target.value)} placeholder="What is the target for tomorrow?" className="w-full bg-surface px-4 py-3 rounded-lg border border-outline-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary font-body-md text-body-md text-on-surface transition-colors resize-y" />
                </div>

                <div className="md:col-span-2 flex justify-end mt-2">
                  <button type="submit" disabled={submitting} className="w-full md:w-auto px-8 py-3 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md hover:bg-secondary/90 transition-colors shadow-md">
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Timeline Line */}
          {filteredDprs.length > 0 && (
             <div className="absolute top-0 bottom-0 left-5 md:left-1/2 w-0.5 bg-gradient-to-b from-outline-variant/50 via-outline-variant/20 to-transparent -translate-x-px md:-translate-x-0 z-0"></div>
          )}

          {loading ? (
             <div className="p-16 text-center text-on-surface-variant">Loading reports...</div>
          ) : filteredDprs.length === 0 ? (
             <div className="p-16 text-center text-on-surface-variant flex flex-col items-center">
                 <span className="material-symbols-outlined text-[48px] opacity-20 mb-4">description</span>
                 <p>No reports found.</p>
             </div>
          ) : (
            filteredDprs.map((dpr, idx) => {
              const isEven = idx % 2 === 0;
              const hasIssues = dpr.issues && dpr.issues.trim().length > 0;
              
              return (
                <div key={dpr.id} className={`relative flex items-start justify-between md:justify-normal group z-10 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shadow-sm absolute left-0 md:left-1/2 md:-translate-x-1/2 shrink-0 z-10 ${hasIssues ? 'bg-error-container text-error' : 'bg-secondary-container text-on-secondary-container'}`}>
                    <span className="material-symbols-outlined text-[20px] font-bold">
                      {hasIssues ? 'warning' : 'check_circle'}
                    </span>
                  </div>

                  {/* Card */}
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-auto md:ml-0 p-5 rounded-xl bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/30 shadow-sm hover:shadow-md transition-all duration-300`}>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm uppercase">
                          {dpr.projects?.name?.substring(0, 2) || 'GL'}
                        </div>
                        <div>
                          <h3 className="font-label-md text-label-md text-on-surface">{dpr.projects?.name || 'Global Site'}</h3>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">{new Date(dpr.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 flex flex-col justify-center">
                        <span className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Labor Count</span>
                        <div className="flex items-end gap-1">
                          <span className="font-headline-md text-headline-md text-on-surface">{dpr.labor_count}</span>
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant mb-1">group</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 font-body-md text-[14px]">
                      <div>
                        <span className="font-label-md text-label-md text-on-surface block mb-1">Work Executed</span>
                        <p className="text-on-surface-variant whitespace-pre-wrap">{dpr.work_done}</p>
                      </div>

                      {hasIssues && (
                        <div className="p-3 bg-error-container/20 border border-error/20 rounded-lg">
                          <span className="font-label-md text-label-md text-error flex items-center gap-1 mb-1">
                            <span className="material-symbols-outlined text-[16px]">warning</span> Blockers / Issues
                          </span>
                          <p className="text-on-surface-variant whitespace-pre-wrap">{dpr.issues}</p>
                        </div>
                      )}

                      {dpr.next_day_plan && (
                        <div className="p-3 bg-secondary-container/20 border border-secondary/20 rounded-lg">
                          <span className="font-label-md text-label-md text-secondary flex items-center gap-1 mb-1">
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span> Plan for Tomorrow
                          </span>
                          <p className="text-on-surface-variant whitespace-pre-wrap">{dpr.next_day_plan}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
