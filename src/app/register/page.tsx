'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-luxury-border p-8 shadow-luxury text-center">
        <span className="text-xs uppercase font-semibold tracking-[0.35em] text-luxury-gold">
          CREATE ACCOUNT
        </span>
        <h1 className="font-serif text-3xl font-bold text-luxury-black mt-1 mb-2">
          Register Client Profile
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 font-semibold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1 text-luxury-black">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Roy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-luxury-border p-3 text-xs focus:outline-none focus:border-luxury-gold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1 text-luxury-black">Email Address</label>
            <input
              type="email"
              required
              placeholder="ananya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-luxury-border p-3 text-xs focus:outline-none focus:border-luxury-gold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1 text-luxury-black">Phone Number</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-luxury-border p-3 text-xs focus:outline-none focus:border-luxury-gold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1 text-luxury-black">Password</label>
            <input
              type="password"
              required
              minLength={6}
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
            {loading ? 'Creating Profile...' : 'Register Account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-luxury-border text-xs uppercase tracking-wider">
          <p className="text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-luxury-gold font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
