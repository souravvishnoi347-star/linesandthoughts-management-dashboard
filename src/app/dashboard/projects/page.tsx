'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { Plus, Building2, MapPin, Search } from 'lucide-react';

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
  
  // Add Project Form
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>Projects / Sites</h1>
          <p className="text-muted">Manage your construction sites and ongoing projects</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddProject(!showAddProject)}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          {showAddProject ? 'Cancel' : 'Add New Site'}
        </Button>
      </div>

      {showAddProject && (
        <Card glass style={{ padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={20} color="var(--primary)" /> Start New Project
          </h2>
          <form onSubmit={handleAddProject} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 2 }}><Input label="Site / Project Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Haridwar Phase 1" /></div>
            <div style={{ flex: 2 }}><Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Near Main Highway" /></div>
            <Button type="submit" variant="primary" style={{ height: '42px', marginBottom: '4px' }}>Save Project</Button>
          </form>
        </Card>
      )}

      <Card glass style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Active Sites</h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search sites..." className="input-field" style={{ paddingLeft: '2.2rem', padding: '0.5rem 0.5rem 0.5rem 2.2rem', width: '250px' }} />
          </div>
        </div>
        
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading projects...</div>
        ) : projects.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Building2 size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
            <p>No projects created yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem', padding: '1.5rem' }}>
            {projects.map(project => (
              <div key={project.id} style={{ border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: project.status === 'active' ? 'var(--primary)' : 'var(--success)' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{project.name}</h3>
                  <select 
                    value={project.status} 
                    onChange={(e) => updateStatus(project.id, e.target.value)}
                    style={{ 
                      fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', 
                      backgroundColor: project.status === 'active' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                      color: project.status === 'active' ? 'var(--primary)' : 'var(--success)',
                      border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', outline: 'none'
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <MapPin size={16} />
                  <span>{project.location || 'Location not specified'}</span>
                </div>
                
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, backgroundColor: 'var(--background)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Started</p>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{new Date(project.created_at).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
