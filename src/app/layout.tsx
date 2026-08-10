'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SearchModal from '@/components/SearchModal';
import QuickViewModal from '@/components/QuickViewModal';
import SizeGuideModal from '@/components/SizeGuideModal';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>LUXEWEAR | Luxury Fashion & Bespoke Couture</title>
        <meta
          name="description"
          content="Discover LUXEWEAR luxury fashion dresses, handcrafted mulberry silk evening gowns, Banarasi sarees, and bespoke couture collections."
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between bg-luxury-cream text-luxury-black font-sans antialiased">
        <div>
          <Navbar onOpenSearch={() => setSearchOpen(true)} />
          <main>{children}</main>
        </div>
        <Footer />

        {/* Global Modals */}
        <CartDrawer />
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        {quickViewProduct && (
          <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
        )}
        <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      </body>
    </html>
  );
}
