'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowRight, CheckCircle2, LogIn } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();

      if (res.ok) {
        // Automatically login the user upon registration
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (loginRes.ok) {
          router.push('/account');
        } else {
          router.push('/login');
        }
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
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-luxury-border p-8 sm:p-10 shadow-luxury text-center">
        <span className="text-xs uppercase font-semibold tracking-[0.35em] text-luxury-gold">
          BECOME A CLIENT
        </span>
        <h1 className="font-serif text-3xl font-bold text-luxury-black mt-1 mb-2">
          Create Client Profile
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-8">
          Unlock exclusive drops, express checkout, order receipts, and bespoke fit profile.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 font-semibold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1 text-luxury-black">
              Full Name <span className="text-luxury-gold">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sanjay Ram"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-luxury-border p-3.5 text-xs focus:outline-none focus:border-luxury-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1 text-luxury-black">
              Email Address <span className="text-luxury-gold">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="sanjay@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-luxury-border p-3.5 text-xs focus:outline-none focus:border-luxury-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1 text-luxury-black">
              Mobile Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 90432 86377"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-luxury-border p-3.5 text-xs focus:outline-none focus:border-luxury-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1 text-luxury-black">
              Password <span className="text-luxury-gold">*</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-luxury-border p-3.5 text-xs focus:outline-none focus:border-luxury-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1 text-luxury-black">
              Confirm Password <span className="text-luxury-gold">*</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-luxury-border p-3.5 text-xs focus:outline-none focus:border-luxury-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-luxury-black text-luxury-cream py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-black transition-all shadow-subtle flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Creating Profile...' : 'Complete Client Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Features Checklist */}
        <div className="mt-6 p-4 bg-luxury-cream border border-luxury-border text-[11px] text-gray-700 text-left space-y-1.5">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-luxury-gold" />
            <span>Complimentary Express Shipping on Orders &gt; ₹2,000</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-luxury-gold" />
            <span>Automated Email & SMS Order Receipt Dispatches</span>
          </div>
        </div>

        {/* Back to Sign In Link */}
        <div className="mt-8 pt-6 border-t border-luxury-border text-center">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-3">
            Already have a CYTRUS account?
          </p>
          <Link
            href="/login"
            className="w-full border-2 border-luxury-black text-luxury-black py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold hover:border-luxury-gold hover:text-black transition-all flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Existing Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
