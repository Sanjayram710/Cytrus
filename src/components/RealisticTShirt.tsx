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
  
  // 1. Resolve distinct base garment mockup based on silhouette
  let imageSrc = '';
  if (silhouette === 'graphic-tees') {
    imageSrc = viewSide === 'front' 
      ? '/mockups/tshirt_graphic_front.png' 
      : '/mockups/tshirt_graphic_back.png';
  } else if (silhouette === 'vintage-wash') {
    imageSrc = viewSide === 'front' 
      ? '/mockups/tshirt_vintage_wash_front.png' 
      : '/mockups/tshirt_vintage_wash_back.png';
  } else {
    // Oversized Tees
    const mockups = COLOR_MOCKUP_MAP[color.id] || COLOR_MOCKUP_MAP['obsidian-black'];
    imageSrc = viewSide === 'front' ? mockups.front : mockups.back;
  }

  // 2. Calculate text & artwork contrast
  let effectiveTextColor = color.textColor;
  if (silhouette === 'graphic-tees' || silhouette === 'vintage-wash') {
    effectiveTextColor = '#FAF7F2';
  } else {
    effectiveTextColor = color.textColor;
  }

  // 3. Exact coordinates and responsive scaling for all 4 placement zones
  const isPocket = placement.id === 'pocket-left';
  const isLowerHem = placement.id === 'lower-hem';
  const isBack = placement.id === 'back-oversized';

  let placementStyle: React.CSSProperties = {
    top: silhouette === 'graphic-tees' ? '36%' : '34%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    maxWidth: '220px',
  };

  if (isPocket) {
    placementStyle = {
      top: silhouette === 'graphic-tees' ? '30%' : '28%',
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
      
      {/* 1. Distinct Base Studio T-Shirt Mockup */}
      <img
        key={`${silhouette}-${viewSide}-${color.id}`}
        src={imageSrc}
        alt={`Celebritee ${silhouette} ${color.name} ${viewSide} view`}
        className="relative z-10 w-full h-full object-contain filter contrast-[1.03] transition-all duration-300 pointer-events-none"
      />

      {/* 1.1 Dynamic Color Tone Overlay for Graphic Tees & Vintage Wash */}
      {(silhouette === 'graphic-tees' || silhouette === 'vintage-wash') && color.id !== 'obsidian-black' && (
        <div
          className="absolute inset-0 z-20 pointer-events-none transition-all duration-300"
          style={{
            backgroundColor: color.hex,
            mixBlendMode: silhouette === 'vintage-wash' ? 'color' : 'color-burn',
            opacity: silhouette === 'vintage-wash' ? 0.85 : 0.65,
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
                  (silhouette === 'oversized-tees' && color.id !== 'obsidian-black' && color.id !== 'washed-espresso') ||
                  (silhouette !== 'oversized-tees' && (color.id === 'vintage-chalk' || color.id === 'sand-dune'))
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
