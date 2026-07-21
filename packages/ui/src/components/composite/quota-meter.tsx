/**
 * QuotaMeter — Kaynak kullanim/kota gostergesi (DeployLens billing/kota).
 * Kaynak adi + kullanilan/limit (or. "8,2 / 10 GB") + ilerleme cubugu +
 * kalan miktar + esik-uyari rengi (>%80 sari, >=%100 kirmizi) ve opsiyonel
 * "Yukselt" CTA. metric-bar'dan farkli: 0-100 degil, gercek birimli kota
 * semantigi (kullanilan/limit/kalan) tasir.
 */
import * as React from "react";
import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

type QuotaMeterStatus = "ok" | "warning" | "over";

export interface QuotaMeterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Kaynak adi (or. "Depolama", "Fonksiyon cagrisi"). */
  label: React.ReactNode;
  /** Kullanilan miktar (or. 8.2). */
  used: number;
  /** Kota limiti (or. 10). */
  limit: number;
  /** Birim etiketi (or. "GB", "istek", "koltuk"). */
  unit?: React.ReactNode;
  /** Etiketin yanindaki opsiyonel ikon. */
  icon?: React.ReactNode;
  /** Sayi bicimlendirici; varsayilan tr-TR yerel bicimi. */
  formatValue?: (value: number) => string;
  /** Alt aksiyon slotu (or. "Yukselt" butonu). */
  action?: React.ReactNode;
  /** Esik asildiginda action'i her zaman goster yerine sadece uyarida goster. */
  actionOnWarningOnly?: boolean;
}

function formatNumber(value: number): string {
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
}

const fillStatusClasses: Record<QuotaMeterStatus, string> = {
  ok: "bg-primary",
  warning: "bg-warning",
  over: "bg-destructive",
};

const badgeStatusClasses: Record<QuotaMeterStatus, string> = {
  ok: "bg-muted text-muted-foreground",
  warning: "bg-warning/15 text-warning",
  over: "bg-destructive/15 text-destructive",
};

const remainingStatusClasses: Record<QuotaMeterStatus, string> = {
  ok: "text-muted-foreground",
  warning: "text-warning",
  over: "text-destructive",
};

const QuotaMeter = React.forwardRef<HTMLDivElement, QuotaMeterProps>(
  (
    {
      label,
      used,
      limit,
      unit,
      icon,
      formatValue = formatNumber,
      action,
      actionOnWarningOnly = false,
      className,
      ...props
    },
    ref,
  ) => {
    const safeUsed = Math.max(0, used);
    const safeLimit = Math.max(0, limit);
    const hasLimit = safeLimit > 0;

    const usedRatio = hasLimit
      ? safeUsed / safeLimit
      : safeUsed > 0
        ? Infinity
        : 0;
    const usedPercent = Number.isFinite(usedRatio)
      ? Math.round(usedRatio * 100)
      : 100;
    const status: QuotaMeterStatus =
      usedRatio >= 1 ? "over" : usedRatio > 0.8 ? "warning" : "ok";

    const fillPercent = Math.min(100, usedPercent);
    const remaining = safeLimit - safeUsed;
    const isOver = remaining < 0;

    const unitSuffix = unit ? <> {unit}</> : null;
    const showAction = action && (!actionOnWarningOnly || status !== "ok");

    const ariaLabel = typeof label === "string" ? `${label} kotasi` : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          "space-y-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md",
          status === "over" && "border-destructive/40",
          status === "warning" && "border-warning/40",
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
            {icon ? (
              <span
                className="rounded-md bg-primary/10 p-1.5 text-primary [&_svg]:size-4"
                aria-hidden="true"
              >
                {icon}
              </span>
            ) : null}
            <span className="truncate">{label}</span>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
              badgeStatusClasses[status],
            )}
          >
            {status === "over" ? (
              <TriangleAlert className="size-3" aria-hidden="true" />
            ) : null}
            %{usedPercent}
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(100, usedPercent)}
          aria-valuetext={`${formatValue(safeUsed)} / ${formatValue(safeLimit)}${
            typeof unit === "string" ? ` ${unit}` : ""
          } (%${usedPercent})`}
          aria-label={ariaLabel}
          className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-500 ease-out",
              fillStatusClasses[status],
            )}
            style={{ width: `${fillPercent}%` }}
          />
        </div>

        <div className="flex items-end justify-between gap-2 text-xs">
          <div className="tabular-nums">
            <span className="font-semibold text-foreground">
              {formatValue(safeUsed)}
            </span>
            <span className="text-muted-foreground">
              {" / "}
              {formatValue(safeLimit)}
              {unitSuffix}
            </span>
          </div>
          <span
            className={cn(
              "font-medium tabular-nums",
              remainingStatusClasses[status],
            )}
          >
            {isOver
              ? `${formatValue(Math.abs(remaining))}${
                  typeof unit === "string" ? ` ${unit}` : ""
                } aşıldı`
              : `${formatValue(remaining)}${
                  typeof unit === "string" ? ` ${unit}` : ""
                } kaldı`}
          </span>
        </div>

        {showAction ? <div className="pt-1">{action}</div> : null}
      </div>
    );
  },
);
QuotaMeter.displayName = "QuotaMeter";

export { QuotaMeter };
