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
    <div className="max-w-md mx-auto px-4 py-16 bg-canvas">
      <div className="bg-surface border border-border p-8 text-center">
        <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
          CREATE ACCOUNT
        </span>
        <h1 className="font-serif text-3xl font-normal text-ink mt-1 mb-2">
          Register Client Profile
        </h1>

        {error && (
          <div className="bg-surface border border-border text-accent font-mono text-xs p-3 font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <div>
            <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Roy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">Email Address</label>
            <input
              type="email"
              required
              placeholder="ananya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">Phone Number</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-canvas py-4 font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:bg-ink transition-all border border-accent"
          >
            {loading ? 'Creating Profile...' : 'Register Account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border font-mono text-xs uppercase tracking-wider text-center">
          <p className="text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-accent font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
