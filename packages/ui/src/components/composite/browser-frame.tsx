/**
 * BrowserFrame — Tarayici penceresi cercevesi.
 * Ust bar (macOS trafik-isigi noktalari + opsiyonel gezinme kontrolleri +
 * adres cubugu URL) ve altinda icerik alani sunar. Sekmeler verilirse
 * adres cubugunun ustunde akiskan bir sekme seridi gosterilir.
 * Web onizleme/vitrin senaryolari icin (DeployLens tarayici karsilastirma).
 * Etkilesimsiz (sunum) bilesen.
 */
import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock,
  Plus,
  RotateCw,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface BrowserFrameTab {
  /** Sekme basligi. */
  label: React.ReactNode;
  /** Aktif (secili) sekme mi? */
  active?: boolean;
  /** Sekme basi ikonu (favicon); verilmezse Globe kullanilir. */
  icon?: React.ReactNode;
  /** Sekme kapatma "x" dugmesini gizler. */
  hideClose?: boolean;
}

type BrowserFrameAspect = "video" | "wide" | "square" | "auto";

export interface BrowserFrameProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Adres cubugunda gosterilecek URL (orn. "deploylens.app/panel"). */
  url?: React.ReactNode;
  /** Sekme seridi; verilirse adres cubugunun ustunde gosterilir. */
  tabs?: BrowserFrameTab[];
  /** URL guvenli mi (https)? Kilit ikonu gosterir. Varsayilan: true. */
  secure?: boolean;
  /** Icerik alani en-boy orani. "auto" ise yukseklik icerige gore akar. Varsayilan: "auto". */
  aspect?: BrowserFrameAspect;
  /** Adres cubugu solundaki geri/ileri/yenile kontrollerini gizler. */
  hideControls?: boolean;
  /** Trafik-isigi noktalarini gizler. */
  hideTrafficLights?: boolean;
  /** Icerik alani sarmalayicisina ek sinif. */
  contentClassName?: string;
  /** Icerik alani; verilmezse URL'li yer tutucu gosterilir. */
  children?: React.ReactNode;
}

const aspectClasses: Record<Exclude<BrowserFrameAspect, "auto">, string> = {
  video: "aspect-video",
  wide: "aspect-[16/10]",
  square: "aspect-square",
};

function toPlain(node: React.ReactNode): string {
  return typeof node === "string" || typeof node === "number"
    ? String(node)
    : "";
}

const TrafficLights = () => (
  <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
    <span className="size-3 rounded-full bg-destructive/90" />
    <span className="size-3 rounded-full bg-warning/90" />
    <span className="size-3 rounded-full bg-success/90" />
  </div>
);

const BrowserFrame = React.forwardRef<HTMLDivElement, BrowserFrameProps>(
  (
    {
      url,
      tabs,
      secure = true,
      aspect = "auto",
      hideControls = false,
      hideTrafficLights = false,
      contentClassName,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const hasTabs = Array.isArray(tabs) && tabs.length > 0;
    const label = url ? `Tarayici onizleme: ${toPlain(url)}` : "Tarayici onizleme";

    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className={cn(
          "flex w-full max-w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg",
          className
        )}
        {...props}
      >
        {/* Sekme seridi (opsiyonel) */}
        {hasTabs ? (
          <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 pt-2">
            {!hideTrafficLights ? (
              <div className="pb-2">
                <TrafficLights />
              </div>
            ) : null}
            <div className="flex min-w-0 flex-1 items-end gap-1 overflow-x-auto">
              {tabs!.map((tab, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex min-w-0 max-w-[11rem] shrink-0 items-center gap-1.5 rounded-t-lg border border-b-0 px-3 py-2 text-xs",
                    tab.active
                      ? "border-border bg-background font-medium text-foreground"
                      : "border-transparent bg-muted/40 text-muted-foreground"
                  )}
                >
                  <span className="shrink-0 text-muted-foreground [&_svg]:size-3.5">
                    {tab.icon ?? <Globe className="size-3.5" aria-hidden="true" />}
                  </span>
                  <span className="min-w-0 truncate">{tab.label}</span>
                  {!tab.hideClose ? (
                    <X
                      className="size-3 shrink-0 text-muted-foreground/70"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              ))}
              <span
                className="mb-1 ml-0.5 hidden shrink-0 rounded-md p-1 text-muted-foreground sm:inline-flex"
                aria-hidden="true"
              >
                <Plus className="size-4" />
              </span>
            </div>
          </div>
        ) : null}

        {/* Arac cubugu: trafik isiklari (sekme yoksa) + gezinme + adres cubugu */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2.5 sm:gap-3">
          {!hasTabs && !hideTrafficLights ? <TrafficLights /> : null}

          {!hideControls ? (
            <div
              className="hidden shrink-0 items-center gap-0.5 text-muted-foreground sm:flex [&_svg]:size-4"
              aria-hidden="true"
            >
              <span className="rounded-md p-1">
                <ChevronLeft />
              </span>
              <span className="rounded-md p-1 opacity-50">
                <ChevronRight />
              </span>
              <span className="rounded-md p-1">
                <RotateCw className="size-3.5" />
              </span>
            </div>
          ) : null}

          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
            {secure ? (
              <Lock className="size-3 shrink-0 text-success" aria-hidden="true" />
            ) : (
              <Globe className="size-3 shrink-0" aria-hidden="true" />
            )}
            <span className="truncate">
              {url ?? <span className="italic opacity-70">yeni sekme</span>}
            </span>
          </div>
        </div>

        {/* Icerik alani */}
        <div
          className={cn(
            "relative min-w-0 bg-background",
            aspect !== "auto" && [aspectClasses[aspect], "overflow-hidden"],
            !children && "min-h-[12rem]",
            contentClassName
          )}
        >
          {children ?? (
            <div className="flex min-h-[12rem] flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
              <Globe className="size-8 opacity-40" aria-hidden="true" />
              {url ? (
                <span className="max-w-full truncate text-sm">{url}</span>
              ) : null}
            </div>
          )}
        </div>
      </div>
    );
  }
);
BrowserFrame.displayName = "BrowserFrame";

export { BrowserFrame };
