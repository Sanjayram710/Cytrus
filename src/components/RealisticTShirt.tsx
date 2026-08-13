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

// Dedicated High-Resolution Studio Apparel Mockup per Color
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
  
  // 1. Resolve base mockup image for the active color
  const mockups = COLOR_MOCKUP_MAP[color.id] || COLOR_MOCKUP_MAP['obsidian-black'];
  const imageSrc = viewSide === 'front' ? mockups.front : mockups.back;

  // 2. Garment styling filter based on silhouette
  let garmentFilter = 'contrast(1.02)';
  if (silhouette === 'vintage-wash') {
    garmentFilter = 'contrast(1.14) brightness(0.96) saturate(0.88)';
  } else if (silhouette === 'graphic-tees') {
    garmentFilter = 'contrast(1.08) brightness(1.01)';
  }

  // 3. High-contrast typography color based on fabric tone
  const isLightFabric = color.id === 'vintage-chalk' || color.id === 'sand-dune';
  const effectiveTextColor = isLightFabric ? '#1C1917' : '#FAF7F2';

  // 4. Exact coordinates and responsive scaling for all 4 placement zones
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
    <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center select-none overflow-hidden bg-white">
      
      {/* 1. Base Studio T-Shirt Mockup In Chosen Color */}
      <img
        key={`${silhouette}-${viewSide}-${color.id}`}
        src={imageSrc}
        alt={`CELEBRITEE ${silhouette} ${color.name} ${viewSide} view`}
        style={{ filter: garmentFilter }}
        className="relative z-10 w-full h-full object-contain mix-blend-multiply transition-all duration-300 pointer-events-none"
      />

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
                  isLightFabric ? 'mix-blend-multiply' : 'brightness-110'
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
