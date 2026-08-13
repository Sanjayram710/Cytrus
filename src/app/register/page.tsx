'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CelebriteeLogo from '@/components/CelebriteeLogo';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push('/account');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 bg-white text-charcoal">
      <div className="bg-white border border-border p-8 text-center rounded-2xl shadow-subtle text-charcoal">
        <div className="mb-4 flex justify-center">
          <CelebriteeLogo variant="rectangle" size="sm" />
        </div>

        <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal flex items-center justify-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
          <span>JOIN THE ATELIER</span>
        </span>
        <h1 className="font-serif text-3xl font-normal text-charcoal mt-1 mb-2">
          Register VIP Profile
        </h1>
        <p className="font-mono text-xs text-muted uppercase tracking-widest mb-6">
          Exclusive invitations to celebrity drops & priority access.
        </p>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs p-3 font-bold mb-6 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left text-charcoal">
          <div>
            <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Roy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-tint border border-border p-3 font-sans text-xs focus:outline-none focus:border-royal text-charcoal placeholder:text-muted rounded-md"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">Email Address</label>
            <input
              type="email"
              required
              placeholder="ananya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-tint border border-border p-3 font-sans text-xs focus:outline-none focus:border-royal text-charcoal placeholder:text-muted rounded-md"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">Phone Number</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-surface-tint border border-border p-3 font-sans text-xs focus:outline-none focus:border-royal text-charcoal placeholder:text-muted rounded-md"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-tint border border-border p-3 font-sans text-xs focus:outline-none focus:border-royal text-charcoal placeholder:text-muted rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-royal hover:bg-royal-dark text-white py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all rounded-md shadow-luxury"
          >
            {loading ? 'Creating Profile...' : 'Complete VIP Registration'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border font-mono text-xs text-muted">
          <p>
            Already have a profile?{' '}
            <Link href="/login" className="text-royal font-bold hover:underline transition-colors">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
