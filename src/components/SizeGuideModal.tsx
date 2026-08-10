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
            LUXEWEAR Size Guide
          </h2>
          <p className="text-xs uppercase tracking-widest text-luxury-gold mb-6 font-semibold">
            Standard Luxury Couture Measurements (Inches)
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-luxury-black bg-luxury-beige/50 text-luxury-black font-serif uppercase tracking-widest">
                  <th className="p-3">Size</th>
                  <th className="p-3">Bust (In)</th>
                  <th className="p-3">Waist (In)</th>
                  <th className="p-3">Hip (In)</th>
                  <th className="p-3">UK / IND</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-border text-luxury-black font-medium">
                <tr>
                  <td className="p-3 font-bold">XS</td>
                  <td className="p-3">31 - 32.5</td>
                  <td className="p-3">24 - 25.5</td>
                  <td className="p-3">34 - 35.5</td>
                  <td className="p-3">6 - 8</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">S</td>
                  <td className="p-3">33 - 34.5</td>
                  <td className="p-3">26 - 27.5</td>
                  <td className="p-3">36 - 37.5</td>
                  <td className="p-3">8 - 10</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">M</td>
                  <td className="p-3">35 - 36.5</td>
                  <td className="p-3">28 - 29.5</td>
                  <td className="p-3">38 - 39.5</td>
                  <td className="p-3">10 - 12</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">L</td>
                  <td className="p-3">37 - 39.0</td>
                  <td className="p-3">30 - 32.0</td>
                  <td className="p-3">40 - 42.0</td>
                  <td className="p-3">12 - 14</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">XL</td>
                  <td className="p-3">40 - 42.0</td>
                  <td className="p-3">33 - 35.0</td>
                  <td className="p-3">43 - 45.0</td>
                  <td className="p-3">14 - 16</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">XXL</td>
                  <td className="p-3">43 - 45.0</td>
                  <td className="p-3">36 - 38.0</td>
                  <td className="p-3">46 - 48.0</td>
                  <td className="p-3">16 - 18</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-white border border-luxury-border text-[11px] text-gray-600 leading-relaxed">
            <p className="font-bold uppercase tracking-wider text-luxury-black mb-1">How to Measure:</p>
            <p><strong>Bust:</strong> Measure around the fullest part of your bust.</p>
            <p><strong>Waist:</strong> Measure around your natural waistline, keeping tape comfortably loose.</p>
            <p><strong>Hips:</strong> Measure around the fullest part of your hips.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
