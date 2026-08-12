'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CustomizerColorOption,
  CustomizerPlacementOption,
  CustomizerFontOption,
  CustomizerGraphicOption,
} from '@/lib/customizerPricing';

export type CustomizerSilhouette = 'oversized-tees' | 'graphic-tees' | 'vintage-wash';

interface RealisticTShirtProps {
  silhouette?: CustomizerSilhouette;
  viewSide: 'front' | 'back';
  color: CustomizerColorOption;
  placement: CustomizerPlacementOption;
  headlineText: string;
  taglineText: string;
  font: CustomizerFontOption;
  textScale: 'sm' | 'md' | 'lg';
  graphic: CustomizerGraphicOption;
}

// Dedicated High-Resolution Studio Apparel Mockup per Color for Oversized Tees
const COLOR_MOCKUP_MAP: Record<string, { front: string; back: string }> = {
  'obsidian-black': {
    front: '/mockups/tshirt_black_front.png',
    back: '/mockups/tshirt_black_back.png',
  },
  'washed-espresso': {
    front: '/mockups/tshirt_espresso_front.png',
    back: '/mockups/tshirt_espresso_back.png',
  },
  'mineral-slate': {
    front: '/mockups/tshirt_mineral_front.png',
    back: '/mockups/tshirt_mineral_back.png',
  },
  'distressed-clay': {
    front: '/mockups/tshirt_clay_front.png',
    back: '/mockups/tshirt_clay_back.png',
  },
  'vintage-chalk': {
    front: '/mockups/tshirt_vintage_front.png',
    back: '/mockups/tshirt_vintage_back.png',
  },
  'sand-dune': {
    front: '/mockups/tshirt_sand_front.png',
    back: '/mockups/tshirt_sand_back.png',
  },
};

export default function RealisticTShirt({
  silhouette = 'oversized-tees',
  viewSide,
  color,
  placement,
  headlineText,
  taglineText,
  font,
  textScale,
  graphic,
}: RealisticTShirtProps) {
  const isPrintVisible = placement.viewSide === viewSide;
  
  // Resolve image source based on active silhouette category
  let imageSrc = '';
  let effectiveTextColor = color.textColor;

  if (silhouette === 'graphic-tees') {
    imageSrc = viewSide === 'front' 
      ? '/mockups/tshirt_graphic_front.png' 
      : '/mockups/tshirt_graphic_back.png';
    // Dark silhouette gets high-contrast crisp text
    effectiveTextColor = '#FAF7F2';
  } else if (silhouette === 'vintage-wash') {
    imageSrc = viewSide === 'front' 
      ? '/mockups/tshirt_vintage_wash_front.png' 
      : '/mockups/tshirt_vintage_wash_back.png';
    // Acid wash silhouette gets high-contrast crisp text
    effectiveTextColor = '#FAF7F2';
  } else {
    // Oversized Tees: Use color-specific photorealistic mockups
    const mockups = COLOR_MOCKUP_MAP[color.id] || COLOR_MOCKUP_MAP['vintage-chalk'] || COLOR_MOCKUP_MAP['obsidian-black'];
    imageSrc = viewSide === 'front' ? mockups.front : mockups.back;
  }

  return (
    <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center select-none overflow-hidden rounded-md bg-transparent">
      
      {/* 1. Real Studio T-Shirt Photography */}
      <img
        key={`${silhouette}-${viewSide}-${color.id}`}
        src={imageSrc}
        alt={`CYTRUS ${silhouette} ${color.name} ${viewSide} view`}
        className="relative z-10 w-full h-full object-contain filter contrast-[1.03] transition-all duration-300 pointer-events-none"
      />

      {/* 2. Real-time Print Placement Layer */}
      {isPrintVisible && (
        <div
          className={`absolute ${placement.posClass} pointer-events-none flex flex-col items-center justify-center text-center transition-all duration-300 px-3 z-30`}
        >
          {/* Custom Artwork Graphic */}
          {graphic.previewUrl && (
            <motion.div
              key={graphic.previewUrl}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="mx-auto mb-2 max-w-[110px] max-h-[110px] overflow-hidden shadow-sm filter contrast-125"
            >
              <img
                src={graphic.previewUrl}
                alt="Graphic Artwork"
                className={`w-full h-full object-cover rounded-sm ${
                  silhouette === 'oversized-tees' && color.id !== 'obsidian-black' && color.id !== 'washed-espresso'
                    ? 'mix-blend-multiply'
                    : 'brightness-110'
                }`}
              />
            </motion.div>
          )}

          {/* Primary Headline Typography */}
          {headlineText && (
            <p
              className={`${font.fontClass} uppercase transition-all duration-150 leading-tight drop-shadow-sm ${
                textScale === 'sm'
                  ? 'text-xs sm:text-sm'
                  : textScale === 'md'
                  ? 'text-base sm:text-lg'
                  : 'text-xl sm:text-2xl'
              }`}
              style={{ color: effectiveTextColor }}
            >
              {headlineText}
            </p>
          )}

          {/* Secondary Tagline Typography */}
          {taglineText && (
            <p
              className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] mt-1.5 opacity-85 leading-normal drop-shadow-sm"
              style={{ color: effectiveTextColor }}
            >
              {taglineText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
