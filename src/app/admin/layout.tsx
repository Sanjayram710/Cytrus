'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Sparkles,
  Sliders,
  ShoppingBag,
  Users,
  Warehouse,
  Tag,
  Star,
  BarChart3,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import CelebriteeLogo from '@/components/CelebriteeLogo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user || data.user.role !== 'ADMIN') {
          router.push('/login');
        } else {
          setLoading(false);
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-luxury-black text-luxury-gold uppercase font-serif text-sm tracking-widest">Verifying Admin Credentials...</div>;
  }

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Hero Slides (5)', href: '/admin/slides', icon: Sliders },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Collections', href: '/admin/collections', icon: Sparkles },
    { name: 'Inventory Stock', href: '/admin/inventory', icon: Warehouse },
    { name: 'Offers & Integrity', href: '/admin/offers', icon: Tag },
    { name: 'Customer Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex bg-luxury-cream text-luxury-black font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-luxury-black text-luxury-cream flex flex-col justify-between p-6 border-r border-luxury-gold/20 flex-shrink-0">
        <div>
          <div className="flex items-center space-x-3 border-b border-white/10 pb-6 mb-8">
            <CelebriteeLogo variant="badge" size="xs" />
            <div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-pink font-bold block">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-all ${
                    isActive
                      ? 'bg-luxury-gold text-luxury-black font-bold shadow-md'
                      : 'text-luxury-cream/70 hover:text-luxury-gold hover:bg-luxury-charcoal'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-luxury-cream/10">
          <Link
            href="/"
            className="block text-center text-xs uppercase tracking-widest text-luxury-gold font-bold hover:underline mb-3"
          >
            ← View Customer Storefront
          </Link>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/';
            }}
            className="w-full text-left flex items-center justify-center space-x-2 text-xs uppercase tracking-widest text-red-400 hover:text-red-300 font-bold py-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 sm:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
