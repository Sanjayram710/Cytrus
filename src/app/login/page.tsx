'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';

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
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white border border-luxury-border p-8 shadow-luxury text-center">
        <span className="text-xs uppercase font-semibold tracking-[0.35em] text-luxury-gold">
          CLIENT ACCESS
        </span>
        <h1 className="font-serif text-3xl font-bold text-luxury-black mt-1 mb-2">
          Sign In to LUXEWEAR
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-8">
          Access your saved wishlist, order tracking, and bespoke fit profile.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 font-semibold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1 text-luxury-black">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-luxury-border p-3 text-xs focus:outline-none focus:border-luxury-gold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1 text-luxury-black">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-luxury-border p-3 text-xs focus:outline-none focus:border-luxury-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-luxury-black text-luxury-cream py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-black transition-all shadow-subtle"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-luxury-border text-xs uppercase tracking-wider space-y-2">
          <p className="text-gray-500">
            Don't have an account yet?{' '}
            <Link href="/register" className="text-luxury-gold font-bold hover:underline">
              Create Client Account
            </Link>
          </p>
          <div className="p-3 bg-luxury-cream border border-luxury-border text-[11px] text-gray-700 text-left font-mono">
            <p className="font-bold text-luxury-black">Demo Credentials:</p>
            <p>Admin: admin@luxewear.com / Admin@123</p>
            <p>Customer: aarya.sharma@example.com / Customer@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
