/**
 * SplitHero — iki kolonlu hero bolumu.
 * Solda eyebrow, baslik, aciklama ve aksiyonlar; sagda medya slotu.
 * `reverse` ile kolon sirasi genis ekranda ters cevrilir; medya verilmezse
 * bg-muted bir placeholder cizilir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface SplitHeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Baslik ustu kucuk etiket. */
  eyebrow?: React.ReactNode;
  /** Ana baslik. */
  title: React.ReactNode;
  /** Aciklama metni. */
  description?: React.ReactNode;
  /** Aksiyon butonlari slotu. */
  actions?: React.ReactNode;
  /** Medya slotu (gorsel, video vb.); verilmezse placeholder gosterilir. */
  media?: React.ReactNode;
  /** Genis ekranda medya solda, icerik sagda olacak sekilde ters cevirir. */
  reverse?: boolean;
}

export const SplitHero = React.forwardRef<HTMLElement, SplitHeroProps>(
  (
    {
      eyebrow,
      title,
      description,
      actions,
      media,
      reverse = false,
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
          "grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center",
          className,
        )}
        {...props}
      >
        <div
          className={cn("flex flex-col gap-4", reverse && "lg:order-2")}
        >
          {eyebrow ? (
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="font-display text-4xl font-bold tracking-tight">
            {title}
          </h1>
          {description ? (
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
          {actions ? (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {actions}
            </div>
          ) : null}
          {children}
        </div>
        <div
          className={cn(
            "overflow-hidden rounded-2xl shadow-xl",
            reverse && "lg:order-1",
          )}
        >
          {media ?? (
            <div
              aria-hidden="true"
              className="aspect-video w-full rounded-2xl bg-muted"
            />
          )}
        </div>
      </section>
    );
  },
);
SplitHero.displayName = "SplitHero";
