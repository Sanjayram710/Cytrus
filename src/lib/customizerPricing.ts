/**
 * Pure Pricing Calculation Engine for CYTRUS Bespoke Product Designer
 * Computes live, client-side, pure function of current selections.
 */

export interface CustomizerCutOption {
  id: string;
  name: string;
  desc: string;
  basePrice: number;
}

export interface CustomizerColorOption {
  id: string;
  name: string;
  hex: string;
  borderHex: string;
  textColor: string;
}

export interface CustomizerPlacementOption {
  id: string;
  name: string;
  viewSide: 'front' | 'back';
  posClass: string;
  surcharge: number;
}

export interface CustomizerFontOption {
  id: string;
  name: string;
  fontClass: string;
}

export interface CustomizerGraphicOption {
  id: string;
  name: string;
  icon: string;
  previewUrl: string;
  surcharge: number;
  isUpload?: boolean;
}

export interface CustomizerSelections {
  cut: CustomizerCutOption;
  color: CustomizerColorOption;
  placement: CustomizerPlacementOption;
  headlineText: string;
  taglineText: string;
  font: CustomizerFontOption;
  textScale: 'sm' | 'md' | 'lg';
  graphic: CustomizerGraphicOption;
  size: string;
}

export const CUT_OPTIONS: CustomizerCutOption[] = [
  {
    id: 'oversized-heavy',
    name: '240 GSM Oversized Drop-Shoulder',
    desc: 'Heavyweight organic French Terry with exaggerated drop shoulders & boxy drape.',
    basePrice: 2499,
  },
  {
    id: 'vintage-boxy',
    name: '240 GSM Vintage Boxy Cut',
    desc: 'Slightly cropped waist with wide chest and relaxed reinforced collar.',
    basePrice: 2299,
  },
  {
    id: 'raw-minimalist',
    name: '240 GSM Raw Edge Atelier Cut',
    desc: 'Ultra-dense combed cotton with distressed raw hems & heavy ribbing.',
    basePrice: 2699,
  },
];

export const COLOR_OPTIONS: CustomizerColorOption[] = [
  { id: 'sand-dune', name: 'Sand Dune (Warm Stone)', hex: '#EBE3D5', borderHex: '#D5CCA8', textColor: '#2E2822' },
  { id: 'washed-espresso', name: 'Washed Espresso', hex: '#3B332B', borderHex: '#5A4F44', textColor: '#FAF7F2' },
  { id: 'mineral-slate', name: 'Mineral Slate', hex: '#646D74', borderHex: '#828B92', textColor: '#FAF7F2' },
  { id: 'vintage-chalk', name: 'Vintage Chalk', hex: '#F7F4EE', borderHex: '#DFD9CB', textColor: '#2E2822' },
  { id: 'distressed-clay', name: 'Distressed Clay', hex: '#8C6753', borderHex: '#AA826D', textColor: '#FAF7F2' },
  { id: 'obsidian-black', name: 'Obsidian Black', hex: '#1C1917', borderHex: '#44403C', textColor: '#FAF7F2' },
];

export const PLACEMENT_OPTIONS: CustomizerPlacementOption[] = [
  {
    id: 'center-chest',
    name: 'Center Chest Graphic',
    viewSide: 'front',
    posClass: 'top-[34%] left-1/2 -translate-x-1/2 w-[60%] max-w-[210px]',
    surcharge: 0,
  },
  {
    id: 'pocket-left',
    name: 'Left Pocket Minimal',
    viewSide: 'front',
    posClass: 'top-[28%] left-[28%] w-[26%] max-w-[90px]',
    surcharge: 0,
  },
  {
    id: 'back-oversized',
    name: 'Full Back Statement',
    viewSide: 'back',
    posClass: 'top-[26%] left-1/2 -translate-x-1/2 w-[70%] max-w-[230px]',
    surcharge: 100, // Premium for large surface area back print
  },
  {
    id: 'lower-hem',
    name: 'Lower Hem Atelier Tag',
    viewSide: 'front',
    posClass: 'bottom-[14%] left-[25%] w-[30%] max-w-[100px]',
    surcharge: 0,
  },
];

export const FONT_OPTIONS: CustomizerFontOption[] = [
  { id: 'serif', name: 'Editorial Serif', fontClass: 'font-serif' },
  { id: 'mono', name: 'Monospace Stencil', fontClass: 'font-mono tracking-widest' },
  { id: 'gothic', name: 'Brutalist Gothic', fontClass: 'font-sans font-black tracking-tight uppercase' },
  { id: 'clean', name: 'Modern Clean Sans', fontClass: 'font-sans font-medium tracking-[0.25em] uppercase' },
];

export const GRAPHIC_PRESETS: CustomizerGraphicOption[] = [
  {
    id: 'none',
    name: 'Typography Only',
    icon: 'Aa',
    previewUrl: '',
    surcharge: 0,
  },
  {
    id: 'emblem',
    name: 'CYTRUS Atelier Emblem',
    icon: '⚡',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300',
    surcharge: 150,
  },
  {
    id: 'geometric',
    name: 'Mineral Geometric Mark',
    icon: '✦',
    previewUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=300',
    surcharge: 150,
  },
  {
    id: 'botanical',
    name: 'Botanical Acid Wash',
    icon: '🌿',
    previewUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=300',
    surcharge: 150,
  },
];

export const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'] as const;

/**
 * Size Surcharge: XXL carries a small +₹150 fabric surcharge for extra heavy terry yardage
 */
export function calculateSizeSurcharge(size: string): number {
  if (size === 'XXL') return 150;
  return 0;
}

/**
 * Pure Pricing Calculation Function
 * total = baseCutPrice + placementSurcharge + graphicSurcharge + sizeSurcharge
 */
export function calculatePrice(selections: CustomizerSelections): number {
  const base = selections.cut?.basePrice || 2499;
  const placementSur = selections.placement?.surcharge || 0;
  const graphicSur = selections.graphic?.surcharge || 0;
  const sizeSur = calculateSizeSurcharge(selections.size);

  return base + placementSur + graphicSur + sizeSur;
}
