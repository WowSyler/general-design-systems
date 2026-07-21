"use client";

/**
 * FaceScanOverlay — Yuz tarama arayuzu overlay'i (GlowScan yakalama cekirdegi).
 * Kamera veya foto uzerine binen dekoratif bir katman: merkezde oval yuz
 * hizalama cercevesi + kose ayraclari, tarama sirasinda yukari-asagi suzulen
 * tarama cizgisi animasyonu, duruma gore degisen alt durum metni
 * ('Yuzunuzu cerceveye hizalayin' -> 'Analiz ediliyor...') ve opsiyonel
 * ilerleme cubugu. Durum ve ilerleme prop ile kontrol edilir; salt sunum
 * amacli, tema-agnostik bir katmandir.
 */

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ScanFace,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type FaceScanOverlayStatus =
  | "aligning"
  | "scanning"
  | "success"
  | "error";

type FaceScanOverlayAspect = "portrait" | "square";

export interface FaceScanOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Tarama durumu; cerceve rengini, ikonu ve varsayilan metni belirler. */
  status?: FaceScanOverlayStatus;
  /** 0-100 arasi ilerleme; verilirse alt kisimda ilerleme cubugu cizilir. */
  progress?: number;
  /** Varsayilan durum metnini gecersiz kilar. */
  statusText?: React.ReactNode;
  /** Overlay'in altina yerlesecek kamera/foto icerigi. Verilmezse yer tutucu. */
  media?: React.ReactNode;
  /** Cerceve en-boy orani. */
  aspect?: FaceScanOverlayAspect;
}

const aspectClasses: Record<FaceScanOverlayAspect, string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
};

const frameColor: Record<FaceScanOverlayStatus, string> = {
  aligning: "text-foreground/45",
  scanning: "text-primary",
  success: "text-success",
  error: "text-destructive",
};

const badgeIconColor: Record<FaceScanOverlayStatus, string> = {
  aligning: "text-muted-foreground",
  scanning: "text-primary",
  success: "text-success",
  error: "text-destructive",
};

const statusIcons: Record<FaceScanOverlayStatus, LucideIcon> = {
  aligning: ScanFace,
  scanning: Loader2,
  success: CheckCircle2,
  error: AlertTriangle,
};

const defaultText: Record<FaceScanOverlayStatus, string> = {
  aligning: "Yüzünüzü çerçeveye hizalayın",
  scanning: "Analiz ediliyor...",
  success: "Yüz doğrulandı",
  error: "Yüz algılanamadı, tekrar deneyin",
};

const SWEEP_KEYFRAMES =
  "@keyframes ds-facescan-sweep{0%{top:2%}100%{top:86%}}";

const FaceScanOverlay = React.forwardRef<HTMLDivElement, FaceScanOverlayProps>(
  (
    {
      status = "aligning",
      progress,
      statusText,
      media,
      aspect = "portrait",
      className,
      ...props
    },
    ref,
  ) => {
    const Icon = statusIcons[status];
    const animated = status === "scanning";
    const text = statusText ?? defaultText[status];
    const hasProgress = typeof progress === "number";
    const clampedProgress = hasProgress
      ? Math.min(100, Math.max(0, Math.round(progress)))
      : 0;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={
          typeof text === "string" ? `Yüz tarama: ${text}` : "Yüz tarama"
        }
        className={cn(
          "relative isolate flex w-full flex-col overflow-hidden rounded-3xl bg-muted shadow-lg ring-1 ring-border",
          aspectClasses[aspect],
          className,
        )}
        {...props}
      >
        {/* Arka plan: kamera/foto veya yer tutucu */}
        {media ? (
          <div className="absolute inset-0">{media}</div>
        ) : (
          <div className="absolute inset-0 bg-muted bg-grain" aria-hidden="true" />
        )}

        {/* Merkez hizalama cercevesi */}
        <div className="absolute inset-0 grid place-items-center p-6">
          <div
            className={cn(
              "relative aspect-[3/4] w-1/2 min-w-[150px] max-w-[230px]",
              frameColor[status],
            )}
          >
            {/* Tarama cizgisi (yalnizca analiz sirasinda), ovale kirpilir */}
            {animated ? (
              <div className="absolute inset-0 overflow-hidden rounded-[50%]">
                <span
                  className="absolute inset-x-0 h-10 motion-reduce:hidden"
                  style={{
                    animation:
                      "ds-facescan-sweep 2.6s ease-in-out infinite alternate",
                  }}
                  aria-hidden="true"
                >
                  <span className="absolute inset-0 bg-gradient-to-b from-transparent via-current to-transparent opacity-25" />
                  <span className="absolute left-1/2 top-1/2 h-px w-[86%] -translate-x-1/2 -translate-y-1/2 bg-current shadow-glow" />
                </span>
              </div>
            ) : null}

            {/* Oval yuz cercevesi */}
            <div
              className={cn(
                "absolute inset-0 rounded-[50%] border-2 border-current transition-colors duration-300",
                animated && "shadow-glow",
              )}
              aria-hidden="true"
            />

            {/* Kose ayraclari */}
            <span
              className="absolute -left-1.5 -top-1.5 size-6 rounded-tl-lg border-l-2 border-t-2 border-current"
              aria-hidden="true"
            />
            <span
              className="absolute -right-1.5 -top-1.5 size-6 rounded-tr-lg border-r-2 border-t-2 border-current"
              aria-hidden="true"
            />
            <span
              className="absolute -bottom-1.5 -left-1.5 size-6 rounded-bl-lg border-b-2 border-l-2 border-current"
              aria-hidden="true"
            />
            <span
              className="absolute -bottom-1.5 -right-1.5 size-6 rounded-br-lg border-b-2 border-r-2 border-current"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Alt okunabilirlik gradyani */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background/85 via-background/30 to-transparent"
          aria-hidden="true"
        />

        {/* Durum metni + ilerleme */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-4">
          {hasProgress ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-foreground/90">
                <span>Tarama</span>
                <span className="tabular-nums">%{clampedProgress}</span>
              </div>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={clampedProgress}
                aria-label="Yüz tarama ilerlemesi"
                className="h-1.5 w-full overflow-hidden rounded-full bg-background/50"
              >
                <div
                  className="h-full rounded-full bg-primary bg-sheen shadow-sm transition-[width] duration-500 ease-out"
                  style={{ width: `${clampedProgress}%` }}
                />
              </div>
            </div>
          ) : null}

          <div
            aria-live="polite"
            className="flex items-center justify-center gap-2 rounded-full bg-background/90 px-3.5 py-2 text-sm font-medium text-foreground shadow-md ring-1 ring-border backdrop-blur"
          >
            <Icon
              className={cn(
                "size-4 shrink-0",
                badgeIconColor[status],
                animated && "animate-spin",
              )}
              aria-hidden="true"
            />
            <span>{text}</span>
          </div>
        </div>

        {animated ? <style>{SWEEP_KEYFRAMES}</style> : null}
      </div>
    );
  },
);
FaceScanOverlay.displayName = "FaceScanOverlay";

export { FaceScanOverlay };
