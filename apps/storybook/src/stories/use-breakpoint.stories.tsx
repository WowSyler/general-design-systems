import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Monitor, Smartphone, Tablet } from "lucide-react";

import {
  BREAKPOINTS,
  useBreakpoint,
  useBreakpointValue,
  useMediaQuery,
} from "@ds/ui";

/**
 * BreakpointDemo — useBreakpoint/useMediaQuery/useBreakpointValue hook'larini
 * canli gosteren kucuk demo. Storybook tuvalini yeniden boyutlandirin veya
 * viewport aracindan cihaz secin; degerlerin aninda guncellendigini gorun.
 */
const BreakpointDemo = () => {
  const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const columns =
    useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4, xl: 6 }) ?? 1;
  const cihazEtiketi =
    useBreakpointValue({
      base: "Telefon dikey",
      sm: "Telefon yatay",
      md: "Tablet",
      lg: "Dizustu",
      xl: "Masaustu",
      "2xl": "Genis ekran",
    }) ?? "Bilinmiyor";

  const CihazIkon = isMobile ? Smartphone : isTablet ? Tablet : Monitor;
  const bayraklar = [
    { ad: "isMobile", deger: isMobile },
    { ad: "isTablet", deger: isTablet },
    { ad: "isDesktop", deger: isDesktop },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 p-4 sm:p-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CihazIkon className="size-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Aktif breakpoint</p>
            <p className="font-display text-2xl font-semibold text-foreground">
              {breakpoint}
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-muted/60 px-3 py-2 text-center">
          <p className="text-xs text-muted-foreground">Cihaz sinifi</p>
          <p className="text-sm font-medium text-foreground">{cihazEtiketi}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {bayraklar.map((bayrak) => (
          <div
            key={bayrak.ad}
            className={
              "rounded-lg border px-4 py-3 text-sm transition-colors " +
              (bayrak.deger
                ? "border-success/40 bg-success/10 text-success"
                : "border-border bg-muted/40 text-muted-foreground")
            }
          >
            <span className="font-mono">{bayrak.ad}</span>
            <span className="float-right font-semibold tabular-nums">
              {bayrak.deger ? "true" : "false"}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p>
          useMediaQuery(&quot;(prefers-color-scheme: dark)&quot;) ={" "}
          <span className="font-semibold text-foreground">
            {prefersDark ? "true" : "false"}
          </span>
        </p>
        <p>
          useBreakpointValue kolon sayisi ={" "}
          <span className="font-semibold text-foreground tabular-nums">
            {columns}
          </span>
        </p>
      </div>

      {/* useBreakpointValue ile kolon sayisi degisen canli izgara */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="flex h-12 items-center justify-center rounded-md bg-primary/15 text-xs font-medium text-primary tabular-nums"
          >
            {index + 1}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Esik degerleri: sm {BREAKPOINTS.sm} · md {BREAKPOINTS.md} · lg{" "}
        {BREAKPOINTS.lg} · xl {BREAKPOINTS.xl} · 2xl {BREAKPOINTS["2xl"]} (px).
        Tuvali daraltip genisleterek degisimi izleyin.
      </p>
    </div>
  );
};

const meta: Meta<typeof BreakpointDemo> = {
  title: "Primitives/useBreakpoint",
  component: BreakpointDemo,
};

export default meta;
type Story = StoryObj<typeof BreakpointDemo>;

/**
 * Canli demo: aktif breakpoint, cihaz bayraklari ve useBreakpointValue ile
 * degisen izgara. Tuvali yeniden boyutlandirin.
 */
export const CanliDemo: Story = {
  render: () => <BreakpointDemo />,
};

/**
 * Mobil onizleme: dar bir sarmalayici icinde hook'lar pencere genisligini
 * baz alir; bu ornek gercek mobil cihazda "base"/"sm" degerlerini gosterir.
 */
export const MobilGorunum: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: () => <BreakpointDemo />,
};

/**
 * Sadece medya sorgusu: useMediaQuery ile isik/karanlik tercihini ve ozel
 * bir min-width sorgusunu canli izleyen kompakt ornek.
 */
const MediaQueryDemo = () => {
  const genisMi = useMediaQuery("(min-width: 900px)");
  const azHareket = useMediaQuery("(prefers-reduced-motion: reduce)");
  const satirlar = [
    { sorgu: "(min-width: 900px)", deger: genisMi },
    { sorgu: "(prefers-reduced-motion: reduce)", deger: azHareket },
  ];
  return (
    <div className="mx-auto w-full max-w-md space-y-2 p-4 sm:p-6">
      {satirlar.map((satir) => (
        <div
          key={satir.sorgu}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
        >
          <code className="min-w-0 truncate text-xs text-muted-foreground">
            {satir.sorgu}
          </code>
          <span
            className={
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold " +
              (satir.deger
                ? "bg-success/15 text-success"
                : "bg-muted text-muted-foreground")
            }
          >
            {satir.deger ? "eşleşiyor" : "eşleşmiyor"}
          </span>
        </div>
      ))}
    </div>
  );
};

export const SadeceMediaQuery: Story = {
  render: () => <MediaQueryDemo />,
};
