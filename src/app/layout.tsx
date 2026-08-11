'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SearchModal from '@/components/SearchModal';
import QuickViewModal from '@/components/QuickViewModal';
import SizeGuideModal from '@/components/SizeGuideModal';
import SplashScreen from '@/components/SplashScreen';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user already saw the entrance splash in this session
    try {
      const seen = sessionStorage.getItem('cytrus_entrance_seen');
      if (seen) {
        setHasEntered(true);
      } else {
        setHasEntered(false);
      }
    } catch (e) {
      setHasEntered(true);
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <title>CYTRUS | Luxury Heavyweight Streetwear & Bespoke Drops</title>
        <meta
          name="description"
          content="Discover CYTRUS 300 GSM organic French Terry oversized tees, vintage mineral washes, graphic streetwear capsules, and custom bespoke tees."
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between bg-canvas text-ink font-sans antialiased selection:bg-surface selection:text-ink">
        {/* If user has not completed the 2-second entrance screen, render ONLY the entrance screen */}
        {hasEntered === false && (
          <SplashScreen onComplete={() => setHasEntered(true)} />
        )}

        {/* Website Content (Revealed after entering the website) */}
        {hasEntered !== false && (
          <>
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
          </>
        )}
      </body>
    </html>
  );
}
