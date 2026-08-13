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
import RealisticTShirt, { CustomizerSilhouette } from '@/components/RealisticTShirt';
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

const SILHOUETTE_OPTIONS: Array<{
  id: CustomizerSilhouette;
  name: string;
  cutId?: string;
  badge: string;
}> = [
  {
    id: 'oversized-tees',
    name: 'Oversized Tees',
    cutId: 'oversized-heavy',
    badge: 'Heavyweight Boxy Cut',
  },
  {
    id: 'graphic-tees',
    name: 'Graphic Tees',
    cutId: 'raw-minimalist',
    badge: 'Streetwear Graphic Cut',
  },
  {
    id: 'vintage-wash',
    name: 'Vintage Wash',
    cutId: 'vintage-boxy',
    badge: 'Acid Mineral Distressed',
  },
];

export default function CustomizePage() {
  const { addItem, openCart } = useCartStore();

  // Silhouette Category State (Oversized Tees / Graphic Tees / Vintage Wash)
  const [selectedSilhouette, setSelectedSilhouette] = useState<CustomizerSilhouette>('oversized-tees');

  // Selection States
  const [selectedCut, setSelectedCut] = useState(CUT_OPTIONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedPlacement, setSelectedPlacement] = useState(PLACEMENT_OPTIONS[0]);
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');

  // Typography States
  const [headlineText, setHeadlineText] = useState('CELEBRITEE ATELIER');
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

  // Sync placement when manually toggling front/back views
  const handleViewSideToggle = (side: 'front' | 'back') => {
    setViewSide(side);
    if (side === 'back' && selectedPlacement.viewSide !== 'back') {
      const backPlace = PLACEMENT_OPTIONS.find((p) => p.viewSide === 'back');
      if (backPlace) setSelectedPlacement(backPlace);
    } else if (side === 'front' && selectedPlacement.viewSide !== 'front') {
      const frontPlace = PLACEMENT_OPTIONS.find((p) => p.viewSide === 'front');
      if (frontPlace) setSelectedPlacement(frontPlace);
    }
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
    setSelectedSilhouette('oversized-tees');
    setSelectedCut(CUT_OPTIONS[0]);
    setSelectedColor(COLOR_OPTIONS[0]);
    setSelectedPlacement(PLACEMENT_OPTIONS[0]);
    setViewSide('front');
    setHeadlineText('CELEBRITEE ATELIER');
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
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setCustomUploadUrl(url);
      setSelectedGraphic({
        id: 'user-custom-upload',
        name: file.name.replace(/\.[^/.]+$/, '').slice(0, 18),
        icon: 'Upload',
        previewUrl: url,
        surcharge: 250,
        isUpload: true,
      });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Add Customized Tee to Cart Store
  const handleAddToCart = () => {
    setIsOrdering(true);

    const customItemPayload = {
      productId: `custom-${selectedSilhouette}-${selectedCut.id}`,
      productName: `Bespoke ${
        selectedSilhouette === 'vintage-wash'
          ? 'Vintage Wash'
          : selectedSilhouette === 'graphic-tees'
          ? 'Graphic Streetwear'
          : 'Oversized'
      } Tee (${selectedCut.name})`,
      productImage:
        selectedSilhouette === 'vintage-wash'
          ? '/mockups/tshirt_vintage_wash_front.png'
          : selectedSilhouette === 'graphic-tees'
          ? '/mockups/tshirt_graphic_front.png'
          : '/mockups/tshirt_black_front.png',
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
    <div className="bg-white min-h-screen">
      {/* Studio Header Bar: Back Arrow, Centered "Personalise this", Live Price & Reset */}
      <section className="border-b border-border py-6 bg-white">
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

            {/* Right: Live Total Price & Reset Action */}
            <div className="flex items-center space-x-4 self-end md:self-center">
              <button
                type="button"
                onClick={handleResetDesign}
                className="flex items-center space-x-1.5 font-mono text-xs text-muted hover:text-ink transition-colors p-1"
                title="Reset all design selections"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline uppercase">Reset</span>
              </button>

              <div className="border border-border bg-white px-4 py-2 font-mono text-right">
                <span className="text-[10px] text-muted block uppercase tracking-wider">Estimated Total</span>
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
            
            {/* 3 SILHOUETTE OPTIONS: OVERSIZED TEES | GRAPHIC TEES | VINTAGE WASH */}
            <div className="w-full mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted font-medium">
                  Select Silhouette Style
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink font-semibold">
                  {SILHOUETTE_OPTIONS.find((s) => s.id === selectedSilhouette)?.name}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-1 bg-white border border-border">
                {SILHOUETTE_OPTIONS.map((sil) => {
                  const isSelected = selectedSilhouette === sil.id;
                  return (
                    <button
                      key={sil.id}
                      type="button"
                      onClick={() => {
                        setSelectedSilhouette(sil.id);
                        if (sil.cutId) {
                          const matchedCut = CUT_OPTIONS.find((c) => c.id === sil.cutId);
                          if (matchedCut) setSelectedCut(matchedCut);
                        }
                      }}
                      className={`py-2 px-2 sm:px-3 text-center transition-all font-mono text-[10px] sm:text-[11px] uppercase tracking-wider ${
                        isSelected
                          ? 'bg-ink text-white font-bold shadow-sm'
                          : 'text-muted hover:text-ink hover:bg-slate-50'
                      }`}
                    >
                      {sil.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* View Switcher Controls (Front / Back) */}
            <div className="w-full flex items-center justify-between mb-3">
              <div className="flex space-x-2 font-mono text-xs uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => handleViewSideToggle('front')}
                  className={`px-4 py-1.5 border transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                    viewSide === 'front'
                      ? 'bg-ink text-white border-ink font-semibold'
                      : 'bg-white text-muted border-border hover:text-ink'
                  }`}
                >
                  Front View
                </button>
                <button
                  type="button"
                  onClick={() => handleViewSideToggle('back')}
                  className={`px-4 py-1.5 border transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                    viewSide === 'back'
                      ? 'bg-ink text-white border-ink font-semibold'
                      : 'bg-white text-muted border-border hover:text-ink'
                  }`}
                >
                  Back View
                </button>
              </div>

              <span className="font-mono text-[11px] text-muted uppercase tracking-widest hidden sm:inline">
                {selectedSilhouette === 'vintage-wash'
                  ? 'Mineral Acid Wash · 240 GSM'
                  : selectedSilhouette === 'graphic-tees'
                  ? 'Graphic Atelier · 240 GSM'
                  : `${selectedColor.name} · 240 GSM`}
              </span>
            </div>

            {/* Realistic T-Shirt Mockup on Pure White Background */}
            <div className="relative w-full aspect-[4/5] max-w-[500px] border border-border flex items-center justify-center p-6 shadow-sm overflow-hidden rounded-none bg-white">
              {/* Subtle Dotted-Grid Canvas Background */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2E2822_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Realistic T-Shirt Garment with Real Drapery & Live Print Render */}
              <RealisticTShirt
                silhouette={selectedSilhouette}
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
                <span className="text-[10px]">Pre-shrunk 240 GSM French Terry</span>
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
          <div className="lg:col-span-5 space-y-8 bg-white border border-border p-6 sm:p-8 shadow-sm">
            
            {/* STEP 1: Select Cut / Style */}
            <div>
              <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-3">
                <Scissors className="w-4 h-4 text-accent" />
                <span>Step 1 — Select Cut &amp; Style</span>
              </div>
              <div className="space-y-2.5">
                {CUT_OPTIONS.map((cut) => (
                  <button
                    key={cut.id}
                    type="button"
                    onClick={() => setSelectedCut(cut)}
                    className={`w-full text-left p-3.5 border transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                      selectedCut.id === cut.id
                        ? 'border-accent bg-slate-50 shadow-sm'
                        : 'border-border bg-white hover:border-accent/60'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-serif text-sm font-medium text-ink">{cut.name}</span>
                      <span className="font-mono text-xs font-semibold text-accent">{formatPrice(cut.basePrice)}</span>
                    </div>
                    <p className="text-xs text-muted font-sans leading-relaxed">{cut.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: Color Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                  <Palette className="w-4 h-4 text-accent" />
                  <span>Step 2 — Base Color Tone</span>
                </div>
                <span className="font-mono text-xs text-muted font-medium">{selectedColor.name}</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`p-3 border text-center transition-all flex flex-col items-center space-y-2 focus:outline-none focus:ring-1 focus:ring-accent ${
                      selectedColor.id === col.id
                        ? 'border-accent bg-slate-50 shadow-sm'
                        : 'border-border bg-white hover:border-accent/60'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full shadow-inner border"
                      style={{ backgroundColor: col.hex, borderColor: col.borderHex }}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink line-clamp-1">
                      {col.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: Print Placement */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                  <Layers className="w-4 h-4 text-accent" />
                  <span>Step 3 — Print Placement</span>
                </div>
                <span className="font-mono text-xs text-accent">
                  {selectedPlacement.surcharge > 0 ? `+${formatPrice(selectedPlacement.surcharge)}` : 'Included'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {PLACEMENT_OPTIONS.map((place) => (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => handlePlacementChange(place)}
                    className={`p-3 border text-left transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                      selectedPlacement.id === place.id
                        ? 'border-accent bg-slate-50 shadow-sm'
                        : 'border-border bg-white hover:border-accent/60'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-xs uppercase tracking-wider text-ink font-medium">
                        {place.name}
                      </span>
                      <span className="font-mono text-[10px] text-muted">({place.viewSide.toUpperCase()})</span>
                    </div>
                    <span className="font-mono text-[11px] text-accent">
                      {place.surcharge > 0 ? `+${formatPrice(place.surcharge)}` : 'Free'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 4: Typography & Headlines */}
            <div>
              <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-3">
                <Type className="w-4 h-4 text-accent" />
                <span>Step 4 — Typography &amp; Headlines</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-1">
                    Primary Headline
                  </label>
                  <input
                    type="text"
                    value={headlineText}
                    maxLength={32}
                    onChange={(e) => setHeadlineText(e.target.value)}
                    placeholder="Enter headline (e.g. CELEBRITEE ATELIER)"
                    className="w-full bg-white border border-border px-3.5 py-2.5 text-xs text-ink font-mono focus:border-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-1">
                    Secondary Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={taglineText}
                    maxLength={48}
                    onChange={(e) => setTaglineText(e.target.value)}
                    placeholder="Enter subtitle (e.g. LIMITED BESPOKE DROP / 2026)"
                    className="w-full bg-white border border-border px-3.5 py-2.5 text-xs text-ink font-mono focus:border-ink focus:outline-none"
                  />
                </div>

                {/* Font Selector */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">
                    Typeface Font Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_OPTIONS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFont(f)}
                        className={`p-2.5 border text-center transition-all ${
                          selectedFont.id === f.id
                            ? 'border-accent bg-slate-50 font-bold'
                            : 'border-border bg-white hover:border-accent/60'
                        }`}
                      >
                        <span className={`${f.fontClass} text-xs block text-ink`}>{f.name}</span>
                        <span className="font-mono text-[9px] text-muted uppercase tracking-wider">Preview Typography</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Scale Buttons */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-1">
                    Print Scale
                  </label>
                  <div className="flex space-x-2">
                    {(['sm', 'md', 'lg'] as const).map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => setTextScale(scale)}
                        className={`flex-1 py-1.5 border font-mono text-xs uppercase tracking-wider transition-all ${
                          textScale === scale
                            ? 'bg-ink text-white border-ink font-semibold'
                            : 'bg-white text-muted border-border hover:text-ink'
                        }`}
                      >
                        {scale === 'sm' ? 'Compact' : scale === 'md' ? 'Regular' : 'Oversized'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 5: Artwork & Graphics */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Step 5 — Artwork &amp; Emblems</span>
                </div>
                <span className="font-mono text-xs text-accent">
                  {selectedGraphic.surcharge > 0 ? `+${formatPrice(selectedGraphic.surcharge)}` : 'None'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {GRAPHIC_PRESETS.map((grp) => (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => setSelectedGraphic(grp)}
                    className={`p-2.5 border text-center transition-all flex flex-col items-center space-y-1.5 ${
                      selectedGraphic.id === grp.id
                        ? 'border-accent bg-slate-50 shadow-sm'
                        : 'border-border bg-white hover:border-accent/60'
                    }`}
                  >
                    {grp.previewUrl ? (
                      <div className="w-10 h-10 overflow-hidden border border-border bg-white">
                        <img src={grp.previewUrl} alt={grp.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center border border-border text-muted font-mono text-[10px]">
                        None
                      </div>
                    )}
                    <span className="font-mono text-[9px] uppercase tracking-wider text-ink line-clamp-1">
                      {grp.name}
                    </span>
                    <span className="font-mono text-[9px] text-accent">
                      {grp.surcharge > 0 ? `+${formatPrice(grp.surcharge)}` : 'Free'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Image Upload */}
              <div className="border border-dashed border-border p-4 text-center bg-white hover:border-ink transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center space-x-2 font-mono text-xs uppercase tracking-wider text-ink hover:text-accent"
                >
                  <Upload className="w-4 h-4 text-accent" />
                  <span>{uploading ? 'Processing Artwork...' : 'Upload Custom Image (+₹250)'}</span>
                </button>
                <p className="font-mono text-[9px] text-muted mt-1">Supports transparent PNG, JPEG &amp; WebP up to 10MB</p>
              </div>
            </div>

            {/* STEP 6: Size Selection & Surcharge Warning */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                  Step 6 — Select Size
                </span>
                {sizeSurcharge > 0 && (
                  <span className="font-mono text-[10px] text-accent font-semibold">
                    +{formatPrice(sizeSurcharge)} XXL Fabric Surcharge
                  </span>
                )}
              </div>

              <div className="grid grid-cols-5 gap-2">
                {SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 border font-mono text-xs uppercase tracking-wider transition-all ${
                      selectedSize === size
                        ? 'bg-ink text-white border-ink font-bold shadow-sm'
                        : 'bg-white text-muted border-border hover:text-ink'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ORDER & PRICING BREAKDOWN DRAWER */}
            <div className="border-t border-border pt-6 space-y-4 font-mono">
              <div className="bg-slate-50 p-4 border border-border space-y-2 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Base Garment ({selectedCut.name})</span>
                  <span>{formatPrice(selectedCut.basePrice)}</span>
                </div>

                {selectedPlacement.surcharge > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>Placement ({selectedPlacement.name})</span>
                    <span>+{formatPrice(selectedPlacement.surcharge)}</span>
                  </div>
                )}

                {selectedGraphic.surcharge > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>Custom Graphic ({selectedGraphic.name})</span>
                    <span>+{formatPrice(selectedGraphic.surcharge)}</span>
                  </div>
                )}

                {sizeSurcharge > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>Size Surcharge ({selectedSize})</span>
                    <span>+{formatPrice(sizeSurcharge)}</span>
                  </div>
                )}

                <div className="flex justify-between text-ink font-bold pt-2 border-t border-border text-sm">
                  <span>Total Bespoke Price</span>
                  <span className="text-accent">{formatPrice(livePrice)}</span>
                </div>
              </div>

              {/* Add To Bag CTA Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOrdering}
                className="w-full bg-ink text-white py-4 uppercase font-mono text-xs tracking-[0.2em] font-semibold hover:bg-accent transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-75"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOrdering ? 'Crafting Atelier Piece...' : `Add To Bag · ${formatPrice(livePrice)}`}</span>
              </button>

              <div className="flex items-center justify-center space-x-4 text-center text-[10px] text-muted pt-2 font-mono">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>Tailored On-Demand in 48 Hours</span>
                </span>
                <span>•</span>
                <span>Free Express Shipping</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
