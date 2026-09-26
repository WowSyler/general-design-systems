/**
 * UptimeBars — Status page tarzi calisma suresi cubuklari.
 * Ince dikey cubuk seridi (30/60/90 gun): her cubuk gun durumunu tasir
 * (operasyonel -> success, kismi -> warning, kesinti -> destructive).
 * Cubuk uzerine gelince CSS group-hover ile tarih + durum ipucu belirir;
 * ustte toplam calisma suresi yuzdesi gosterilir. Seridin butunu role="img"
 * ve ozet aria-label ile etiketlenir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export type UptimeBarsStatus = "operational" | "partial" | "outage";

export interface UptimeBarsDay {
  /** Gosterilecek tarih etiketi, orn. "14 Tem". */
  date: string;
  /** Gun durumu. */
  status: UptimeBarsStatus;
  /** Ipucunda gosterilecek ek aciklama (orn. "42 dk kesinti"). */
  detail?: string;
}

export interface UptimeBarsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Gunluk durum dizisi (eskiden yeniye). */
  days: UptimeBarsDay[];
  /** Serit basligi, orn. servis adi. */
  label?: string;
  /** Ustte gosterilecek calisma suresi yuzdesi. Verilmezse gunlerden hesaplanir. */
  uptime?: number;
  /** Cubuk seridinin piksel yuksekligi. Varsayilan 40. */
  height?: number;
  /** Alt kismindaki durum aciklamasini (legend) gizle. */
  hideLegend?: boolean;
}

const statusConfig: Record<
  UptimeBarsStatus,
  { label: string; barClass: string; dotClass: string }
> = {
  operational: {
    label: "Operasyonel",
    barClass: "bg-success",
    dotClass: "bg-success",
  },
  partial: {
    label: "Kısmi kesinti",
    barClass: "bg-warning",
    dotClass: "bg-warning",
  },
  outage: {
    label: "Kesinti",
    barClass: "bg-destructive",
    dotClass: "bg-destructive",
  },
};

const statusWeight: Record<UptimeBarsStatus, number> = {
  operational: 1,
  partial: 0.5,
  outage: 0,
};

const legendOrder: UptimeBarsStatus[] = ["operational", "partial", "outage"];

const UptimeBars = React.forwardRef<HTMLDivElement, UptimeBarsProps>(
  (
    { days, label, uptime, height = 40, hideLegend = false, className, ...props },
    ref
  ) => {
    const computedUptime =
      days.length > 0
        ? (days.reduce((sum, d) => sum + statusWeight[d.status], 0) /
            days.length) *
          100
        : 100;
    const uptimeValue = uptime ?? computedUptime;
    const uptimeText = uptimeValue.toLocaleString("tr-TR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    });

    const counts = days.reduce(
      (acc, d) => {
        acc[d.status] += 1;
        return acc;
      },
      { operational: 0, partial: 0, outage: 0 } as Record<UptimeBarsStatus, number>
    );

    const summary = `${label ?? "Çalışma süresi"}: son ${days.length} gün, %${uptimeText} çalışma süresi. ${counts.operational} operasyonel, ${counts.partial} kısmi, ${counts.outage} kesinti günü.`;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={summary}
        className={cn("w-full", className)}
        {...props}
      >
        <div className="mb-2 flex items-baseline justify-between gap-3">
          {label ? (
            <span className="truncate text-sm font-medium text-foreground">
              {label}
            </span>
          ) : (
            <span className="sr-only">Çalışma süresi</span>
          )}
          <span className="flex shrink-0 items-baseline gap-1.5">
            <span className="text-sm font-semibold tabular-nums text-success">
              %{uptimeText}
            </span>
            <span className="text-xs text-muted-foreground">çalışma süresi</span>
          </span>
        </div>

        <div className="relative flex items-stretch gap-0.5 overflow-x-auto" style={{ height }}>
          {days.map((day, index) => {
            const config = statusConfig[day.status];
            return (
              <div
                key={index}
                className="group/bar relative min-w-[3px] flex-1"
                title={`${day.date} — ${config.label}${
                  day.detail ? ` (${day.detail})` : ""
                }`}
                aria-hidden="true"
              >
                <div
                  className={cn(
                    "h-full w-full rounded-[2px] transition-all duration-200 group-hover/bar:brightness-110 group-hover/bar:-translate-y-0.5",
                    config.barClass
                  )}
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 scale-95 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground opacity-0 shadow-md transition-all duration-150 group-hover/bar:scale-100 group-hover/bar:opacity-100">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span
                      className={cn("size-2 rounded-full", config.dotClass)}
                    />
                    {config.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] tabular-nums text-muted-foreground">
                    {day.date}
                    {day.detail ? ` · ${day.detail}` : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground"
          aria-hidden="true"
        >
          <span>{days.length > 0 ? days[0]?.date : ""}</span>
          <span className="tabular-nums">Son {days.length} gün</span>
          <span>Bugün</span>
        </div>

        {hideLegend ? null : (
          <div
            className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground"
            aria-hidden="true"
          >
            {legendOrder.map((status) => (
              <span key={status} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-2.5 rounded-full",
                    statusConfig[status].dotClass
                  )}
                />
                {statusConfig[status].label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
);
UptimeBars.displayName = "UptimeBars";

export { UptimeBars };
