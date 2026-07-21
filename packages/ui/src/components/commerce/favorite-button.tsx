/**
 * FavoriteButton — kalp begeni/favori toggle butonu.
 * Dolu/bos Heart ikonu, opsiyonel begeni sayaci ve tiklama aninda
 * kisa bir buyume (scale) animasyonu sunar. Uc gorunum: sade ikon,
 * kart ustu yuvarlak overlay (bg-background/80 blur) ve etiketli detay.
 * Kontrollu (value + onValueChange) veya kontrolsuz (defaultValue)
 * calisir; aria-pressed ile durumu bildirir.
 * Dolap favori, GlowScan kaydet.
 */
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";

const favoriteButtonVariants = cva(
  "group/fav inline-flex select-none items-center justify-center gap-2 whitespace-nowrap outline-none transition-all duration-200 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        icon: "rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground",
        overlay:
          "rounded-full bg-background/80 p-2.5 text-foreground shadow-sm backdrop-blur-sm hover:bg-background hover:shadow-md",
        detail:
          "rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:border-ring/60 hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "icon",
      size: "md",
    },
  },
);

const iconSizeClasses: Record<NonNullable<FavoriteButtonProps["size"]>, string> =
  {
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  };

export interface FavoriteButtonProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "value" | "defaultValue" | "onChange"
    >,
    VariantProps<typeof favoriteButtonVariants> {
  /** Kontrollu begeni durumu. */
  value?: boolean;
  /** Kontrolsuz baslangic durumu. */
  defaultValue?: boolean;
  /** Durum degistiginde cagrilir. */
  onValueChange?: (value: boolean) => void;
  /** Gosterilecek begeni sayaci. */
  count?: number;
  /** Sayaci goster/gizle (varsayilan: count verilmisse gosterir). */
  showCount?: boolean;
  /** detail gorunumunde pasif etiket. */
  label?: React.ReactNode;
  /** detail gorunumunde begenilmis etiket. */
  activeLabel?: React.ReactNode;
}

const FavoriteButton = React.forwardRef<
  HTMLButtonElement,
  FavoriteButtonProps
>(
  (
    {
      value,
      defaultValue = false,
      onValueChange,
      count,
      showCount,
      label = "Favorilere ekle",
      activeLabel = "Favorilerde",
      variant = "icon",
      size = "md",
      className,
      disabled,
      onClick,
      "aria-label": ariaLabelProp,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const liked = isControlled ? value : internalValue;

    const [bump, setBump] = React.useState(false);
    React.useEffect(() => {
      if (!bump) return;
      const timer = setTimeout(() => setBump(false), 260);
      return () => clearTimeout(timer);
    }, [bump]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      const next = !liked;
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
      setBump(true);
    };

    const isDetail = variant === "detail";
    const shouldShowCount = showCount ?? typeof count === "number";
    const ariaLabel =
      ariaLabelProp ??
      (isDetail
        ? undefined
        : liked
          ? "Favorilerden cikar"
          : "Favorilere ekle");

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={liked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={handleClick}
        className={cn(favoriteButtonVariants({ variant, size }), className)}
        {...props}
      >
        <Heart
          aria-hidden="true"
          className={cn(
            iconSizeClasses[size ?? "md"],
            "shrink-0 transition-[color,fill,transform] duration-200 ease-out",
            liked ? "fill-current text-destructive" : "",
            bump ? "scale-125" : "scale-100",
          )}
        />
        {isDetail ? <span>{liked ? activeLabel : label}</span> : null}
        {shouldShowCount && typeof count === "number" ? (
          <span
            className={cn(
              "tabular-nums font-medium",
              size === "sm" ? "text-xs" : "text-sm",
              liked && !isDetail ? "text-foreground" : "",
            )}
          >
            {count.toLocaleString("tr-TR")}
          </span>
        ) : null}
      </button>
    );
  },
);
FavoriteButton.displayName = "FavoriteButton";

export { FavoriteButton, favoriteButtonVariants };
