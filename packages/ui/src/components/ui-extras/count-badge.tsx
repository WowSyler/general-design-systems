/**
 * CountBadge / DotBadge / BadgeOverlay — Overlay (bindirme) amacli rozetler.
 * Mevcut Badge'den farkli olarak bir ikon/butonun kosesine binmek uzere
 * tasarlanmistir: CountBadge sayisal sayac gosterir (max asilinca "99+"),
 * DotBadge yalnizca renkli bir nokta cizer, BadgeOverlay ise verilen cocugun
 * (ikon/buton) bir kosesine rozeti konumlar. Arka planla ayrismasi icin
 * ring-2 ring-background halkasi kullanilir; renkler cva ile
 * primary/destructive/success arasindan secilir.
 * Kullanim: Dolap sepet urun sayaci, DeployLens bildirim noktasi.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const countBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold tabular-nums leading-none shadow-sm ring-2 ring-background transition-all duration-200",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        success: "bg-success text-success-foreground",
      },
      size: {
        sm: "h-4 min-w-4 px-1 text-[10px]",
        md: "h-5 min-w-5 px-1.5 text-[11px]",
        lg: "h-6 min-w-6 px-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "destructive",
      size: "md",
    },
  }
);

export interface CountBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof countBadgeVariants> {
  /** Gosterilecek sayi (or. okunmamis bildirim / sepet urun adedi). */
  count: number;
  /** Ust sinir; asilinca "<max>+" olarak gosterilir. Varsayilan 99. */
  max?: number;
  /** count 0 iken de rozeti goster. Varsayilan false (0'da render etmez). */
  showZero?: boolean;
  /** Ekran okuyucu aciklamasi. Verilmezse tam sayi degeri okunur. */
  srLabel?: string;
}

const CountBadge = React.forwardRef<HTMLSpanElement, CountBadgeProps>(
  (
    { count, max = 99, showZero = false, srLabel, variant, size, className, ...props },
    ref
  ) => {
    if (count <= 0 && !showZero) {
      return null;
    }

    const capped = count > max;
    const display = capped ? `${max}+` : `${count}`;

    return (
      <span
        ref={ref}
        role="status"
        aria-label={srLabel ?? `${count}`}
        className={cn(countBadgeVariants({ variant, size }), className)}
        {...props}
      >
        <span aria-hidden="true">{display}</span>
      </span>
    );
  }
);
CountBadge.displayName = "CountBadge";

const dotBadgeVariants = cva(
  "inline-block shrink-0 rounded-full ring-2 ring-background",
  {
    variants: {
      variant: {
        primary: "bg-primary",
        destructive: "bg-destructive",
        success: "bg-success",
      },
      size: {
        sm: "size-2",
        md: "size-2.5",
        lg: "size-3",
      },
    },
    defaultVariants: {
      variant: "destructive",
      size: "md",
    },
  }
);

export interface DotBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof dotBadgeVariants> {
  /** Noktayi nabiz gibi atacak sekilde canlandirir (canli/yeni durum). */
  pulse?: boolean;
  /** Ekran okuyucu aciklamasi. Verilirse role=status ile duyurulur. */
  srLabel?: string;
}

const DotBadge = React.forwardRef<HTMLSpanElement, DotBadgeProps>(
  ({ variant, size, pulse = false, srLabel, className, ...props }, ref) => (
    <span
      ref={ref}
      role={srLabel ? "status" : undefined}
      aria-label={srLabel}
      aria-hidden={srLabel ? undefined : true}
      className={cn(
        dotBadgeVariants({ variant, size }),
        pulse && "animate-glow-pulse motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
);
DotBadge.displayName = "DotBadge";

/** Rozetin cocugun hangi kosesine binecegini belirleyen konum siniflari. */
type BadgeOverlayPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

const overlayPositionClasses: Record<BadgeOverlayPosition, string> = {
  "top-right": "top-0 right-0 -translate-y-1/3 translate-x-1/3",
  "top-left": "top-0 left-0 -translate-y-1/3 -translate-x-1/3",
  "bottom-right": "bottom-0 right-0 translate-y-1/3 translate-x-1/3",
  "bottom-left": "bottom-0 left-0 translate-y-1/3 -translate-x-1/3",
};

export interface BadgeOverlayProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Kosesine rozet binecek eleman (ikon, buton, avatar vb.). */
  children: React.ReactNode;
  /** Konumlanacak rozet (genelde CountBadge veya DotBadge). */
  badge: React.ReactNode;
  /** Rozetin binecegi kose. Varsayilan "top-right". */
  position?: BadgeOverlayPosition;
}

const BadgeOverlay = React.forwardRef<HTMLSpanElement, BadgeOverlayProps>(
  ({ children, badge, position = "top-right", className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("relative inline-flex align-middle", className)}
      {...props}
    >
      {children}
      {badge != null ? (
        <span
          className={cn(
            "pointer-events-none absolute z-10 inline-flex",
            overlayPositionClasses[position]
          )}
        >
          {badge}
        </span>
      ) : null}
    </span>
  )
);
BadgeOverlay.displayName = "BadgeOverlay";

export {
  CountBadge,
  countBadgeVariants,
  DotBadge,
  dotBadgeVariants,
  BadgeOverlay,
};
