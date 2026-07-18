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
        /** Aurora mesh: tema gradyan renklerinden yumuşak çok-noktalı bulut */
        "aurora":
          "radial-gradient(40% 55% at 20% 25%, hsl(var(--gradient-from) / 0.55), transparent 70%), radial-gradient(45% 50% at 80% 20%, hsl(var(--gradient-to) / 0.50), transparent 70%), radial-gradient(50% 60% at 60% 90%, hsl(var(--primary) / 0.35), transparent 70%)",
        /** Dönen konik marka gradyanı — animasyonlu kenarlıklar için */
        "conic-brand":
          "conic-gradient(from var(--border-angle, 0deg), transparent 0%, hsl(var(--gradient-from)) 20%, hsl(var(--gradient-to)) 40%, transparent 55%)",
        /** İnce grain/noise dokusu (SVG data-URI, temadan bağımsız) */
        "grain":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
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
        /** Yatay sonsuz kayan şerit — Marquee */
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-50%)" },
        },
        /** Aurora bulutunun yavaş kayması */
        aurora: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)", opacity: "0.9" },
          "50%": { transform: "translate3d(2%,-2%,0) scale(1.08)", opacity: "1" },
        },
        /** Konik kenarlık dönüşü (ShineBorder) — @property olmadan da bg-position ile */
        "shine-border": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        /** Buton cila süpürmesi (ShimmerButton) */
        "shine-sweep": {
          "0%": { transform: "translateX(-120%) skewX(-12deg)" },
          "60%, 100%": { transform: "translateX(220%) skewX(-12deg)" },
        },
        /** Yumuşak parıltı nabzı (glow) */
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        "fade-up": "fade-up 0.35s ease-out both",
        marquee: "marquee var(--marquee-duration, 30s) linear infinite",
        "marquee-vertical":
          "marquee-vertical var(--marquee-duration, 30s) linear infinite",
        aurora: "aurora 12s ease-in-out infinite",
        "shine-border": "shine-border 4s linear infinite",
        "shine-sweep": "shine-sweep 3.5s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
    },
    screens: Object.fromEntries(
      Object.entries(scales.breakpoints).map(([k, px]) => [k, `${px}px`]),
    ),
  },
};

export default dsPreset;
