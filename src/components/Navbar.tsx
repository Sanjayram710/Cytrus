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
  Truck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import CelebriteeLogo from '@/components/CelebriteeLogo';

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
      setScrolled(window.scrollY > 15);
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
    { name: 'Vault', href: '/shop' },
    { name: 'Celebrity Drops', href: '/#icons' },
    { name: 'Custom Studio', href: '/custom-design' },
    { name: 'Oversized', href: '/shop?category=oversized-tees' },
    { name: 'Vintage Acid', href: '/shop?category=vintage-wash-tees' },
    { name: 'Journal', href: '/#journal' },
  ];

  return (
    <>
      {/* 1. Top Announcement Bar - Full width */}
      <div className="w-full bg-[#0F172A] text-white text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase py-2 px-3 sm:px-6 text-center border-b border-slate-800 flex items-center justify-center space-x-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
        <span className="font-semibold text-white">
          LIMITED DROPS IN COLLABORATION WITH CULTURE DEFINERS
        </span>
        <span className="hidden md:inline text-pink font-semibold">· COMPLIMENTARY EXPRESS DELIVERY OVER ₹2,500</span>
      </div>

      {/* 2. Full-Width Sticky Header - Clean Frosted White Canvas with Black Typography */}
      <header
        className={`w-full sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'luxury-nav shadow-subtle py-2 sm:py-2.5'
            : 'bg-white/95 backdrop-blur-md py-2.5 sm:py-3.5 border-b border-border text-charcoal'
        }`}
      >
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            
            {/* FAR LEFT: Rectangle Logo + Main Navigation Links */}
            <div className="flex items-center space-x-3 sm:space-x-5 lg:space-x-7 flex-1 min-w-0">
              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 text-charcoal hover:text-royal transition-colors rounded-md flex-shrink-0"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 text-charcoal" />
              </button>

              {/* CELEBRITEE.in Rectangular Badge Logo on Far Left Corner */}
              <Link
                href="/"
                className="flex-shrink-0 inline-flex items-center group transition-transform duration-200 active:scale-95 py-0.5"
                title="CELEBRITEE.in Home"
              >
                <CelebriteeLogo variant="rectangle" size="md" className="group-hover:opacity-95" />
              </Link>

              {/* Navigation Links in Black Text */}
              <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-[11px] xl:text-xs uppercase tracking-[0.2em] font-bold transition-all duration-200 relative py-1 whitespace-nowrap ${
                        isActive
                          ? 'text-charcoal font-black'
                          : 'text-charcoal/80 hover:text-royal'
                      }`}
                    >
                      <span className="text-charcoal font-bold">{link.name}</span>
                      {isActive && (
                        <motion.span
                          layoutId="navIndicator"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-royal rounded-full"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* FAR RIGHT: Search Bar + Express Delivery + Actions */}
            <div className="flex items-center space-x-2.5 sm:space-x-4 text-charcoal flex-shrink-0">
              {/* Search Trigger */}
              <button
                onClick={onOpenSearch}
                className="group flex items-center space-x-2 border-b border-border hover:border-charcoal py-1 px-1 transition-colors text-charcoal"
                title="Search Products"
              >
                <Search className="w-4 h-4 text-charcoal group-hover:text-royal transition-colors" />
                <span className="hidden md:inline font-sans text-xs text-charcoal/80 group-hover:text-charcoal tracking-wide font-medium">
                  Search Vault...
                </span>
              </button>

              {/* Express Delivery Badge Pill */}
              <div className="hidden 2xl:flex items-center space-x-2 bg-surface-tint border border-border px-3 py-1.5 rounded-full font-mono text-[10px] text-charcoal font-semibold">
                <Truck className="w-3.5 h-3.5 text-royal" />
                <span>EXPRESS DISPATCH</span>
              </div>

              {/* Client Profile */}
              <Link
                href={user ? '/account' : '/login'}
                className="p-1.5 text-charcoal hover:text-royal transition-colors rounded-md"
                title={user ? `Signed in as ${user.name}` : 'Client Sign In'}
              >
                <User className="w-4 h-4 text-charcoal" />
              </Link>

              {/* Saved Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-1.5 text-charcoal hover:text-royal transition-colors hidden sm:block rounded-md"
                title="Wishlist"
              >
                <Heart className="w-4 h-4 text-charcoal" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-pink text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono font-bold shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Luxury Shopping Bag Button */}
              <button
                onClick={openCart}
                className="relative bg-royal hover:bg-royal-dark text-white px-3.5 sm:px-4 py-2 text-[11px] font-mono tracking-[0.18em] uppercase font-bold transition-all duration-200 flex items-center space-x-2 rounded-md shadow-sm"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline text-white">Bag</span>
                <span className="bg-white text-royal text-[10px] px-1.5 py-0.5 rounded-full font-mono font-black shadow-sm">
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[84%] max-w-[360px] bg-white border-r border-border z-50 p-6 flex flex-col justify-between overflow-y-auto lg:hidden text-charcoal shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-border">
                  <CelebriteeLogo variant="rectangle" size="sm" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-charcoal/70 hover:text-charcoal rounded-md"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 text-charcoal" />
                  </button>
                </div>

                <div className="mt-8 space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm uppercase tracking-[0.2em] font-bold text-charcoal hover:text-royal transition-colors py-2 flex items-center justify-between border-b border-border"
                    >
                      <span className="text-charcoal">{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-muted" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border space-y-4 font-mono text-xs text-muted">
                <div className="flex items-center justify-center pb-2">
                  <CelebriteeLogo variant="rectangle" size="sm" />
                </div>
                <p className="uppercase tracking-widest text-[10px] text-center text-muted">
                  CELEBRITEE.IN · LIMITED DROP ATELIER
                </p>
                <Link
                  href={user ? '/account' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-royal hover:bg-royal-dark text-white py-3 text-center uppercase tracking-widest text-[11px] font-bold transition-colors rounded-md shadow-sm"
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
