/**
 * BudgetBar — Kategori butce satiri (Fisly).
 * metric-bar'dan zengin: yatay ilerleme cubugu + limit isaretcisi cizgisi,
 * harcanan/limit etiketleri, kalan tutar ve esik-uyari rengi (>%80 sari,
 * >=%100 kirmizi). Harcama limiti asildiginda cubuk limit cizgisini gecer.
 */
import * as React from "react";
import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

/** Limit cizgisinin, limit asilmadan once cubuk uzerindeki sabit konumu. */
const LIMIT_ANCHOR = 0.85;

type BudgetBarStatus = "ok" | "warning" | "over";

export interface BudgetBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Kategori/satir etiketi. */
  label: React.ReactNode;
  /** Harcanan tutar (or. 4243). */
  spent: number;
  /** Butce limiti (or. 5000). */
  limit: number;
  /** Etiketin yanindaki opsiyonel ikon. */
  icon?: React.ReactNode;
  /** Tutar bicimlendirici; varsayilan TRY (or. "₺4.243"). */
  formatValue?: (value: number) => string;
}

function formatTRY(value: number): string {
  return value.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  });
}

const fillStatusClasses: Record<BudgetBarStatus, string> = {
  ok: "bg-primary",
  warning: "bg-warning",
  over: "bg-destructive",
};

const badgeStatusClasses: Record<BudgetBarStatus, string> = {
  ok: "bg-muted text-muted-foreground",
  warning: "bg-warning/15 text-warning",
  over: "bg-destructive/15 text-destructive",
};

const BudgetBar = React.forwardRef<HTMLDivElement, BudgetBarProps>(
  ({ label, spent, limit, icon, formatValue = formatTRY, className, ...props }, ref) => {
    const safeSpent = Math.max(0, spent);
    const safeLimit = Math.max(0, limit);
    const hasLimit = safeLimit > 0;

    const usedRatio = hasLimit ? safeSpent / safeLimit : safeSpent > 0 ? Infinity : 0;
    const usedPercent = Number.isFinite(usedRatio) ? Math.round(usedRatio * 100) : 100;
    const status: BudgetBarStatus =
      usedRatio >= 1 ? "over" : usedRatio > 0.8 ? "warning" : "ok";

    // Olcek: limit asilmadikca limit cizgisi %85'te durur ve saga bir miktar
    // bosluk kalir; asildiginda olcek harcamaya genisleyip cizgi sola kayar.
    const scaleMax = hasLimit ? Math.max(safeLimit / LIMIT_ANCHOR, safeSpent) : safeSpent;
    const fillPercent = scaleMax > 0 ? Math.min(100, (safeSpent / scaleMax) * 100) : 0;
    const markerPercent = scaleMax > 0 ? Math.min(100, (safeLimit / scaleMax) * 100) : 0;

    const remaining = safeLimit - safeSpent;
    const isOver = remaining < 0;

    const ariaLabel = typeof label === "string" ? `${label} butcesi` : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          "group space-y-2 rounded-lg p-3 transition-colors hover:bg-muted/40",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
            {icon ? (
              <span className="text-muted-foreground [&_svg]:size-4" aria-hidden="true">
                {icon}
              </span>
            ) : null}
            <span className="truncate">{label}</span>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
              badgeStatusClasses[status]
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
          aria-valuetext={`${formatValue(safeSpent)} / ${formatValue(safeLimit)} (%${usedPercent})`}
          aria-label={ariaLabel}
          className="relative py-1"
        >
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-500 ease-out",
                fillStatusClasses[status]
              )}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
          {hasLimit ? (
            <span
              aria-hidden="true"
              className="absolute inset-y-0 w-0.5 -translate-x-1/2 rounded-full bg-foreground/60 ring-1 ring-background"
              style={{ left: `${markerPercent}%` }}
            />
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="tabular-nums">
            <span className="font-semibold text-foreground">{formatValue(safeSpent)}</span>
            <span className="text-muted-foreground"> / {formatValue(safeLimit)}</span>
          </div>
          <span
            className={cn(
              "font-medium tabular-nums",
              isOver ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {isOver
              ? `${formatValue(Math.abs(remaining))} aşıldı`
              : `${formatValue(remaining)} kaldı`}
          </span>
        </div>
      </div>
    );
  }
);
BudgetBar.displayName = "BudgetBar";

export { BudgetBar };
