/**
 * FeatureCta — buyuk gradyan CTA karti.
 * Ana aksiyonlari (or. "analizi baslat") ikon, baslik ve aciklama ile
 * brand-gradient arka planli genis bir kart olarak sunar.
 */
import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface FeatureCtaProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Soldaki ikon kutusu icerigi. */
  icon?: React.ReactNode;
  /** Baslik ustu kucuk etiket. */
  overline?: React.ReactNode;
  /** Baslik. */
  title: React.ReactNode;
  /** Aciklama metni. */
  description?: React.ReactNode;
  /** Tiklama isleyicisi. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** onClick verildiginde <button> olarak render edilir. */
  asButton?: boolean;
}

export const FeatureCta = React.forwardRef<HTMLElement, FeatureCtaProps>(
  (
    { icon, overline, title, description, onClick, asButton, className, ...props },
    ref,
  ) => {
    const isButton = Boolean(asButton ?? onClick);

    const content = (
      <>
        {icon ? (
          <div className="shrink-0 rounded-xl bg-white/15 p-3">{icon}</div>
        ) : null}
        <div className="min-w-0 flex-1">
          {overline ? (
            <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
              {overline}
            </div>
          ) : null}
          <div className="text-lg font-semibold">{title}</div>
          {description ? (
            <div className="text-sm opacity-90">{description}</div>
          ) : null}
        </div>
        <ChevronRight className="size-5 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
      </>
    );

    const rootClassName = cn(
      "flex w-full items-center gap-4 rounded-2xl bg-brand-gradient p-5 text-start text-primary-foreground shadow-glow transition-all duration-300 hover:shadow-xl hover:opacity-95",
      isButton &&
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      className,
    );

    if (isButton) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          className={rootClassName}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {content}
        </button>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={rootClassName}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {content}
      </div>
    );
  },
);
FeatureCta.displayName = "FeatureCta";
