/**
 * MiniCartBadge — Header (baslik) sepet rozeti/butonu.
 * Sepet ikonu (ShoppingBag/ShoppingCart) + sag-ust urun sayaci rozeti +
 * opsiyonel toplam tutar gosterir. Salt sunum amaclidir (kendi durumu yok);
 * asChild ile bir <a>/<button> gibi tiklanabilir bir sarmalayiciya donusur.
 * Sayac count > max iken "<max>+" olarak kirpilir. Erisilebilirlik: tek bir
 * aria-label ("Sepet: N urun") ile duyurulur, gorsel rozet aria-hidden'dir.
 * Kullanim: Dolap ust bar sepet butonu, urun listesi header'i.
 */
import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ShoppingBag } from "lucide-react";

import { BadgeOverlay } from "@/components/ui-extras/count-badge";
import { cn } from "@/lib/utils";

const miniCartBadgeVariants = cva(
  "group relative inline-flex items-center gap-2.5 pointer-coarse:min-h-11 pointer-coarse:min-w-11 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary bg-sheen text-primary-foreground shadow hover:shadow-md hover:brightness-[1.06]",
        outline:
          "border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-ring/60",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-8 gap-2 px-2.5 text-xs",
        md: "h-9 px-3 text-sm",
        lg: "h-11 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  }
);

const badgeSizeClasses: Record<
  NonNullable<VariantProps<typeof miniCartBadgeVariants>["size"]>,
  string
> = {
  sm: "h-4 min-w-4 px-1 text-[10px]",
  md: "h-[18px] min-w-[18px] px-1 text-[10px]",
  lg: "h-5 min-w-5 px-1.5 text-[11px]",
};

const iconSizeClasses: Record<
  NonNullable<VariantProps<typeof miniCartBadgeVariants>["size"]>,
  string
> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

export interface MiniCartBadgeProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children">,
    VariantProps<typeof miniCartBadgeVariants> {
  /** Sepetteki urun adedi; sag-ust rozeti bu deger yonetir. */
  count?: number;
  /** Rozet ust siniri; asilinca "<max>+" olarak gosterilir. Varsayilan 99. */
  max?: number;
  /** count 0 iken de rozeti goster. Varsayilan false. */
  showZero?: boolean;
  /** Opsiyonel bicimlenmis toplam tutar (or. "₺1.248,50"). */
  total?: React.ReactNode;
  /** Sepet ikonu. Varsayilan ShoppingBag. */
  icon?: React.ReactNode;
  /** Rozetin rengi. Varsayilan "destructive". */
  badgeTone?: "primary" | "destructive" | "success";
  /** Erisilebilir etiket. Verilmezse "Sepet: N urun" uretilir. */
  label?: string;
  /** true iken tek cocuk (or. <a>) tiklanabilir sarmalayici olur (Slot). */
  asChild?: boolean;
  /** asChild iken kok eleman (or. <a href>). Aksi halde yok sayilir. */
  children?: React.ReactNode;
}

const badgeToneClasses: Record<
  NonNullable<MiniCartBadgeProps["badgeTone"]>,
  string
> = {
  primary: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  success: "bg-success text-success-foreground",
};

const MiniCartBadge = React.forwardRef<HTMLElement, MiniCartBadgeProps>(
  (
    {
      count = 0,
      max = 99,
      showZero = false,
      total,
      icon,
      badgeTone = "destructive",
      label,
      variant,
      size,
      asChild = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const resolvedSize = size ?? "md";
    const showBadge = count > 0 || showZero;
    const capped = count > max;
    const badgeText = capped ? `${max}+` : `${count}`;
    const computedLabel =
      label ?? `Sepet: ${count > max ? `${max}+` : count} urun`;

    const cartIcon = icon ?? (
      <ShoppingBag className={iconSizeClasses[resolvedSize]} aria-hidden="true" />
    );

    const content = (
      <>
        <BadgeOverlay
          badge={
            showBadge ? (
              <span
                aria-hidden="true"
                className={cn(
                  "inline-flex items-center justify-center rounded-full font-semibold leading-none tabular-nums shadow-sm ring-2 ring-background",
                  badgeSizeClasses[resolvedSize],
                  badgeToneClasses[badgeTone]
                )}
              >
                {badgeText}
              </span>
            ) : null
          }
        >
          {cartIcon}
        </BadgeOverlay>
        {total != null ? (
          <span className="font-semibold tabular-nums">{total}</span>
        ) : null}
      </>
    );

    return (
      <Comp
        ref={ref as React.Ref<HTMLButtonElement>}
        aria-label={computedLabel}
        className={cn(miniCartBadgeVariants({ variant, size }), className)}
        {...(asChild ? {} : { type: "button" as const })}
        {...props}
      >
        {content}
        {asChild ? <Slottable>{children}</Slottable> : null}
      </Comp>
    );
  }
);
MiniCartBadge.displayName = "MiniCartBadge";

export { MiniCartBadge, miniCartBadgeVariants };
