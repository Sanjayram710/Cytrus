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
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4 z-50">
        <div className="bg-luxury-cream border border-luxury-border max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-luxury-black hover:text-luxury-gold"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-luxury-black mb-1">
            LUXEWEAR T-Shirt Size Guide
          </h2>
          <p className="text-xs uppercase tracking-widest text-luxury-gold mb-6 font-semibold">
            Oversized & Heavyweight Cut Measurements (Inches)
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-luxury-black bg-luxury-beige/50 text-luxury-black font-serif uppercase tracking-widest">
                  <th className="p-3">Size</th>
                  <th className="p-3">Chest Width (In)</th>
                  <th className="p-3">Tee Length (In)</th>
                  <th className="p-3">Shoulder Drop (In)</th>
                  <th className="p-3">Fit Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-border text-luxury-black font-medium">
                <tr>
                  <td className="p-3 font-bold">S</td>
                  <td className="p-3">42"</td>
                  <td className="p-3">28.5"</td>
                  <td className="p-3">21.5"</td>
                  <td className="p-3 font-semibold text-luxury-gold">Relaxed Boxy</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">M</td>
                  <td className="p-3">44"</td>
                  <td className="p-3">29.5"</td>
                  <td className="p-3">22.5"</td>
                  <td className="p-3 font-semibold text-luxury-gold">Relaxed Boxy</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">L</td>
                  <td className="p-3">46"</td>
                  <td className="p-3">30.5"</td>
                  <td className="p-3">23.5"</td>
                  <td className="p-3 font-semibold text-luxury-gold">Oversized Drop</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">XL</td>
                  <td className="p-3">48"</td>
                  <td className="p-3">31.5"</td>
                  <td className="p-3">24.5"</td>
                  <td className="p-3 font-semibold text-luxury-gold">Oversized Drop</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">XXL</td>
                  <td className="p-3">50"</td>
                  <td className="p-3">32.5"</td>
                  <td className="p-3">25.5"</td>
                  <td className="p-3 font-semibold text-luxury-gold">Ultra Oversized</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-white border border-luxury-border text-[11px] text-gray-600 leading-relaxed">
            <p className="font-bold uppercase tracking-wider text-luxury-black mb-1">Fit & Care Recommendation:</p>
            <p>• Our <strong>Oversized Tees</strong> feature dropped shoulders and a wide boxy body width. Stick to your true size for the intended streetwear drape, or size down for a standard fit.</p>
            <p>• Pre-shrunk 280 GSM organic cotton. Machine wash cold with similar colors; lay flat to dry.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
