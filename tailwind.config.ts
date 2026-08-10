import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: "#121212",
          charcoal: "#1c1b1f",
          dark: "#262529",
          cream: "#FAF8F5",
          beige: "#F2EDE4",
          tan: "#E8DFC8",
          gold: "#D4AF37",
          goldMuted: "#C5A880",
          offwhite: "#FDFBF7",
          border: "#EAE5DC",
          silver: "#E5E7EB",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        luxury: "0 20px 40px -15px rgba(18, 18, 18, 0.08)",
        modal: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out forwards",
        slideRight: "slideRight 0.3s ease-out forwards",
        pulseSlow: "pulseSlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
