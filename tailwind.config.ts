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
        "royal-light": "rgba(30, 90, 230, 0.15)",
        "royal-subtle": "rgba(30, 90, 230, 0.08)",
        "royal-glow": "rgba(30, 90, 230, 0.35)",

        pink: "#FF4D97",
        "pink-hover": "#E63380",
        "pink-light": "rgba(255, 77, 151, 0.15)",
        "pink-glow": "rgba(255, 77, 151, 0.35)",

        // Canvas & Surface Tokens (Rich Deep Blue Canvas matching the logo)
        canvas: "#0A1128",
        surface: "#101D3F",
        "surface-tint": "#16254F",
        "surface-dark": "#060B1A",
        
        // High-Contrast Crisp Typography on Deep Blue
        charcoal: "#FFFFFF",
        "charcoal-dark": "#F8FAFC",
        "charcoal-light": "#E2E8F0",
        white: "#FFFFFF",

        muted: "#94A3B8",
        "muted-light": "#CBD5E1",
        border: "rgba(255, 255, 255, 0.12)",
        "border-soft": "rgba(255, 255, 255, 0.06)",
        "border-dark": "rgba(255, 255, 255, 0.22)",

        gold: "#F59E0B",
        "gold-light": "rgba(245, 158, 11, 0.15)",

        // Aliases
        ink: "#FFFFFF",
        accent: "#1E5AE6",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Fraunces", "Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        none: "none",
        subtle: "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
        luxury: "0 10px 25px -5px rgba(30, 90, 230, 0.35), 0 8px 10px -6px rgba(30, 90, 230, 0.2)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
        "pink-glow": "0 10px 25px -5px rgba(255, 77, 151, 0.35)",
        editorial: "0 20px 40px -15px rgba(0, 0, 0, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
