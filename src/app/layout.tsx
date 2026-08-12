'use client';

import React, { useState } from 'react';
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

  return (
    <html lang="en">
      <head>
        <title>CELEBRITEE.in | Luxury Celebrity-Commerce &amp; Iconic Drops</title>
        <meta
          name="description"
          content="CELEBRITEE.in — Limited edition couture and heavyweight streetwear collections created in exclusive collaboration with the icons who define culture."
        />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="theme-color" content="#1E5AE6" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col justify-between bg-canvas text-charcoal font-sans antialiased selection:bg-royal selection:text-white">
        <SplashScreen />
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
