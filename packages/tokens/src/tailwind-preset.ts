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
      },
    },
    screens: Object.fromEntries(
      Object.entries(scales.breakpoints).map(([k, px]) => [k, `${px}px`]),
    ),
  },
};

export default dsPreset;
