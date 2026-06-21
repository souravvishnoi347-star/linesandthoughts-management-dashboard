'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  name: string;
  location: string;
  status: string;
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddProject, setShowAddProject] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  }

  async function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('projects').insert([{ name, location }]);
    if (!error) {
      setName('');
      setLocation('');
      setShowAddProject(false);
      fetchProjects();
    } else {
      alert(error.message);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    await supabase.from('projects').update({ status: newStatus }).eq('id', id);
    fetchProjects();
  }

  return (
    <div className="p-container-padding flex-1 overflow-x-hidden space-y-6">
      {/* Page Header (Mobile search added) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="hidden md:block">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">Projects / Sites</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage and monitor ongoing site operations.</p>
        </div>
        <div className="md:hidden flex items-center bg-surface-container-lowest border border-outline-variant/30 rounded-full px-4 py-3 shadow-sm">
          <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
          <input className="w-full bg-transparent outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant border-none focus:ring-0 p-0" placeholder="Search sites..." type="text" />
          <span className="material-symbols-outlined text-on-surface-variant ml-2">tune</span>
        </div>
        <button 
          onClick={() => setShowAddProject(!showAddProject)}
          className="bg-primary text-on-primary px-6 py-3 rounded-full md:rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/10 w-full sm:w-auto mt-2 md:mt-0"
        >
          <span className="material-symbols-outlined text-[20px]">{showAddProject ? 'close' : 'add'}</span>
          {showAddProject ? 'Cancel' : 'New Site'}
        </button>
      </div>

      {showAddProject && (
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">architecture</span> Start New Project
          </h2>
          <form onSubmit={handleAddProject} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Site / Project Name</label>
              <input 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Haridwar Phase 1" 
                className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none bg-surface-container-lowest"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Location</label>
              <input 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="e.g. Near Main Highway" 
                className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none bg-surface-container-lowest"
              />
            </div>
            <button type="submit" className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-label-md hover:bg-secondary/90 w-full md:w-auto h-[42px]">
              Save Project
            </button>
          </form>
        </div>
      )}

      {/* Sites Grid */}
      {loading ? (
        <div className="flex justify-center p-16">
          <div className="w-8 h-8 border-4 border-surface-container border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center p-16 border border-dashed border-outline-variant rounded-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] opacity-20 mb-4">architecture</span>
          <p>No projects created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map(project => (
            <article key={project.id} className={`bg-surface-container-lowest rounded-[20px] p-5 shadow-sm border border-outline-variant/30 transition-transform ${project.status !== 'active' ? 'opacity-75' : 'hover:scale-[1.01]'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-1 line-clamp-1">{project.name}</h2>
                  <p className="font-body-md text-body-md text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span> <span className="line-clamp-1">{project.location || 'Location not specified'}</span>
                  </p>
                </div>
                {/* Status Badge */}
                <span className={`${project.status === 'active' ? 'bg-primary-container/20 text-primary-container border-primary-container/30' : 'bg-surface-variant text-on-surface-variant border-outline-variant/30'} font-label-md text-label-md font-bold px-3 py-1 rounded-[8px] border whitespace-nowrap`}>
                  {project.status === 'active' ? 'Active' : 'Completed'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 border-t border-outline-variant/30 pt-4">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Status Action</p>
                  <select 
                    value={project.status} 
                    onChange={(e) => updateStatus(project.id, e.target.value)}
                    className="w-full bg-transparent text-on-surface font-body-md font-medium outline-none p-0 border-none cursor-pointer focus:ring-0"
                  >
                    <option value="active">Active Site</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Start Date</p>
                  <p className="font-body-md text-body-md text-on-surface font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">calendar_today</span> {new Date(project.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
