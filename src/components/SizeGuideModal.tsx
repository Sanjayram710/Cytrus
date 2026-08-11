'use client';

import React from 'react';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-ink/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4 z-50">
        <div className="bg-surface border border-border max-w-2xl w-full p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-ink hover:text-accent"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="font-serif text-2xl font-normal uppercase tracking-wider text-ink mb-1">
            CYTRUS Size Guide
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6 font-medium">
            Oversized & Heavyweight Cut Measurements (Inches)
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-canvas text-ink uppercase tracking-widest">
                  <th className="p-3 font-semibold">Size</th>
                  <th className="p-3 font-semibold">Chest Width (In)</th>
                  <th className="p-3 font-semibold">Tee Length (In)</th>
                  <th className="p-3 font-semibold">Shoulder Drop (In)</th>
                  <th className="p-3 font-semibold">Fit Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-ink">
                <tr>
                  <td className="p-3 font-semibold">S</td>
                  <td className="p-3">42"</td>
                  <td className="p-3">28.5"</td>
                  <td className="p-3">21.5"</td>
                  <td className="p-3 text-accent font-medium">Relaxed Boxy</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">M</td>
                  <td className="p-3">44"</td>
                  <td className="p-3">29.5"</td>
                  <td className="p-3">22.5"</td>
                  <td className="p-3 text-accent font-medium">Relaxed Boxy</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">L</td>
                  <td className="p-3">46"</td>
                  <td className="p-3">30.5"</td>
                  <td className="p-3">23.5"</td>
                  <td className="p-3 text-accent font-medium">Oversized Drop</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">XL</td>
                  <td className="p-3">48"</td>
                  <td className="p-3">31.5"</td>
                  <td className="p-3">24.5"</td>
                  <td className="p-3 text-accent font-medium">Oversized Drop</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">XXL</td>
                  <td className="p-3">50"</td>
                  <td className="p-3">32.5"</td>
                  <td className="p-3">25.5"</td>
                  <td className="p-3 text-accent font-medium">Ultra Oversized</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-canvas border border-border text-[11px] text-muted leading-relaxed font-sans">
            <p className="font-mono text-xs uppercase font-medium tracking-wider text-ink mb-1">Fit & Care Recommendation:</p>
            <p>• Our <strong>Oversized Tees</strong> feature dropped shoulders and a wide boxy body width. Stick to your true size for the intended streetwear drape, or size down for a standard fit.</p>
            <p className="mt-1">• Pre-shrunk 240 GSM French Terry organic cotton. Machine wash cold with similar colors; lay flat to dry.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
