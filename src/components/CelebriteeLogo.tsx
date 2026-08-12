'use client';

import React from 'react';

interface CelebriteeLogoProps {
  variant?: 'badge' | 'rectangle' | 'wordmark' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export default function CelebriteeLogo({
  variant = 'rectangle',
  size = 'md',
  className = '',
}: CelebriteeLogoProps) {
  const sizeStyles = {
    xs: {
      text: 'text-xs sm:text-sm tracking-tight',
      badge: 'px-2.5 py-1 rounded-sm',
    },
    sm: {
      text: 'text-sm sm:text-base tracking-tight',
      badge: 'px-3 py-1.5 rounded-sm',
    },
    md: {
      text: 'text-base sm:text-lg lg:text-xl tracking-tight',
      badge: 'px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-sm',
    },
    lg: {
      text: 'text-xl sm:text-2xl tracking-tight',
      badge: 'px-5 py-2.5 rounded-md',
    },
    xl: {
      text: 'text-2xl sm:text-3xl tracking-tight',
      badge: 'px-6 py-3 rounded-md',
    },
    '2xl': {
      text: 'text-4xl sm:text-5xl tracking-tight',
      badge: 'px-8 py-4 rounded-lg',
    },
  }[size];

  // Rectangular Badge (Peter England style horizontal rectangular block with blue background)
  if (variant === 'rectangle' || variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-[#0048D9] border border-blue-400/30 shadow-md transition-all duration-200 select-none group-hover:bg-[#003cb8] ${sizeStyles.badge} ${className}`}
        style={{
          boxShadow: '0 2px 10px rgba(0, 72, 217, 0.35)',
        }}
      >
        <span
          className={`font-black italic uppercase font-sans leading-none flex items-baseline ${sizeStyles.text}`}
          style={{ fontStyle: 'italic', transform: 'skewX(-6deg)' }}
        >
          <span className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">CELEBRI</span>
          <span className="text-[#FF4D97] drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] ml-0.5">TEE</span>
          <span className="text-[#FF4D97] text-[0.85em] lowercase font-black tracking-normal leading-none">
            .in
          </span>
        </span>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-[#0048D9] aspect-square rounded-sm shadow-sm select-none ${
          size === 'xs'
            ? 'w-7 h-7'
            : size === 'sm'
            ? 'w-9 h-9'
            : size === 'md'
            ? 'w-11 h-11'
            : 'w-14 h-14'
        } ${className}`}
      >
        <span
          className="font-black italic uppercase text-white font-sans text-base sm:text-lg leading-none"
          style={{ transform: 'skewX(-6deg)' }}
        >
          C<span className="text-[#FF4D97]">.</span>
        </span>
      </div>
    );
  }

  // Wordmark without rectangular box
  return (
    <div
      className={`inline-flex items-baseline font-sans font-black italic tracking-tighter uppercase select-none transition-colors duration-200 ${sizeStyles.text} ${className}`}
      style={{ transform: 'skewX(-6deg)' }}
    >
      <span className="text-white leading-none drop-shadow-sm">CELEBRI</span>
      <span className="text-[#FF4D97] leading-none ml-0.5 drop-shadow-sm">TEE</span>
      <span className="text-[#FF4D97] text-[0.82em] lowercase font-black tracking-normal leading-none drop-shadow-sm">
        .in
      </span>
    </div>
  );
}
