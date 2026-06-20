'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('EMAIL_NOT_CONFIRMED');
      } else if (error.message.includes('Invalid login credentials')) {
        setError('INVALID_CREDENTIALS');
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    if (data?.user) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-container/20 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="bg-surface-container-lowest/70 backdrop-blur-xl border border-outline-variant/30 rounded-2xl w-full max-w-md p-8 md:p-10 shadow-2xl relative z-10">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-full flex justify-center mb-4">
            <Image 
              src="/logo.png" 
              alt="Lines & Thoughts" 
              width={240} 
              height={80} 
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant text-center mt-2 tracking-wide uppercase">
            Construction Management
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">mail</span>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="admin@example.com"
                className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all font-body-md text-on-surface"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all font-body-md text-on-surface"
              />
            </div>
          </div>

          {error === 'EMAIL_NOT_CONFIRMED' && (
            <div className="p-4 bg-error-container/20 border border-error/30 rounded-xl flex items-start gap-3">
              <span className="material-symbols-outlined text-error mt-0.5">warning</span>
              <p className="font-body-md text-[13px] text-on-surface-variant leading-relaxed">
                <strong className="text-error font-semibold">Email not confirmed!</strong><br/>
                Please check your inbox or go to Supabase → Authentication to verify your account.
              </p>
            </div>
          )}

          {error === 'INVALID_CREDENTIALS' && (
            <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl flex items-center gap-2 text-error font-label-md text-label-md">
              <span className="material-symbols-outlined text-[18px]">error</span>
              Incorrect email or password.
            </div>
          )}

          {error && error !== 'EMAIL_NOT_CONFIRMED' && error !== 'INVALID_CREDENTIALS' && (
            <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl flex items-center gap-2 text-error font-label-md text-label-md">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-primary-container text-on-primary font-label-md text-label-md rounded-xl hover:bg-primary transition-colors shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
