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
    <div className="max-w-md mx-auto px-4 py-20 bg-white text-charcoal">
      <div className="bg-white border border-border p-8 text-center rounded-2xl shadow-subtle text-charcoal">
        <div className="mb-4 flex justify-center">
          <CelebriteeLogo variant="rectangle" size="sm" />
        </div>

        <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal flex items-center justify-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
          <span>VIP CLIENT ACCESS</span>
        </span>
        <h1 className="font-serif text-3xl font-normal text-charcoal mt-1 mb-2">
          Sign In to CELEBRITEE
        </h1>
        <p className="font-mono text-xs text-muted uppercase tracking-widest mb-8">
          Access your saved drop vault, order tracking, and fit profile.
        </p>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs p-3 font-bold mb-6 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left text-charcoal">
          <div>
            <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. client@celebritee.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-tint border border-border p-3 font-sans text-xs focus:outline-none focus:border-royal text-charcoal placeholder:text-muted rounded-md"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-bold tracking-wider mb-1 text-charcoal">
              Password
            </label>
            <input
              type="password"
              required
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
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border font-mono text-xs text-muted">
          <p>
            Don't have a VIP client profile?{' '}
            <Link href="/register" className="text-royal font-bold hover:underline transition-colors">
              Create Profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
