'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { Plus, Users, IndianRupee, Search, Download } from 'lucide-react';

interface Party {
  id: string;
  name: string;
  contact_info: string;
  total_received: number;
}

export default function PartiesPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals / Forms
  const [showAddParty, setShowAddParty] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState<string | null>(null);

  // Add Party Form
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  
  // Add Payment Form
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Bank Transfer');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchParties();
  }, []);

  async function fetchParties() {
    setLoading(true);
    // Fetch parties and their payments
    const { data: partiesData } = await supabase.from('parties').select('*').order('name');
    const { data: paymentsData } = await supabase.from('client_payments').select('party_id, amount');

    if (partiesData) {
      const merged = partiesData.map(party => {
        const partyPayments = (paymentsData || []).filter(p => p.party_id === party.id);
        const total = partyPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        return { ...party, total_received: total };
      });
      setParties(merged);
    }
    setLoading(false);
  }

  async function handleAddParty(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('parties').insert([{ name, contact_info: contact }]);
    if (!error) {
      setName('');
      setContact('');
      setShowAddParty(false);
      fetchParties();
    } else {
      alert(error.message);
    }
  }

  async function handleAddPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!showAddPayment) return;
    
    const { error } = await supabase.from('client_payments').insert([{
      party_id: showAddPayment,
      amount: parseFloat(amount),
      mode_of_payment: paymentMode,
      payment_date: paymentDate
    }]);

    if (!error) {
      setAmount('');
      setShowAddPayment(null);
      fetchParties();
    } else {
      alert(error.message);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>Parties / Clients</h1>
          <p className="text-muted">Manage your clients and incoming payments</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddParty(!showAddParty)}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          {showAddParty ? 'Cancel' : 'Add New Client'}
        </Button>
      </div>

      {showAddParty && (
        <Card glass style={{ padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="var(--primary)" /> Register Client
          </h2>
          <form onSubmit={handleAddParty} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}><Input label="Client / Company Name" required value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div style={{ flex: 1 }}><Input label="Contact Info (Phone / Email)" value={contact} onChange={(e) => setContact(e.target.value)} /></div>
            <Button type="submit" variant="primary" style={{ height: '42px', marginBottom: '4px' }}>Save Client</Button>
          </form>
        </Card>
      )}

      {showAddPayment && (
        <Card glass style={{ padding: '2rem', animation: 'fadeIn 0.3s ease', borderLeft: '4px solid var(--success)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IndianRupee size={20} color="var(--success)" /> Record Incoming Payment
          </h2>
          <form onSubmit={handleAddPayment} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
            <div><Input label="Amount Received (₹)" type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Mode</label>
              <select className="input-field" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} style={{ height: '42px' }}>
                <option>Bank Transfer</option><option>Cash</option><option>Cheque</option><option>UPI</option>
              </select>
            </div>
            <div><Input label="Date" type="date" required value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} /></div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '4px' }}>
              <Button type="button" onClick={() => setShowAddPayment(null)} style={{ height: '42px', backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)' }}>Cancel</Button>
              <Button type="submit" style={{ height: '42px', backgroundColor: 'var(--success)', color: 'white', border: 'none' }}>Save</Button>
            </div>
          </form>
        </Card>
      )}

      <Card glass style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Client Ledgers</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search clients..." className="input-field" style={{ paddingLeft: '2.2rem', padding: '0.5rem 0.5rem 0.5rem 2.2rem', width: '250px' }} />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>
        ) : parties.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Users size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
            <p>No clients registered yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', padding: '1.5rem' }}>
            {parties.map(party => (
              <div key={party.id} style={{ border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{party.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{party.contact_info || 'No contact provided'}</p>
                
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Received</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>₹{party.total_received.toLocaleString('en-IN')}</p>
                </div>

                <Button onClick={() => setShowAddPayment(party.id)} style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.03)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
                  + Record Payment
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
