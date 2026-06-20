'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

  const grandTotal = parties.reduce((sum, p) => sum + p.total_received, 0);

  return (
    <div className="p-container-padding flex-1 overflow-x-hidden bg-background h-full">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-1">Parties & Clients</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage client profiles, project links, and financial receipts.</p>
        </div>

        {/* Metrics Snippet (Glassmorphic) */}
        <div className="flex gap-4">
          <div className="bg-surface-container-low/80 backdrop-blur-md rounded-xl p-4 border border-outline-variant/20 shadow-sm flex items-center gap-4 min-w-[160px]">
            <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Received</p>
              <p className="font-headline-md text-headline-md text-on-surface">₹{(grandTotal / 100000).toFixed(2)}L</p>
            </div>
          </div>
        </div>
      </div>

      {showAddParty && (
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person_add</span> Register Client
          </h2>
          <form onSubmit={handleAddParty} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Client / Company Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none bg-surface-container-lowest" />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Contact Info</label>
              <input value={contact} onChange={(e) => setContact(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none bg-surface-container-lowest" />
            </div>
            <button type="submit" className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-label-md hover:bg-secondary/90 w-full md:w-auto h-[42px]">
              Save Client
            </button>
          </form>
        </div>
      )}

      {showAddPayment && (
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 mb-8 animate-in fade-in slide-in-from-top-4 border-l-4 border-l-secondary">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">payments</span> Record Incoming Payment
          </h2>
          <form onSubmit={handleAddPayment} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Amount (₹)</label>
              <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none" />
            </div>
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Mode</label>
              <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none bg-white">
                <option>Bank Transfer</option><option>Cash</option><option>Cheque</option><option>UPI</option>
              </select>
            </div>
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Date</label>
              <input type="date" required value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAddPayment(null)} className="flex-1 px-4 py-2 rounded-lg border border-outline-variant font-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors">Cancel</button>
              <button type="submit" className="flex-1 bg-secondary text-on-secondary px-4 py-2 rounded-lg font-label-md hover:bg-secondary/90 transition-colors">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Data Table Section */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="bg-surface-container-low/50 backdrop-blur-md p-4 border-b border-outline-variant/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input className="w-full bg-surface border-2 border-transparent focus:border-secondary rounded-lg py-2 pl-10 pr-4 text-sm outline-none transition-colors" placeholder="Filter clients..." type="text"/>
          </div>
          <button onClick={() => setShowAddParty(!showAddParty)} className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary-container text-on-primary rounded-lg font-label-sm hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[18px]">add</span> Register Client
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          {loading ? (
             <div className="p-16 text-center text-on-surface-variant">Loading records...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/40">
                  <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide font-semibold">Client Name</th>
                  <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide font-semibold">Contact Info</th>
                  <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide font-semibold text-right">Total Money Received</th>
                  <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md">
                {parties.map(party => (
                  <tr key={party.id} className="border-b border-outline-variant/20 hover:bg-surface-container-highest/20 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs uppercase">
                            {party.name.substring(0, 2)}
                        </div>
                        <span className="font-semibold text-on-surface">{party.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">{party.contact_info || 'N/A'}</td>
                    <td className="py-4 px-6 text-right font-headline-md text-[16px] text-secondary">₹{party.total_received.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => setShowAddPayment(party.id)} className="bg-secondary-container/50 text-on-secondary-container px-3 py-1 rounded-md text-sm font-semibold hover:bg-secondary-container transition-colors">
                        + Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile List View */}
        <div className="md:hidden flex flex-col">
          {loading ? (
             <div className="p-8 text-center text-on-surface-variant">Loading records...</div>
          ) : parties.map(party => (
            <div key={party.id} className="p-4 border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors relative overflow-hidden group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm uppercase">
                    {party.name.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-surface text-[16px]">{party.name}</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{party.contact_info || 'N/A'}</p>
                  </div>
                </div>
                <button onClick={() => setShowAddPayment(party.id)} className="text-secondary p-1">
                  <span className="material-symbols-outlined">add_card</span>
                </button>
              </div>
              <div className="flex justify-between items-end mt-4">
                <div></div>
                <div className="text-right">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[10px] mb-1">Total Received</p>
                  <p className="font-headline-md text-[18px] text-secondary font-bold">₹{party.total_received.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
