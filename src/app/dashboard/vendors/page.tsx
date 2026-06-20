'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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
    <div className="p-container-padding flex-1 overflow-x-hidden space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-1">Vendors & Sub-contractors</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage vendor directory and payouts.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-highest text-on-surface font-label-md text-label-md px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-variant transition-colors border border-outline-variant">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filter
          </button>
          <button onClick={() => setShowAddVendor(!showAddVendor)} className="bg-primary-container text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-xl shadow-primary-container/10">
            <span className="material-symbols-outlined text-[18px]">{showAddVendor ? 'close' : 'person_add'}</span>
            {showAddVendor ? 'Cancel' : 'Add Vendor'}
          </button>
        </div>
      </div>

      {/* Category Tags */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button className="whitespace-nowrap px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md border border-secondary-container">All Vendors</button>
        <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md border border-outline-variant hover:bg-surface-variant transition-colors">Painters</button>
        <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md border border-outline-variant hover:bg-surface-variant transition-colors">Plumbers</button>
        <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md border border-outline-variant hover:bg-surface-variant transition-colors">Electricians</button>
        <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md border border-outline-variant hover:bg-surface-variant transition-colors">Civil</button>
        <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md border border-outline-variant hover:bg-surface-variant transition-colors">Suppliers</button>
      </div>

      {showAddVendor && (
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person_add</span> Register Vendor
          </h2>
          <form onSubmit={handleAddVendor} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Vendor Name / Agency</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none bg-surface-container-lowest" />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none bg-white h-[42px]">
                <option>Painter</option><option>Sanitary</option><option>Electrician</option><option>Civil Contractor</option><option>Material Supplier</option><option>Other</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Contact Info</label>
              <input value={contact} onChange={(e) => setContact(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none bg-surface-container-lowest" />
            </div>
            <button type="submit" className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-label-md hover:bg-secondary/90 w-full md:w-auto h-[42px]">
              Save Vendor
            </button>
          </form>
        </div>
      )}

      {showAddPayment && (
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 mb-8 animate-in fade-in slide-in-from-top-4 border-l-4 border-l-error">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-error">payments</span> Record Payout (Expense)
          </h2>
          <form onSubmit={handleAddPayment} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Amount Paid (₹)</label>
              <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Description / Bill Info</label>
              <input required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none" />
            </div>
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Date</label>
              <input type="date" required value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 focus:border-secondary outline-none" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAddPayment(null)} className="flex-1 px-4 py-2 rounded-lg border border-outline-variant font-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors">Cancel</button>
              <button type="submit" className="flex-1 bg-error text-on-error px-4 py-2 rounded-lg font-label-md hover:bg-error/90 transition-colors">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Vendor Directory Table */}
      <div className="bg-surface-container-lowest/70 backdrop-blur-md rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          {loading ? (
             <div className="p-16 text-center text-on-surface-variant">Loading records...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Vendor Name</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Category</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Payouts</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Contact</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {vendors.map(vendor => (
                  <tr key={vendor.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface font-label-md text-label-md font-bold uppercase">
                          {vendor.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-label-md text-label-md text-on-surface">{vendor.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-surface-container text-on-surface font-label-sm text-label-sm">{vendor.category}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-label-md text-label-md text-error">₹{vendor.total_paid.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-body-md text-body-md text-on-surface-variant">{vendor.contact_info || 'N/A'}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setShowAddPayment(vendor.id)} className="bg-primary-container text-on-primary font-label-sm text-label-sm px-3 py-1.5 rounded-lg font-bold hover:opacity-90 transition-opacity">Pay Vendor</button>
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
          ) : vendors.map(vendor => (
            <div key={vendor.id} className="p-4 border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors relative overflow-hidden group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-sm uppercase text-on-surface">
                    {vendor.name.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-surface text-[16px]">{vendor.name}</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{vendor.category} • {vendor.contact_info || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end mt-4">
                <button onClick={() => setShowAddPayment(vendor.id)} className="bg-primary-container text-on-primary font-label-sm text-label-sm px-3 py-1.5 rounded-lg font-bold">Pay Vendor</button>
                <div className="text-right">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[10px] mb-1">Total Payouts</p>
                  <p className="font-headline-md text-[18px] text-error font-bold">₹{vendor.total_paid.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
