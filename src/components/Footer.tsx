'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Instagram, ShieldCheck, Truck, Sparkles, Lock, ArrowUpRight } from 'lucide-react';

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
    <footer className="bg-charcoal text-ivory border-t border-charcoal pt-16 pb-12">
      {/* 1. Value Pillars Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-ivory/10 pb-12 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-5 h-5 text-gold mb-2.5" />
            <h4 className="font-mono text-xs uppercase tracking-widest text-ivory mb-1 font-semibold">
              Numbered Authenticity
            </h4>
            <p className="font-mono text-[11px] text-ivory/60">Certificate of Collaboration Included</p>
          </div>

          <div className="flex flex-col items-center">
            <Sparkles className="w-5 h-5 text-gold mb-2.5" />
            <h4 className="font-mono text-xs uppercase tracking-widest text-ivory mb-1 font-semibold">
              320+ GSM Heavyweight
            </h4>
            <p className="font-mono text-[11px] text-ivory/60">Master Tailored Streetwear Cotton</p>
          </div>

          <div className="flex flex-col items-center">
            <Truck className="w-5 h-5 text-gold mb-2.5" />
            <h4 className="font-mono text-xs uppercase tracking-widest text-ivory mb-1 font-semibold">
              White-Glove Delivery
            </h4>
            <p className="font-mono text-[11px] text-ivory/60">Tamper-Proof Boxed Courier Across India</p>
          </div>

          <div className="flex flex-col items-center">
            <Lock className="w-5 h-5 text-gold mb-2.5" />
            <h4 className="font-mono text-xs uppercase tracking-widest text-ivory mb-1 font-semibold">
              Exclusive Drop Vault
            </h4>
            <p className="font-mono text-[11px] text-ivory/60">Strictly Limited Quantity Batches</p>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Gazette Newsletter Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-baseline space-x-1">
              <span className="font-serif text-2xl font-semibold tracking-[0.24em] text-ivory uppercase">
                CELEBRITEE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink inline-block mb-0.5" />
              <span className="font-mono text-[10px] text-ivory/50 uppercase tracking-widest ml-1">
                .IN
              </span>
            </div>
            <p className="text-xs text-ivory/70 leading-relaxed max-w-sm font-normal">
              Limited collections created in exclusive collaboration with the icons who define culture. Private drop invites only.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 max-w-md pt-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="ENTER YOUR VIP EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-charcoal-dark border border-ivory/20 px-4 py-3 font-mono text-xs uppercase tracking-wider text-ivory focus:outline-none focus:border-royal placeholder:text-ivory/40"
                />
                <button
                  type="submit"
                  className="bg-royal text-ivory font-mono font-semibold text-xs uppercase tracking-[0.2em] px-6 py-3 hover:bg-pink transition-colors border border-royal"
                >
                  Join
                </button>
              </div>
              {msg && <p className="font-mono text-[11px] text-gold tracking-wide mt-1">{msg}</p>}
            </form>
          </div>

          {/* Quick Column 1: Iconic Drops */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ivory">
              Iconic Drops
            </h4>
            <ul className="space-y-2 font-mono text-xs text-ivory/70 uppercase tracking-wider">
              <li>
                <Link href="/shop" className="hover:text-pink transition-colors">
                  All Icon Drops
                </Link>
              </li>
              <li>
                <Link href="/shop?category=oversized-tees" className="hover:text-pink transition-colors">
                  Heavyweight Oversized
                </Link>
              </li>
              <li>
                <Link href="/shop?category=graphic-tees" className="hover:text-pink transition-colors">
                  Gallery Art Graphic
                </Link>
              </li>
              <li>
                <Link href="/shop?category=vintage-wash-tees" className="hover:text-pink transition-colors">
                  Acid Wash Editions
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Column 2: Client Services */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ivory">
              Client Concierge
            </h4>
            <ul className="space-y-2 font-mono text-xs text-ivory/70 uppercase tracking-wider">
              <li>
                <Link href="/account" className="hover:text-pink transition-colors">
                  Client Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-pink transition-colors">
                  Track Collaboration Order
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-pink transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <a href="mailto:concierge@celebritee.in" className="hover:text-pink transition-colors">
                  VIP Concierge Support
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Column 3: The Maison */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ivory">
              The Maison
            </h4>
            <ul className="space-y-2 font-mono text-xs text-ivory/70 uppercase tracking-wider">
              <li>
                <Link href="/#standards" className="hover:text-pink transition-colors">
                  The CELEBRITEE Standard
                </Link>
              </li>
              <li>
                <Link href="/#journal" className="hover:text-pink transition-colors">
                  The Editorial Journal
                </Link>
              </li>
              <li>
                <Link href="/#icons" className="hover:text-pink transition-colors">
                  Collaborator Icons
                </Link>
              </li>
              <li>
                <span className="text-gold text-[10px] block pt-1">
                  MUMBAI · DELHI · LONDON
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-ivory/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-ivory/50 uppercase tracking-widest">
          <p>© 2026 CELEBRITEE.IN. ALL RIGHTS RESERVED. THE ART OF BEING ICONIC.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/" className="hover:text-ivory transition-colors">Privacy</Link>
            <Link href="/" className="hover:text-ivory transition-colors">Terms of Atelier</Link>
            <Link href="/" className="hover:text-ivory transition-colors">Authenticity</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
