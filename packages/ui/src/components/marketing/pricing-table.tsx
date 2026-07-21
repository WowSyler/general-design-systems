/**
 * PricingTable — plan karsilastirma tablosu.
 * Birden fazla abonelik planini (ad, fiyat/donem, aciklama, CTA) yan yana
 * sutunlar halinde ve altlarinda ozellik satirlarini (her planda Check/eksik
 * isareti veya serbest metin) gosterir. One cikan plan icin surekli ring +
 * rozet vurgusu, opsiyonel aylik/yillik PeriodSwitcher slotu ve alt not sunar.
 * DeployLens/Randevu/GlowScan gibi abonelik sayfalari icin tasarlanmistir.
 */
import * as React from "react";
import { Check, Minus, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Tablodaki tek bir plan sutunu. */
export interface PricingTablePlan {
  /** Benzersiz plan anahtari (React key + hucre eslesmesi icin). */
  id: string;
  /** Plan adi (or. "Takim"). */
  name: React.ReactNode;
  /** Fiyat (or. "₺249"). */
  price: React.ReactNode;
  /** Fiyat periyodu (or. "/ay"). */
  period?: React.ReactNode;
  /** Kisa plan aciklamasi. */
  description?: React.ReactNode;
  /** Alt aksiyon slotu (genelde tam-genislik buton). */
  cta?: React.ReactNode;
  /** One cikan plan (surekli ring + tonlu panel + rozet). */
  highlighted?: boolean;
  /** One cikan plan rozet metni. */
  highlightLabel?: React.ReactNode;
}

/**
 * Bir ozellik satirinin plan basina degeri.
 * `true` -> Check, `false` -> eksik isareti; diger her sey metin olarak basilir.
 */
export type PricingTableCell = boolean | React.ReactNode;

/** Ozellik karsilastirma satiri. */
export interface PricingTableFeature {
  /** Ozellik etiketi (satir basligi). */
  label: React.ReactNode;
  /** Etiketin altinda gosterilen ipucu / aciklama. */
  hint?: React.ReactNode;
  /** Plan sirasiyla hizali deger dizisi. */
  values: PricingTableCell[];
}

export interface PricingTableProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 2-4 plan sutunu. */
  plans: PricingTablePlan[];
  /** Ozellik karsilastirma satirlari. */
  features?: PricingTableFeature[];
  /** Sol ust hucre etiketi (ozellik sutunu basligi). */
  featureColumnLabel?: React.ReactNode;
  /** Tablonun ustundeki aylik/yillik PeriodSwitcher slotu. */
  periodSwitcher?: React.ReactNode;
  /** Tablonun altindaki kucuk not / dipnot. */
  caption?: React.ReactNode;
}

function renderCellValue(value: PricingTableCell) {
  if (value === true) {
    return (
      <>
        <Check className="size-4 text-success" aria-hidden="true" />
        <span className="sr-only">Dahil</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Minus className="size-4 text-muted-foreground/40" aria-hidden="true" />
        <span className="sr-only">Dahil değil</span>
      </>
    );
  }
  return <span className="font-medium tabular-nums text-foreground">{value}</span>;
}

export const PricingTable = React.forwardRef<HTMLDivElement, PricingTableProps>(
  (
    {
      plans,
      features = [],
      featureColumnLabel,
      periodSwitcher,
      caption,
      className,
      ...props
    },
    ref,
  ) => {
    const hasFeatures = features.length > 0;

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {periodSwitcher ? (
          <div className="mb-6 flex justify-center">{periodSwitcher}</div>
        ) : null}

        <div className="w-full overflow-x-auto">
          <div
            role="table"
            className="grid"
            style={{
              gridTemplateColumns: `minmax(9rem,1.3fr) repeat(${plans.length}, minmax(9.5rem,1fr))`,
              minWidth: `${(plans.length + 1) * 150}px`,
            }}
          >
            {/* Baslik satiri: plan sutunlari */}
            <div role="row" className="contents">
              <div
                role="columnheader"
                className="flex items-end p-5 text-sm font-medium text-muted-foreground"
              >
                {featureColumnLabel}
              </div>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  role="columnheader"
                  className={cn(
                    "relative flex flex-col gap-3 p-5 text-left transition-all duration-200",
                    plan.highlighted
                      ? cn(
                          "rounded-t-xl border-x border-t border-primary bg-primary/[0.06] shadow-sm",
                          !hasFeatures && "rounded-b-xl border-b",
                        )
                      : undefined,
                  )}
                >
                  {plan.highlighted ? (
                    <Badge className="w-fit gap-1">
                      <Sparkles className="size-3" aria-hidden="true" />
                      {plan.highlightLabel ?? "En Popüler"}
                    </Badge>
                  ) : null}
                  <div className="text-base font-semibold text-foreground">
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
                      {plan.price}
                    </span>
                    {plan.period ? (
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    ) : null}
                  </div>
                  {plan.description ? (
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  ) : null}
                  {plan.cta ? <div className="mt-1">{plan.cta}</div> : null}
                </div>
              ))}
            </div>

            {/* Ozellik satirlari */}
            {features.map((feature, rowIndex) => {
              const isLast = rowIndex === features.length - 1;
              return (
                <div role="row" className="contents" key={rowIndex}>
                  <div
                    role="rowheader"
                    className="flex flex-col justify-center gap-0.5 border-t border-border p-4 text-sm"
                  >
                    <span className="font-medium text-foreground">
                      {feature.label}
                    </span>
                    {feature.hint ? (
                      <span className="text-xs text-muted-foreground">
                        {feature.hint}
                      </span>
                    ) : null}
                  </div>
                  {plans.map((plan, planIndex) => (
                    <div
                      key={plan.id}
                      role="cell"
                      className={cn(
                        "flex items-center justify-center gap-2 p-4 text-center text-sm",
                        plan.highlighted
                          ? cn(
                              "border-x border-primary bg-primary/[0.06]",
                              isLast && "rounded-b-xl border-b",
                            )
                          : "border-t border-border",
                      )}
                    >
                      {renderCellValue(feature.values[planIndex])}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {caption ? (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {caption}
          </p>
        ) : null}
      </div>
    );
  },
);
PricingTable.displayName = "PricingTable";
