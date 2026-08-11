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
  Sparkles,
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
  const [inlineSearchOpen, setInlineSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { openCart, getCartItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const itemCount = getCartItemCount();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
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
    { name: 'Graphic Tees', href: '/category/graphic-tees' },
    { name: 'Vintage Wash', href: '/category/vintage-wash-tees' },
    { name: 'Custom Design', href: '/custom-design' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Main Header / Sticky Nav */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? 'mono-nav border-b border-border py-2.5' : 'bg-canvas/95 backdrop-blur-md py-4 border-b border-border'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[64px] sm:min-h-[72px]">
            {/* Left Group: Logo on Far Left + Generous Space + Search & Category Links */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 text-ink hover:text-accent transition-colors lg:hidden mr-3"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Brand Logo on Left Corner: Circular Logo Image on top + "CYTRUS" underneath */}
              <Link href="/" className="flex flex-col items-center group py-0.5 flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="CYTRUS"
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform group-hover:scale-105"
                />
                <span className="font-sans text-xs sm:text-sm md:text-[14px] font-extrabold tracking-[0.28em] uppercase text-ink group-hover:text-accent transition-colors mt-0.5 text-center">
                  CYTRUS
                </span>
              </Link>

              {/* Space between Logo and Search Icon + Categories */}
              <div className="flex items-center ml-8 sm:ml-12 lg:ml-16">
                {/* Search Icon */}
                <button
                  onClick={() => {
                    setInlineSearchOpen(!inlineSearchOpen);
                  }}
                  className="p-1.5 text-ink hover:text-accent transition-colors flex items-center flex-shrink-0"
                  title="Search"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-ink hover:text-accent transition-colors" />
                </button>

                {/* Desktop Dynamic Area: Search Input (when active) OR Category Links */}
                <div className="hidden lg:flex items-center pl-4 xl:pl-6">
                  <AnimatePresence mode="wait">
                    {inlineSearchOpen ? (
                      <motion.form
                        key="search-input-active"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleSearchSubmit}
                        className="flex items-center border-b border-ink pb-0.5 w-[220px] xl:w-[260px]"
                      >
                        <input
                          type="text"
                          placeholder="Search CYTRUS tees..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                          className="bg-transparent text-xs text-ink placeholder:text-muted focus:outline-none w-full tracking-wider font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setInlineSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="text-muted hover:text-ink p-0.5 ml-1"
                          title="Close Search"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.form>
                    ) : (
                      <motion.nav
                        key="nav-links-default"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center space-x-6 xl:space-x-8"
                      >
                        {navLinks.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-all hover:text-ink whitespace-nowrap ${
                              pathname === link.href ? 'text-ink font-bold border-b border-ink pb-0.5' : 'text-muted'
                            }`}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </motion.nav>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Group: Action Icons (Account, Wishlist, Bag with Badge) */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Account / User */}
              {user ? (
                <div className="relative group">
                  <Link
                    href={user.role === 'ADMIN' ? '/admin' : '/account'}
                    className="flex items-center space-x-1.5 p-1.5 text-ink hover:text-accent transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden xl:inline text-xs tracking-wider uppercase font-medium">
                      {user.name.split(' ')[0]}
                    </span>
                  </Link>

                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto py-2 z-50">
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
                      My Profile & Orders
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
                  className="p-1.5 text-ink hover:text-accent transition-colors"
                  title="Sign In"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative p-1.5 text-ink hover:text-accent transition-colors"
                title="Saved Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-canvas text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger with Badge */}
              <button
                onClick={openCart}
                className="relative p-1.5 text-ink hover:text-accent transition-colors flex items-center"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-canvas text-[10px] font-mono font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                ) : (
                  <span className="absolute -top-0.5 -right-0.5 bg-border text-ink text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    0
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-surface border-r border-border p-6 flex flex-col justify-between z-50">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center space-x-2">
                  <img src="/logo.png" alt="CYTRUS" className="h-7 w-7 object-contain" />
                  <span className="font-sans text-base font-bold tracking-[0.2em] text-ink">
                    CYTRUS
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-ink hover:text-accent"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-8 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-xs uppercase tracking-widest font-medium text-ink hover:text-accent py-2 border-b border-border/40"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-muted" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-3">
              {user ? (
                <>
                  <p className="text-xs uppercase tracking-wider text-ink font-semibold">
                    Signed in as {user.name}
                  </p>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs uppercase tracking-widest text-accent font-bold"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-xs uppercase tracking-widest text-muted hover:text-ink font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-accent text-canvas py-3 text-xs uppercase tracking-widest font-semibold hover:bg-ink transition-colors"
                  >
                    Sign In / Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
