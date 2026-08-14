'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Instagram, Facebook, Twitter, Lock, Truck, RefreshCw, Award } from 'lucide-react';

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
        setMsg(data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        setMsg(data.error || 'Subscription failed');
      }
    } catch (err) {
      setMsg('Subscription failed');
    }
  };

  return (
    <footer className="bg-ink text-canvas border-t border-border pt-16 pb-12">
      {/* Brand Value Pillars Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-canvas/10 pb-12 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Award className="w-6 h-6 text-border mb-3" />
            <h4 className="font-mono text-xs uppercase tracking-widest text-canvas mb-1 font-semibold">
              240 GSM French Terry
            </h4>
            <p className="font-mono text-[11px] text-canvas/60">100% Organic Heavyweight Combed Cotton</p>
          </div>

          <div className="flex flex-col items-center">
            <Truck className="w-6 h-6 text-border mb-3" />
            <h4 className="font-mono text-xs uppercase tracking-widest text-canvas mb-1 font-semibold">
              Express Delivery
            </h4>
            <p className="font-mono text-[11px] text-canvas/60">Complimentary Shipping Over ₹2,000</p>
          </div>

          <div className="flex flex-col items-center">
            <RefreshCw className="w-6 h-6 text-border mb-3" />
            <h4 className="font-mono text-xs uppercase tracking-widest text-canvas mb-1 font-semibold">
              Non-Stretch Collar
            </h4>
            <p className="font-mono text-[11px] text-canvas/60">1.2-Inch Reinforced Heavy Ribbed Collar</p>
          </div>

          <div className="flex flex-col items-center">
            <Lock className="w-6 h-6 text-border mb-3" />
            <h4 className="font-mono text-xs uppercase tracking-widest text-canvas mb-1 font-semibold">
              Secure Checkout
            </h4>
            <p className="font-mono text-[11px] text-canvas/60">Razorpay Encrypted & Cash on Delivery</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Gazette Newsletter Column */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-serif text-2xl font-normal tracking-[0.2em] text-canvas">
              CELEBRITEE
            </h3>
            <p className="text-xs text-canvas/70 leading-relaxed max-w-sm font-normal">
              Subscribe for exclusive drop alerts, limited edition mineral washes, and private streetwear capsule releases.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 max-w-md pt-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="ENTER YOUR EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-ink border border-canvas/20 px-4 py-3 font-mono text-xs uppercase tracking-wider text-canvas focus:outline-none focus:border-border placeholder:text-canvas/40"
                />
                <button
                  type="submit"
                  className="bg-accent text-canvas font-mono font-semibold text-xs uppercase tracking-[0.2em] px-6 py-3 hover:bg-canvas hover:text-ink transition-colors border border-accent"
                >
                  Join
                </button>
              </div>
              {msg && <p className="font-mono text-[11px] text-border font-medium">{msg}</p>}
            </form>
          </div>

          {/* Customer Care Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-border">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 font-mono text-xs uppercase tracking-widest text-canvas/70">
              <li><Link href="/orders" className="hover:text-canvas transition-colors">Track Order</Link></li>
              <li><Link href="/shop" className="hover:text-canvas transition-colors">Tee Size Guide</Link></li>
              <li><Link href="/checkout" className="hover:text-canvas transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/account/privacy" className="hover:text-canvas transition-colors">Privacy & Data Rights (DPDP)</Link></li>
              <li><Link href="/account" className="hover:text-canvas transition-colors">FAQ & Support</Link></li>
            </ul>
          </div>

          {/* T-Shirt Categories Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-border">
              TEE DROPS
            </h4>
            <ul className="space-y-2 font-mono text-xs uppercase tracking-widest text-canvas/70">
              <li><Link href="/category/oversized-tees" className="hover:text-canvas transition-colors">Oversized Tees</Link></li>
              <li><Link href="/category/graphic-tees" className="hover:text-canvas transition-colors">Graphic Tees</Link></li>
              <li><Link href="/category/vintage-wash-tees" className="hover:text-canvas transition-colors">Vintage Wash</Link></li>
              <li><Link href="/category/pima-cotton-essentials" className="hover:text-canvas transition-colors">Pima Essentials</Link></li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-border">
              CONNECT
            </h4>
            <div className="flex space-x-4 text-canvas/80">
              <a href="#" className="hover:text-border transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="hover:text-border transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="hover:text-border transition-colors"><Twitter className="w-4 h-4" /></a>
            </div>
            <p className="font-mono text-[11px] text-canvas/50 pt-2">
              Atelier & Flagship Studio:<br />
              Indiranagar, Bengaluru 560038
            </p>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-canvas/10 flex flex-col sm:flex-row items-center justify-between font-mono text-[10px] text-canvas/40 uppercase tracking-widest">
          <p>© 2026 CELEBRITEE.IN. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy-policy" className="hover:text-canvas">PRIVACY POLICY (DPDP)</Link>
            <Link href="/privacy-policy" className="hover:text-canvas">TERMS OF SERVICE</Link>
            <Link href="/account/privacy" className="hover:text-canvas">DATA RIGHTS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
