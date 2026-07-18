/**
 * ProductCard — urun vitrin karti.
 * Gorsel (yoksa ImageOff yer tutucu), baslik, fiyat, eski fiyat,
 * puan, rozet ve aksiyon slotunu hover kaldirma efektiyle sunar.
 */
import * as React from "react";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/commerce/rating";

export interface ProductCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Urun gorseli adresi. */
  image?: string;
  /** Gorsel alternatif metni. */
  imageAlt?: string;
  /** Urun adi. */
  title: React.ReactNode;
  /** Guncel fiyat. */
  price: React.ReactNode;
  /** Indirim oncesi fiyat. */
  oldPrice?: React.ReactNode;
  /** Puan (0-5). */
  rating?: number;
  /** Gorsel ustu rozet metni. */
  badge?: React.ReactNode;
  /** Aksiyon slotu (sepete ekle vb.). */
  action?: React.ReactNode;
}

export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      image,
      imageAlt,
      title,
      price,
      oldPrice,
      rating,
      badge,
      action,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
          className,
        )}
        {...props}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {image ? (
            <img
              src={image}
              alt={typeof imageAlt === "string" ? imageAlt : ""}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <ImageOff
                aria-hidden="true"
                className="size-8 text-muted-foreground/50"
              />
            </div>
          )}
          {badge ? (
            <Badge className="absolute left-3 top-3">{badge}</Badge>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="line-clamp-2 text-sm font-medium">{title}</div>
          {typeof rating === "number" ? (
            <Rating value={rating} size="sm" showValue />
          ) : null}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold tabular-nums">
              {price}
            </span>
            {oldPrice ? (
              <span className="text-sm tabular-nums text-muted-foreground line-through">
                {oldPrice}
              </span>
            ) : null}
          </div>
          {children}
          {action ? <div className="pt-1">{action}</div> : null}
        </div>
      </div>
    );
  },
);
ProductCard.displayName = "ProductCard";
