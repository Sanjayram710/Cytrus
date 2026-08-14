'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Package, Heart, MapPin, LogOut, ShieldCheck } from 'lucide-react';

export default function AccountDashboardPage() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  if (loading) {
    return <div className="p-20 text-center font-mono uppercase tracking-widest text-muted text-xs">Loading Account Profile...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-surface border border-border">
        <h2 className="font-serif text-2xl font-normal text-ink mb-2">Access Restricted</h2>
        <p className="font-mono text-xs text-muted mb-6 uppercase tracking-wider">Please sign in to view your client profile.</p>
        <Link href="/login" className="bg-accent text-canvas px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest hover:bg-ink transition-colors border border-accent">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-canvas">
      <div className="border-b border-border pb-6 mb-10 flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <span className="font-mono text-xs uppercase font-medium tracking-[0.25em] text-muted">
            CLIENT PORTAL
          </span>
          <h1 className="font-serif text-3xl font-normal text-ink mt-1">
            Welcome, {user.name}
          </h1>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-3">
          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="bg-accent text-canvas px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider flex items-center border border-accent hover:bg-ink"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" /> Admin Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="border border-border font-mono text-muted hover:text-ink px-4 py-2 text-xs uppercase tracking-wider bg-surface transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/orders"
          className="bg-surface border border-border p-6 hover:border-accent transition-all flex items-center space-x-4"
        >
          <Package className="w-7 h-7 text-accent" />
          <div>
            <h3 className="font-serif font-normal text-ink text-sm uppercase tracking-wider">My Orders & Tracking</h3>
            <p className="font-mono text-xs text-muted">Track drop shipments & view receipts</p>
          </div>
        </Link>

        <Link
          href="/wishlist"
          className="bg-surface border border-border p-6 hover:border-accent transition-all flex items-center space-x-4"
        >
          <Heart className="w-7 h-7 text-accent" />
          <div>
            <h3 className="font-serif font-normal text-ink text-sm uppercase tracking-wider">Saved Drop Vault</h3>
            <p className="font-mono text-xs text-muted">View saved tees & cuts</p>
          </div>
        </Link>

        <Link
          href="/account/privacy"
          className="bg-surface border border-border p-6 hover:border-accent transition-all flex items-center space-x-4"
        >
          <ShieldCheck className="w-7 h-7 text-accent" />
          <div>
            <h3 className="font-serif font-normal text-ink text-sm uppercase tracking-wider">Privacy & Data (DPDP)</h3>
            <p className="font-mono text-xs text-muted">Export data, manage consents & erasure</p>
          </div>
        </Link>

        <div className="bg-surface border border-border p-6 flex items-center space-x-4">
          <User className="w-7 h-7 text-accent" />
          <div>
            <h3 className="font-serif font-normal text-ink text-sm uppercase tracking-wider">Profile Details</h3>
            <p className="font-mono text-xs text-muted">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
