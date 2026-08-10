'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash screen for exactly 2 seconds then smoothly fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cytrus-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-luxury-black text-luxury-cream overflow-hidden select-none"
        >
          {/* Subtle Ambient Radial Gold Glow */}
          <div className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-luxury-gold/10 rounded-full blur-[100px] pointer-events-none -z-10" />

          {/* Logo & Brand Emblem Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-4">
              <motion.img
                src="/logo.png"
                alt="CYTRUS Logo"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain filter drop-shadow-[0_0_25px_rgba(212,175,55,0.25)]"
                animate={{
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            <motion.h1
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, letterSpacing: '0.35em' }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="font-sans text-2xl sm:text-3xl font-extrabold tracking-[0.35em] uppercase text-luxury-cream pl-1"
            >
              CYTRUS
            </motion.h1>
          </motion.div>

          {/* Luxury 2-Second Progress Line Indicator */}
          <div className="absolute bottom-12 w-32 sm:w-44 h-[2px] bg-luxury-cream/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.9, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-luxury-gold to-luxury-cream"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
