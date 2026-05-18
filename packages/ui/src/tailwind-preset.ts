import type { Config } from "tailwindcss/types/config";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * blaj.io Tailwind preset
 * Extends the default theme with brand tokens from design.md.
 * Usage in apps/web/tailwind.config.ts:
 *   import { blajPreset } from "@blaj/ui/tailwind-preset";
 *   export default { presets: [blajPreset], content: [...] }
 */
export const blajPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--color-brand-primary)",
          accent: "var(--color-brand-accent)",
          "accent-hover": "var(--color-brand-accent-hover)",
          "accent-soft": "var(--color-brand-accent-soft)",
        },
        electric: {
          DEFAULT: "var(--color-electric)",
          hover: "var(--color-electric-hover)",
          soft: "var(--color-electric-soft)",
        },
        neutral: {
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          400: "var(--color-neutral-400)",
          500: "var(--color-neutral-500)",
          600: "var(--color-neutral-600)",
          700: "var(--color-neutral-700)",
          800: "var(--color-neutral-800)",
          900: "var(--color-neutral-900)",
        },
        success: "var(--color-success)",
        "success-soft": "var(--color-success-soft)",
        warning: "var(--color-warning)",
        "warning-soft": "var(--color-warning-soft)",
        danger: "var(--color-danger)",
        "danger-soft": "var(--color-danger-soft)",
        info: "var(--color-info)",
        "info-soft": "var(--color-info-soft)",
      },
      backgroundColor: {
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        disabled: "var(--color-disabled-bg)",
      },
      textColor: {
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        tertiary: "var(--color-text-tertiary)",
        "on-brand": "var(--color-text-on-brand)",
        "on-accent": "var(--color-text-on-accent)",
        disabled: "var(--color-disabled-text)",
      },
      borderColor: {
        subtle: "var(--color-border-subtle)",
        DEFAULT: "var(--color-border-default)",
        strong: "var(--color-border-strong)",
        focus: "var(--color-border-focus)",
      },
      spacing: {
        4.5: "18px", // used occasionally
        13: "52px", // input lg height
        15: "60px",
        18: "72px", // header height desktop
        22: "88px",
        26: "104px",
        30: "120px",
        34: "136px",
        38: "152px",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        focus: "var(--shadow-focus)",
        "glow-accent": "var(--shadow-glow-accent)",
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "Geist Sans", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Geist Mono", "monospace"],
      },
      fontSize: {
        "display-2xl": ["80px", { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "600" }],
        "display-xl": ["64px", { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "600" }],
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "600" }],
        "display-md": ["36px", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-sm": ["28px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        tabular: ["16px", { lineHeight: "1.5", letterSpacing: "0" }],
      },
      transitionDuration: {
        instant: "var(--duration-instant)",
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        medium: "var(--duration-medium)",
        slow: "var(--duration-slow)",
        slower: "var(--duration-slower)",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "spring-soft": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        "container-narrow": "640px",
        "container-default": "1080px",
        "container-wide": "1280px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-up-fade": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-fade": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "confetti-burst": {
          "0%": { opacity: "1", transform: "scale(0) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1.2) rotate(180deg)" },
          "100%": { opacity: "0", transform: "scale(1) rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.5s ease-in-out infinite",
        "slide-up-fade": "slide-up-fade var(--duration-medium) var(--ease-out)",
        "scale-fade": "scale-fade var(--duration-base) var(--ease-out)",
        "confetti-burst": "confetti-burst 0.7s var(--ease-spring)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
