/**
 * BrowserMatrix — Tarayici uyumluluk matrisi (DeployLens gorsel test).
 * Satirlar tarayicilari (Chrome/Safari/Firefox/Edge + surum), sutunlar ise
 * ortam/viewport'lari temsil eder. Her hucre bir test durumu tasir:
 * gecti (yesil Check), gecmedi (kirmizi X) veya uyari (sari ucgen); istege
 * bagli olarak gorsel testin ekran goruntusu kucukresmi gosterilir.
 * Ust bilgide baslik, commit/zaman etiketi ve gecti/gecmedi/uyari ozeti;
 * altta durum aciklamasi (legend) bulunur. Etkilesimsiz (sunum) bilesen;
 * gercek bir <table> ile erisilebilir olarak isaretlenir.
 */
import * as React from "react";
import {
  Check,
  X,
  AlertTriangle,
  Minus,
  Monitor,
  Tablet,
  Smartphone,
  Globe,
  Camera,
  GitCommitHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type BrowserMatrixStatus = "passed" | "failed" | "warning" | "skipped";

export type BrowserMatrixDevice = "desktop" | "tablet" | "mobile";

export interface BrowserMatrixBrowser {
  /** Tarayici adi (orn. "Chrome"). */
  name: React.ReactNode;
  /** Surum etiketi (orn. "126"). */
  version?: React.ReactNode;
  /** Ozel tarayici ikonu; verilmezse Globe kullanilir. */
  icon?: React.ReactNode;
}

export interface BrowserMatrixColumn {
  /** Sutun basligi (ortam/viewport, orn. "Masaustu"). */
  label: React.ReactNode;
  /** Cihaz turu; sutun basligina ikon ve varsayilan ipucu ekler. */
  device?: BrowserMatrixDevice;
  /** Ek ipucu (orn. cozunurluk "1440x900"). */
  hint?: React.ReactNode;
}

export interface BrowserMatrixCell {
  /** Hucrenin test durumu. */
  status: BrowserMatrixStatus;
  /** Gorsel testin ekran goruntusu kucukresmi (img src). */
  thumbnail?: string;
  /** Hucre altinda gosterilecek kisa not (orn. "3px kayma"). */
  note?: React.ReactNode;
}

export interface BrowserMatrixRow {
  /** Satiri tanimlayan tarayici. */
  browser: BrowserMatrixBrowser;
  /** Sutun sirasiyla eslesen hucreler. */
  cells: BrowserMatrixCell[];
}

export interface BrowserMatrixProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Sutunlar: ortam/viewport listesi. */
  columns: BrowserMatrixColumn[];
  /** Satirlar: tarayici + hucreler. */
  rows: BrowserMatrixRow[];
  /** Ust bilgi basligi (orn. test paketi adi). */
  title?: React.ReactNode;
  /** Baslik altindaki aciklama. */
  subtitle?: React.ReactNode;
  /** Kaynak commit kisa hash'i (orn. "a1b2c3d"). */
  commit?: React.ReactNode;
  /** Calisma zamani etiketi (orn. "5 dk once"). */
  capturedAt?: React.ReactNode;
  /** Ozet rozetlerini gizler. */
  hideSummary?: boolean;
  /** Durum aciklamasini (legend) gizler. */
  hideLegend?: boolean;
}

interface StatusMeta {
  label: string;
  icon: React.ReactNode;
  chip: string;
  badgeOnThumb: string;
}

const statusMeta: Record<BrowserMatrixStatus, StatusMeta> = {
  passed: {
    label: "Geçti",
    icon: <Check className="size-4" aria-hidden="true" />,
    chip: "border-success/30 bg-success/15 text-success",
    badgeOnThumb: "bg-success text-success-foreground",
  },
  failed: {
    label: "Geçmedi",
    icon: <X className="size-4" aria-hidden="true" />,
    chip: "border-destructive/30 bg-destructive/15 text-destructive",
    badgeOnThumb: "bg-destructive text-destructive-foreground",
  },
  warning: {
    label: "Uyarı",
    icon: <AlertTriangle className="size-4" aria-hidden="true" />,
    chip: "border-warning/30 bg-warning/15 text-warning",
    badgeOnThumb: "bg-warning text-warning-foreground",
  },
  skipped: {
    label: "Atlandı",
    icon: <Minus className="size-4" aria-hidden="true" />,
    chip: "border-border bg-muted text-muted-foreground",
    badgeOnThumb: "bg-muted text-muted-foreground",
  },
};

const deviceIcons: Record<BrowserMatrixDevice, React.ReactNode> = {
  desktop: <Monitor className="size-3.5" aria-hidden="true" />,
  tablet: <Tablet className="size-3.5" aria-hidden="true" />,
  mobile: <Smartphone className="size-3.5" aria-hidden="true" />,
};

const summaryOrder: BrowserMatrixStatus[] = [
  "passed",
  "warning",
  "failed",
  "skipped",
];

const summaryChip: Record<BrowserMatrixStatus, string> = {
  passed: "text-success",
  warning: "text-warning",
  failed: "text-destructive",
  skipped: "text-muted-foreground",
};

function toPlain(node: React.ReactNode): string {
  return typeof node === "string" || typeof node === "number"
    ? String(node)
    : "";
}

const BrowserMatrix = React.forwardRef<HTMLDivElement, BrowserMatrixProps>(
  (
    {
      columns,
      rows,
      title,
      subtitle,
      commit,
      capturedAt,
      hideSummary = false,
      hideLegend = false,
      className,
      ...props
    },
    ref
  ) => {
    // Ozet: tum hucrelerdeki durum sayimlari + gecme orani.
    const counts: Record<BrowserMatrixStatus, number> = {
      passed: 0,
      failed: 0,
      warning: 0,
      skipped: 0,
    };
    for (const row of rows) {
      for (const cell of row.cells) counts[cell.status] += 1;
    }

    const evaluated = counts.passed + counts.failed + counts.warning;
    const passRate =
      evaluated > 0 ? Math.round((counts.passed / evaluated) * 100) : 0;

    const captionSummary = `Tarayıcı uyumluluk matrisi: ${counts.passed} geçti, ${counts.warning} uyarı, ${counts.failed} geçmedi.`;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={toPlain(title) || "Tarayıcı uyumluluk matrisi"}
        className={cn(
          "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        {/* Ust bilgi */}
        {title || subtitle || commit || capturedAt || !hideSummary ? (
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-5">
            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="rounded-lg bg-primary/10 p-1.5 text-primary"
                  aria-hidden="true"
                >
                  <Camera className="size-4" />
                </span>
                {title ? (
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {title}
                  </h3>
                ) : null}
              </div>
              {subtitle ? (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              ) : null}
              {commit || capturedAt ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {commit ? (
                    <span className="inline-flex items-center gap-1 font-mono">
                      <GitCommitHorizontal
                        className="size-3.5"
                        aria-hidden="true"
                      />
                      {commit}
                    </span>
                  ) : null}
                  {capturedAt ? (
                    <span className="tabular-nums">{capturedAt}</span>
                  ) : null}
                </div>
              ) : null}
            </div>

            {!hideSummary ? (
              <div className="flex shrink-0 items-center gap-3">
                <div className="flex items-center gap-3 tabular-nums">
                  {summaryOrder
                    .filter((s) => counts[s] > 0)
                    .map((s) => (
                      <span
                        key={s}
                        className={cn(
                          "inline-flex items-center gap-1 text-sm font-semibold",
                          summaryChip[s]
                        )}
                      >
                        <span aria-hidden="true">{statusMeta[s].icon}</span>
                        {counts[s]}
                        <span className="sr-only">{statusMeta[s].label}</span>
                      </span>
                    ))}
                </div>
                <div className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-end">
                  <div className="text-lg font-bold leading-none tabular-nums text-foreground">
                    %{passRate}
                  </div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    Geçme oranı
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Matris */}
        <div className="relative overflow-x-auto p-2">
          <table className="w-full border-separate border-spacing-1.5">
            <caption className="sr-only">{captionSummary}</caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky start-0 z-10 bg-card px-3 py-2 text-start text-xs font-medium text-muted-foreground"
                >
                  Tarayıcı
                </th>
                {columns.map((column, ci) => (
                  <th
                    key={ci}
                    scope="col"
                    className="min-w-[7rem] px-3 py-2 text-center align-bottom"
                  >
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-foreground">
                      {column.device ? (
                        <span className="text-muted-foreground">
                          {deviceIcons[column.device]}
                        </span>
                      ) : null}
                      {column.label}
                    </div>
                    {column.hint ? (
                      <div className="mt-0.5 text-[10px] font-normal tabular-nums text-muted-foreground">
                        {column.hint}
                      </div>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="group">
                  <th
                    scope="row"
                    className="sticky start-0 z-10 whitespace-nowrap bg-card px-3 py-2 text-start"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40 text-muted-foreground"
                        aria-hidden="true"
                      >
                        {row.browser.icon ?? <Globe className="size-4" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {row.browser.name}
                        </span>
                        {row.browser.version != null ? (
                          <span className="block text-xs tabular-nums text-muted-foreground">
                            v{row.browser.version}
                          </span>
                        ) : null}
                      </span>
                    </div>
                  </th>

                  {columns.map((column, ci) => {
                    const cell = row.cells[ci];
                    if (!cell) {
                      return (
                        <td key={ci} className="px-2 py-2 text-center">
                          <span
                            className="inline-flex size-8 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground"
                            aria-hidden="true"
                          >
                            <Minus className="size-4" />
                          </span>
                          <span className="sr-only">Veri yok</span>
                        </td>
                      );
                    }

                    const meta = statusMeta[cell.status];
                    const cellLabel = `${toPlain(row.browser.name)} ${toPlain(
                      column.label
                    )}: ${meta.label}`;

                    return (
                      <td key={ci} className="px-2 py-2 align-top">
                        {cell.thumbnail ? (
                          <figure className="mx-auto w-full max-w-[9rem]">
                            <div className="relative overflow-hidden rounded-md border border-border bg-muted shadow-sm transition-all duration-200 group-hover:shadow-md">
                              <img
                                src={cell.thumbnail}
                                alt={cellLabel}
                                loading="lazy"
                                className="aspect-[16/10] w-full object-cover"
                              />
                              <span
                                className={cn(
                                  "absolute end-1 top-1 flex size-5 items-center justify-center rounded-full shadow-sm ring-2 ring-card [&_svg]:size-3",
                                  meta.badgeOnThumb
                                )}
                                title={meta.label}
                              >
                                {meta.icon}
                                <span className="sr-only">{cellLabel}</span>
                              </span>
                            </div>
                            {cell.note ? (
                              <figcaption className="mt-1 truncate text-center text-[11px] text-muted-foreground">
                                {cell.note}
                              </figcaption>
                            ) : null}
                          </figure>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span
                              title={cellLabel}
                              className={cn(
                                "inline-flex size-8 items-center justify-center rounded-md border transition-all duration-200 group-hover:-translate-y-0.5",
                                meta.chip
                              )}
                            >
                              {meta.icon}
                              <span className="sr-only">{cellLabel}</span>
                            </span>
                            {cell.note ? (
                              <span className="max-w-[7rem] truncate text-center text-[11px] text-muted-foreground">
                                {cell.note}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        {!hideLegend ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-5 py-3 text-xs text-muted-foreground">
            {summaryOrder.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-md border [&_svg]:size-3",
                    statusMeta[s].chip
                  )}
                  aria-hidden="true"
                >
                  {statusMeta[s].icon}
                </span>
                {statusMeta[s].label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);
BrowserMatrix.displayName = "BrowserMatrix";

export { BrowserMatrix };
