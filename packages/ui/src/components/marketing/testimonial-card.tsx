/**
 * TestimonialCard — musteri yorumu karti.
 * Alinti, isim/unvan, opsiyonel avatar ve 0-5 yildiz puanini sunar.
 * Sol ustte dekoratif buyuk tirnak isareti bulunur.
 */
import * as React from "react";
import { Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TestimonialCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Alinti metni. */
  quote: React.ReactNode;
  /** Yorumu yapan kisinin adi (avatar yoksa bas harfi kullanilir). */
  name: string;
  /** Unvan / sirket bilgisi. */
  title?: React.ReactNode;
  /** Avatar slotu; verilmezse isim bas harfli daire gosterilir. */
  avatar?: React.ReactNode;
  /** Yildiz puani (0-5). */
  rating?: number;
}

const MAX_RATING = 5;

export const TestimonialCard = React.forwardRef<
  HTMLDivElement,
  TestimonialCardProps
>(({ quote, name, title, avatar, rating, className, ...props }, ref) => {
  const clampedRating =
    rating === undefined ? undefined : Math.max(0, Math.min(MAX_RATING, Math.round(rating)));

  return (
    <Card
      ref={ref}
      className={cn("relative flex flex-col gap-4 p-6 pt-10", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute start-4 top-1 select-none font-display text-7xl leading-none text-primary/15"
      >
        &ldquo;
      </span>
      {clampedRating !== undefined ? (
        <div
          className="flex items-center gap-0.5"
          role="img"
          aria-label={`${clampedRating} / ${MAX_RATING} yıldız`}
        >
          {Array.from({ length: MAX_RATING }, (_, index) => (
            <Star
              key={index}
              aria-hidden="true"
              className={cn(
                "size-4",
                index < clampedRating
                  ? "fill-current text-warning"
                  : "text-muted-foreground/30",
              )}
            />
          ))}
        </div>
      ) : null}
      <blockquote className="text-sm leading-relaxed text-foreground">
        {quote}
      </blockquote>
      <div className="mt-auto flex items-center gap-3 pt-2">
        {avatar ?? (
          <div
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
          >
            {name.charAt(0).toLocaleUpperCase("tr-TR")}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-sm font-semibold">{name}</div>
          {title ? (
            <div className="text-xs text-muted-foreground">{title}</div>
          ) : null}
        </div>
      </div>
    </Card>
  );
});
TestimonialCard.displayName = "TestimonialCard";
