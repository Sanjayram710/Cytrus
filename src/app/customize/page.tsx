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
  Scissors,
  ArrowLeft,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import RealisticTShirt from '@/components/RealisticTShirt';
import {
  CUT_OPTIONS,
  COLOR_OPTIONS,
  PLACEMENT_OPTIONS,
  FONT_OPTIONS,
  GRAPHIC_PRESETS,
  SIZE_OPTIONS,
  calculatePrice,
  calculateSizeSurcharge,
  CustomizerSelections,
  CustomizerGraphicOption,
} from '@/lib/customizerPricing';

export default function CustomizePage() {
  const { addItem, openCart } = useCartStore();

  // Selection States
  const [selectedCut, setSelectedCut] = useState(CUT_OPTIONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedPlacement, setSelectedPlacement] = useState(PLACEMENT_OPTIONS[0]);
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');

  // Typography States
  const [headlineText, setHeadlineText] = useState('CYTRUS ATELIER');
  const [taglineText, setTaglineText] = useState('LIMITED BESPOKE DROP / 2026');
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
  const [textScale, setTextScale] = useState<'sm' | 'md' | 'lg'>('md');

  // Graphic States
  const [selectedGraphic, setSelectedGraphic] = useState<CustomizerGraphicOption>(GRAPHIC_PRESETS[0]);
  const [customUploadUrl, setCustomUploadUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Size State & Feedback
  const [selectedSize, setSelectedSize] = useState('L');
  const [isOrdering, setIsOrdering] = useState(false);

  // Auto-sync view side when placement changes
  const handlePlacementChange = (p: typeof PLACEMENT_OPTIONS[0]) => {
    setSelectedPlacement(p);
    setViewSide(p.viewSide);
  };

  // Pure Pricing Calculation
  const currentSelections: CustomizerSelections = {
    cut: selectedCut,
    color: selectedColor,
    placement: selectedPlacement,
    headlineText,
    taglineText,
    font: selectedFont,
    textScale,
    graphic: selectedGraphic,
    size: selectedSize,
  };

  const livePrice = calculatePrice(currentSelections);
  const sizeSurcharge = calculateSizeSurcharge(selectedSize);

  // Reset to initial default selections
  const handleResetDesign = () => {
    setSelectedCut(CUT_OPTIONS[0]);
    setSelectedColor(COLOR_OPTIONS[0]);
    setSelectedPlacement(PLACEMENT_OPTIONS[0]);
    setViewSide('front');
    setHeadlineText('CYTRUS ATELIER');
    setTaglineText('LIMITED BESPOKE DROP / 2026');
    setSelectedFont(FONT_OPTIONS[0]);
    setTextScale('md');
    setSelectedGraphic(GRAPHIC_PRESETS[0]);
    setCustomUploadUrl('');
    setSelectedSize('L');
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setCustomUploadUrl(url);
      setSelectedGraphic({
        id: 'uploaded',
        name: 'Custom User Artwork',
        icon: '🎨',
        previewUrl: url,
        surcharge: 200,
        isUpload: true,
      });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Add Custom Tee to Cart via Existing Hook
  const handleOrderCustomProduct = () => {
    setIsOrdering(true);

    const customItemPayload = {
      productId: `custom-tee-${Date.now()}`,
      productName: `Custom ${selectedCut.name}`,
      productImage:
        selectedGraphic.previewUrl ||
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
      size: selectedSize,
      color: selectedColor.name,
      price: livePrice,
      quantity: 1,
    };

    addItem(customItemPayload);

    setTimeout(() => {
      setIsOrdering(false);
      openCart();
    }, 450);
  };

  return (
    <div className="bg-canvas min-h-screen">
      {/* Studio Header Bar: Back Arrow, Centered "Personalise this", Live Price & Reset */}
      <section className="border-b border-border py-6 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left: Back Navigation Arrow */}
            <div className="flex items-center self-start md:self-center">
              <Link
                href="/shop"
                className="flex items-center space-x-2 text-ink hover:text-accent font-mono text-xs uppercase tracking-wider transition-colors p-1"
                title="Back to Catalog"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </div>

            {/* Center: "Personalise this Freestyle Tee" Header */}
            <div className="text-center">
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-muted block mb-1">
                Personalise this
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-ink font-medium tracking-tight">
                {selectedCut.name}
              </h1>
              <p className="font-mono text-[11px] sm:text-xs text-muted mt-1 max-w-lg mx-auto">
                Make this T-Shirt truly yours by getting something printed on it.
              </p>
            </div>

            {/* Right: Reset & Live Price Readout */}
            <div className="flex items-center space-x-3 self-end md:self-center">
              <button
                type="button"
                onClick={handleResetDesign}
                className="flex items-center space-x-1.5 font-mono text-[11px] text-muted hover:text-ink px-3 py-1.5 border border-border bg-surface transition-colors uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>

              <div className="font-mono text-right bg-surface px-3 py-1.5 border border-border">
                <span className="text-[9px] text-muted uppercase block tracking-wider leading-none mb-0.5">Total</span>
                <span className="text-sm sm:text-base font-semibold text-accent leading-none">{formatPrice(livePrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Studio Workspace: 2-Column Split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT 7 COLS: Live Realistic T-Shirt Preview Mockup Panel */}
          <div className="lg:col-span-7 flex flex-col items-center lg:sticky lg:top-24">
            
            {/* View Switcher Controls */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex space-x-2 font-mono text-xs uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setViewSide('front')}
                  className={`px-4 py-1.5 border transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                    viewSide === 'front'
                      ? 'bg-ink text-canvas border-ink font-semibold'
                      : 'bg-surface text-muted border-border hover:text-ink'
                  }`}
                >
                  Front View
                </button>
                <button
                  type="button"
                  onClick={() => setViewSide('back')}
                  className={`px-4 py-1.5 border transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                    viewSide === 'back'
                      ? 'bg-ink text-canvas border-ink font-semibold'
                      : 'bg-surface text-muted border-border hover:text-ink'
                  }`}
                >
                  Back View
                </button>
              </div>

              <span className="font-mono text-[11px] text-muted uppercase tracking-widest hidden sm:inline">
                {selectedColor.name} · Heavyweight French Terry
              </span>
            </div>

            {/* Realistic T-Shirt Mockup on Subtle Dotted-Grid Background */}
            <div className="relative w-full aspect-[4/5] max-w-[500px] border border-border bg-[#F5F2EB] flex items-center justify-center p-6 shadow-sm overflow-hidden rounded-none">
              {/* Subtle Dotted-Grid Canvas Background */}
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#2E2822_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Realistic T-Shirt Garment with Real Drapery & Live Print Render */}
              <RealisticTShirt
                viewSide={viewSide}
                color={selectedColor}
                placement={selectedPlacement}
                headlineText={headlineText}
                taglineText={taglineText}
                font={selectedFont}
                textScale={textScale}
                graphic={selectedGraphic}
              />
            </div>

            {/* Garment Highlights Pillars Under Mockup */}
            <div className="w-full grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border font-mono text-center text-xs text-muted">
              <div>
                <span className="text-ink font-semibold block text-[11px] uppercase">100% Combed Cotton</span>
                <span className="text-[10px]">Pre-shrunk heavyweight French Terry</span>
              </div>
              <div>
                <span className="text-ink font-semibold block text-[11px] uppercase">Screen Pigment Dye</span>
                <span className="text-[10px]">Permanent wash-fast cured print</span>
              </div>
              <div>
                <span className="text-ink font-semibold block text-[11px] uppercase">Atelier Inspection</span>
                <span className="text-[10px]">Individually numbered tag</span>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: Step-by-Step Configuration Options Panel */}
          <div className="lg:col-span-5 space-y-8 bg-surface border border-border p-6 sm:p-8">
            
            {/* STEP 1: Select Cut / Style */}
            <div>
              <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-3">
                <Scissors className="w-4 h-4 text-accent" />
                <span>Step 1 — Select Cut & Style</span>
              </div>
              <div className="space-y-2.5">
                {CUT_OPTIONS.map((cut) => (
                  <button
                    key={cut.id}
                    type="button"
                    onClick={() => setSelectedCut(cut)}
                    className={`w-full text-left p-3.5 border transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                      selectedCut.id === cut.id
                        ? 'border-accent bg-canvas shadow-sm'
                        : 'border-border bg-surface hover:border-accent/60'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-serif text-sm text-ink">{cut.name}</span>
                      <span className="font-mono text-xs font-semibold text-accent">
                        {formatPrice(cut.basePrice)}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-muted">{cut.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: Select Fabric / Color Swatch */}
            <div className="pt-2 border-t border-border">
              <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-3">
                <Palette className="w-4 h-4 text-accent" />
                <span>Step 2 — Select Fabric Color ({selectedColor.name})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`p-2.5 border flex items-center space-x-2 transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                      selectedColor.id === col.id
                        ? 'border-accent ring-1 ring-accent bg-canvas'
                        : 'border-border bg-surface hover:border-accent/60'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="font-mono text-[10px] text-ink truncate uppercase">
                      {col.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: Bespoke Typography */}
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                <Type className="w-4 h-4 text-accent" />
                <span>Step 3 — Bespoke Typography</span>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-muted mb-1">
                  Primary Headline Text
                </label>
                <input
                  type="text"
                  value={headlineText}
                  maxLength={28}
                  onChange={(e) => setHeadlineText(e.target.value)}
                  placeholder="e.g. CYTRUS ATELIER"
                  className="w-full bg-canvas border border-border p-2.5 font-sans text-xs text-ink focus:outline-none focus:border-accent uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-muted mb-1">
                  Secondary Tagline / Caption
                </label>
                <input
                  type="text"
                  value={taglineText}
                  maxLength={40}
                  onChange={(e) => setTaglineText(e.target.value)}
                  placeholder="e.g. LIMITED BESPOKE DROP / 2026"
                  className="w-full bg-canvas border border-border p-2.5 font-sans text-xs text-ink focus:outline-none focus:border-accent uppercase tracking-wider"
                />
              </div>

              {/* Font Style Picker (The card itself renders the actual font as preview) */}
              <div>
                <label className="block font-mono text-[10px] uppercase text-muted mb-1">
                  Typography Font Style (Card is Font Preview)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FONT_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFont(f)}
                      className={`p-2.5 border text-xs text-center transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                        selectedFont.id === f.id
                          ? 'border-accent bg-canvas font-semibold text-ink shadow-sm'
                          : 'border-border bg-surface text-muted hover:text-ink'
                      }`}
                    >
                      <span className={f.fontClass}>{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Scale Selector: S / M / L */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-[10px] uppercase text-muted">Print Text Scale:</span>
                <div className="flex space-x-1 font-mono text-[10px]">
                  {(['sm', 'md', 'lg'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setTextScale(sz)}
                      className={`px-3.5 py-1 border uppercase transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                        textScale === sz
                          ? 'bg-ink text-canvas border-ink font-semibold'
                          : 'border-border text-muted bg-canvas hover:text-ink'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 4: Graphic Artwork Placement */}
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                  <Layers className="w-4 h-4 text-accent" />
                  <span>Step 4 — Graphic Artwork & Placement</span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-mono text-[10px] uppercase text-accent hover:underline flex items-center space-x-1 focus:outline-none"
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

              {/* Preset Cards */}
              <div className="grid grid-cols-2 gap-2">
                {GRAPHIC_PRESETS.map((art) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => setSelectedGraphic(art)}
                    className={`p-2.5 border flex items-center space-x-2 text-left transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                      selectedGraphic.id === art.id
                        ? 'border-accent bg-canvas font-semibold text-ink shadow-sm'
                        : 'border-border bg-surface text-muted hover:text-ink'
                    }`}
                  >
                    <span className="text-base">{art.icon}</span>
                    <div className="truncate">
                      <span className="font-mono text-[10px] uppercase block truncate">{art.name}</span>
                      {art.surcharge > 0 && (
                        <span className="font-mono text-[9px] text-accent">+{formatPrice(art.surcharge)}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Placement Zone Grid */}
              <div>
                <label className="block font-mono text-[10px] uppercase text-muted mb-1">
                  Print Placement Zone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PLACEMENT_OPTIONS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePlacementChange(p)}
                      className={`p-2.5 border text-[11px] font-mono uppercase text-center transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                        selectedPlacement.id === p.id
                          ? 'border-accent bg-canvas font-semibold text-ink shadow-sm'
                          : 'border-border bg-surface text-muted hover:text-ink'
                      }`}
                    >
                      <span>{p.name}</span>
                      {p.surcharge > 0 && (
                        <span className="block text-[9px] text-accent mt-0.5">+{formatPrice(p.surcharge)}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 5: Size Selection */}
            <div className="pt-2 border-t border-border space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                    Step 5 — Select Size
                  </span>
                  <Link href="/shop" className="font-mono text-[10px] text-accent uppercase hover:underline">
                    Size Guide
                  </Link>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {SIZE_OPTIONS.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 font-mono text-xs uppercase font-semibold border transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                        selectedSize === sz
                          ? 'bg-ink text-canvas border-ink'
                          : 'bg-canvas text-ink border-border hover:border-accent'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                {sizeSurcharge > 0 && (
                  <p className="font-mono text-[10px] text-muted mt-1">
                    * XXL carries a +{formatPrice(sizeSurcharge)} fabric yarn surcharge.
                  </p>
                )}
              </div>

              {/* Order Action Button */}
              <button
                type="button"
                onClick={handleOrderCustomProduct}
                disabled={isOrdering}
                className="w-full bg-accent text-canvas py-4 font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:bg-ink transition-all border border-accent flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-ink"
              >
                {isOrdering ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Adding to Cart...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order Custom {selectedCut.name.split(' ')[0]} — {formatPrice(livePrice)}</span>
                  </>
                )}
              </button>

              {/* Trust Line */}
              <p className="font-mono text-[10px] text-muted text-center uppercase tracking-wider">
                Crafted to order in Bengaluru Atelier · Complimentary express shipping · Quality inspection guaranteed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
