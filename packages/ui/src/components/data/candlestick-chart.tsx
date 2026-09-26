/**
 * CandlestickChart — SVG mum (OHLC) grafigi.
 * Her veri noktasi acilis/en yuksek/en dusuk/kapanis degerleriyle bir mum cizer:
 * govde acilis-kapanis araligini (yukselis hsl(var(--success)) / dusus
 * hsl(var(--destructive))), fitil ise en yuksek-en dusuk araligini gosterir.
 * Solda deger etiketli y ekseni, altta zaman etiketli x ekseni bulunur.
 * Grafik butunu role="img" ve ozet aria-label ile etiketlenir; genis veri
 * yatayda kaydirilabilir. Fisly piyasa/finansal gorunumu icin uygundur.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface CandlestickDatum {
  /** Zaman etiketi (orn. gun/ay/saat). x ekseninde gosterilir. */
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlestickChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  data: CandlestickDatum[];
  /** Cizim alaninin piksel yuksekligi. Varsayilan 260. */
  height?: number;
  /** Her mumun kapladigi yatay slot genisligi (px). Varsayilan 34. */
  slotWidth?: number;
  /** y ekseni etiketleri icin bicimleyici. Varsayilan tr-TR yerel bicimi. */
  valueFormatter?: (value: number) => string;
}

const RISE_COLOR = "hsl(var(--success))";
const FALL_COLOR = "hsl(var(--destructive))";
const AXIS_COLOR = "hsl(var(--border))";
const LABEL_COLOR = "hsl(var(--muted-foreground))";

const PAD_TOP = 12;
const PAD_RIGHT = 12;
const PAD_LEFT = 52;
const PAD_BOTTOM = 26;
const Y_TICKS = 4;

const defaultFormatter = (value: number) =>
  value.toLocaleString("tr-TR", { maximumFractionDigits: 2 });

const CandlestickChart = React.forwardRef<HTMLDivElement, CandlestickChartProps>(
  (
    {
      data,
      height = 260,
      slotWidth = 34,
      valueFormatter = defaultFormatter,
      className,
      ...props
    },
    ref
  ) => {
    const plotHeight = height - PAD_TOP - PAD_BOTTOM;
    const chartWidth = PAD_LEFT + data.length * slotWidth + PAD_RIGHT;

    const highs = data.map((d) => d.high);
    const lows = data.map((d) => d.low);
    const maxHigh = highs.length > 0 ? Math.max(...highs) : 0;
    const minLow = lows.length > 0 ? Math.min(...lows) : 0;
    const span = maxHigh - minLow || 1;
    // Ust/alt uclarin ezilmemesi icin araligi hafifce genislet.
    const pad = span * 0.06;
    const top = maxHigh + pad;
    const bottom = minLow - pad;
    const range = top - bottom || 1;

    const toY = (value: number) =>
      PAD_TOP + ((top - value) / range) * plotHeight;

    const ticks = Array.from(
      { length: Y_TICKS + 1 },
      (_, i) => top - (range * i) / Y_TICKS
    );

    // x etiketlerini seyreltmek icin adim (en fazla ~8 etiket).
    const labelStep = Math.max(1, Math.ceil(data.length / 8));

    const first = data[0];
    const last = data[data.length - 1];
    const change = first && last ? last.close - first.open : 0;
    const changePct = first && first.open ? (change / first.open) * 100 : 0;
    const trend = change >= 0 ? "yukselis" : "dusus";

    const summary =
      data.length > 0
        ? `Mum grafigi: ${data.length} periyot (${first?.date} - ${last?.date}). ` +
          `Acilis ${valueFormatter(first?.open ?? 0)}, son kapanis ${valueFormatter(
            last?.close ?? 0
          )}, ${trend} yuzde ${Math.abs(changePct).toFixed(1)}. ` +
          `En yuksek ${valueFormatter(maxHigh)}, en dusuk ${valueFormatter(minLow)}.`
        : "Mum grafigi: veri yok.";

    return (
      <div
        ref={ref}
        role="img"
        aria-label={summary}
        className={cn("relative w-full overflow-x-auto", className)}
        {...props}
      >
        <svg
          width={chartWidth}
          height={height}
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="block"
          aria-hidden="true"
        >
          {/* y ekseni izgara cizgileri ve deger etiketleri */}
          {ticks.map((tick, i) => {
            const y = toY(tick);
            return (
              <g key={`tick-${i}`}>
                <line
                  x1={PAD_LEFT}
                  y1={y}
                  x2={chartWidth - PAD_RIGHT}
                  y2={y}
                  stroke={AXIS_COLOR}
                  strokeWidth={1}
                  strokeOpacity={0.6}
                  strokeDasharray={i === Y_TICKS ? undefined : "2 4"}
                />
                <text
                  x={PAD_LEFT - 8}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontSize={10}
                  className="tabular-nums"
                  fill={LABEL_COLOR}
                >
                  {valueFormatter(tick)}
                </text>
              </g>
            );
          })}

          {/* mumlar */}
          {data.map((d, i) => {
            const cx = PAD_LEFT + i * slotWidth + slotWidth / 2;
            const bodyWidth = Math.max(3, slotWidth * 0.58);
            const rising = d.close >= d.open;
            const color = rising ? RISE_COLOR : FALL_COLOR;
            const bodyTop = toY(Math.max(d.open, d.close));
            const bodyBottom = toY(Math.min(d.open, d.close));
            const bodyHeight = Math.max(1.5, bodyBottom - bodyTop);
            const showLabel = i % labelStep === 0 || i === data.length - 1;

            return (
              <g key={`candle-${i}`}>
                {/* fitil: en yuksek - en dusuk */}
                <line
                  x1={cx}
                  y1={toY(d.high)}
                  x2={cx}
                  y2={toY(d.low)}
                  stroke={color}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
                {/* govde: acilis - kapanis */}
                <rect
                  x={cx - bodyWidth / 2}
                  y={bodyTop}
                  width={bodyWidth}
                  height={bodyHeight}
                  rx={1.5}
                  fill={color}
                  fillOpacity={rising ? 0.9 : 1}
                />
                {/* x ekseni zaman etiketi */}
                {showLabel ? (
                  <text
                    x={cx}
                    y={height - PAD_BOTTOM + 15}
                    textAnchor="middle"
                    fontSize={10}
                    fill={LABEL_COLOR}
                  >
                    {d.date}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
);
CandlestickChart.displayName = "CandlestickChart";

export { CandlestickChart };
