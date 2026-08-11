'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CustomizerColorOption,
  CustomizerPlacementOption,
  CustomizerFontOption,
  CustomizerGraphicOption,
} from '@/lib/customizerPricing';

interface RealisticTShirtProps {
  viewSide: 'front' | 'back';
  color: CustomizerColorOption;
  placement: CustomizerPlacementOption;
  headlineText: string;
  taglineText: string;
  font: CustomizerFontOption;
  textScale: 'sm' | 'md' | 'lg';
  graphic: CustomizerGraphicOption;
}

export default function RealisticTShirt({
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
  const imageSrc = viewSide === 'front' ? '/mockups/tshirt_front.png' : '/mockups/tshirt_back.png';

  // Rule: Background color must remain pure white (#FFFFFF) for every color except Sand Dune and Vintage Chalk
  const isSandOrVintage = color.id === 'sand-dune' || color.id === 'vintage-chalk';
  const containerBg = isSandOrVintage ? (color.id === 'sand-dune' ? '#EBE3D5' : '#F7F4EE') : '#FFFFFF';

  return (
    <div
      className="relative w-full max-w-[440px] aspect-square flex items-center justify-center select-none overflow-hidden rounded-md transition-colors duration-500"
      style={{ backgroundColor: containerBg }}
    >
      {/* 1. Underlying Real Dye Color Layer (Clipped to T-shirt silhouette so background stays clean white) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Front T-Shirt Silhouette Clip Path */}
          <clipPath id="frontTeeClip">
            <path d="M 175 42 C 215 72, 285 72, 325 42 L 445 118 C 470 135, 480 170, 450 225 L 398 250 C 385 228, 380 205, 375 190 L 375 465 C 375 490, 125 490, 125 465 L 125 190 C 120 205, 115 228, 102 250 L 50 225 C 20 170, 30 135, 55 118 Z" />
          </clipPath>
          {/* Back T-Shirt Silhouette Clip Path */}
          <clipPath id="backTeeClip">
            <path d="M 175 42 C 215 50, 285 50, 325 42 L 445 118 C 470 135, 480 170, 450 225 L 398 250 C 385 228, 380 205, 375 190 L 375 465 C 375 490, 125 490, 125 465 L 125 190 C 120 205, 115 228, 102 250 L 50 225 C 20 170, 30 135, 55 118 Z" />
          </clipPath>
        </defs>

        {/* Color Fill for T-Shirt only */}
        <rect
          width="100%"
          height="100%"
          fill={color.hex}
          clipPath={viewSide === 'front' ? 'url(#frontTeeClip)' : 'url(#backTeeClip)'}
          className="transition-colors duration-500"
        />
      </svg>

      {/* 2. Photorealistic Studio Apparel Mockup (Multiply Blend for Realistic Cotton Folds) */}
      <img
        src={imageSrc}
        alt={`CYTRUS Heavyweight 300 GSM Tee ${viewSide} view`}
        className="relative z-10 w-full h-full object-contain mix-blend-multiply filter contrast-[1.08] brightness-[0.98] transition-all duration-300 pointer-events-none"
      />

      {/* 3. Soft Studio Light Sheen Overlay */}
      <img
        src={imageSrc}
        alt="Highlight sheen"
        className="absolute inset-0 z-20 w-full h-full object-contain mix-blend-screen opacity-15 pointer-events-none"
      />

      {/* 4. Real-time Print Placement Layer */}
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
                className="w-full h-full object-cover mix-blend-multiply rounded-sm"
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
              style={{ color: color.textColor }}
            >
              {headlineText}
            </p>
          )}

          {/* Secondary Tagline Typography */}
          {taglineText && (
            <p
              className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] mt-1.5 opacity-85 leading-normal drop-shadow-sm"
              style={{ color: color.textColor }}
            >
              {taglineText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
