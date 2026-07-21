/**
 * CenteredHero — ortalanmis hero bolumu (en yaygin landing deseni).
 * Ortali rozet/eyebrow + buyuk baslik + alt-baslik + birincil/ikincil CTA;
 * altta opsiyonel logo-cloud veya gorsel slotu. Ferah, tamamen ortali
 * kompozisyon; `atmosphere` ile bg-aurora veya marka gradyani atmosferi.
 * SplitHero/GradientHero'dan farkli olarak tek kolon ve merkeze hizalidir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type CenteredHeroAtmosphere = "none" | "aurora" | "gradient";

export interface CenteredHeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Baslik ustundeki kucuk rozet/eyebrow slotu. */
  eyebrow?: React.ReactNode;
  /** Ana baslik. */
  title: React.ReactNode;
  /** Basligin altindaki destekleyici alt-baslik. */
  description?: React.ReactNode;
  /** Birincil/ikincil CTA butonlari slotu. */
  actions?: React.ReactNode;
  /** Altta gosterilecek logo-cloud, gorsel veya guven satiri slotu. */
  footer?: React.ReactNode;
  /** Arka plan atmosferi: sade, aurora parilti veya marka gradyani. */
  atmosphere?: CenteredHeroAtmosphere;
}

const atmosphereClasses: Record<CenteredHeroAtmosphere, string> = {
  none: "",
  aurora: "bg-aurora",
  gradient:
    "bg-[radial-gradient(60%_60%_at_50%_0%,hsl(var(--primary)/0.14),transparent)]",
};

export const CenteredHero = React.forwardRef<HTMLElement, CenteredHeroProps>(
  (
    {
      eyebrow,
      title,
      description,
      actions,
      footer,
      atmosphere = "none",
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
          "relative overflow-hidden rounded-3xl px-6 py-20 sm:py-24",
          className,
        )}
        {...props}
      >
        {atmosphere !== "none" ? (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 -z-10 opacity-70",
              atmosphereClasses[atmosphere],
            )}
          />
        ) : null}
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          {eyebrow ? (
            <div className="animate-fade-up [animation-delay:0ms]">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="animate-fade-up font-display text-4xl font-bold tracking-tight text-foreground [animation-delay:60ms] sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl animate-fade-up text-balance text-lg text-muted-foreground [animation-delay:120ms] sm:text-xl">
              {description}
            </p>
          ) : null}
          {actions ? (
            <div className="flex animate-fade-up flex-col items-center justify-center gap-3 pt-2 [animation-delay:180ms] sm:flex-row">
              {actions}
            </div>
          ) : null}
          {children}
        </div>
        {footer ? (
          <div className="mx-auto mt-16 flex max-w-4xl animate-fade-up flex-col items-center gap-4 [animation-delay:240ms]">
            {footer}
          </div>
        ) : null}
      </section>
    );
  },
);
CenteredHero.displayName = "CenteredHero";
