"use client";

/**
 * AlertCallout — Semantik uyari/callout bileseni.
 * Mevcut Alert primitifinden daha zengin: cva ile info/success/warning/error/neutral
 * tonlari (ikon ve renk otomatik), inline (karti) ve banner (tam genislik) gorunum,
 * X ile kapatilabilir (dismissible + onDismiss), opsiyonel aksiyon butonlari,
 * baslik + aciklama. Form ve sistem geri bildirimleri icin uygundur; ton'a gore
 * role=alert (error/warning) ya da role=status (info/success/neutral) verir.
 */
import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertCalloutVariants = cva(
  "relative flex w-full gap-3 text-sm transition-all duration-200",
  {
    variants: {
      tone: {
        info: "bg-info/10 border-info/25 border-l-info/70",
        success: "bg-success/10 border-success/25 border-l-success/70",
        warning: "bg-warning/10 border-warning/25 border-l-warning/70",
        error: "bg-destructive/10 border-destructive/25 border-l-destructive/70",
        neutral: "bg-muted/50 border-border border-l-primary/50",
      },
      appearance: {
        inline: "rounded-lg border border-l-4 px-4 py-3 shadow-sm",
        banner: "border-b border-l-4 px-5 py-3.5",
      },
    },
    defaultVariants: {
      tone: "info",
      appearance: "inline",
    },
  }
);

type AlertCalloutTone = NonNullable<
  VariantProps<typeof alertCalloutVariants>["tone"]
>;

const toneIcons: Record<AlertCalloutTone, React.ElementType> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  neutral: Sparkles,
};

const toneIconClasses: Record<AlertCalloutTone, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
  neutral: "text-muted-foreground",
};

const toneLabels: Record<AlertCalloutTone, string> = {
  info: "Bilgi",
  success: "Basarili",
  warning: "Uyari",
  error: "Hata",
  neutral: "Not",
};

export interface AlertCalloutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "role">,
    VariantProps<typeof alertCalloutVariants> {
  /** Ust satirdaki vurgulu baslik. */
  title?: React.ReactNode;
  /** Baslik altindaki aciklama metni. children ile de gecilebilir. */
  description?: React.ReactNode;
  /** Ton'a gore secilen ikonu override eder. */
  icon?: React.ReactNode;
  /** Lider ikonu tamamen gizler. */
  hideIcon?: boolean;
  /** Sagda X kapatma butonu gosterir. */
  dismissible?: boolean;
  /** Kapatma butonu tiklandiginda cagrilir (bilesen kendini gizler). */
  onDismiss?: () => void;
  /** Aciklama altindaki aksiyon butonlari (ornek: <Button size="sm" />). */
  actions?: React.ReactNode;
  /** aria rolunu ton varsayimini ezerek belirler. */
  role?: "alert" | "status";
}

const AlertCallout = React.forwardRef<HTMLDivElement, AlertCalloutProps>(
  (
    {
      tone,
      appearance,
      title,
      description,
      icon,
      hideIcon = false,
      dismissible = false,
      onDismiss,
      actions,
      role,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(true);

    const effectiveTone: AlertCalloutTone = tone ?? "info";
    const Icon = toneIcons[effectiveTone];
    const resolvedRole =
      role ??
      (effectiveTone === "error" || effectiveTone === "warning"
        ? "alert"
        : "status");

    const handleDismiss = React.useCallback(() => {
      setOpen(false);
      onDismiss?.();
    }, [onDismiss]);

    if (!open) return null;

    return (
      <div
        ref={ref}
        role={resolvedRole}
        aria-live={resolvedRole === "alert" ? "assertive" : "polite"}
        className={cn(alertCalloutVariants({ tone, appearance }), className)}
        {...props}
      >
        {!hideIcon ? (
          <span
            data-slot="icon"
            className={cn("mt-0.5 shrink-0", toneIconClasses[effectiveTone])}
          >
            {icon ?? <Icon className="size-5" aria-hidden="true" />}
            <span className="sr-only">{toneLabels[effectiveTone]}:</span>
          </span>
        ) : null}

        <div className="min-w-0 flex-1 space-y-1">
          {title ? (
            <p className="font-semibold leading-snug tracking-tight text-foreground">
              {title}
            </p>
          ) : null}
          {description ? (
            <div className="text-sm leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">
              {description}
            </div>
          ) : null}
          {children}
          {actions ? (
            <div className="flex flex-wrap items-center gap-2 pt-2.5">
              {actions}
            </div>
          ) : null}
        </div>

        {dismissible ? (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Uyariyi kapat"
            className={cn(
              "-mr-1 -mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground/70 transition-all duration-200",
              "hover:bg-foreground/5 hover:text-foreground active:scale-[0.95]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background"
            )}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    );
  }
);
AlertCallout.displayName = "AlertCallout";

export { AlertCallout, alertCalloutVariants };
