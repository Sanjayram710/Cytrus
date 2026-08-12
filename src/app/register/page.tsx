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
    <div className="max-w-md mx-auto px-4 py-16 bg-[#0A1128] text-white">
      <div className="bg-[#101D3F] border border-white/10 p-8 text-center rounded-2xl shadow-subtle text-white">
        <div className="mb-4 flex justify-center">
          <CelebriteeLogo variant="rectangle" size="sm" />
        </div>

        <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal-light flex items-center justify-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
          <span>JOIN THE ATELIER</span>
        </span>
        <h1 className="font-serif text-3xl font-normal text-white mt-1 mb-2">
          Register VIP Profile
        </h1>
        <p className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-6">
          Exclusive invitations to celebrity drops & priority access.
        </p>

        {error && (
          <div className="bg-rose-900/30 border border-rose-500/50 text-rose-300 font-mono text-xs p-3 font-bold mb-6 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left text-white">
          <div>
            <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-slate-300">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Roy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0A1128] border border-white/15 p-3 font-sans text-xs focus:outline-none focus:border-royal text-white placeholder:text-slate-500 rounded-md"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-slate-300">Email Address</label>
            <input
              type="email"
              required
              placeholder="ananya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0A1128] border border-white/15 p-3 font-sans text-xs focus:outline-none focus:border-royal text-white placeholder:text-slate-500 rounded-md"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-slate-300">Phone Number</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#0A1128] border border-white/15 p-3 font-sans text-xs focus:outline-none focus:border-royal text-white placeholder:text-slate-500 rounded-md"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-slate-300">Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0A1128] border border-white/15 p-3 font-sans text-xs focus:outline-none focus:border-royal text-white placeholder:text-slate-500 rounded-md"
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

        <div className="mt-8 pt-6 border-t border-white/10 font-mono text-xs text-slate-400">
          <p>
            Already have a profile?{' '}
            <Link href="/login" className="text-royal-light font-bold hover:underline transition-colors">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
