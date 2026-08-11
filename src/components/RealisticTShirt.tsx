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

  return (
    <div className="relative w-full max-w-[460px] aspect-[4/5] flex items-center justify-center select-none">
      {/* Dynamic Realistic T-Shirt SVG Construction */}
      <svg
        viewBox="0 0 500 560"
        className="w-full h-full filter drop-shadow-md transition-all duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Fabric Grain / Soft Lighting Gradient */}
          <linearGradient id="bodyLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
          </linearGradient>

          {/* Realistic Shoulder & Chest Shading */}
          <linearGradient id="chestFoldGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="25%" stopColor="#000000" stopOpacity="0.04" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
          </linearGradient>

          {/* Sleeve Crease Gradient */}
          <linearGradient id="sleeveLeftGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="sleeveRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* --- FRONT VIEW REALISTIC SHAPE --- */}
        {viewSide === 'front' ? (
          <g id="tshirt-front">
            {/* 1. Base Garment Path (True Oversized Boxy Cut Silhouette) */}
            <path
              d="M 180 50 
                 C 215 80, 285 80, 320 50 
                 L 435 125 
                 C 455 140, 465 170, 440 215 
                 L 395 240 
                 C 385 220, 380 200, 375 190 
                 L 375 490 
                 C 375 515, 125 515, 125 490 
                 L 125 190 
                 C 120 200, 115 220, 105 240 
                 L 60 215 
                 C 35 170, 45 140, 65 125 
                 Z"
              fill={color.hex}
              stroke={color.borderHex}
              strokeWidth="2"
              className="transition-colors duration-300"
            />

            {/* 2. Realistic Sleeve Shadows & Folds */}
            <path
              d="M 65 125 L 125 190 L 105 240 L 60 215 Z"
              fill="url(#sleeveLeftGrad)"
            />
            <path
              d="M 435 125 L 375 190 L 395 240 L 440 215 Z"
              fill="url(#sleeveRightGrad)"
            />

            {/* 3. Main Torso Dimensional Lighting */}
            <path
              d="M 180 50 C 215 80, 285 80, 320 50 L 375 190 L 375 490 C 375 515, 125 515, 125 490 L 125 190 Z"
              fill="url(#chestFoldGrad)"
            />
            <path
              d="M 180 50 C 215 80, 285 80, 320 50 L 435 125 L 375 490 C 375 515, 125 515, 125 490 L 65 125 Z"
              fill="url(#bodyLightGrad)"
            />

            {/* 4. Realistic Collar Inner Rim & Neck Ribbing */}
            <path
              d="M 180 50 C 215 85, 285 85, 320 50 C 290 70, 210 70, 180 50 Z"
              fill="#181512"
              opacity="0.35"
            />
            <path
              d="M 180 50 C 215 85, 285 85, 320 50"
              fill="none"
              stroke={color.borderHex}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 178 48 C 215 78, 285 78, 322 48"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.2"
              strokeWidth="1.5"
            />

            {/* 5. Sleeve Hem Stitch Lines */}
            <line x1="68" y1="210" x2="108" y2="232" stroke={color.borderHex} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
            <line x1="432" y1="210" x2="392" y2="232" stroke={color.borderHex} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />

            {/* 6. Bottom Hem Stitch Line */}
            <path
              d="M 130 482 C 200 495, 300 495, 370 482"
              fill="none"
              stroke={color.borderHex}
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.5"
            />
          </g>
        ) : (
          /* --- BACK VIEW REALISTIC SHAPE --- */
          <g id="tshirt-back">
            {/* 1. Base Garment Path (Back Silhouette) */}
            <path
              d="M 180 50 
                 C 215 58, 285 58, 320 50 
                 L 435 125 
                 C 455 140, 465 170, 440 215 
                 L 395 240 
                 C 385 220, 380 200, 375 190 
                 L 375 490 
                 C 375 515, 125 515, 125 490 
                 L 125 190 
                 C 120 200, 115 220, 105 240 
                 L 60 215 
                 C 35 170, 45 140, 65 125 
                 Z"
              fill={color.hex}
              stroke={color.borderHex}
              strokeWidth="2"
              className="transition-colors duration-300"
            />

            {/* 2. Realistic Sleeve Shadows */}
            <path
              d="M 65 125 L 125 190 L 105 240 L 60 215 Z"
              fill="url(#sleeveLeftGrad)"
            />
            <path
              d="M 435 125 L 375 190 L 395 240 L 440 215 Z"
              fill="url(#sleeveRightGrad)"
            />

            {/* 3. Back Torso Drape Lighting & Spine Crease */}
            <path
              d="M 180 50 C 215 58, 285 58, 320 50 L 375 190 L 375 490 C 375 515, 125 515, 125 490 L 125 190 Z"
              fill="url(#chestFoldGrad)"
            />
            <path
              d="M 180 50 C 215 58, 285 58, 320 50 L 435 125 L 375 490 C 375 515, 125 515, 125 490 L 65 125 Z"
              fill="url(#bodyLightGrad)"
            />

            {/* 4. High Back Neck Collar Ribbing */}
            <path
              d="M 180 50 C 215 58, 285 58, 320 50"
              fill="none"
              stroke={color.borderHex}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 178 48 C 215 55, 285 55, 322 48"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />

            {/* 5. Back Shoulder Yoke Seam */}
            <path
              d="M 140 120 C 220 135, 280 135, 360 120"
              fill="none"
              stroke={color.borderHex}
              strokeWidth="1"
              strokeDasharray="4 2"
              opacity="0.5"
            />

            {/* 6. Bottom Hem Stitch */}
            <path
              d="M 130 482 C 200 495, 300 495, 370 482"
              fill="none"
              stroke={color.borderHex}
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.5"
            />
          </g>
        )}
      </svg>

      {/* --- LIVE PRINT PLACEMENT ZONE ON THE GARMENT --- */}
      {isPrintVisible && (
        <div
          className={`absolute ${placement.posClass} pointer-events-none flex flex-col items-center justify-center text-center transition-all duration-300 px-3 z-20`}
        >
          {/* Custom Artwork Render */}
          {graphic.previewUrl && (
            <motion.div
              key={graphic.previewUrl}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="mx-auto mb-1.5 max-w-[120px] max-h-[120px] overflow-hidden shadow-sm filter contrast-125"
            >
              <img
                src={graphic.previewUrl}
                alt="Custom Graphic"
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </motion.div>
          )}

          {/* Primary Headline Typography */}
          {headlineText && (
            <p
              className={`${font.fontClass} uppercase transition-all duration-150 leading-tight ${
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
              className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] mt-1 opacity-80 leading-normal"
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
