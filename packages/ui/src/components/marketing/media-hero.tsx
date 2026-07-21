/**
 * MediaHero — gorsel/video arka-planli tam-genislik hero bolumu.
 * Arka plana bir <img> veya <video> slotu yerlestirir (object-cover ile kaplar),
 * uzerine okunabilirlik icin karartma/gradyan/marka overlay katmani cizer ve
 * en ustte kontrast (beyaz) baslik, aciklama ve CTA sunar. min-h ile dikey
 * boyut, `align` ile sol/orta hizalama ayarlanir. GlowScan/Dolap gibi
 * gorsel-agirlikli landing sayfalari icin idealdir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type MediaHeroAlign = "start" | "center";
type MediaHeroOverlay = "none" | "dark" | "gradient" | "brand";
type MediaHeroMinHeight = "sm" | "md" | "lg" | "screen";

export interface MediaHeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Arka plan medya slotu: <img> veya <video>; verilmezse bg-muted placeholder cizilir. */
  media?: React.ReactNode;
  /** Baslik ustundeki kucuk rozet/eyebrow slotu. */
  eyebrow?: React.ReactNode;
  /** Ana baslik. */
  title: React.ReactNode;
  /** Basligin altindaki destekleyici aciklama. */
  description?: React.ReactNode;
  /** Birincil/ikincil CTA butonlari slotu. */
  actions?: React.ReactNode;
  /** Icerik yatay hizalamasi: sola veya ortaya. */
  align?: MediaHeroAlign;
  /** Medya uzerindeki okunabilirlik katmani. */
  overlay?: MediaHeroOverlay;
  /** Minimum dikey yukseklik. */
  minHeight?: MediaHeroMinHeight;
}

const alignClasses: Record<MediaHeroAlign, string> = {
  start: "max-w-2xl items-start text-left",
  center: "mx-auto max-w-3xl items-center text-center",
};

const actionsAlignClasses: Record<MediaHeroAlign, string> = {
  start: "justify-start",
  center: "justify-center",
};

const overlayClasses: Record<MediaHeroOverlay, string> = {
  none: "",
  dark: "bg-black/50",
  gradient: "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
  brand: "bg-brand-gradient opacity-70 mix-blend-multiply",
};

const minHeightClasses: Record<MediaHeroMinHeight, string> = {
  sm: "min-h-[20rem]",
  md: "min-h-[28rem] sm:min-h-[32rem]",
  lg: "min-h-[34rem] sm:min-h-[40rem]",
  screen: "min-h-screen",
};

export const MediaHero = React.forwardRef<HTMLElement, MediaHeroProps>(
  (
    {
      media,
      eyebrow,
      title,
      description,
      actions,
      align = "start",
      overlay = "gradient",
      minHeight = "md",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative isolate flex flex-col justify-center overflow-hidden rounded-3xl px-6 py-16 text-white sm:px-10 sm:py-20",
          minHeightClasses[minHeight],
          className,
        )}
        {...props}
      >
        {/* Arka plan medya: verilen img/video slotunu kapsayacak sekilde doldur. */}
        <div
          aria-hidden={media ? undefined : "true"}
          className="absolute inset-0 -z-20 bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
        >
          {media}
        </div>

        {/* Okunabilirlik katmani. */}
        {overlay !== "none" ? (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 -z-10",
              overlayClasses[overlay],
            )}
          />
        ) : null}

        <div
          className={cn(
            "relative z-10 flex w-full flex-col gap-5 [text-shadow:0_1px_12px_rgb(0_0_0/0.35)]",
            alignClasses[align],
          )}
        >
          {eyebrow ? (
            <div className="animate-fade-up [animation-delay:0ms]">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white ring-1 ring-white/25 backdrop-blur-sm">
                {eyebrow}
              </span>
            </div>
          ) : null}
          <h1 className="animate-fade-up text-balance font-display text-4xl font-bold tracking-tight [animation-delay:60ms] sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-xl animate-fade-up text-pretty text-base text-white/85 [animation-delay:120ms] sm:text-lg">
              {description}
            </p>
          ) : null}
          {actions ? (
            <div
              className={cn(
                "flex animate-fade-up flex-col gap-3 pt-2 [animation-delay:180ms] sm:flex-row sm:flex-wrap sm:items-center",
                actionsAlignClasses[align],
              )}
            >
              {actions}
            </div>
          ) : null}
          {children}
        </div>
      </section>
    );
  },
);
MediaHero.displayName = "MediaHero";
