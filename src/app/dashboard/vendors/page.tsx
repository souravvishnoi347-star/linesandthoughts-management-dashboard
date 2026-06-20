'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { Plus, Briefcase, IndianRupee, Search } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  category: string;
  contact_info: string;
  total_paid: number;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals / Forms
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState<string | null>(null);

  // Add Vendor Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Painter');
  const [contact, setContact] = useState('');
  
  // Add Payment Form
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  async function fetchVendors() {
    setLoading(true);
    // Fetch vendors and their payouts
    const { data: vendorsData } = await supabase.from('vendors').select('*').order('name');
    const { data: paymentsData } = await supabase.from('vendor_payments').select('vendor_id, amount');

    if (vendorsData) {
      const merged = vendorsData.map(vendor => {
        const vendorPayments = (paymentsData || []).filter(p => p.vendor_id === vendor.id);
        const total = vendorPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        return { ...vendor, total_paid: total };
      });
      setVendors(merged);
    }
    setLoading(false);
  }

  async function handleAddVendor(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('vendors').insert([{ name, category, contact_info: contact }]);
    if (!error) {
      setName('');
      setContact('');
      setShowAddVendor(false);
      fetchVendors();
    } else {
      alert(error.message);
    }
  }

  async function handleAddPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!showAddPayment) return;
    
    const { error } = await supabase.from('vendor_payments').insert([{
      vendor_id: showAddPayment,
      amount: parseFloat(amount),
      description: description,
      payment_date: paymentDate
    }]);

    if (!error) {
      setAmount('');
      setDescription('');
      setShowAddPayment(null);
      fetchVendors();
    } else {
      alert(error.message);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>Vendors / Contractors</h1>
          <p className="text-muted">Manage sub-contractors and track business payouts</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddVendor(!showAddVendor)}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          {showAddVendor ? 'Cancel' : 'Add New Vendor'}
        </Button>
      </div>

      {showAddVendor && (
        <Card glass style={{ padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={20} color="var(--primary)" /> Register Vendor
          </h2>
          <form onSubmit={handleAddVendor} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
            <div><Input label="Vendor Name / Agency" required value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category</label>
              <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} style={{ height: '42px' }}>
                <option>Painter</option><option>Sanitary</option><option>Electrician</option><option>Civil Contractor</option><option>Material Supplier</option><option>Other</option>
              </select>
            </div>
            <div><Input label="Contact / Phone" value={contact} onChange={(e) => setContact(e.target.value)} /></div>
            <Button type="submit" variant="primary" style={{ height: '42px', marginBottom: '4px' }}>Save Vendor</Button>
          </form>
        </Card>
      )}

      {showAddPayment && (
        <Card glass style={{ padding: '2rem', animation: 'fadeIn 0.3s ease', borderLeft: '4px solid var(--danger)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IndianRupee size={20} color="var(--danger)" /> Record Payout (Expense)
          </h2>
          <form onSubmit={handleAddPayment} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
            <div><Input label="Amount Paid (₹)" type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <div><Input label="Description / Against Bill" required value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div><Input label="Date" type="date" required value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} /></div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '4px' }}>
              <Button type="button" onClick={() => setShowAddPayment(null)} style={{ height: '42px', backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)' }}>Cancel</Button>
              <Button type="submit" style={{ height: '42px', backgroundColor: 'var(--danger)', color: 'white', border: 'none' }}>Save</Button>
            </div>
          </form>
        </Card>
      )}

      <Card glass style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Vendor Directory & Payouts</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search vendors..." className="input-field" style={{ paddingLeft: '2.2rem', padding: '0.5rem 0.5rem 0.5rem 2.2rem', width: '250px' }} />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>
        ) : vendors.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Briefcase size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
            <p>No vendors registered yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', padding: '1.5rem' }}>
            {vendors.map(vendor => (
              <div key={vendor.id} style={{ border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: 'var(--danger)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{vendor.name}</h3>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: 'var(--background)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {vendor.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', marginTop: '0.25rem' }}>{vendor.contact_info || 'No contact provided'}</p>
                
                <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.05)', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Business / Payouts</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)' }}>₹{vendor.total_paid.toLocaleString('en-IN')}</p>
                </div>

                <Button onClick={() => setShowAddPayment(vendor.id)} style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.03)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
                  + Pay Vendor
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
