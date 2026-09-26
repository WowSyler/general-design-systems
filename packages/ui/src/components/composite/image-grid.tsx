/**
 * ImageGrid + PhotoCard — fotograf agirlikli gardirop deseni.
 * ImageGrid responsive bir grid kabugu; PhotoCard gorsel, rozet ve
 * baslik/altbaslik alanlariyla tek bir fotograf kartini temsil eder.
 */
import * as React from "react";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

export type ImageGridProps = React.HTMLAttributes<HTMLDivElement>;

export const ImageGrid = React.forwardRef<HTMLDivElement, ImageGridProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
      {...props}
    />
  ),
);
ImageGrid.displayName = "ImageGrid";

export interface PhotoCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Gorsel kaynagi; yoksa fallback alani gosterilir. */
  src?: string;
  /** Gorsel alternatif metni. */
  alt: string;
  /** src yokken gosterilecek icerik (varsayilan: ImageOff ikonu). */
  fallback?: React.ReactNode;
  /** Kart basligi. */
  title?: React.ReactNode;
  /** Kart alt basligi. */
  subtitle?: React.ReactNode;
  /** Sol ust rozet slotu. */
  badge?: React.ReactNode;
  /** Sag ust slot (or. favori butonu). */
  topRight?: React.ReactNode;
  /** Gorsel orani. */
  aspect?: "square" | "portrait";
}

const aspectClasses: Record<"square" | "portrait", string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

export const PhotoCard = React.forwardRef<HTMLDivElement, PhotoCardProps>(
  (
    {
      src,
      alt,
      fallback,
      title,
      subtitle,
      badge,
      topRight,
      aspect = "square",
      onClick,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onClick(
                    event as unknown as React.MouseEvent<HTMLDivElement>,
                  );
                }
              }
            : undefined
        }
        className={cn(
          "group overflow-hidden rounded-lg border bg-card text-card-foreground",
          onClick &&
            "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
        {...props}
      >
        <div className={cn("relative overflow-hidden", aspectClasses[aspect])}>
          {src ? (
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div
              role="img"
              aria-label={alt}
              className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground"
            >
              {fallback ?? <ImageOff className="size-8" aria-hidden="true" />}
            </div>
          )}
          {badge ? (
            <div className="absolute start-2 top-2">{badge}</div>
          ) : null}
          {topRight ? (
            <div className="absolute end-2 top-2">{topRight}</div>
          ) : null}
        </div>
        {title || subtitle ? (
          <div className="p-2">
            {title ? (
              <div className="truncate text-sm font-medium">{title}</div>
            ) : null}
            {subtitle ? (
              <div className="truncate text-xs text-muted-foreground">
                {subtitle}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);
PhotoCard.displayName = "PhotoCard";
