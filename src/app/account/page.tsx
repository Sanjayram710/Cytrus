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
    return <div className="p-20 text-center uppercase tracking-widest text-luxury-gold text-xs">Loading Account Profile...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white border border-luxury-border">
        <h2 className="font-serif text-2xl font-bold text-luxury-black mb-2">Access Restricted</h2>
        <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">Please sign in to view your client profile.</p>
        <Link href="/login" className="bg-luxury-black text-luxury-cream px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-black">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-luxury-border pb-6 mb-10 flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <span className="text-xs uppercase font-semibold tracking-[0.3em] text-luxury-gold">
            MAISON CLIENT PORTAL
          </span>
          <h1 className="font-serif text-3xl font-bold text-luxury-black mt-1">
            Welcome, {user.name}
          </h1>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-3">
          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="bg-luxury-gold text-luxury-black px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" /> Admin Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="border border-luxury-border text-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/orders"
          className="bg-white border border-luxury-border p-6 shadow-subtle hover:border-luxury-gold transition-all flex items-center space-x-4"
        >
          <Package className="w-8 h-8 text-luxury-gold" />
          <div>
            <h3 className="font-serif font-bold text-luxury-black text-sm uppercase tracking-wider">My Orders & Tracking</h3>
            <p className="text-xs text-gray-500">Track shipments & view order receipts</p>
          </div>
        </Link>

        <Link
          href="/wishlist"
          className="bg-white border border-luxury-border p-6 shadow-subtle hover:border-luxury-gold transition-all flex items-center space-x-4"
        >
          <Heart className="w-8 h-8 text-luxury-gold" />
          <div>
            <h3 className="font-serif font-bold text-luxury-black text-sm uppercase tracking-wider">Saved Wishlist</h3>
            <p className="text-xs text-gray-500">View saved haute couture gowns</p>
          </div>
        </Link>

        <div className="bg-white border border-luxury-border p-6 shadow-subtle flex items-center space-x-4">
          <User className="w-8 h-8 text-luxury-gold" />
          <div>
            <h3 className="font-serif font-bold text-luxury-black text-sm uppercase tracking-wider">Profile Details</h3>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
