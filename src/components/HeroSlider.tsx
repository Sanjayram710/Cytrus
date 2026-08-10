'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface HeroSlideData {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  image: string;
  mobileImage?: string | null;
  buttonText: string;
  buttonUrl: string;
  displayOrder: number;
  isActive: boolean;
}

interface HeroSliderProps {
  initialSlides?: HeroSlideData[];
}

export default function HeroSlider({ initialSlides = [] }: HeroSliderProps) {
  const [slides, setSlides] = useState<HeroSlideData[]>(initialSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (initialSlides.length === 0) {
      fetch('/api/hero-slides')
        .then((res) => res.json())
        .then((data) => {
          if (data.slides && data.slides.length > 0) {
            setSlides(data.slides);
          }
        })
        .catch(() => {});
    }
  }, [initialSlides]);

  // Autoplay functionality (5 seconds interval)
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Mobile Touch/Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 50) {
      handleNext();
    } else if (diffX < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full h-[85vh] sm:h-[90vh] bg-luxury-black overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0.4, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.4 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Desktop & Mobile Background Images */}
          <picture className="w-full h-full block">
            <source media="(max-width: 640px)" srcSet={currentSlide.mobileImage || currentSlide.image} />
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover object-center filter brightness-[0.70]"
            />
          </picture>

          {/* Luxury Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/30 to-transparent" />

          {/* Animated Slide Content Overlay */}
          <div className="absolute inset-0 flex items-end sm:items-center justify-start max-w-7xl mx-auto px-6 sm:px-12 pb-20 sm:pb-0 z-20">
            <div className="max-w-2xl text-left text-luxury-cream">
              {currentSlide.subtitle && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-luxury-gold text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase mb-3"
                >
                  {currentSlide.subtitle}
                </motion.p>
              )}

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight uppercase mb-4"
              >
                {currentSlide.title}
              </motion.h1>

              {currentSlide.description && (
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="text-luxury-cream/80 text-sm sm:text-base font-light leading-relaxed mb-8 max-w-lg hidden sm:block"
                >
                  {currentSlide.description}
                </motion.p>
              )}

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                <Link
                  href={currentSlide.buttonUrl}
                  className="inline-block bg-luxury-cream text-luxury-black hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 px-8 py-4 text-xs uppercase font-bold tracking-[0.2em] shadow-luxury"
                >
                  {currentSlide.buttonText}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next Arrows Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/30 hover:bg-luxury-gold text-white hover:text-black transition-colors rounded-full backdrop-blur-sm hidden sm:flex items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/30 hover:bg-luxury-gold text-white hover:text-black transition-colors rounded-full backdrop-blur-sm hidden sm:flex items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Indicators & Pause/Play Control */}
      <div className="absolute bottom-8 right-6 sm:right-12 z-30 flex items-center space-x-4">
        {/* Slide Numbers & Dots */}
        <div className="flex items-center space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                idx === currentIndex ? 'w-8 bg-luxury-gold' : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Pause / Play Toggle */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="text-white/60 hover:text-luxury-gold transition-colors p-1"
          aria-label={isPaused ? 'Play slider' : 'Pause slider'}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
      </div>
    </section>
  );
}
