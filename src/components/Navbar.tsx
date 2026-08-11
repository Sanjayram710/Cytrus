'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface NavbarProps {
  onOpenSearch: () => void;
}

export default function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const { openCart, getCartItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const itemCount = getCartItemCount();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Icons', href: '/#icons' },
    { name: 'Collections', href: '/shop?category=oversized-tees' },
    { name: 'Journal', href: '/#journal' },
  ];

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="bg-charcoal text-ivory text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase py-2 px-4 text-center border-b border-charcoal/40 flex items-center justify-center space-x-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
        <span>LIMITED DROPS IN COLLABORATION WITH CULTURE DEFINERS</span>
        <span className="hidden md:inline text-gold">· COMPLIMENTARY EXPRESS DELIVERY OVER ₹2,500</span>
      </div>

      {/* 2. Main Minimalist Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'luxury-nav border-b border-border shadow-subtle py-3.5'
            : 'bg-ivory/95 backdrop-blur-md py-5 border-b border-border/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Mobile Menu Trigger + Main Nav Links */}
            <div className="flex items-center space-x-8">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 text-charcoal hover:text-royal transition-colors"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <nav className="hidden lg:flex items-center space-x-7">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-[11px] uppercase tracking-[0.22em] font-medium transition-all duration-200 relative py-1 ${
                        isActive
                          ? 'text-royal font-semibold'
                          : 'text-muted hover:text-charcoal'
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <motion.span
                          layoutId="navIndicator"
                          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-royal"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Center: CELEBRITEE Brand Wordmark */}
            <div className="text-center">
              <Link href="/" className="inline-flex items-baseline space-x-0.5 group">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.28em] font-semibold text-charcoal group-hover:text-royal transition-colors uppercase">
                  CELEBRITEE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-pink inline-block mb-0.5" />
                <span className="font-mono text-[9px] text-muted tracking-widest uppercase ml-0.5 opacity-80">
                  .IN
                </span>
              </Link>
            </div>

            {/* Right: Actions (Search, Wishlist, Account, Bag) */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Search Modal Trigger */}
              <button
                onClick={onOpenSearch}
                className="p-1 text-charcoal hover:text-royal transition-colors flex items-center space-x-1.5 text-xs font-mono tracking-wider"
                title="Search Products"
              >
                <Search className="w-4 h-4" />
                <span className="hidden xl:inline text-[11px] uppercase text-muted hover:text-charcoal">
                  Search
                </span>
              </button>

              {/* Account */}
              <Link
                href={user ? '/account' : '/login'}
                className="p-1 text-charcoal hover:text-royal transition-colors"
                title={user ? `Signed in as ${user.name}` : 'Sign In'}
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-1 text-charcoal hover:text-royal transition-colors hidden sm:block"
                title="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-royal text-ivory text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Bag Trigger */}
              <button
                onClick={openCart}
                className="relative bg-charcoal hover:bg-royal text-ivory px-3 sm:px-4 py-2 text-[11px] font-mono tracking-[0.18em] uppercase transition-all duration-200 flex items-center space-x-2 shadow-subtle"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bag</span>
                <span className="bg-pink text-ivory text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                  {itemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[82%] max-w-[360px] bg-ivory border-r border-border z-50 p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-border">
                  <div className="flex items-baseline space-x-0.5">
                    <span className="font-serif text-xl tracking-[0.24em] font-semibold text-charcoal uppercase">
                      CELEBRITEE
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-pink inline-block mb-0.5" />
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-muted hover:text-charcoal"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-8 space-y-5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm uppercase tracking-[0.2em] font-medium text-charcoal hover:text-royal transition-colors py-1.5 flex items-center justify-between border-b border-border/50"
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-muted" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border space-y-4 font-mono text-xs text-muted">
                <p className="uppercase tracking-widest text-[10px]">
                  CELEBRITEE.IN · LIMITED DROP ATELIER
                </p>
                <Link
                  href={user ? '/account' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-charcoal text-ivory py-3 text-center uppercase tracking-widest text-[11px] font-semibold hover:bg-royal transition-colors"
                >
                  {user ? 'My Client Profile' : 'Client Sign In'}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
