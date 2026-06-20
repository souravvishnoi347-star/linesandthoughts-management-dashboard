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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">Active Projects</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage and monitor ongoing site operations.</p>
        </div>
        <button 
          onClick={() => setShowAddProject(!showAddProject)}
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-inverse-surface transition-colors shadow-lg shadow-primary/10 w-full sm:w-auto"
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
            <article key={project.id} className="bg-surface-container-lowest rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-outline-variant/10 flex flex-col">
              <div className="h-48 w-full relative bg-surface-container flex items-center justify-center">
                {/* Fallback pattern for images */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--outline)_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <span className="material-symbols-outlined text-[64px] text-outline-variant/50">construction</span>
                
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-sm border ${project.status === 'active' ? 'bg-secondary-container text-on-secondary-container border-secondary-container' : 'bg-surface-variant text-on-surface-variant border-outline-variant/20'}`}>
                  <span className={`w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-secondary' : 'bg-outline'}`}></span>
                  {project.status === 'active' ? 'Active Site' : 'Completed'}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline-md text-headline-md text-on-surface line-clamp-1">{project.name}</h3>
                </div>
                
                <div className="flex items-center gap-1 text-on-surface-variant font-body-md text-body-md mb-4">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  <span className="line-clamp-1">{project.location || 'Location not specified'}</span>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <div className="flex items-center justify-between text-label-sm text-on-surface-variant bg-surface-container-low p-2 rounded-lg">
                    <span>Started:</span>
                    <span className="font-bold text-on-surface">{new Date(project.created_at).toLocaleDateString('en-IN')}</span>
                  </div>

                  <select 
                    value={project.status} 
                    onChange={(e) => updateStatus(project.id, e.target.value)}
                    className="w-full bg-surface text-on-surface border border-outline-variant/30 py-2.5 rounded-lg font-label-md text-center outline-none focus:border-primary"
                  >
                    <option value="active">Mark Active</option>
                    <option value="completed">Mark Completed</option>
                  </select>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
