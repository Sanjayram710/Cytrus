'use client';

import React, { useState } from 'react';
import { X, Ruler, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  const measurementsInches = [
    { size: 'S', chest: '42 - 44', length: '28.5', shoulder: '21.0', sleeve: '9.0' },
    { size: 'M', chest: '44 - 46', length: '29.5', shoulder: '22.0', sleeve: '9.5' },
    { size: 'L', chest: '46 - 48', length: '30.5', shoulder: '23.0', sleeve: '10.0' },
    { size: 'XL', chest: '48 - 50', length: '31.5', shoulder: '24.0', sleeve: '10.5' },
    { size: 'XXL', chest: '50 - 52', length: '32.5', shoulder: '25.0', sleeve: '11.0' },
  ];

  const measurementsCm = [
    { size: 'S', chest: '106 - 112', length: '72.4', shoulder: '53.3', sleeve: '22.8' },
    { size: 'M', chest: '112 - 117', length: '74.9', shoulder: '55.8', sleeve: '24.1' },
    { size: 'L', chest: '117 - 122', length: '77.5', shoulder: '58.4', sleeve: '25.4' },
    { size: 'XL', chest: '122 - 127', length: '80.0', shoulder: '61.0', sleeve: '26.7' },
    { size: 'XXL', chest: '127 - 132', length: '82.5', shoulder: '63.5', sleeve: '28.0' },
  ];

  const currentData = unit === 'inches' ? measurementsInches : measurementsCm;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-charcoal">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white border border-border overflow-hidden z-10 shadow-2xl rounded-2xl text-charcoal"
        >
          {/* Header */}
          <div className="p-6 border-b border-border bg-surface-tint flex items-center justify-between text-charcoal">
            <div className="flex items-center space-x-2">
              <Ruler className="w-5 h-5 text-royal" />
              <h2 className="font-serif text-xl font-normal tracking-tight text-charcoal">
                CELEBRITEE Boxy Streetwear Size Guide
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-charcoal transition-colors rounded-md bg-white border border-border"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 text-charcoal">
            {/* Editorial Fit Description */}
            <div className="p-4 bg-surface-tint border border-border rounded-xl space-y-1.5 font-mono text-xs text-charcoal">
              <div className="flex items-center space-x-2 text-charcoal font-bold">
                <Sparkles className="w-4 h-4 text-pink" />
                <span className="uppercase tracking-wider">Bespoke Boxy Oversized Silhouette</span>
              </div>
              <p className="text-muted leading-relaxed font-sans text-xs">
                All CELEBRITEE collaboration tees are custom-patterned with a generous drop-shoulder, widened chest, and structured drape. 
                For the intended designer boxy fit, choose your normal size. For a tailored standard fit, choose one size down.
              </p>
            </div>

            {/* Unit Toggle */}
            <div className="flex items-center justify-between text-charcoal">
              <span className="font-mono text-xs uppercase font-bold tracking-wider text-charcoal">
                Garment Measurement Table
              </span>
              <div className="inline-flex border border-border rounded-md overflow-hidden font-mono text-xs">
                <button
                  onClick={() => setUnit('inches')}
                  className={`px-3 py-1.5 transition-colors uppercase font-bold ${
                    unit === 'inches' ? 'bg-royal text-white' : 'bg-surface-tint text-charcoal hover:bg-slate-200'
                  }`}
                >
                  Inches (")
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1.5 transition-colors uppercase font-bold ${
                    unit === 'cm' ? 'bg-royal text-white' : 'bg-surface-tint text-charcoal hover:bg-slate-200'
                  }`}
                >
                  Centimeters (CM)
                </button>
              </div>
            </div>

            {/* Sizing Table */}
            <div className="border border-border overflow-hidden rounded-xl">
              <table className="w-full text-left font-mono text-xs text-charcoal">
                <thead className="bg-surface-tint border-b border-border text-muted uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3 font-bold text-charcoal">Size</th>
                    <th className="p-3">Chest Circumference</th>
                    <th className="p-3">Body Length</th>
                    <th className="p-3">Shoulder Width</th>
                    <th className="p-3">Sleeve Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-charcoal">
                  {currentData.map((row) => (
                    <tr key={row.size} className="hover:bg-surface-tint transition-colors">
                      <td className="p-3 font-bold text-charcoal">{row.size}</td>
                      <td className="p-3 text-muted">{row.chest}</td>
                      <td className="p-3 text-muted">{row.length}</td>
                      <td className="p-3 text-muted">{row.shoulder}</td>
                      <td className="p-3 text-muted">{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
