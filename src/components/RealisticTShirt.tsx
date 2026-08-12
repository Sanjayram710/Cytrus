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
  
  // Resolve base image source for the active silhouette and color
  const mockups = COLOR_MOCKUP_MAP[color.id] || COLOR_MOCKUP_MAP['obsidian-black'];
  let imageSrc = viewSide === 'front' ? mockups.front : mockups.back;

  // Custom filter style for silhouettes to impart unique texture & style character
  let garmentFilter = 'contrast(1.03)';
  if (silhouette === 'vintage-wash') {
    // Authentic vintage wash mineral/acid fading texture
    garmentFilter = 'contrast(1.15) brightness(0.95) saturate(0.85)';
  } else if (silhouette === 'graphic-tees') {
    // Bold streetwear high-fashion punch
    garmentFilter = 'contrast(1.12) brightness(1.02)';
  }

  // Calculate text color for high legibility
  let effectiveTextColor = color.textColor;
  if (color.id === 'obsidian-black' || color.id === 'washed-espresso' || color.id === 'mineral-slate' || color.id === 'distressed-clay') {
    effectiveTextColor = '#FAF7F2';
  } else {
    effectiveTextColor = '#1C1917';
  }

  // Exact coordinates and scaling for all 4 placement zones
  const isPocket = placement.id === 'pocket-left';
  const isLowerHem = placement.id === 'lower-hem';
  const isBack = placement.id === 'back-oversized';

  let placementStyle: React.CSSProperties = {
    top: '34%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    maxWidth: '220px',
  };

  if (isPocket) {
    placementStyle = {
      top: '28%',
      left: '26%',
      width: '28%',
      maxWidth: '95px',
    };
  } else if (isLowerHem) {
    placementStyle = {
      bottom: '15%',
      left: '25%',
      width: '30%',
      maxWidth: '105px',
    };
  } else if (isBack) {
    placementStyle = {
      top: '26%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '70%',
      maxWidth: '240px',
    };
  }

  return (
    <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center select-none overflow-hidden rounded-md bg-transparent">
      
      {/* 1. Base Studio T-Shirt Mockup */}
      <img
        key={`${silhouette}-${viewSide}-${color.id}`}
        src={imageSrc}
        alt={`CYTRUS ${silhouette} ${color.name} ${viewSide} view`}
        style={{ filter: garmentFilter }}
        className="relative z-10 w-full h-full object-contain transition-all duration-300 pointer-events-none"
      />

      {/* 1.1 Subtle Vintage Wash Distressed Texture Layer */}
      {silhouette === 'vintage-wash' && (
        <div
          className="absolute inset-0 z-20 pointer-events-none opacity-40 mix-blend-overlay transition-opacity duration-300"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.3) 100%)`,
            maskImage: `url(${imageSrc})`,
            WebkitMaskImage: `url(${imageSrc})`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        />
      )}

      {/* 2. Real-time Print Placement Layer */}
      {isPrintVisible && (
        <div
          style={placementStyle}
          className={`absolute pointer-events-none flex flex-col ${
            isPocket || isLowerHem ? 'items-start text-left' : 'items-center text-center'
          } transition-all duration-300 z-30`}
        >
          {/* Custom Artwork Graphic */}
          {graphic.previewUrl && (
            <motion.div
              key={graphic.previewUrl}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className={`mb-1.5 overflow-hidden shadow-sm filter contrast-125 ${
                isPocket
                  ? 'max-w-[34px] max-h-[34px] self-start'
                  : isLowerHem
                  ? 'max-w-[28px] max-h-[28px] self-start'
                  : isBack
                  ? 'max-w-[130px] max-h-[130px] mx-auto'
                  : 'max-w-[100px] max-h-[100px] mx-auto'
              }`}
            >
              <img
                src={graphic.previewUrl}
                alt="Graphic Artwork"
                className={`w-full h-full object-cover rounded-sm ${
                  color.id === 'vintage-chalk' || color.id === 'sand-dune'
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
                isPocket || isLowerHem
                  ? 'text-[8px] sm:text-[9px] tracking-wider'
                  : isBack
                  ? textScale === 'sm'
                    ? 'text-sm sm:text-base'
                    : textScale === 'md'
                    ? 'text-base sm:text-xl'
                    : 'text-xl sm:text-2xl'
                  : textScale === 'sm'
                  ? 'text-xs sm:text-sm'
                  : textScale === 'md'
                  ? 'text-sm sm:text-base'
                  : 'text-lg sm:text-xl'
              }`}
              style={{ color: effectiveTextColor }}
            >
              {headlineText}
            </p>
          )}

          {/* Secondary Tagline Typography */}
          {taglineText && (
            <p
              className={`font-mono uppercase opacity-85 leading-normal drop-shadow-sm ${
                isPocket || isLowerHem
                  ? 'text-[6px] tracking-widest mt-0.5'
                  : 'text-[8px] sm:text-[9px] tracking-[0.2em] mt-1.5'
              }`}
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
