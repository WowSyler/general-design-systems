/**
 * WaterfallChart — SVG/CSS selale (waterfall) grafigi.
 * Bir baslangic degerinden baslar; ardil artis/azalis adimlari kumulatif
 * toplami yukari/asagi tasir; istege bagli toplam sutunuyla biter.
 * Artislar bg-success (deltalar text-success), azalislar bg-destructive
 * (deltalar text-destructive); baslangic/toplam sutunlari bg-primary ile
 * cizilir. Ardisik sutunlarin ustunu ince kesikli baglayici cizgiler birlestirir.
 * Kilavuz cizgileri, sol y ekseni ve x ekseni etiketleri isteğe baglidir.
 * Grafik butunu role="img" ve ozet aria-label ile etiketlenir.
 * Kullanim: Fisly nakit akisi (gelir - gider -> net), DeployLens degisim analizi.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export type WaterfallChartStepType =
  | "baslangic"
  | "artis"
  | "azalis"
  | "toplam";

export interface WaterfallChartStep {
  /** Sutun etiketi (x ekseni). */
  label: string;
  /**
   * Deger. "baslangic" icin baslangic seviyesi; "artis"/"azalis" icin
   * hareketin buyuklugu (isaret onemsiz, tur belirler); "toplam" icin
   * gorsel dogrulama amacli beklenen toplam (verilmezse hesaplanan
   * kumulatif kullanilir).
   */
  value: number;
  type: WaterfallChartStepType;
}

export interface WaterfallChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Selale adimlari; soldan saga sirayla islenir. */
  steps: WaterfallChartStep[];
  /** Cizim alaninin piksel yuksekligi. Varsayilan 240. */
  height?: number;
  /** Sutun tepesinde delta/toplam degerlerini goster. Varsayilan true. */
  showValues?: boolean;
  /** Sol y ekseni ve kilavuz cizgilerini goster. Varsayilan true. */
  showAxis?: boolean;
  /** Deger bicimleyici (or. para birimi). Varsayilan tr-TR yerel bicim. */
  valueFormatter?: (value: number) => string;
}

interface ResolvedSegment {
  label: string;
  type: WaterfallChartStepType;
  /** Sutunun tabani (deger uzayinda). */
  start: number;
  /** Sutunun tepesi (deger uzayinda). */
  end: number;
  /** Etikette gosterilecek delta/toplam. */
  display: number;
  /** Bir onceki sutundan gelen baglayicinin baslangic seviyesi. */
  connectorFrom: number;
}

const GRID_LEVELS = [1, 0.75, 0.5, 0.25, 0] as const;
const VIEW = 100;
const BAR_FRACTION = 0.6;

const barToneClasses: Record<WaterfallChartStepType, string> = {
  baslangic: "bg-primary",
  toplam: "bg-primary",
  artis: "bg-success",
  azalis: "bg-destructive",
};

const deltaToneClasses: Record<WaterfallChartStepType, string> = {
  baslangic: "text-foreground",
  toplam: "text-foreground",
  artis: "text-success",
  azalis: "text-destructive",
};

function defaultFormat(value: number): string {
  return Math.round(value).toLocaleString("tr-TR");
}

/** Adimlari kumulatif taban/tepe seviyelerine cozer. */
function resolveSegments(steps: WaterfallChartStep[]): ResolvedSegment[] {
  let running = 0;
  return steps.map((step) => {
    const magnitude = Math.abs(step.value);
    let start = running;
    let end = running;
    let display = step.value;

    switch (step.type) {
      case "baslangic":
        start = 0;
        end = step.value;
        running = step.value;
        display = step.value;
        break;
      case "artis":
        start = running;
        end = running + magnitude;
        running = end;
        display = magnitude;
        break;
      case "azalis":
        start = running;
        end = running - magnitude;
        running = end;
        display = magnitude;
        break;
      case "toplam":
        start = 0;
        end = running;
        display = running;
        break;
    }

    return {
      label: step.label,
      type: step.type,
      start,
      end,
      display,
      connectorFrom: running,
    };
  });
}

const WaterfallChart = React.forwardRef<HTMLDivElement, WaterfallChartProps>(
  (
    {
      steps,
      height = 240,
      showValues = true,
      showAxis = true,
      valueFormatter,
      className,
      ...props
    },
    ref
  ) => {
    const format = valueFormatter ?? defaultFormat;
    const segments = resolveSegments(steps);

    const columnCount = Math.max(segments.length, 1);

    // Deger uzayi alanı: tum taban/tepe seviyeleri ve sifir dahil.
    const bounds = segments.flatMap((s) => [s.start, s.end]);
    const minV = Math.min(0, ...bounds);
    const maxV = Math.max(0, ...bounds);
    const range = maxV - minV || 1;

    // Deger -> tabandan yukari oran (0..1).
    const levelFromBottom = (value: number) => (value - minV) / range;

    const axisTick = (level: number) => format(minV + level * range);

    const summary =
      segments.length > 0
        ? `Selale grafigi. ${segments
            .map((s) => {
              const sign =
                s.type === "artis" ? "+" : s.type === "azalis" ? "-" : "";
              return `${s.label} ${sign}${format(s.display)}`;
            })
            .join("; ")}.`
        : "Selale grafigi: veri yok";

    return (
      <div
        ref={ref}
        role="img"
        aria-label={summary}
        className={cn("w-full", className)}
        {...props}
      >
        <div className="flex gap-2">
          {showAxis ? (
            <div
              className="flex w-12 shrink-0 flex-col justify-between py-0 text-right text-[10px] tabular-nums text-muted-foreground"
              style={{ height }}
              aria-hidden="true"
            >
              {GRID_LEVELS.map((level) => (
                <span
                  key={level}
                  className="-translate-y-1/2 leading-none first:translate-y-0 last:translate-y-0"
                >
                  {axisTick(level)}
                </span>
              ))}
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="relative" style={{ height }}>
              {/* Kilavuz + baglayici cizgi katmani */}
              <svg
                viewBox={`0 0 ${VIEW} ${height}`}
                preserveAspectRatio="none"
                className="absolute inset-0 block h-full w-full overflow-visible"
                aria-hidden="true"
              >
                {showAxis
                  ? GRID_LEVELS.map((level) => {
                      const y = height * (1 - level);
                      return (
                        <line
                          key={level}
                          x1={0}
                          y1={y}
                          x2={VIEW}
                          y2={y}
                          stroke="hsl(var(--border))"
                          strokeWidth={1}
                          vectorEffect="non-scaling-stroke"
                          opacity={level === 0 ? 1 : 0.5}
                        />
                      );
                    })
                  : null}

                {/* Sifir cizgisi (deger uzayi 0'a denk gelirse) */}
                {minV < 0 ? (
                  <line
                    x1={0}
                    y1={height * (1 - levelFromBottom(0))}
                    x2={VIEW}
                    y2={height * (1 - levelFromBottom(0))}
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                    opacity={0.6}
                  />
                ) : null}

                {/* Sutunlar arasi baglayicilar */}
                {segments.slice(0, -1).map((segment, index) => {
                  const y = height * (1 - levelFromBottom(segment.connectorFrom));
                  const x1 = ((index + 0.5 + BAR_FRACTION / 2) / columnCount) * VIEW;
                  const x2 =
                    ((index + 1.5 - BAR_FRACTION / 2) / columnCount) * VIEW;
                  return (
                    <line
                      key={index}
                      x1={x1}
                      y1={y}
                      x2={x2}
                      y2={y}
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      vectorEffect="non-scaling-stroke"
                      opacity={0.55}
                    />
                  );
                })}
              </svg>

              {/* Sutunlar (CSS ile net koseler) */}
              <div className="absolute inset-0 flex">
                {segments.map((segment, index) => {
                  const topLevel = Math.max(
                    levelFromBottom(segment.start),
                    levelFromBottom(segment.end)
                  );
                  const bottomLevel = Math.min(
                    levelFromBottom(segment.start),
                    levelFromBottom(segment.end)
                  );
                  const barHeightPct = Math.max(
                    0.6,
                    (topLevel - bottomLevel) * 100
                  );
                  const sign =
                    segment.type === "artis"
                      ? "+"
                      : segment.type === "azalis"
                        ? "-"
                        : "";
                  return (
                    <div
                      key={index}
                      className="relative min-w-0 flex-1"
                    >
                      <div
                        className={cn(
                          "absolute left-1/2 -translate-x-1/2 rounded-sm bg-sheen shadow-sm transition-[height,bottom] duration-300",
                          barToneClasses[segment.type]
                        )}
                        style={{
                          width: `${BAR_FRACTION * 100}%`,
                          bottom: `${bottomLevel * 100}%`,
                          height: `${barHeightPct}%`,
                        }}
                      />
                      {showValues ? (
                        <span
                          className={cn(
                            "absolute left-1/2 -translate-x-1/2 -translate-y-1 whitespace-nowrap text-[11px] font-semibold tabular-nums",
                            deltaToneClasses[segment.type]
                          )}
                          style={{ bottom: `${topLevel * 100}%` }}
                        >
                          {sign}
                          {format(segment.display)}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X ekseni etiketleri */}
            <div className="mt-1.5 flex">
              {segments.map((segment, index) => (
                <div
                  key={index}
                  className="min-w-0 flex-1 truncate px-0.5 text-center text-xs text-muted-foreground"
                >
                  {segment.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
WaterfallChart.displayName = "WaterfallChart";

export { WaterfallChart };
