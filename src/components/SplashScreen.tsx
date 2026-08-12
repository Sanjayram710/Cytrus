'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CelebriteeLogo from '@/components/CelebriteeLogo';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash screen for exactly 1.8 seconds then smoothly fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="celebritee-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0F172A] text-white overflow-hidden select-none"
        >
          {/* Ambient Soft Cobalt & Pink Glow */}
          <div className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-[#1E5AE6]/20 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-[#FF4D97]/15 rounded-full blur-[100px] pointer-events-none -z-10 translate-x-20 -translate-y-10" />

          {/* Master Logo Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6">
              <CelebriteeLogo variant="badge" size="xl" className="shadow-2xl shadow-[#1E5AE6]/40" />
            </div>

            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.25em' }}
              animate={{ opacity: 1, letterSpacing: '0.35em' }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-slate-400 font-semibold"
            >
              LUXURY CELEBRITY-COMMERCE
            </motion.p>
          </motion.div>

          {/* Smooth Progress Indicator */}
          <div className="absolute bottom-12 w-36 sm:w-48 h-[3px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.7, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-royal via-pink to-royal"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
