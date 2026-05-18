export { blajPreset } from "./tailwind-preset";
export { GeistSans, GeistMono } from "./fonts";

// Re-export all components
export * from "./export";

/** Typography scale tokens — for programmatic use */
export const typography = {
  "display-2xl": { fontFamily: "Geist Sans", fontSize: "80px", lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: 600 },
  "display-xl": { fontFamily: "Geist Sans", fontSize: "64px", lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: 600 },
  "display-lg": { fontFamily: "Geist Sans", fontSize: "48px", lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: 600 },
  "display-md": { fontFamily: "Geist Sans", fontSize: "36px", lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: 600 },
  "display-sm": { fontFamily: "Geist Sans", fontSize: "28px", lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: 600 },
  xl: { fontFamily: "Geist Sans", fontSize: "24px", lineHeight: "1.35", letterSpacing: "-0.01em", fontWeight: 500 },
  lg: { fontFamily: "Inter", fontSize: "20px", lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: 500 },
  base: { fontFamily: "Inter", fontSize: "16px", lineHeight: "1.5", letterSpacing: "0", fontWeight: 400 },
  sm: { fontFamily: "Inter", fontSize: "14px", lineHeight: "1.5", letterSpacing: "0", fontWeight: 400 },
  xs: { fontFamily: "Inter", fontSize: "12px", lineHeight: "1.5", letterSpacing: "0.01em", fontWeight: 500 },
  tabular: { fontFamily: "Geist Mono", fontSize: "16px", lineHeight: "1.5", letterSpacing: "0", fontWeight: 400 },
} as const;

/** Motion duration tokens */
export const motion = {
  instant: "0ms",
  fast: "150ms",
  base: "200ms",
  medium: "300ms",
  slow: "500ms",
  slower: "700ms",
} as const;

/** Animation presets for Framer Motion */
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: [0, 0, 0.2, 1] },
  },
  slideUpFade: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  scaleFade: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
  staggerChildren: {
    animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  },
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  },
  cardHover: {
    rest: { y: 0, boxShadow: "var(--shadow-sm)" },
    hover: { y: -4, boxShadow: "var(--shadow-md)", transition: { duration: 0.2, ease: [0, 0, 0.2, 1] } },
  },
} as const;
