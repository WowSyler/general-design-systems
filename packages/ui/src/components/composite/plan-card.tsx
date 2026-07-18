/**
 * PlanCard — abonelik/paket karti.
 * Fiyatlandirma sayfalarinda (paywall, billing) plan secenegini gosterir;
 * one cikan plan icin ring + banner, mevcut plan icin rozet destekler.
 */
import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface PlanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plan adi. */
  name: React.ReactNode;
  /** Fiyat (or. "₺149"). */
  price: React.ReactNode;
  /** Fiyat periyodu (or. "/ay"). */
  period?: React.ReactNode;
  /** Kisa plan aciklamasi. */
  description?: React.ReactNode;
  /** Ozellik satirlari (Check ikonu ile listelenir). */
  features?: React.ReactNode[];
  /** One cikan plan (ring + ust banner). */
  highlighted?: boolean;
  /** One cikan plan banner metni. */
  highlightLabel?: React.ReactNode;
  /** Kullanicinin mevcut plani mi? */
  current?: boolean;
  /** Alt aksiyon slotu (buton). */
  action?: React.ReactNode;
}

export const PlanCard = React.forwardRef<HTMLDivElement, PlanCardProps>(
  (
    {
      name,
      price,
      period,
      description,
      features,
      highlighted = false,
      highlightLabel = "En Popüler",
      current = false,
      action,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow",
          highlighted && "ring-2 ring-primary",
          className,
        )}
        {...props}
      >
        {highlighted ? (
          <div className="bg-primary px-4 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            {highlightLabel}
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-2">
            <div className="text-base font-semibold">{name}</div>
            {current ? (
              <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Mevcut plan
              </span>
            ) : null}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight">{price}</span>
            {period ? (
              <span className="text-sm text-muted-foreground">{period}</span>
            ) : null}
          </div>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
          {features && features.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {action ? <div className="mt-auto w-full pt-2">{action}</div> : null}
        </div>
      </div>
    );
  },
);
PlanCard.displayName = "PlanCard";
