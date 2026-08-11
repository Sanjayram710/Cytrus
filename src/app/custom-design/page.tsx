'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Upload,
  Check,
  Type,
  Palette,
  Layers,
  Award,
  Truck,
  ShieldCheck,
  ChevronRight,
  Eye,
  Sliders,
  Scissors,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

// Color Options
const TEE_COLORS = [
  { id: 'sand-dune', name: 'Sand Dune (Warm Stone)', hex: '#EBE3D5', border: '#D5CCA8', textColor: '#2E2822' },
  { id: 'washed-espresso', name: 'Washed Espresso', hex: '#3B332B', border: '#5A4F44', textColor: '#FAF7F2' },
  { id: 'mineral-slate', name: 'Mineral Slate', hex: '#646D74', border: '#828B92', textColor: '#FAF7F2' },
  { id: 'vintage-chalk', name: 'Vintage Chalk', hex: '#F7F4EE', border: '#DFD9CB', textColor: '#2E2822' },
  { id: 'distressed-clay', name: 'Distressed Clay', hex: '#8C6753', border: '#AA826D', textColor: '#FAF7F2' },
  { id: 'obsidian-black', name: 'Obsidian Black', hex: '#1C1917', border: '#44403C', textColor: '#FAF7F2' },
];

// Silhouette / Cut Options
const SILHOUETTES = [
  {
    id: 'oversized-heavy',
    name: '300 GSM Oversized Drop-Shoulder',
    desc: 'Heavyweight organic French Terry with exaggerated drop shoulders & boxy drape.',
    price: 2499,
  },
  {
    id: 'vintage-boxy',
    name: '280 GSM Vintage Boxy Cut',
    desc: 'Slightly cropped waist with wide chest and relaxed collar.',
    price: 2299,
  },
  {
    id: 'raw-minimalist',
    name: '320 GSM Raw Edge Atelier Cut',
    desc: 'Ultra-dense combed cotton with distressed hems & ribbed collar.',
    price: 2699,
  },
];

// Print Placements
const PLACEMENTS = [
  { id: 'center-chest', name: 'Center Chest Graphic', posClass: 'top-[32%] left-1/2 -translate-x-1/2 max-w-[200px]' },
  { id: 'pocket-left', name: 'Left Pocket Minimal', posClass: 'top-[28%] left-[34%] max-w-[90px]' },
  { id: 'back-oversized', name: 'Full Back Statement', posClass: 'top-[26%] left-1/2 -translate-x-1/2 max-w-[220px]' },
  { id: 'lower-hem', name: 'Lower Hem Atelier Tag', posClass: 'bottom-[15%] left-[28%] max-w-[100px]' },
];

// Typography Fonts
const FONTS = [
  { id: 'serif', name: 'Editorial Serif', fontClass: 'font-serif' },
  { id: 'mono', name: 'Plex Monospace Stencil', fontClass: 'font-mono tracking-widest' },
  { id: 'sans-heavy', name: 'Brutalist Gothic', fontClass: 'font-sans font-black tracking-tight uppercase' },
  { id: 'classic', name: 'Modern Minimal', fontClass: 'font-sans font-medium tracking-[0.25em] uppercase' },
];

// Presets / Graphics
const ARTWORK_PRESETS = [
  { id: 'none', name: 'Typography Only', icon: 'Aa', preview: '' },
  {
    id: 'seal',
    name: 'CYTRUS Atelier Emblem',
    icon: '⚡',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'geometric',
    name: 'Minimalist Mineral Geometry',
    icon: '✦',
    preview: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'botanical',
    name: 'Acid Wash Floral Silhouette',
    icon: '🌿',
    preview: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=300',
  },
];

// Sizes
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function CustomDesignStudioPage() {
  const { addItem, openCart } = useCartStore();

  // Customization State
  const [selectedColor, setSelectedColor] = useState(TEE_COLORS[0]);
  const [selectedCut, setSelectedCut] = useState(SILHOUETTES[0]);
  const [placement, setPlacement] = useState(PLACEMENTS[0]);
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');
  
  // Custom Text State
  const [customText, setCustomText] = useState('CYTRUS ATELIER');
  const [subText, setSubText] = useState('LIMITED BESPOKE DROP / 2026');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [textColor, setTextColor] = useState('#2E2822');
  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Custom Artwork State
  const [selectedPreset, setSelectedPreset] = useState(ARTWORK_PRESETS[0]);
  const [customUploadUrl, setCustomUploadUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Garment Sizing & Adding
  const [selectedSize, setSelectedSize] = useState('L');
  const [isAdded, setIsAdded] = useState(false);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setCustomUploadUrl(reader.result as string);
      setSelectedPreset({ id: 'uploaded', name: 'Custom User Artwork', icon: '🎨', preview: reader.result as string });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Reset to default
  const handleReset = () => {
    setSelectedColor(TEE_COLORS[0]);
    setSelectedCut(SILHOUETTES[0]);
    setPlacement(PLACEMENTS[0]);
    setCustomText('CYTRUS ATELIER');
    setSubText('LIMITED BESPOKE DROP / 2026');
    setSelectedFont(FONTS[0]);
    setSelectedPreset(ARTWORK_PRESETS[0]);
    setCustomUploadUrl('');
    setSelectedSize('L');
  };

  // Add Bespoke Tee to Cart
  const handleAddToCart = () => {
    addItem({
      productId: `custom-tee-${Date.now()}`,
      productName: `Custom Bespoke Tee (${selectedCut.name})`,
      productImage:
        selectedPreset.preview ||
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
      size: selectedSize,
      color: selectedColor.name,
      price: selectedCut.price,
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      openCart();
    }, 600);
  };

  return (
    <div className="bg-canvas min-h-screen">
      {/* Studio Header */}
      <section className="border-b border-border py-8 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-[0.25em] text-muted mb-1">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>CYTRUS ATELIER STUDIO</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
                Bespoke T-Shirt Customizer
              </h1>
              <p className="font-mono text-xs text-muted mt-1">
                Engineer your custom heavyweight tee with curated mineral dye shades, bespoke typography, and graphic placements.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                className="flex items-center space-x-1.5 font-mono text-xs text-muted hover:text-ink px-4 py-2 border border-border bg-canvas transition-colors uppercase tracking-wider"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Design</span>
              </button>
              <div className="font-mono text-right">
                <span className="text-[10px] text-muted uppercase block">Estimated Price</span>
                <span className="text-lg font-semibold text-accent">{formatPrice(selectedCut.price)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Studio Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT 7 COLS: Interactive Real-Time T-Shirt Mockup Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* View Switcher & Controls */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex space-x-2 font-mono text-xs uppercase tracking-wider">
                <button
                  onClick={() => setViewSide('front')}
                  className={`px-4 py-1.5 border transition-all ${
                    viewSide === 'front' ? 'bg-ink text-canvas border-ink' : 'bg-surface text-muted border-border hover:text-ink'
                  }`}
                >
                  Front View
                </button>
                <button
                  onClick={() => setViewSide('back')}
                  className={`px-4 py-1.5 border transition-all ${
                    viewSide === 'back' ? 'bg-ink text-canvas border-ink' : 'bg-surface text-muted border-border hover:text-ink'
                  }`}
                >
                  Back View
                </button>
              </div>

              <span className="font-mono text-[11px] text-muted uppercase tracking-widest hidden sm:inline">
                Heavyweight 300 GSM Organic Cotton
              </span>
            </div>

            {/* Visual T-Shirt Mockup Box */}
            <div
              className="relative w-full aspect-[4/5] max-w-[500px] border border-border flex items-center justify-center p-6 shadow-sm overflow-hidden transition-colors duration-500 rounded-sm"
              style={{ backgroundColor: selectedColor.hex }}
            >
              {/* Subtle Fabric Grain Overlay */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* T-Shirt Silhouette Vector Mask Simulation */}
              <div className="relative w-full h-full flex flex-col items-center justify-center select-none pointer-events-none">
                {/* Crewneck Collar Detail */}
                <div
                  className="w-32 h-10 border-b-4 border-l-2 border-r-2 rounded-b-full mb-auto mt-4 transition-colors"
                  style={{ borderColor: selectedColor.border }}
                />

                {/* Simulated Custom Print Placement Area */}
                <div className={`absolute ${placement.posClass} text-center transition-all duration-300 p-2 z-10`}>
                  {/* Artwork Image if selected */}
                  {selectedPreset.preview && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mx-auto mb-2 max-w-[130px] max-h-[130px] overflow-hidden rounded-sm border border-black/10 shadow-sm"
                    >
                      <img
                        src={selectedPreset.preview}
                        alt="Custom Graphic"
                        className="w-full h-full object-cover filter contrast-125"
                      />
                    </motion.div>
                  )}

                  {/* Custom Typography */}
                  {customText && (
                    <p
                      className={`${selectedFont.fontClass} uppercase transition-all duration-200 ${
                        textSize === 'sm' ? 'text-sm' : textSize === 'md' ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'
                      }`}
                      style={{ color: textColor }}
                    >
                      {customText}
                    </p>
                  )}

                  {subText && (
                    <p
                      className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] mt-1 opacity-80"
                      style={{ color: textColor }}
                    >
                      {subText}
                    </p>
                  )}
                </div>

                {/* Atelier Woven Swing-Tag on Bottom Hem */}
                <div className="mt-auto mb-3 flex items-center space-x-2 bg-canvas/80 backdrop-blur-sm border border-border px-3 py-1 text-[9px] font-mono text-ink">
                  <span className="font-bold uppercase tracking-widest">CYTRUS ATELIER</span>
                  <span className="text-muted">|</span>
                  <span className="text-accent">{selectedColor.name}</span>
                </div>
              </div>
            </div>

            {/* Garment Highlights Pillars */}
            <div className="w-full grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border font-mono text-center text-xs text-muted">
              <div>
                <span className="text-ink font-semibold block text-[11px] uppercase">100% Combed Cotton</span>
                <span className="text-[10px]">Zero shrinkage weave</span>
              </div>
              <div>
                <span className="text-ink font-semibold block text-[11px] uppercase">Pigment Screen Print</span>
                <span className="text-[10px]">Fade-proof washability</span>
              </div>
              <div>
                <span className="text-ink font-semibold block text-[11px] uppercase">Dispatched in 48H</span>
                <span className="text-[10px]">Bespoke atelier queue</span>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: Studio Customization Controls Panel */}
          <div className="lg:col-span-5 space-y-8 bg-surface border border-border p-6 sm:p-8">
            {/* STEP 1: Silhouette / Cut Selector */}
            <div>
              <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-3">
                <Scissors className="w-4 h-4 text-accent" />
                <span>1. Select Silhouette Cut</span>
              </div>
              <div className="space-y-2.5">
                {SILHOUETTES.map((cut) => (
                  <button
                    key={cut.id}
                    onClick={() => setSelectedCut(cut)}
                    className={`w-full text-left p-3.5 border transition-all ${
                      selectedCut.id === cut.id
                        ? 'border-accent bg-canvas shadow-sm'
                        : 'border-border bg-surface hover:border-accent/60'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-serif text-sm text-ink">{cut.name}</span>
                      <span className="font-mono text-xs font-semibold text-accent">{formatPrice(cut.price)}</span>
                    </div>
                    <p className="font-mono text-[11px] text-muted">{cut.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: Base Fabric Color Palette */}
            <div>
              <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-3">
                <Palette className="w-4 h-4 text-accent" />
                <span>2. Fabric Mineral Wash Color ({selectedColor.name})</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {TEE_COLORS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      setSelectedColor(col);
                      setTextColor(col.textColor);
                    }}
                    className={`p-2.5 border flex items-center space-x-2 transition-all ${
                      selectedColor.id === col.id ? 'border-accent ring-1 ring-accent bg-canvas' : 'border-border bg-surface'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="font-mono text-[10px] text-ink truncate uppercase">{col.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: Custom Typography & Text */}
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                <Type className="w-4 h-4 text-accent" />
                <span>3. Bespoke Typography</span>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-muted mb-1">Primary Headline Text</label>
                <input
                  type="text"
                  value={customText}
                  maxLength={28}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. TOKYO ATELIER"
                  className="w-full bg-canvas border border-border p-2.5 font-sans text-xs text-ink focus:outline-none focus:border-accent uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-muted mb-1">Secondary Caption Tagline</label>
                <input
                  type="text"
                  value={subText}
                  maxLength={40}
                  onChange={(e) => setSubText(e.target.value)}
                  placeholder="e.g. LIMITED EDITION 2026"
                  className="w-full bg-canvas border border-border p-2.5 font-sans text-xs text-ink focus:outline-none focus:border-accent uppercase tracking-wider"
                />
              </div>

              {/* Font Style Selection */}
              <div>
                <label className="block font-mono text-[10px] uppercase text-muted mb-1">Typography Font Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFont(f)}
                      className={`p-2 border text-xs text-center transition-all ${
                        selectedFont.id === f.id
                          ? 'border-accent bg-canvas font-semibold text-ink'
                          : 'border-border bg-surface text-muted hover:text-ink'
                      }`}
                    >
                      <span className={f.fontClass}>{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Scale Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-[10px] uppercase text-muted">Print Text Scale:</span>
                <div className="flex space-x-1 font-mono text-[10px]">
                  {(['sm', 'md', 'lg'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setTextSize(sz)}
                      className={`px-3 py-1 border uppercase ${
                        textSize === sz ? 'bg-ink text-canvas border-ink' : 'border-border text-muted bg-canvas'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 4: Artwork & Graphic Selection */}
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                  <Layers className="w-4 h-4 text-accent" />
                  <span>4. Graphic Artwork Placement</span>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="font-mono text-[10px] uppercase text-accent hover:underline flex items-center space-x-1"
                >
                  <Upload className="w-3 h-3 mr-0.5" />
                  <span>{uploading ? 'Uploading...' : 'Upload Art'}</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="grid grid-cols-2 gap-2">
                {ARTWORK_PRESETS.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => setSelectedPreset(art)}
                    className={`p-2 border flex items-center space-x-2 text-left transition-all ${
                      selectedPreset.id === art.id
                        ? 'border-accent bg-canvas font-semibold text-ink'
                        : 'border-border bg-surface text-muted hover:text-ink'
                    }`}
                  >
                    <span className="text-base">{art.icon}</span>
                    <span className="font-mono text-[10px] uppercase truncate">{art.name}</span>
                  </button>
                ))}
              </div>

              {/* Placement Selector */}
              <div>
                <label className="block font-mono text-[10px] uppercase text-muted mb-1">Print Placement Zone</label>
                <div className="grid grid-cols-2 gap-2">
                  {PLACEMENTS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlacement(p)}
                      className={`p-2 border text-[11px] font-mono uppercase text-center transition-all ${
                        placement.id === p.id
                          ? 'border-accent bg-canvas font-semibold text-ink'
                          : 'border-border bg-surface text-muted hover:text-ink'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 5: Sizing & Add to Bag CTA */}
            <div className="pt-4 border-t border-border space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                    5. Select Oversized Size
                  </span>
                  <Link href="/shop" className="font-mono text-[10px] text-accent uppercase hover:underline">
                    Size Guide
                  </Link>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 font-mono text-xs uppercase font-semibold border transition-all ${
                        selectedSize === sz
                          ? 'bg-ink text-canvas border-ink'
                          : 'bg-canvas text-ink border-border hover:border-accent'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className="w-full bg-accent text-canvas py-4 font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:bg-ink transition-all border border-accent flex items-center justify-center space-x-2"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order Custom Tee — {formatPrice(selectedCut.price)}</span>
                  </>
                )}
              </button>

              <p className="font-mono text-[10px] text-muted text-center uppercase tracking-wider">
                Crafted to order in Bengaluru Atelier. Complimentary shipping & quality inspection guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
