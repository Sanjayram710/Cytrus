'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Instagram, ShieldCheck, Truck, Sparkles, Lock, ArrowUpRight } from 'lucide-react';
import CelebriteeLogo from '@/components/CelebriteeLogo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubscribed(true);
        setMsg(data.message || 'You have been granted priority drop access.');
        setEmail('');
      } else {
        setMsg(data.error || 'Subscription failed');
      }
    } catch (err) {
      setMsg('Subscription failed');
    }
  };

  return (
    <footer className="bg-slate-50 text-charcoal border-t border-slate-200 pt-16 pb-12">
      {/* 1. Value Pillars Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200 pb-12 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-charcoal">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white shadow-subtle border border-slate-200 flex items-center justify-center mb-3 text-royal">
              <ShieldCheck className="w-5 h-5 text-royal" />
            </div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-charcoal mb-1 font-bold">
              Numbered Authenticity
            </h4>
            <p className="font-mono text-[11px] text-muted">Certificate of Collaboration Included</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white shadow-subtle border border-slate-200 flex items-center justify-center mb-3 text-pink">
              <Sparkles className="w-5 h-5 text-pink" />
            </div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-charcoal mb-1 font-bold">
              240 GSM Heavyweight
            </h4>
            <p className="font-mono text-[11px] text-muted">Master Tailored Streetwear Cotton</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white shadow-subtle border border-slate-200 flex items-center justify-center mb-3 text-royal">
              <Truck className="w-5 h-5 text-royal" />
            </div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-charcoal mb-1 font-bold">
              White-Glove Delivery
            </h4>
            <p className="font-mono text-[11px] text-muted">Tamper-Proof Boxed Courier Across India</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white shadow-subtle border border-slate-200 flex items-center justify-center mb-3 text-pink">
              <Lock className="w-5 h-5 text-pink" />
            </div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-charcoal mb-1 font-bold">
              Exclusive Drop Vault
            </h4>
            <p className="font-mono text-[11px] text-muted">Strictly Limited Quantity Batches</p>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-charcoal">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <CelebriteeLogo variant="rectangle" size="sm" />
            </Link>
            <p className="text-xs text-muted leading-relaxed max-w-sm font-normal">
              Limited edition streetwear collections created in exclusive collaboration with the culture-defining icons of our generation. Private drop invites only.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 max-w-md pt-2">
              <div className="flex rounded-lg overflow-hidden border border-slate-300 focus-within:border-royal bg-white transition-colors shadow-subtle">
                <input
                  type="email"
                  placeholder="ENTER YOUR VIP EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent px-4 py-3 text-xs font-mono uppercase tracking-wider text-charcoal focus:outline-none flex-1 placeholder:text-muted"
                />
                <button
                  type="submit"
                  className="bg-royal hover:bg-royal-dark text-white px-5 py-3 font-mono text-xs uppercase font-bold tracking-widest transition-colors flex items-center space-x-1"
                >
                  <span>Join</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              {msg && <p className="font-mono text-[10px] text-royal font-bold pt-1">{msg}</p>}
            </form>
          </div>

          {/* Navigation Columns */}
          <div>
            <h4 className="font-mono text-xs uppercase font-bold tracking-[0.2em] text-charcoal mb-4">
              Vault Drops
            </h4>
            <ul className="space-y-2.5 font-mono text-xs text-muted">
              <li>
                <Link href="/shop" className="hover:text-royal transition-colors">
                  All Collaborations
                </Link>
              </li>
              <li>
                <Link href="/shop?category=oversized-tees" className="hover:text-royal transition-colors">
                  Oversized Cuts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=vintage-wash-tees" className="hover:text-royal transition-colors">
                  Acid Washed
                </Link>
              </li>
              <li>
                <Link href="/shop?category=hoodies-sweats" className="hover:text-royal transition-colors">
                  Heavyweight Hoodies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase font-bold tracking-[0.2em] text-charcoal mb-4">
              Collaborations
            </h4>
            <ul className="space-y-2.5 font-mono text-xs text-muted">
              <li>
                <Link href="/#icons" className="hover:text-royal transition-colors">
                  Ranveer Singh Edition
                </Link>
              </li>
              <li>
                <Link href="/#icons" className="hover:text-royal transition-colors">
                  Zendaya Capsule
                </Link>
              </li>
              <li>
                <Link href="/#icons" className="hover:text-royal transition-colors">
                  Diljit Dosanjh Boxy
                </Link>
              </li>
              <li>
                <Link href="/#standards" className="hover:text-royal transition-colors">
                  Authenticity Verification
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase font-bold tracking-[0.2em] text-charcoal mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 font-mono text-xs text-muted">
              <li>
                <Link href="/account" className="hover:text-royal transition-colors">
                  Client Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-royal transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-royal transition-colors">
                  Saved Vault
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted hover:text-royal transition-colors">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Legal & Copyright Strip */}
        <div className="mt-14 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between font-mono text-[11px] text-muted gap-4">
          <p>&copy; 2026 CELEBRITEE.in. All Rights Reserved. Master Tailored Heavyweight Celebrity Streetwear.</p>
          <div className="flex space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Access</span>
            <span>Authenticity Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
