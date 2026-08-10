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
    <footer className="bg-luxury-black text-luxury-cream border-t border-luxury-border/20 pt-16 pb-12">
      {/* Brand Value Pillars Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-luxury-cream/10 pb-12 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Award className="w-7 h-7 text-luxury-gold mb-3" />
            <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-luxury-cream mb-1">
              280 GSM French Terry
            </h4>
            <p className="text-[11px] text-luxury-cream/60">100% Organic Heavyweight Combed Cotton</p>
          </div>

          <div className="flex flex-col items-center">
            <Truck className="w-7 h-7 text-luxury-gold mb-3" />
            <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-luxury-cream mb-1">
              Express Delivery
            </h4>
            <p className="text-[11px] text-luxury-cream/60">Complimentary Shipping Over ₹2,000</p>
          </div>

          <div className="flex flex-col items-center">
            <RefreshCw className="w-7 h-7 text-luxury-gold mb-3" />
            <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-luxury-cream mb-1">
              Non-Stretch Collar Guarantee
            </h4>
            <p className="text-[11px] text-luxury-cream/60">1.2-Inch Reinforced Heavy Ribbed Collar</p>
          </div>

          <div className="flex flex-col items-center">
            <Lock className="w-7 h-7 text-luxury-gold mb-3" />
            <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-luxury-cream mb-1">
              Secure Checkout
            </h4>
            <p className="text-[11px] text-luxury-cream/60">Razorpay Encrypted & Cash on Delivery</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Gazette Newsletter Column */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-[0.2em] text-luxury-cream">
              LUXEWEAR
            </h3>
            <p className="text-xs text-luxury-cream/70 leading-relaxed max-w-sm">
              Subscribe to the LUXEWEAR Gazette for exclusive drop notifications, limited edition streetwear releases, and VIP early access codes.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 max-w-md pt-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="ENTER YOUR EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-luxury-charcoal border border-luxury-cream/20 px-4 py-3 text-xs uppercase tracking-wider text-luxury-cream focus:outline-none focus:border-luxury-gold"
                />
                <button
                  type="submit"
                  className="bg-luxury-gold text-luxury-black font-bold text-xs uppercase tracking-[0.2em] px-6 py-3 hover:bg-white transition-colors"
                >
                  Join
                </button>
              </div>
              {msg && <p className="text-[11px] text-luxury-gold font-medium">{msg}</p>}
            </form>
          </div>

          {/* Customer Care Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.25em] text-luxury-gold">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-xs uppercase tracking-widest text-luxury-cream/70">
              <li><Link href="/orders" className="hover:text-luxury-gold transition-colors">Track Order</Link></li>
              <li><Link href="/shop" className="hover:text-luxury-gold transition-colors">Tee Size Guide</Link></li>
              <li><Link href="/checkout" className="hover:text-luxury-gold transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/account" className="hover:text-luxury-gold transition-colors">FAQ & Support</Link></li>
            </ul>
          </div>

          {/* T-Shirt Categories Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.25em] text-luxury-gold">
              TEE CATEGORIES
            </h4>
            <ul className="space-y-2 text-xs uppercase tracking-widest text-luxury-cream/70">
              <li><Link href="/category/oversized-tees" className="hover:text-luxury-gold transition-colors">Oversized Tees</Link></li>
              <li><Link href="/category/graphic-tees" className="hover:text-luxury-gold transition-colors">Graphic Tees</Link></li>
              <li><Link href="/category/vintage-wash-tees" className="hover:text-luxury-gold transition-colors">Vintage Wash</Link></li>
              <li><Link href="/category/pima-cotton-essentials" className="hover:text-luxury-gold transition-colors">Pima Essentials</Link></li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div className="space-y-4">
            <h4 className="font-serif text-xs font-bold uppercase tracking-[0.25em] text-luxury-gold">
              CONNECT
            </h4>
            <div className="flex space-x-4 text-luxury-cream/80">
              <a href="#" className="hover:text-luxury-gold transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-luxury-gold transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-luxury-gold transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
            <p className="text-[11px] text-luxury-cream/50 pt-2">
              Atelier & Flagship Studio:<br />
              45 Marine Drive, Mumbai 400020
            </p>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-luxury-cream/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-luxury-cream/40 uppercase tracking-widest">
          <p>© 2026 LUXEWEAR HEAVYWEIGHT TEES. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-luxury-cream">PRIVACY POLICY</a>
            <a href="#" className="hover:text-luxury-cream">TERMS OF SERVICE</a>
            <a href="#" className="hover:text-luxury-cream">ACCESSIBILITY</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
