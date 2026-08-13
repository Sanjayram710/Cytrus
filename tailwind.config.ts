import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CELEBRITEE Luxury Brand Palette
        royal: "#1E5AE6",
        "royal-dark": "#1342B8",
        "royal-deep": "#0A246A",
        "royal-light": "rgba(30, 90, 230, 0.12)",
        "royal-subtle": "#EEF4FF",
        "royal-glow": "rgba(30, 90, 230, 0.25)",

        pink: "#FF4D97",
        "pink-hover": "#E63380",
        "pink-light": "rgba(255, 77, 151, 0.12)",
        "pink-glow": "rgba(255, 77, 151, 0.25)",

        // Canvas & Surface Tokens (Pure White Backgrounds)
        canvas: "#FFFFFF",
        surface: "#FFFFFF",
        "surface-tint": "#F8FAFC",
        "surface-dark": "#F1F5F9",
        
        // High-Contrast Black Typography
        charcoal: "#0F172A",
        "charcoal-dark": "#000000",
        "charcoal-light": "#334155",
        black: "#000000",

        muted: "#64748B",
        "muted-light": "#94A3B8",
        border: "#E2E8F0",
        "border-soft": "#F1F5F9",
        "border-dark": "#CBD5E1",

        gold: "#D97706",
        "gold-light": "rgba(217, 119, 6, 0.12)",

        // Typography Aliases
        ink: "#0F172A",
        accent: "#1E5AE6",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Fraunces", "Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        none: "none",
        subtle: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        luxury: "0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        "pink-glow": "0 10px 25px -5px rgba(255, 77, 151, 0.35)",
        editorial: "0 20px 40px -15px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
