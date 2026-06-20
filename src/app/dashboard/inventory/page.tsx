'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { Plus, Package, Calendar, Search } from 'lucide-react';

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>Material Inventory</h1>
          <p className="text-muted">Track all site materials and shipments</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          {showAddForm ? 'Cancel' : 'Add Material'}
        </Button>
      </div>

      {showAddForm && (
        <Card glass style={{ padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={20} color="var(--primary)" /> Log New Material
          </h2>
          <form onSubmit={handleAddMaterial} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <Input 
              label="Item Name (e.g. Cement, Steel)" 
              required 
              value={itemName} 
              onChange={(e) => setItemName(e.target.value)} 
            />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 2 }}>
                <Input 
                  label="Quantity" 
                  type="number" 
                  step="0.01" 
                  required 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Unit</label>
                <select 
                  className="input-field" 
                  value={unit} 
                  onChange={(e) => setUnit(e.target.value)}
                  style={{ height: '42px' }}
                >
                  <option value="kg">kg</option>
                  <option value="tons">tons</option>
                  <option value="bags">bags</option>
                  <option value="liters">liters</option>
                  <option value="pieces">pieces</option>
                  <option value="boxes">boxes</option>
                </select>
              </div>
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
              label="Supplier / Vendor" 
              value={supplier} 
              onChange={(e) => setSupplier(e.target.value)} 
            />

            <Input 
              label="Date Received" 
              type="date" 
              required 
              value={receivedDate} 
              onChange={(e) => setReceivedDate(e.target.value)} 
            />

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Material Entry'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card glass style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Inventory Log</h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search materials..." 
              className="input-field"
              style={{ paddingLeft: '2.2rem', padding: '0.5rem 0.5rem 0.5rem 2.2rem', width: '250px' }}
            />
          </div>
        </div>
        
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading inventory...</div>
        ) : materials.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Package size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
            <p>No materials logged yet.</p>
            <Button variant="secondary" onClick={() => setShowAddForm(true)} style={{ marginTop: '1rem' }}>
              Add Your First Material
            </Button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Item</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Project</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quantity</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((mat) => (
                  <tr key={mat.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        {new Date(mat.received_date).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {mat.item_name}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem' }}>
                      <span style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {mat.projects?.name || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>
                      {mat.quantity} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem' }}>{mat.unit}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                      {mat.supplier || '-'}
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
