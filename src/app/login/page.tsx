'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import CelebriteeLogo from '@/components/CelebriteeLogo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.user?.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 bg-[#0A1128] text-white">
      <div className="bg-[#101D3F] border border-white/10 p-8 text-center rounded-2xl shadow-subtle text-white">
        <div className="mb-4 flex justify-center">
          <CelebriteeLogo variant="rectangle" size="sm" />
        </div>

        <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal-light flex items-center justify-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
          <span>VIP CLIENT ACCESS</span>
        </span>
        <h1 className="font-serif text-3xl font-normal text-white mt-1 mb-2">
          Sign In to CELEBRITEE
        </h1>
        <p className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-8">
          Access your saved drop vault, order tracking, and fit profile.
        </p>

        {error && (
          <div className="bg-rose-900/30 border border-rose-500/50 text-rose-300 font-mono text-xs p-3 font-bold mb-6 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left text-white">
          <div>
            <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. client@celebritee.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0A1128] border border-white/15 p-3 font-sans text-xs focus:outline-none focus:border-royal text-white placeholder:text-slate-500 rounded-md"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-slate-300">
              Password
            </label>
            <input
              type="password"
              required
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
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 font-mono text-xs text-slate-400">
          <p>
            Don't have a VIP client profile?{' '}
            <Link href="/register" className="text-royal-light font-bold hover:underline transition-colors">
              Create Profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
