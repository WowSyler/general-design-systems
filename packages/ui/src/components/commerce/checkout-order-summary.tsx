/**
 * CheckoutOrderSummary — odeme ozet karti (Dolap checkout / Randevu on-odeme).
 * Urun/hizmet satirlarini (ad + adet + birim fiyat), ara toplami, kargoyu,
 * kupon indirimini ve KDV'yi tek kartta ozetler; buyuk toplam tutarini ve
 * 'Odemeye gec' CTA'sini altta sunar. Ara toplam, KDV ve toplam verilmezse
 * satirlardan otomatik hesaplanir. Tema-agnostik, tabular-nums hizali ve
 * erisilebilir (para tutarlari icin aria-label).
 */
import * as React from "react";
import { ShieldCheck, Tag, Truck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/** Sayiyi tr-TR bicimiyle iki ondalikli para tutarina (simge onekli) baglar. */
function formatCurrency(value: number, currency: string): string {
  const formatted = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${currency}${formatted}`;
}

export interface CheckoutOrderSummaryItem {
  /** Satir icin benzersiz anahtar (verilmezse indeks kullanilir). */
  id?: string | number;
  /** Urun veya hizmet adi. */
  name: React.ReactNode;
  /** Adet; verilmezse 1 kabul edilir. */
  quantity?: number;
  /** Birim fiyat; satir toplami adet ile carpilarak hesaplanir. */
  unitPrice: number;
  /** Ad altinda gosterilen ikincil bilgi (varyant, tarih vb.). */
  note?: React.ReactNode;
}

export interface CheckoutOrderSummaryProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Odeme kalemleri (urun/hizmet satirlari). */
  items: CheckoutOrderSummaryItem[];
  /** Para birimi simgesi (onek). Varsayilan Turk Lirasi. */
  currency?: string;
  /** Kart basligi. */
  title?: React.ReactNode;
  /** Ara toplam; verilmezse satirlardan otomatik hesaplanir. */
  subtotal?: number;
  /** Kargo tutari; verilmezse kargo satiri gizlenir, 0 ise 'Ucretsiz' gosterilir. */
  shipping?: number;
  /** Indirim tutari (pozitif verilir, toplamdan dusulur). */
  discount?: number;
  /** Uygulanan kupon kodu; verilirse indirim satirinda rozet olarak gosterilir. */
  couponCode?: React.ReactNode;
  /** KDV orani (yuzde); taxAmount verilmezse ara toplam - indirim uzerinden hesaplanir. */
  taxRate?: number;
  /** KDV tutari; verilirse taxRate yerine bu kullanilir. */
  taxAmount?: number;
  /** Genel toplam; verilmezse bilesenlerden otomatik hesaplanir. */
  total?: number;
  /** Toplam satirinin altindaki aciklama (or. KDV dahildir). */
  totalNote?: React.ReactNode;
  /** CTA metni. */
  ctaLabel?: React.ReactNode;
  /** CTA tiklandiginda cagrilir. */
  onCheckout?: () => void;
  /** CTA'yi pasiflestirir. */
  ctaDisabled?: boolean;
  /** CTA altinda gosterilen guvence notu. */
  footnote?: React.ReactNode;
}

interface SummaryRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  valueClassName?: string;
}

/** Ozet bolumundeki tek bir etiket/tutar satiri. */
function SummaryRow({ label, value, icon, valueClassName }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span
        className={cn("font-medium tabular-nums text-foreground", valueClassName)}
      >
        {value}
      </span>
    </div>
  );
}

const CheckoutOrderSummary = React.forwardRef<
  HTMLDivElement,
  CheckoutOrderSummaryProps
>(
  (
    {
      items,
      currency = "₺",
      title = "Sipariş Özeti",
      subtotal,
      shipping,
      discount,
      couponCode,
      taxRate,
      taxAmount,
      total,
      totalNote,
      ctaLabel = "Ödemeye geç",
      onCheckout,
      ctaDisabled = false,
      footnote = "256-bit SSL ile güvenli ödeme",
      className,
      ...props
    },
    ref,
  ) => {
    const computedSubtotal =
      typeof subtotal === "number"
        ? subtotal
        : items.reduce(
            (sum, item) => sum + item.unitPrice * (item.quantity ?? 1),
            0,
          );

    const discountAmount =
      typeof discount === "number" && discount > 0 ? discount : undefined;

    const taxBase = computedSubtotal - (discountAmount ?? 0);
    const computedTax =
      typeof taxAmount === "number"
        ? taxAmount
        : typeof taxRate === "number"
          ? (taxBase * taxRate) / 100
          : undefined;

    const computedTotal =
      typeof total === "number"
        ? total
        : computedSubtotal +
          (shipping ?? 0) -
          (discountAmount ?? 0) +
          (computedTax ?? 0);

    const itemCount = items.reduce(
      (count, item) => count + (item.quantity ?? 1),
      0,
    );

    return (
      <Card
        ref={ref}
        className={cn("w-full max-w-sm", className)}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">{title}</CardTitle>
          <span className="text-xs font-medium tabular-nums text-muted-foreground">
            {itemCount} ürün
          </span>
        </CardHeader>

        <CardContent className="space-y-4">
          <ul className="space-y-3">
            {items.map((item, index) => {
              const quantity = item.quantity ?? 1;
              const lineTotal = item.unitPrice * quantity;
              return (
                <li
                  key={item.id ?? index}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-2">
                    <span className="mt-px inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-muted px-1 text-xs font-semibold tabular-nums text-muted-foreground">
                      {quantity}
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-medium text-foreground">
                        {item.name}
                      </span>
                      {item.note ? (
                        <span className="truncate text-xs text-muted-foreground">
                          {item.note}
                        </span>
                      ) : null}
                    </span>
                  </div>
                  <span className="shrink-0 font-medium tabular-nums text-foreground">
                    {formatCurrency(lineTotal, currency)}
                  </span>
                </li>
              );
            })}
          </ul>

          <Separator />

          <div className="space-y-2.5">
            <SummaryRow
              label="Ara toplam"
              value={formatCurrency(computedSubtotal, currency)}
            />

            {typeof shipping === "number" ? (
              <SummaryRow
                label="Kargo"
                icon={
                  <Truck className="size-3.5 text-muted-foreground" aria-hidden="true" />
                }
                value={
                  shipping > 0 ? (
                    formatCurrency(shipping, currency)
                  ) : (
                    <span className="font-semibold text-success">Ücretsiz</span>
                  )
                }
              />
            ) : null}

            {discountAmount ? (
              <SummaryRow
                label={
                  <span className="flex items-center gap-1.5">
                    <Tag className="size-3.5 text-success" aria-hidden="true" />
                    İndirim
                    {couponCode ? (
                      <span className="rounded-md bg-success/10 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-success">
                        {couponCode}
                      </span>
                    ) : null}
                  </span>
                }
                value={`-${formatCurrency(discountAmount, currency)}`}
                valueClassName="text-success"
              />
            ) : null}

            {typeof computedTax === "number" ? (
              <SummaryRow
                label={
                  typeof taxRate === "number" && typeof taxAmount !== "number"
                    ? `KDV (%${taxRate})`
                    : "KDV"
                }
                value={formatCurrency(computedTax, currency)}
              />
            ) : null}
          </div>

          <Separator />

          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              Toplam
            </span>
            <span
              className="text-2xl font-bold tabular-nums text-foreground"
              aria-label={`Toplam tutar ${formatCurrency(computedTotal, currency)}`}
            >
              {formatCurrency(computedTotal, currency)}
            </span>
          </div>
          {totalNote ? (
            <p className="-mt-2 text-right text-xs text-muted-foreground">
              {totalNote}
            </p>
          ) : null}
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-3">
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={onCheckout}
            disabled={ctaDisabled}
          >
            {ctaLabel}
          </Button>
          {footnote ? (
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              {footnote}
            </p>
          ) : null}
        </CardFooter>
      </Card>
    );
  },
);
CheckoutOrderSummary.displayName = "CheckoutOrderSummary";

export { CheckoutOrderSummary, formatCurrency as checkoutOrderSummaryFormat };
