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
    <div className="max-w-md mx-auto px-4 py-20 bg-canvas">
      <div className="bg-surface border border-border p-8 text-center">
        <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
          CLIENT ACCESS
        </span>
        <h1 className="font-serif text-3xl font-normal text-ink mt-1 mb-2">
          Sign In to CYTRUS
        </h1>
        <p className="font-mono text-xs text-muted uppercase tracking-widest mb-8">
          Access your saved drop vault, order tracking, and fit profile.
        </p>

        {error && (
          <div className="bg-surface border border-border text-accent font-mono text-xs p-3 font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase font-medium tracking-wider mb-1 text-ink">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-canvas border border-border p-3 font-sans text-xs focus:outline-none focus:border-accent text-ink"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-canvas py-4 font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:bg-ink transition-all border border-accent flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Create Account Link / Button */}
        <div className="mt-8 pt-6 border-t border-border font-mono text-xs uppercase tracking-wider text-center space-y-3">
          <p className="text-muted">
            Don&apos;t have a CYTRUS account yet?
          </p>
          <Link
            href="/register"
            className="w-full border border-border bg-canvas text-ink py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.15em] hover:border-accent hover:text-accent transition-all flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New Client Account</span>
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
