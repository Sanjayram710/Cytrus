import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF7F2",
        surface: "#F0EAE0",
        border: "#D9CFC0",
        muted: "#786B58",
        ink: "#2E2822",
        accent: "#6B5B45",
        luxury: {
          black: "#1A1918",
          cream: "#FAF7F2",
          border: "#D9CFC0",
          gold: "#9B804E",
        },
        // Keep alias for backward compatibility
        mono: {
          canvas: "#FAF7F2",
          surface: "#F0EAE0",
          border: "#D9CFC0",
          muted: "#786B58",
          ink: "#2E2822",
          accent: "#6B5B45",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Fraunces", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        none: "none",
        subtle: "0 1px 3px rgba(46, 40, 34, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
