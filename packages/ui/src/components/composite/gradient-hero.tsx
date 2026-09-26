/**
 * GradientHero — marka gradyanli hero bolumu.
 * Landing ve pazarlama sayfalarinda baslik, alt baslik, eyebrow ve
 * aksiyon butonlarini brand-gradient arka plan uzerinde sunar.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface GradientHeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Ana baslik. */
  title: React.ReactNode;
  /** Alt baslik / aciklama. */
  subtitle?: React.ReactNode;
  /** Baslik ustu kucuk etiket. */
  eyebrow?: React.ReactNode;
  /** Aksiyon butonlari slotu. */
  actions?: React.ReactNode;
  /** Icerik hizalamasi. */
  align?: "center" | "start";
  /** Okunabilirlik icin koyu scrim katmani. */
  overlay?: boolean;
  /** Dikey boyut. */
  size?: "md" | "lg";
}

const alignClasses: Record<"center" | "start", string> = {
  center: "items-center text-center",
  start: "items-start text-start",
};

const sizeClasses: Record<"md" | "lg", string> = {
  md: "py-16",
  lg: "py-24",
};

export const GradientHero = React.forwardRef<HTMLElement, GradientHeroProps>(
  (
    {
      title,
      subtitle,
      eyebrow,
      actions,
      align = "center",
      overlay = false,
      size = "md",
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
          "relative overflow-hidden rounded-2xl bg-brand-gradient text-primary-foreground",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {overlay ? (
          <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
        ) : null}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_10%,rgb(255_255_255/0.18),transparent)]"
          aria-hidden="true"
        />
        <div
          className={cn(
            "relative z-10 flex flex-col gap-4 px-6",
            alignClasses[align],
          )}
        >
          {eyebrow ? (
            <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-2xl text-base opacity-90 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
          {actions ? (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {actions}
            </div>
          ) : null}
          {children}
        </div>
      </section>
    );
  },
);
GradientHero.displayName = "GradientHero";
