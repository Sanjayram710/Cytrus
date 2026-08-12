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
  LogOut,
  ShieldCheck,
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Oversized Tees', href: '/category/oversized-tees' },
    { name: 'Vintage Wash', href: '/category/vintage-wash-tees' },
    { name: 'Graphic Tees', href: '/category/graphic-tees' },
    { name: 'Custom Design', href: '/custom-design' },
  ];

  return (
    <>
      {/* Main Header / Sticky Nav */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'mono-nav border-b border-border py-3 shadow-subtle'
            : 'bg-canvas/95 backdrop-blur-md py-4 border-b border-border'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[52px]">
            
            {/* 1. FAR LEFT CORNER: Mobile Menu + CELEBRITEE .IN Brand Logo */}
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 text-ink hover:text-accent transition-colors lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* CELEBRITEE Brand Logo at Far Left */}
              <Link href="/" className="inline-flex items-baseline space-x-1 group">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.32em] font-normal uppercase text-ink group-hover:text-accent transition-colors">
                  CELEBRITEE
                </span>
                <span className="font-mono text-[9px] text-muted tracking-widest uppercase opacity-80">
                  .IN
                </span>
              </Link>
            </div>

            {/* 2. RIGHT HAND SIDE: Category Links + Actions (Search, Account, Wishlist, Bag) */}
            <div className="flex items-center space-x-5 lg:space-x-7">
              {/* Category Nav Links */}
              <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-[11px] uppercase tracking-[0.18em] font-medium transition-colors duration-200 whitespace-nowrap ${
                        isActive
                          ? 'text-ink font-bold'
                          : 'text-muted hover:text-ink'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Subtle Divider between Categories and Action Suite */}
              <div className="hidden lg:block h-3.5 w-[1px] bg-border" />

              {/* Action Suite: Search, User, Wishlist, Bag */}
              <div className="flex items-center space-x-4 sm:space-x-5">
                {/* Search Trigger */}
                <button
                  onClick={onOpenSearch}
                  className="flex items-center space-x-1.5 text-muted hover:text-ink transition-colors p-1"
                  title="Search"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider">
                    Search
                  </span>
                </button>

                {/* Account Dropdown / Link */}
                {user ? (
                  <div className="relative group">
                    <Link
                      href={user.role === 'ADMIN' ? '/admin' : '/account'}
                      className="flex items-center p-1 text-ink hover:text-accent transition-colors"
                    >
                      <User className="w-4 h-4" />
                    </Link>

                    <div className="absolute right-0 mt-2 w-48 bg-surface border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto py-2 z-50">
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-xs uppercase tracking-wider text-accent font-bold hover:bg-canvas"
                        >
                          <ShieldCheck className="w-4 h-4 mr-2" /> Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-xs uppercase tracking-wider text-ink hover:bg-canvas"
                      >
                        My Profile &amp; Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-xs uppercase tracking-wider text-muted hover:text-ink hover:bg-canvas"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="p-1 text-ink hover:text-accent transition-colors"
                    title="Sign In"
                  >
                    <User className="w-4 h-4" />
                  </Link>
                )}

                {/* Wishlist Link with Superscript Count Badge */}
                <Link
                  href="/wishlist"
                  className="relative p-1 text-ink hover:text-accent transition-colors"
                  title="Wishlist"
                >
                  <Heart className="w-4 h-4" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 text-[10px] font-mono font-bold text-ink leading-none">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Bag Button: [ 🛍️ BAG 1 ] */}
                <button
                  onClick={openCart}
                  className="border border-border bg-canvas hover:border-ink hover:bg-surface px-3 sm:px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink transition-all flex items-center space-x-2 flex-shrink-0"
                  aria-label="Shopping Bag"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="font-semibold">Bag</span>
                  <span className="font-bold">{itemCount}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[82%] max-w-[340px] bg-canvas border-r border-border z-50 p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-border">
                  <div className="flex items-baseline space-x-1">
                    <span className="font-serif text-xl tracking-[0.28em] font-normal uppercase text-ink">
                      CELEBRITEE
                    </span>
                    <span className="font-mono text-[9px] text-muted tracking-widest uppercase">
                      .IN
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-muted hover:text-ink"
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
                      className="block text-xs uppercase tracking-[0.22em] font-medium text-ink hover:text-accent transition-colors py-2 flex items-center justify-between border-b border-border/50"
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
                  className="block bg-ink text-canvas py-3 text-center uppercase tracking-widest text-[11px] font-semibold hover:bg-accent transition-colors"
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
