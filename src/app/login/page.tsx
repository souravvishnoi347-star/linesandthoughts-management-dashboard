'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
      // Use hard redirect to avoid middleware cookie timing issues
      window.location.href = '/dashboard';
    }
  };

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <Card glass style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Image src="/logo.png" alt="Lines & Thoughts" width={220} height={80} style={{ objectFit: 'contain', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>Lines & Thoughts ERP</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          {error === 'EMAIL_NOT_CONFIRMED' && (
            <div style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '8px', padding: '1rem', fontSize: '0.875rem', lineHeight: 1.7 }}>
              <strong>⚠️ Email not confirmed!</strong><br />
              Go to <strong>Supabase → Authentication → Users</strong> → click on your user → click <strong>&quot;Send confirmation email&quot;</strong> or delete and recreate the user.
            </div>
          )}

          {error === 'INVALID_CREDENTIALS' && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--danger)', fontSize: '0.875rem' }}>
              ❌ Wrong email or password. Please check and try again.
            </div>
          )}

          {error && error !== 'EMAIL_NOT_CONFIRMED' && error !== 'INVALID_CREDENTIALS' && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--danger)', fontSize: '0.875rem' }}>
              ❌ {error}
            </div>
          )}

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </Button>
        </form>
      </Card>
    </main>
  );
}
