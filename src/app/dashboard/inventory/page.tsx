'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Material {
  id: string;
  item_name: string;
  quantity: number;
  unit: string;
  supplier: string;
  received_date: string;
  project_id: string;
  projects?: { name: string };
}

interface Project {
  id: string;
  name: string;
}

export default function InventoryPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [supplier, setSupplier] = useState('');
  const [projectId, setProjectId] = useState('');
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    // Fetch materials with project names
    const { data: materialsData } = await supabase
      .from('materials')
      .select('*, projects(name)')
      .order('received_date', { ascending: false });
      
    // Fetch projects for the dropdown
    const { data: projectsData } = await supabase
      .from('projects')
      .select('id, name')
      .order('name');

    if (materialsData) setMaterials(materialsData);
    if (projectsData) {
      setProjects(projectsData);
      if (projectsData.length > 0) {
        setProjectId(projectsData[0].id);
      }
    }
    
    setLoading(false);
  }

  async function handleAddMaterial(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('materials').insert([
      {
        item_name: itemName,
        quantity: parseFloat(quantity),
        unit,
        supplier,
        project_id: projectId || null,
        received_date: receivedDate,
      }
    ]);

    if (!error) {
      setItemName('');
      setQuantity('');
      setSupplier('');
      setShowAddForm(false);
      fetchData(); // Refresh list
    } else {
      alert('Error adding material: ' + error.message);
    }
    setSubmitting(false);
  }

  // Calculate some simple metrics
  const totalEntries = materials.length;
  const recentEntries = materials.filter(m => new Date(m.received_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="p-container-padding flex-1 overflow-x-hidden space-y-8 bg-surface-bright relative">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/2 h-64 bg-gradient-to-bl from-surface-container-high/50 to-transparent pointer-events-none rounded-bl-full hidden md:block"></div>
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Page Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">Material Inventory</h2>
            <p className="text-on-surface-variant mt-1">Manage and track on-site materials.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md">
              <span className="material-symbols-outlined text-[20px]">output</span>
              Issue Material
            </button>
            <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary rounded-lg hover:bg-primary transition-colors font-label-md text-label-md shadow-md">
              <span className="material-symbols-outlined text-[20px]">{showAddForm ? 'close' : 'add_circle'}</span>
              {showAddForm ? 'Cancel' : 'Add Stock'}
            </button>
          </div>
        </div>

        {/* KPI Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest/70 backdrop-blur-md border border-outline-variant/30 p-5 rounded-xl flex items-start justify-between relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-secondary-container/20 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Deliveries</p>
              <h3 className="font-display-lg text-display-lg text-on-surface">{totalEntries}</h3>
              <p className="text-sm text-secondary flex items-center mt-2 font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span> +{recentEntries} this week
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest/70 backdrop-blur-md border border-outline-variant/30 p-5 rounded-xl flex items-start justify-between relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-tertiary-fixed/20 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Active Sites</p>
              <h3 className="font-display-lg text-display-lg text-on-surface">{projects.length}</h3>
              <p className="text-sm text-secondary flex items-center mt-2 font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px] mr-1">check_circle</span> Operational
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-tertiary-container">
              <span className="material-symbols-outlined">architecture</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest/70 backdrop-blur-md border border-outline-variant/30 p-5 rounded-xl flex items-start justify-between relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-error-container/20 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Alerts</p>
              <h3 className="font-display-lg text-display-lg text-on-surface">0</h3>
              <p className="text-sm text-secondary flex items-center mt-2 font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px] mr-1">check_circle</span> All good
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-error">
              <span className="material-symbols-outlined">warning</span>
            </div>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 mb-8 animate-in fade-in slide-in-from-top-4">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">inventory_2</span> Log New Material
            </h2>
            <form onSubmit={handleAddMaterial} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Item Name (e.g. Cement, Steel)</label>
                <input required value={itemName} onChange={(e) => setItemName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none bg-surface-container-lowest" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Quantity</label>
                  <input type="number" step="0.01" required value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none bg-surface-container-lowest" />
                </div>
                <div className="w-32">
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Unit</label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none bg-white h-[42px]">
                    <option value="kg">kg</option>
                    <option value="tons">tons</option>
                    <option value="bags">bags</option>
                    <option value="liters">liters</option>
                    <option value="pieces">pieces</option>
                    <option value="boxes">boxes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Project / Site</label>
                <select value={projectId} onChange={(e) => setProjectId(e.target.value)} required={projects.length > 0} disabled={projects.length === 0} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none bg-white h-[42px]">
                  {projects.length === 0 ? <option value="">No projects available</option> : <option value="" disabled>Select a project</option>}
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Supplier / Vendor</label>
                <input value={supplier} onChange={(e) => setSupplier(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none bg-surface-container-lowest" />
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Date Received</label>
                <input type="date" required value={receivedDate} onChange={(e) => setReceivedDate(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none bg-surface-container-lowest" />
              </div>

              <div className="flex items-end justify-end mt-4 md:mt-0">
                <button type="submit" disabled={submitting} className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-label-md hover:bg-secondary/90 w-full md:w-auto h-[42px]">
                  {submitting ? 'Saving...' : 'Save Material Entry'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Inventory List (Bento-style Cards) */}
        <section className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant col-span-full">Loading inventory...</div>
          ) : materials.length === 0 ? (
            <div className="p-16 text-center text-on-surface-variant col-span-full flex flex-col items-center">
              <span className="material-symbols-outlined text-[48px] opacity-20 mb-4">inventory_2</span>
              <p>No materials logged yet.</p>
            </div>
          ) : (
            materials.map(mat => (
              <article key={mat.id} className="bg-surface-container-lowest rounded-[20px] p-6 shadow-sm border border-outline-variant/30 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[8px] bg-surface-container text-on-surface-variant font-label-sm text-label-sm mb-2">
                      <span className="material-symbols-outlined text-[16px]">hardware</span> {mat.projects?.name || 'Central'}
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface">{mat.item_name}</h2>
                  </div>
                  <button className="text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant mb-1">Received Quantity</p>
                    <div className="flex items-baseline gap-1 text-on-surface">
                      <span className="font-display text-display">{mat.quantity}</span>
                      <span className="font-body-md text-body-md font-medium text-secondary">{mat.unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-label-md text-label-md text-on-surface-variant mb-1">Date</p>
                    <p className="font-body-md text-body-md font-medium text-secondary">{new Date(mat.received_date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
