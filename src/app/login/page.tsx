'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowRight, ShieldCheck, User } from 'lucide-react';

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

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-luxury-border p-8 sm:p-10 shadow-luxury text-center">
        <span className="text-xs uppercase font-semibold tracking-[0.35em] text-luxury-gold">
          CLIENT ACCESS
        </span>
        <h1 className="font-serif text-3xl font-bold text-luxury-black mt-1 mb-2">
          Sign In to CYTRUS
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
              className="w-full border border-luxury-border p-3.5 text-xs focus:outline-none focus:border-luxury-gold transition-colors"
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
              className="w-full border border-luxury-border p-3.5 text-xs focus:outline-none focus:border-luxury-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-luxury-black text-luxury-cream py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-black transition-all shadow-subtle flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Logins */}
        <div className="mt-6 pt-6 border-t border-luxury-border">
          <p className="text-[11px] font-mono text-gray-500 uppercase tracking-wider mb-3">1-Click Quick Demo Login:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickFill('admin@cytrus.com', 'Admin@123')}
              className="bg-luxury-cream border border-luxury-border hover:border-luxury-gold p-2.5 text-left text-[11px] font-bold text-luxury-black transition-colors flex items-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-luxury-gold" />
              <span>Admin Access</span>
            </button>
            <button
              onClick={() => handleQuickFill('aarya.sharma@example.com', 'Customer@123')}
              className="bg-luxury-cream border border-luxury-border hover:border-luxury-gold p-2.5 text-left text-[11px] font-bold text-luxury-black transition-colors flex items-center space-x-2"
            >
              <User className="w-4 h-4 text-luxury-gold" />
              <span>Customer Access</span>
            </button>
          </div>
        </div>

        {/* Prominent Create Account CTA Button */}
        <div className="mt-8 pt-8 border-t border-luxury-border text-center space-y-3">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
            Don't have a CYTRUS Client Account yet?
          </p>
          <Link
            href="/register"
            className="w-full border-2 border-luxury-black text-luxury-black py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold hover:border-luxury-gold hover:text-black transition-all flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Client Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
