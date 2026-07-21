/**
 * PriceTag — fiyat gosterimi (Dolap urun karti / detay / ray).
 * Guncel fiyati buyuk ve tabular-nums olarak; opsiyonel ustu-cizili
 * orijinal fiyati, otomatik ya da elle verilen indirim yuzdesi rozetini
 * (-%30) ve 'Pazarliga acik' etiketini tema-agnostik sunar. Para birimi
 * simgesi degistirilebilir; sm/md/lg boyutlariyla kart, detay ve rayda
 * tutarli gorunur.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Handshake } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const priceTagVariants = cva("inline-flex flex-col items-start gap-1.5", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type PriceTagSize = NonNullable<VariantProps<typeof priceTagVariants>["size"]>;

const sizeStyles: Record<
  PriceTagSize,
  {
    row: string;
    price: string;
    original: string;
    badge: string;
    negotiable: string;
    icon: string;
  }
> = {
  sm: {
    row: "gap-x-1.5 gap-y-1",
    price: "text-base",
    original: "text-xs",
    badge: "px-1.5 py-0 text-[10px]",
    negotiable: "px-1.5 py-0.5 text-[10px]",
    icon: "size-3",
  },
  md: {
    row: "gap-x-2 gap-y-1",
    price: "text-2xl",
    original: "text-sm",
    badge: "text-xs",
    negotiable: "px-2 py-0.5 text-xs",
    icon: "size-3.5",
  },
  lg: {
    row: "gap-x-2.5 gap-y-1.5",
    price: "text-3xl",
    original: "text-base",
    badge: "px-2.5 py-0.5 text-sm",
    negotiable: "px-2.5 py-1 text-sm",
    icon: "size-4",
  },
};

/** Sayiyi tr-TR bicimiyle para birimi simgesine (onek) baglar. */
function formatCurrency(value: number, currency: string): string {
  const formatted = new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 2,
  }).format(value);
  return `${currency}${formatted}`;
}

export interface PriceTagProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof priceTagVariants> {
  /** Guncel (satis) fiyati. */
  price: number;
  /** Indirim oncesi orijinal fiyat; verilirse ustu cizili gosterilir. */
  originalPrice?: number;
  /** Para birimi simgesi (onek). Varsayilan Turk Lirasi. */
  currency?: string;
  /** Indirim yuzdesi; verilmezse originalPrice'tan otomatik hesaplanir. */
  discountPercent?: number;
  /** 'Pazarliga acik' etiketini gosterir. */
  negotiable?: boolean;
}

const PriceTag = React.forwardRef<HTMLDivElement, PriceTagProps>(
  (
    {
      price,
      originalPrice,
      currency = "₺",
      discountPercent,
      negotiable = false,
      size = "md",
      className,
      ...props
    },
    ref,
  ) => {
    const sizeKey: PriceTagSize = size ?? "md";
    const s = sizeStyles[sizeKey];

    const hasOriginal =
      typeof originalPrice === "number" && originalPrice > price;

    const discount =
      typeof discountPercent === "number"
        ? discountPercent
        : hasOriginal
          ? Math.round((1 - price / (originalPrice as number)) * 100)
          : undefined;
    const showDiscount = typeof discount === "number" && discount > 0;

    const ariaParts = [`Güncel fiyat ${formatCurrency(price, currency)}`];
    if (hasOriginal) {
      ariaParts.push(
        `önceki fiyat ${formatCurrency(originalPrice as number, currency)}`,
      );
    }
    if (showDiscount) {
      ariaParts.push(`yüzde ${discount} indirim`);
    }
    if (negotiable) {
      ariaParts.push("pazarlığa açık");
    }
    const ariaLabel = ariaParts.join(", ");

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn(priceTagVariants({ size: sizeKey }), className)}
        {...props}
      >
        <div className={cn("flex flex-wrap items-baseline", s.row)}>
          <span
            aria-hidden="true"
            className={cn(
              "font-bold tabular-nums leading-none text-foreground",
              s.price,
            )}
          >
            {formatCurrency(price, currency)}
          </span>
          {hasOriginal ? (
            <span
              aria-hidden="true"
              className={cn(
                "tabular-nums text-muted-foreground line-through",
                s.original,
              )}
            >
              {formatCurrency(originalPrice as number, currency)}
            </span>
          ) : null}
          {showDiscount ? (
            <Badge
              aria-hidden="true"
              variant="destructive"
              className={cn("font-semibold tabular-nums", s.badge)}
            >
              -%{discount}
            </Badge>
          ) : null}
        </div>
        {negotiable ? (
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex items-center gap-1 rounded-full bg-muted font-medium text-muted-foreground",
              s.negotiable,
            )}
          >
            <Handshake className={s.icon} aria-hidden="true" />
            Pazarlığa açık
          </span>
        ) : null}
      </div>
    );
  },
);
PriceTag.displayName = "PriceTag";

export { PriceTag, priceTagVariants };
