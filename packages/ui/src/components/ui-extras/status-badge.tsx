/**
 * StatusBadge — Durum rozeti (nokta + etiket, pill formu).
 * Yumusak dolgulu (bg-<token>/15 text-<token>) hap seklinde rozet; solda
 * durumu ozetleyen renkli bir nokta, opsiyonel olarak ikon gosterir.
 * "running" durumunda nokta nabiz gibi atar (canli/surmekte olan is).
 * Kullanim: DeployLens build durumu, Dolap siparis durumu, Randevu
 * randevu durumu gibi liste satiri ve tablo hucrelerinde.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium tabular-nums transition-all duration-200 [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        destructive: "bg-destructive/15 text-destructive",
        info: "bg-info/15 text-info",
        neutral: "bg-muted text-muted-foreground",
        running: "bg-primary/15 text-primary",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

/** Noktanin dolu rengi — pill metin rengiyle ayni tonu izler. */
const dotColorMap: Record<
  NonNullable<VariantProps<typeof statusBadgeVariants>["variant"]>,
  string
> = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
  neutral: "bg-muted-foreground",
  running: "bg-primary",
};

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  /** Rozet uzerinde gorunen durum metni (or. "Yayinda", "Beklemede"). */
  label: string;
  /** Nokta yerine gosterilecek opsiyonel ikon (or. lucide bileseni). */
  icon?: React.ReactNode;
  /** Noktayi nabiz gibi atacak sekilde canlandirir. running icin varsayilan acik. */
  pulse?: boolean;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ label, icon, variant = "neutral", pulse, className, ...props }, ref) => {
    const resolvedVariant = variant ?? "neutral";
    const shouldPulse = pulse ?? resolvedVariant === "running";

    return (
      <span
        ref={ref}
        className={cn(statusBadgeVariants({ variant }), className)}
        {...props}
      >
        {icon ? (
          <span className="inline-flex" aria-hidden="true">
            {icon}
          </span>
        ) : (
          <span
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              dotColorMap[resolvedVariant],
              shouldPulse && "animate-glow-pulse"
            )}
            aria-hidden="true"
          />
        )}
        <span>{label}</span>
      </span>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusBadgeVariants };
