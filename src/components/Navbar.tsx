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
    { name: 'Minimalist', href: '/category/minimalist-embroidered' },
    { name: 'Pima Essentials', href: '/category/pima-cotton-essentials' },
    { name: 'Polos & Henleys', href: '/category/polo-henley-tees' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-luxury-black text-luxury-cream text-[11px] font-medium uppercase tracking-[0.2em] py-2 text-center relative z-50">
        Complimentary Express Shipping on Orders Over ₹2,000 | Code: <span className="text-luxury-gold font-bold">LUXE10</span>
      </div>

      {/* Main Header / Sticky Glass Nav */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? 'glass-nav shadow-subtle py-3' : 'bg-luxury-cream/90 backdrop-blur-md py-5 border-b border-luxury-border'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[44px]">
            {/* 1. Left Wing: Desktop Search / Mobile Menu */}
            <div className="flex items-center space-x-4 w-28 sm:w-36 lg:w-44 justify-start flex-shrink-0">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 text-luxury-black hover:text-luxury-gold transition-colors lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Desktop Search Trigger */}
              <button
                onClick={onOpenSearch}
                className="hidden lg:flex items-center space-x-2 text-luxury-black hover:text-luxury-gold transition-colors group p-1"
                title="Search Products"
              >
                <Search className="w-4 h-4 text-luxury-black group-hover:text-luxury-gold transition-colors" />
                <span className="text-[11px] uppercase tracking-[0.2em] font-medium">Search</span>
              </button>
            </div>

            {/* 2. Center Stage: Left Nav + CYTRUS Logo + Right Nav */}
            <div className="flex items-center justify-center flex-1 px-2">
              {/* Desktop Left Nav Links */}
              <nav className="hidden lg:flex items-center justify-end space-x-5 xl:space-x-8 flex-1 pr-5 xl:pr-8">
                {navLinks.slice(0, 3).map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors hover:text-luxury-gold whitespace-nowrap ${
                      pathname === link.href ? 'text-luxury-gold border-b border-luxury-gold pb-0.5' : 'text-luxury-black'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Brand Logo - Perfectly Centered */}
              <Link href="/" className="flex flex-col items-center group px-3 xl:px-6 flex-shrink-0">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-luxury-black group-hover:text-luxury-gold transition-colors text-center">
                  CYTRUS
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.4em] uppercase text-luxury-gold font-semibold -mt-1 text-center">
                  HAUTE COUTURE
                </span>
              </Link>

              {/* Desktop Right Nav Links */}
              <nav className="hidden lg:flex items-center justify-start space-x-5 xl:space-x-8 flex-1 pl-5 xl:pl-8">
                {navLinks.slice(3).map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors hover:text-luxury-gold whitespace-nowrap ${
                      pathname === link.href ? 'text-luxury-gold border-b border-luxury-gold pb-0.5' : 'text-luxury-black'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* 3. Right Wing: Action Icons (Wishlist, Account, Cart, Mobile Search) */}
            <div className="flex items-center justify-end space-x-3 sm:space-x-5 w-28 sm:w-36 lg:w-44 flex-shrink-0">
              {/* Mobile Search Icon */}
              <button
                onClick={onOpenSearch}
                className="p-1.5 text-luxury-black hover:text-luxury-gold transition-colors lg:hidden"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/wishlist"
                className="relative p-1 text-luxury-black hover:text-luxury-gold transition-colors"
                title="Saved Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative group">
                  <Link
                    href={user.role === 'ADMIN' ? '/admin' : '/account'}
                    className="flex items-center space-x-1.5 p-1 text-luxury-black hover:text-luxury-gold transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline text-xs tracking-wider uppercase font-medium">
                      {user.name.split(' ')[0]}
                    </span>
                  </Link>

                  <div className="absolute right-0 mt-2 w-48 bg-white border border-luxury-border shadow-luxury rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto py-2 z-50">
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-xs uppercase tracking-wider text-luxury-gold font-bold hover:bg-luxury-cream"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" /> Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-xs uppercase tracking-wider text-luxury-black hover:bg-luxury-cream"
                    >
                      My Profile & Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-xs uppercase tracking-wider text-red-600 hover:bg-luxury-cream"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="p-1 text-luxury-black hover:text-luxury-gold transition-colors"
                  title="Sign In"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              <button
                onClick={openCart}
                className="relative p-1 text-luxury-black hover:text-luxury-gold transition-colors flex items-center"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-luxury-black text-luxury-cream text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-luxury-cream shadow-2xl p-6 flex flex-col justify-between z-50">
            <div>
              <div className="flex items-center justify-between border-b border-luxury-border pb-4">
                <span className="font-serif text-xl font-bold tracking-widest text-luxury-black">
                  CYTRUS
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-luxury-black hover:text-luxury-gold"
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
                    className="flex items-center justify-between text-sm uppercase tracking-widest font-medium text-luxury-black hover:text-luxury-gold py-2 border-b border-luxury-border/40"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-luxury-gold" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-luxury-border pt-6 space-y-3">
              {user ? (
                <>
                  <p className="text-xs uppercase tracking-wider text-luxury-black font-semibold">
                    Signed in as {user.name}
                  </p>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs uppercase tracking-widest text-luxury-gold font-bold"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-xs uppercase tracking-widest text-red-600 font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-luxury-black text-luxury-cream py-3 text-xs uppercase tracking-widest font-semibold hover:bg-luxury-gold transition-colors"
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
