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
    <div className="max-w-md mx-auto px-4 py-16 bg-canvas">
      <div className="bg-surface border border-border p-8 sm:p-10 text-center">
        <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
          BECOME A CLIENT
        </span>
        <h1 className="font-serif text-3xl font-normal text-ink mt-1 mb-2">
          Create Client Profile
        </h1>
        <p className="font-mono text-xs text-muted uppercase tracking-widest mb-8">
          Unlock exclusive drops, express checkout, order receipts, and fit profile.
        </p>

        {error && (
          <div className="bg-surface border border-border text-accent font-mono text-xs p-3 font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <div>
            <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">
              Full Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sanjay Ram"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">
              Email Address <span className="text-accent">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="sanjay@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">
              Mobile Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 90432 86377"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">
              Password <span className="text-accent">*</span>
            </label>
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

          <div>
            <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">
              Confirm Password <span className="text-accent">*</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-canvas py-4 font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:bg-ink transition-all border border-accent flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Creating Profile...' : 'Complete Client Registration'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Features Checklist */}
        <div className="mt-6 p-4 bg-canvas border border-border text-[11px] text-muted text-left space-y-1.5 font-mono">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
            <span>Complimentary Express Shipping on Orders &gt; ₹2,000</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
            <span>Automated Email & SMS Order Receipt Dispatches</span>
          </div>
        </div>

        {/* Back to Sign In Link */}
        <div className="mt-8 pt-6 border-t border-border text-center space-y-3 font-mono text-xs uppercase tracking-wider">
          <p className="text-muted">
            Already have a CYTRUS account?
          </p>
          <Link
            href="/login"
            className="w-full border border-border bg-canvas text-ink py-3 text-xs font-semibold uppercase tracking-[0.15em] hover:border-accent hover:text-accent transition-all flex items-center justify-center space-x-2"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Existing Account</span>
          </Link>

          {/* Skip for now option */}
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-[11px] text-muted hover:text-ink transition-colors underline underline-offset-4 tracking-widest font-mono"
            >
              <span>Skip for now &amp; explore website</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
