/**
 * CartLineItem — sepet satiri.
 * Urun gorseli, baslik, varyant, fiyat, adet slotu ve
 * kaldirma butonunu tek satirda hizalar.
 */
"use client";

import * as React from "react";
import { ImageOff, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface CartLineItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Urun gorseli adresi. */
  image?: string;
  /** Gorsel alternatif metni. */
  imageAlt?: string;
  /** Urun adi. */
  title: React.ReactNode;
  /** Varyant bilgisi (beden, renk vb.). */
  variant?: React.ReactNode;
  /** Satir fiyati. */
  price: React.ReactNode;
  /** Adet kontrolu slotu (or. QuantityStepper). */
  quantity?: React.ReactNode;
  /** Kaldirma butonu tiklandiginda cagrilir; verilmezse buton gizlenir. */
  onRemove?: () => void;
}

export const CartLineItem = React.forwardRef<HTMLDivElement, CartLineItemProps>(
  (
    {
      image,
      imageAlt,
      title,
      variant,
      price,
      quantity,
      onRemove,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-4 py-4", className)}
        {...props}
      >
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
          {image ? (
            <img
              src={image}
              alt={typeof imageAlt === "string" ? imageAlt : ""}
              className="size-full object-cover"
            />
          ) : (
            <ImageOff
              aria-hidden="true"
              className="size-5 text-muted-foreground/50"
            />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="truncate text-sm font-medium">{title}</div>
          {variant ? (
            <div className="truncate text-xs text-muted-foreground">
              {variant}
            </div>
          ) : null}
          <div className="text-sm font-semibold tabular-nums">{price}</div>
          {children}
        </div>
        {quantity ? <div className="shrink-0">{quantity}</div> : null}
        {onRemove ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            aria-label="Ürünü kaldır"
            onClick={onRemove}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        ) : null}
      </div>
    );
  },
);
CartLineItem.displayName = "CartLineItem";
