'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Package, Heart, MapPin, LogOut, ShieldCheck } from 'lucide-react';
import CelebriteeLogo from '@/components/CelebriteeLogo';

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
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white border border-border rounded-2xl shadow-subtle text-charcoal">
        <h2 className="font-serif text-2xl font-normal text-charcoal mb-2">Access Restricted</h2>
        <p className="font-mono text-xs text-muted mb-6 uppercase tracking-wider">Please sign in to view your client profile.</p>
        <Link href="/login" className="bg-royal hover:bg-royal-dark text-white px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-colors rounded-md shadow-sm">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white text-charcoal">
      <div className="border-b border-border pb-6 mb-10 flex flex-col sm:flex-row justify-between sm:items-center text-charcoal">
        <div>
          <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-royal flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-royal inline-block" />
            <span>CLIENT PORTAL</span>
          </span>
          <h1 className="font-serif text-3xl font-normal text-charcoal mt-1">
            Welcome, {user.name}
          </h1>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-3">
          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="bg-royal text-white hover:bg-royal-dark px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider flex items-center rounded-md transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5 text-white" /> Admin Console
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="border border-border font-mono text-charcoal hover:bg-slate-100 px-4 py-2 text-xs uppercase tracking-wider bg-surface-tint transition-colors rounded-md font-bold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-charcoal">
        <Link
          href="/orders"
          className="bg-white border border-border p-6 hover:border-royal/50 hover:shadow-card transition-all rounded-2xl flex items-center space-x-4 shadow-subtle text-charcoal"
        >
          <div className="w-12 h-12 rounded-full bg-surface-tint flex items-center justify-center flex-shrink-0 border border-border">
            <Package className="w-6 h-6 text-royal" />
          </div>
          <div>
            <h3 className="font-serif font-normal text-charcoal text-sm uppercase tracking-wider">My Orders & Tracking</h3>
            <p className="font-mono text-xs text-muted">Track drop shipments & view receipts</p>
          </div>
        </Link>

        <Link
          href="/wishlist"
          className="bg-white border border-border p-6 hover:border-royal/50 hover:shadow-card transition-all rounded-2xl flex items-center space-x-4 shadow-subtle text-charcoal"
        >
          <div className="w-12 h-12 rounded-full bg-pink-light flex items-center justify-center flex-shrink-0 border border-pink/30">
            <Heart className="w-6 h-6 text-pink" />
          </div>
          <div>
            <h3 className="font-serif font-normal text-charcoal text-sm uppercase tracking-wider">Saved Drop Vault</h3>
            <p className="font-mono text-xs text-muted">View saved tees & cuts</p>
          </div>
        </Link>

        <div className="bg-white border border-border p-6 rounded-2xl flex items-center space-x-4 shadow-subtle text-charcoal">
          <div className="w-12 h-12 rounded-full bg-surface-tint flex items-center justify-center flex-shrink-0 border border-border">
            <User className="w-6 h-6 text-royal" />
          </div>
          <div>
            <h3 className="font-serif font-normal text-charcoal text-sm uppercase tracking-wider">Profile Details</h3>
            <p className="font-mono text-xs text-muted">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
