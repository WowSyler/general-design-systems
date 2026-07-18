import { scales } from "./scales.js";

/**
 * Tailwind v3 preset — tüm renkler CSS değişkenlerine bağlanır,
 * böylece tema (theme-<name> sınıfı) ve dark mode değişince
 * hiçbir Tailwind class'ı değişmeden görünüm güncellenir.
 *
 * Kullanım (tailwind.config.ts):
 *   import { dsPreset } from "@ds/tokens/tailwind-preset";
 *   export default { presets: [dsPreset], darkMode: "class", ... }
 */
const v = (name: string) => `hsl(var(--${name}))`;

export const dsPreset = {
  darkMode: "class" as const,
  theme: {
    extend: {
      colors: {
        background: v("background"),
        foreground: v("foreground"),
        card: { DEFAULT: v("card"), foreground: v("card-foreground") },
        popover: { DEFAULT: v("popover"), foreground: v("popover-foreground") },
        primary: { DEFAULT: v("primary"), foreground: v("primary-foreground") },
        secondary: { DEFAULT: v("secondary"), foreground: v("secondary-foreground") },
        muted: { DEFAULT: v("muted"), foreground: v("muted-foreground") },
        accent: { DEFAULT: v("accent"), foreground: v("accent-foreground") },
        destructive: { DEFAULT: v("destructive"), foreground: v("destructive-foreground") },
        success: { DEFAULT: v("success"), foreground: v("success-foreground") },
        warning: { DEFAULT: v("warning"), foreground: v("warning-foreground") },
        info: { DEFAULT: v("info"), foreground: v("info-foreground") },
        border: v("border"),
        input: v("input"),
        ring: v("ring"),
        chart: {
          "1": v("chart1"),
          "2": v("chart2"),
          "3": v("chart3"),
          "4": v("chart4"),
          "5": v("chart5"),
        },
        sidebar: {
          DEFAULT: v("sidebar"),
          foreground: v("sidebar-foreground"),
          primary: v("sidebar-primary"),
          "primary-foreground": v("sidebar-primary-foreground"),
          accent: v("sidebar-accent"),
          "accent-foreground": v("sidebar-accent-foreground"),
          border: v("sidebar-border"),
          ring: v("sidebar-ring"),
        },
        "gradient-from": v("gradient-from"),
        "gradient-to": v("gradient-to"),
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        serif: "var(--font-serif)",
        mono: "var(--font-mono)",
        display: "var(--font-display)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, hsl(var(--gradient-from)), hsl(var(--gradient-to)))",
        /** Buton cilası: üstten hafif ışık — her düz rengin üzerinde çalışır */
        "sheen": "linear-gradient(to bottom, rgb(255 255 255 / 0.12), transparent 55%)",
      },
      /** Tema-tonlu katmanlı gölgeler — --shadow-color temadan gelir */
      boxShadow: {
        sm: "0 1px 2px hsl(var(--shadow-color) / 0.10)",
        DEFAULT:
          "0 2px 8px -2px hsl(var(--shadow-color) / 0.14), 0 1px 2px hsl(var(--shadow-color) / 0.08)",
        md: "0 4px 12px -2px hsl(var(--shadow-color) / 0.16), 0 2px 4px -2px hsl(var(--shadow-color) / 0.08)",
        lg: "0 12px 24px -6px hsl(var(--shadow-color) / 0.20), 0 4px 8px -4px hsl(var(--shadow-color) / 0.10)",
        xl: "0 24px 48px -12px hsl(var(--shadow-color) / 0.26), 0 8px 16px -8px hsl(var(--shadow-color) / 0.12)",
        "2xl": "0 32px 64px -16px hsl(var(--shadow-color) / 0.32)",
        glow: "0 0 0 1px hsl(var(--primary) / 0.12), 0 8px 24px -4px hsl(var(--primary) / 0.35)",
        inner: "inset 0 2px 4px 0 hsl(var(--shadow-color) / 0.08)",
        none: "none",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        "fade-up": "fade-up 0.35s ease-out both",
      },
    },
    screens: Object.fromEntries(
      Object.entries(scales.breakpoints).map(([k, px]) => [k, `${px}px`]),
    ),
  },
};

export default dsPreset;
