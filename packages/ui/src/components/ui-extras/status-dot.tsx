/**
 * StatusDot — Durum noktasi (DeployLens dagitim durumu / Randevu musaitlik).
 * cva ile renklendirilmis kucuk bir daire; cevrimici, mesgul, hata gibi
 * durumlari semantik tokenlarla gosterir. "running" varyantinda halka ve
 * nabiz animasyonu (animate-glow-pulse) ile canli surec belirtilir.
 * Opsiyonel gorunur etiket alir; her durum ekran okuyuculara duyurulur.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusDotVariants = cva("inline-block shrink-0 rounded-full", {
  variants: {
    variant: {
      online: "bg-success",
      offline: "bg-muted-foreground",
      away: "bg-warning",
      busy: "bg-destructive",
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-destructive",
      info: "bg-info",
      running:
        "bg-info ring-4 ring-info/20 animate-glow-pulse motion-reduce:animate-none",
    },
    size: {
      sm: "size-2",
      md: "size-2.5",
      lg: "size-3",
    },
  },
  defaultVariants: {
    variant: "online",
    size: "md",
  },
});

type StatusDotVariant = NonNullable<
  VariantProps<typeof statusDotVariants>["variant"]
>;

/** Her durum icin varsayilan Turkce ekran okuyucu etiketi. */
const statusDotLabels: Record<StatusDotVariant, string> = {
  online: "Çevrimiçi",
  offline: "Çevrimdışı",
  away: "Uzakta",
  busy: "Meşgul",
  success: "Başarılı",
  warning: "Uyarı",
  error: "Hata",
  info: "Bilgi",
  running: "Çalışıyor",
};

export interface StatusDotProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof statusDotVariants> {
  /** Noktanin yaninda gosterilecek opsiyonel gorunur etiket. */
  label?: React.ReactNode;
  /** Ekran okuyucu aciklamasi. Verilmezse varyanttan turetilir. */
  srLabel?: string;
}

const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  (
    { variant, size, label, srLabel, className, ...props },
    ref
  ) => {
    const resolvedVariant: StatusDotVariant = variant ?? "online";
    const accessibleLabel =
      srLabel ??
      (typeof label === "string" ? label : statusDotLabels[resolvedVariant]);

    return (
      <span
        ref={ref}
        role="status"
        className={cn("inline-flex items-center gap-2 align-middle", className)}
        {...props}
      >
        <span
          className={cn(statusDotVariants({ variant: resolvedVariant, size }))}
          aria-hidden="true"
        />
        {label != null ? (
          <span className="text-sm font-medium text-foreground tabular-nums">
            {label}
          </span>
        ) : null}
        <span className="sr-only">{accessibleLabel}</span>
      </span>
    );
  }
);
StatusDot.displayName = "StatusDot";

export { StatusDot, statusDotVariants };
