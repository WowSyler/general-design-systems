/**
 * BudgetRing — Butce halkasi (progress-ring'den zengin).
 * Dairesel ilerleme uzerinde harcanan/limit oranini gosterir; merkezde
 * kalan tutar buyuk ve tona gore renkli yazilir. Esik-uyari renkleri:
 * harcama orani %80 ustunde warning (sari), %100 ve uzerinde destructive
 * (kirmizi), altinda success (yesil). Halka altinda etiket ve harcanan/limit
 * ozeti bulunur. role="meter" ile erisilebilir. Fisly butce cekirdegi.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type BudgetRingTone = "success" | "warning" | "destructive";

export interface BudgetRingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Harcanan tutar. */
  spent: number;
  /** Butce limiti (ust sinir). */
  limit: number;
  /** Butce kategorisi/etiketi (or. "Market", "Ulasim"). */
  label?: React.ReactNode;
  /** Piksel cinsinden cap. Varsayilan 148. */
  size?: number;
  /** Halka kalinligi. Varsayilana boyuta gore hesaplanir. */
  strokeWidth?: number;
  /** ISO 4217 para birimi kodu. Varsayilan "TRY". */
  currency?: string;
}

const toneStroke: Record<BudgetRingTone, string> = {
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  destructive: "hsl(var(--destructive))",
};

const toneText: Record<BudgetRingTone, string> = {
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

function toneForRatio(ratio: number): BudgetRingTone {
  if (ratio >= 1) return "destructive";
  if (ratio > 0.8) return "warning";
  return "success";
}

const BudgetRing = React.forwardRef<HTMLDivElement, BudgetRingProps>(
  (
    { spent, limit, label, size = 148, strokeWidth, currency = "TRY", className, ...props },
    ref
  ) => {
    const sw = strokeWidth ?? Math.max(10, Math.round(size / 12));
    const radius = (size - sw) / 2;
    const circumference = 2 * Math.PI * radius;

    const safeLimit = limit > 0 ? limit : 0;
    const safeSpent = Math.max(0, spent);
    const ratio = safeLimit > 0 ? safeSpent / safeLimit : safeSpent > 0 ? 1 : 0;
    const clampedRatio = Math.min(1, ratio);
    const offset = circumference * (1 - clampedRatio);
    const percent = Math.round(ratio * 100);

    const tone = toneForRatio(ratio);
    const remaining = safeLimit - safeSpent;
    const overspent = remaining < 0;

    const format = React.useMemo(
      () =>
        new Intl.NumberFormat("tr-TR", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }),
      [currency]
    );

    const remainingText = format.format(Math.abs(remaining));
    const spentText = format.format(safeSpent);
    const limitText = format.format(safeLimit);
    const centerCaption = overspent ? "asildi" : "kalan";

    const summary = `${
      typeof label === "string" ? `${label} butcesi: ` : "Butce: "
    }${spentText} / ${limitText} harcandi, yuzde ${percent}. ${
      overspent ? `${remainingText} asildi` : `${remainingText} kaldi`
    }.`;

    return (
      <div
        ref={ref}
        role="meter"
        aria-valuemin={0}
        aria-valuemax={safeLimit}
        aria-valuenow={safeSpent}
        aria-valuetext={summary}
        aria-label={summary}
        className={cn("inline-flex flex-col items-center gap-3", className)}
        {...props}
      >
        <div
          className="relative inline-flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90"
            aria-hidden="true"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth={sw}
            />
            {clampedRatio > 0 ? (
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={toneStroke[tone]}
                strokeWidth={sw}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-500"
              />
            ) : null}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
            <span
              className={cn(
                "font-bold tabular-nums",
                overspent ? "text-destructive" : "text-foreground"
              )}
              style={{ fontSize: Math.round(size * 0.16) }}
            >
              {overspent ? `-${remainingText}` : remainingText}
            </span>
            <span className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {centerCaption}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          {label ? (
            <span className="text-sm font-semibold text-foreground">{label}</span>
          ) : null}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="tabular-nums font-medium text-foreground">{spentText}</span>
            <span aria-hidden="true">/</span>
            <span className="tabular-nums">{limitText}</span>
            <span
              className={cn("ms-1 font-semibold tabular-nums", toneText[tone])}
            >
              %{percent}
            </span>
          </div>
        </div>
      </div>
    );
  }
);
BudgetRing.displayName = "BudgetRing";

export { BudgetRing };
