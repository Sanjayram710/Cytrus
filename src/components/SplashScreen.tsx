'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash screen for exactly 2 seconds on site entrance, then enter website
    const timer = setTimeout(() => {
      setIsVisible(false);
      try {
        sessionStorage.setItem('cytrus_entrance_seen', 'true');
      } catch (e) {}
      if (onComplete) {
        onComplete();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="celebritee-standalone-entrance"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] w-screen h-screen bg-canvas flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Subtle Ambient Radial Background */}
          <div className="absolute inset-0 bg-[#FAF7F2] -z-10" />

          {/* Logo & Brand Emblem Entrance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center text-center px-4"
          >
            <div className="relative mb-4">
              <motion.img
                src="/logo.png"
                alt="CELEBRITEE.in Logo"
                className="w-56 sm:w-72 h-auto object-contain rounded-lg shadow-2xl"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, letterSpacing: '0.35em' }}
              transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
              className="font-mono text-[10px] sm:text-xs tracking-[0.35em] uppercase text-muted font-bold mt-2"
            >
              LUXURY CELEBRITY-COMMERCE
            </motion.p>
          </motion.div>

          {/* 2-Second Progress Line Indicator */}
          <div className="absolute bottom-16 w-36 sm:w-48 h-[2px] bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.95, ease: 'easeInOut' }}
              className="h-full bg-accent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
