'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SearchModal from '@/components/SearchModal';
import QuickViewModal from '@/components/QuickViewModal';
import SizeGuideModal from '@/components/SizeGuideModal';
import SplashScreen from '@/components/SplashScreen';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen for exactly 2 seconds when entering the website
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Celebritee.in | Luxury Heavyweight Streetwear & Bespoke Drops</title>
        <meta
          name="description"
          content="Discover Celebritee.in 240 GSM organic French Terry oversized tees, vintage mineral washes, graphic streetwear capsules, and custom bespoke tees."
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between bg-canvas text-ink font-sans antialiased selection:bg-surface selection:text-ink">
        {showSplash ? (
          <SplashScreen />
        ) : (
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
            <WhatsAppWidget />
          </>
        )}
      </body>
    </html>
  );
}
