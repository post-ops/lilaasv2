import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0E1A",
        deep: "#0F1B2E",
        steel: "#1E2A3A",
        mist: "#8A96A8",
        fog: "#C9D1DE",
        signal: "#FF6B35",
        copper: "#C97E4F",
        chart: "#2BD4B4",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 8vw, 8rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(2.5rem, 6vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(2rem, 4.5vw, 4rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-sm": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        tightest: "-0.04em",
        wider: "0.06em",
        widest: "0.2em",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-expo": "cubic-bezier(0.7, 0, 0.84, 0)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      animation: {
        "marquee": "marquee 40s linear infinite",
        "pulse-signal": "pulseSignal 2.4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseSignal: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
