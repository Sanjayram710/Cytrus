import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CELEBRITEE Brand Palette
        royal: "#104EA5",
        "royal-dark": "#0B3775",
        "royal-light": "#EBF2FC",
        pink: "#F45BBC",
        "pink-hover": "#E048A7",
        "pink-light": "#FDF0F8",
        ivory: "#FFFEFA",
        charcoal: "#151515",
        "charcoal-dark": "#0C0C0C",
        softgrey: "#F2F2F0",
        "border-soft": "#E5E5E0",
        gold: "#B89B5E",
        "gold-light": "#F7F3E9",

        // Base aliases mapped to CELEBRITEE tokens
        canvas: "#FFFEFA",
        surface: "#F2F2F0",
        border: "#E5E5E0",
        muted: "#70706C",
        ink: "#151515",
        accent: "#104EA5",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Fraunces", "Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        none: "none",
        subtle: "0 1px 3px rgba(21, 21, 21, 0.04)",
        luxury: "0 10px 30px -10px rgba(16, 78, 165, 0.12)",
        editorial: "0 20px 40px -15px rgba(21, 21, 21, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
