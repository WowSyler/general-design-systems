/**
 * FunnelChart — SVG huni (funnel) grafigi.
 * Sirali asamalar (or. Ziyaret -> Sepet -> Odeme -> Tamamlandi) daralan
 * yamuk (trapez) bantlar olarak cizilir; her asama icin deger, girise gore
 * yuzde ve bir onceki asamaya gore donusum orani gosterilir.
 * Dolgu renkleri hsl(var(--chartN)); grafik butunu role="img" + ozet aria-label
 * ile etiketlenir. Dolap/DeployLens donusum hunisi icin uygundur.
 */
import * as React from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

export interface FunnelChartStage {
  label: string;
  value: number;
  /** Dolgu rengi (chart1..5). Verilmezse asama sirasina gore dongusel atanir. */
  colorIndex?: ChartColorIndex;
}

export interface FunnelChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  stages: FunnelChartStage[];
  /** Her asama bandinin piksel yuksekligi. Varsayilan 60. */
  stageHeight?: number;
  /** Deger bicimleyici. Varsayilan tr-TR binlik ayracli. */
  formatValue?: (value: number) => string;
}

const stageFills: Record<ChartColorIndex, string> = {
  1: "hsl(var(--chart1))",
  2: "hsl(var(--chart2))",
  3: "hsl(var(--chart3))",
  4: "hsl(var(--chart4))",
  5: "hsl(var(--chart5))",
};

const defaultFormat = (value: number) => value.toLocaleString("tr-TR");

function resolveColorIndex(stage: FunnelChartStage, index: number): ChartColorIndex {
  return stage.colorIndex ?? (((index % 5) + 1) as ChartColorIndex);
}

const FunnelChart = React.forwardRef<HTMLDivElement, FunnelChartProps>(
  (
    { stages, stageHeight = 60, formatValue = defaultFormat, className, ...props },
    ref
  ) => {
    const max = Math.max(...stages.map((s) => Math.max(0, s.value)), 0);
    const entry = Math.max(0, stages[0]?.value ?? 0);

    const overallPct = (value: number) =>
      entry > 0 ? (Math.max(0, value) / entry) * 100 : 0;
    const stepPct = (value: number, prev: number) =>
      prev > 0 ? (Math.max(0, value) / prev) * 100 : 0;

    const summary = `Huni grafigi: ${stages
      .map((stage, index) => {
        const overall = Math.round(overallPct(stage.value));
        if (index === 0) {
          return `${stage.label} ${formatValue(stage.value)}, giris asamasi`;
        }
        const step = Math.round(stepPct(stage.value, stages[index - 1]!.value));
        return `${stage.label} ${formatValue(stage.value)}, girise gore yuzde ${overall}, onceki asamaya gore yuzde ${step} donusum`;
      })
      .join("; ")}`;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={summary}
        className={cn("w-full space-y-1.5", className)}
        {...props}
      >
        {stages.map((stage, index) => {
          const ratio = max > 0 ? Math.max(0, stage.value) / max : 0;
          const nextRatio =
            index < stages.length - 1
              ? max > 0
                ? Math.max(0, stages[index + 1]!.value) / max
                : 0
              : ratio;
          const topW = ratio * 100;
          const botW = nextRatio * 100;
          const points = [
            `${50 - topW / 2},0`,
            `${50 + topW / 2},0`,
            `${50 + botW / 2},${stageHeight}`,
            `${50 - botW / 2},${stageHeight}`,
          ].join(" ");

          const overall = Math.round(overallPct(stage.value));
          const prev = stages[index - 1]?.value ?? 0;
          const step = Math.round(stepPct(stage.value, prev));
          const StepIcon = step >= 100 ? TrendingUp : step > 0 ? TrendingDown : Minus;

          return (
            <div
              key={index}
              className="group grid grid-cols-[1fr_5.5rem] items-center gap-3"
            >
              <div className="relative" style={{ height: stageHeight }}>
                <svg
                  width="100%"
                  height={stageHeight}
                  viewBox={`0 0 100 ${stageHeight}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="overflow-visible"
                >
                  <polygon
                    points={points}
                    fill={stageFills[resolveColorIndex(stage, index)]}
                    className="opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </svg>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-2">
                  <div className="flex max-w-full items-baseline gap-2 rounded-md bg-background/80 px-2.5 py-1 shadow-sm ring-1 ring-border/60 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                    <span className="truncate text-sm font-medium text-foreground">
                      {stage.label}
                    </span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                      {formatValue(stage.value)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-center leading-tight">
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  %{overall}
                </span>
                {index === 0 ? (
                  <span className="text-xs text-muted-foreground">Giriş</span>
                ) : (
                  <span className="flex items-center gap-0.5 text-xs tabular-nums text-muted-foreground">
                    <StepIcon className="size-3" aria-hidden="true" />%{step}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);
FunnelChart.displayName = "FunnelChart";

export { FunnelChart };
