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
  ArrowRight,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
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
      {/* Studio Header Bar */}
      <section className="border-b border-border py-6 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted mb-1">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>CYTRUS ATELIER · LIVE PRODUCT DESIGNER</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
                Bespoke Garment Customizer
              </h1>
              <p className="font-mono text-xs text-muted mt-1">
                Configure your cut, mineral wash, live typography, and placement in real-time.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleResetDesign}
                className="flex items-center space-x-1.5 font-mono text-xs text-muted hover:text-ink px-4 py-2 border border-border bg-canvas transition-colors uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Design</span>
              </button>

              {/* Persistent Live Price Readout */}
              <div className="font-mono text-right bg-canvas px-4 py-2 border border-border">
                <span className="text-[10px] text-muted uppercase block tracking-wider">Live Total</span>
                <span className="text-lg font-semibold text-accent">{formatPrice(livePrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Studio Workspace: 2-Column Split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT 7 COLS: Live Preview Mockup Panel (Sticky on Desktop) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:sticky lg:top-24">
            {/* View Switcher & Garment Badges */}
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
                {selectedCut.name.split(' ')[0]} {selectedCut.name.split(' ')[1]} Organic Cotton
              </span>
            </div>

            {/* Garment Mockup Container on Subtle Dotted-Grid Background */}
            <div
              className="relative w-full aspect-[4/5] max-w-[520px] border border-border flex items-center justify-center p-6 shadow-sm overflow-hidden transition-colors duration-500 rounded-none"
              style={{ backgroundColor: selectedColor.hex }}
            >
              {/* Subtle Dotted-Grid Background Tone */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Garment Vector Construction Simulation */}
              <div className="relative w-full h-full flex flex-col items-center justify-center select-none pointer-events-none">
                
                {/* Collar Neck Ribbing Simulation */}
                {viewSide === 'front' ? (
                  <div
                    className="w-32 h-10 border-b-4 border-l-2 border-r-2 rounded-b-full mb-auto mt-4 transition-colors duration-300"
                    style={{ borderColor: selectedColor.borderHex }}
                  />
                ) : (
                  <div
                    className="w-32 h-4 border-b-2 rounded-b-lg mb-auto mt-3 transition-colors duration-300"
                    style={{ borderColor: selectedColor.borderHex }}
                  />
                )}

                {/* Simulated Live Print Zone (Visible when placement matches current view side) */}
                {selectedPlacement.viewSide === viewSide && (
                  <div className={`absolute ${selectedPlacement.posClass} text-center transition-all duration-300 p-2 z-10 w-full`}>
                    
                    {/* Live Graphic Artwork Render */}
                    {selectedGraphic.previewUrl && (
                      <motion.div
                        key={selectedGraphic.previewUrl}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mx-auto mb-2 max-w-[130px] max-h-[130px] overflow-hidden rounded-none border border-black/10 shadow-sm"
                      >
                        <img
                          src={selectedGraphic.previewUrl}
                          alt="Graphic Artwork"
                          className="w-full h-full object-cover filter contrast-125"
                        />
                      </motion.div>
                    )}

                    {/* Live Headline Typography */}
                    {headlineText && (
                      <p
                        className={`${selectedFont.fontClass} uppercase transition-all duration-200 ${
                          textScale === 'sm'
                            ? 'text-sm'
                            : textScale === 'md'
                            ? 'text-lg sm:text-xl'
                            : 'text-2xl sm:text-3xl'
                        }`}
                        style={{ color: selectedColor.textColor }}
                      >
                        {headlineText}
                      </p>
                    )}

                    {/* Live Tagline Typography */}
                    {taglineText && (
                      <p
                        className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] mt-1 opacity-80"
                        style={{ color: selectedColor.textColor }}
                      >
                        {taglineText}
                      </p>
                    )}
                  </div>
                )}

                {/* Atelier Signature Woven Swing-Tag Badge on Hem */}
                <div className="mt-auto mb-3 flex items-center space-x-2 bg-canvas/85 backdrop-blur-sm border border-border px-3 py-1 text-[9px] font-mono text-ink">
                  <span className="font-bold uppercase tracking-widest">CYTRUS ATELIER</span>
                  <span className="text-muted">|</span>
                  <span className="text-accent">{selectedColor.name}</span>
                  <span className="text-muted">|</span>
                  <span>{selectedSize}</span>
                </div>
              </div>
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
