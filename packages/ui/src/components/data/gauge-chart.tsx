/**
 * GaugeChart — SVG gosterge/kadran (hiz saati) grafigi.
 * Yarim (180) veya genis (270) derece yay uzerinde min-max araligindaki
 * bir degeri gosterir. Esik bolgeleri (zones) semantik tonlarla renklenir
 * (destructive/warning/success...), ibre degeri isaret eder ve merkezde
 * buyuk deger + etiket bulunur. Grafik butunu role="img" ile etiketlenir.
 * GlowScan cilt skoru, DeployLens web-vitals/saglik gostergesi icin uygundur.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type GaugeChartTone =
  | "primary"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "muted";

export interface GaugeChartZone {
  /** Bolgenin baslangic degeri (min-max araliginda). */
  from: number;
  /** Bolgenin bitis degeri (min-max araliginda). */
  to: number;
  /** Bolgenin semantik tonu. */
  tone: GaugeChartTone;
  /** Istege bagli bolge etiketi. */
  label?: string;
}

export interface GaugeChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Gosterilecek deger. */
  value: number;
  /** Alt sinir. Varsayilan 0. */
  min?: number;
  /** Ust sinir. Varsayilan 100. */
  max?: number;
  /** Esik bolgeleri; verilmezse primary dolu yay cizilir. */
  zones?: GaugeChartZone[];
  /** Merkezde degerin altinda gosterilen etiket. */
  label?: React.ReactNode;
  /** Deger sonuna eklenen birim (or. "%", "puan"). */
  unit?: string;
  /** Piksel cinsinden genislik. Varsayilan 220. */
  size?: number;
  /** Yayin derece acikligi: 180 (yarim) veya 270 (genis). Varsayilan 180. */
  span?: 180 | 270;
  /** Yay/band kalinligi. Varsayilana boyuta gore hesaplanir. */
  strokeWidth?: number;
  /** Ibreyi goster. Varsayilan: bolge varsa true, yoksa false. */
  showNeedle?: boolean;
  /** Uclarda min/max etiketlerini goster. Varsayilan true. */
  showRange?: boolean;
  /** Merkezdeki deger metnini override eder. */
  valueLabel?: React.ReactNode;
}

const toneStroke: Record<GaugeChartTone, string> = {
  primary: "hsl(var(--primary))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  destructive: "hsl(var(--destructive))",
  info: "hsl(var(--info))",
  muted: "hsl(var(--muted))",
};

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const GaugeChart = React.forwardRef<HTMLDivElement, GaugeChartProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      zones,
      label,
      unit,
      size = 220,
      span = 180,
      strokeWidth,
      showNeedle,
      showRange = true,
      valueLabel,
      className,
      ...props
    },
    ref
  ) => {
    const sw = strokeWidth ?? Math.max(10, Math.round(size / 11));
    const pad = sw / 2 + 6;
    const r = size / 2 - pad;
    const cx = size / 2;
    const cy = pad + r;
    const startAngle = span === 270 ? 135 : 180;

    const range = max - min || 1;
    const clampedValue = clampNumber(value, min, max);

    const rad = (deg: number) => (deg * Math.PI) / 180;
    const point = (radius: number, deg: number) => ({
      x: cx + radius * Math.cos(rad(deg)),
      y: cy + radius * Math.sin(rad(deg)),
    });
    const angleFor = (v: number) =>
      startAngle + ((clampNumber(v, min, max) - min) / range) * span;

    const describeArc = (radius: number, startDeg: number, endDeg: number) => {
      const s = point(radius, startDeg);
      const e = point(radius, endDeg);
      const large = endDeg - startDeg > 180 ? 1 : 0;
      return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
    };

    const hasZones = Boolean(zones && zones.length > 0);
    const withNeedle = showNeedle ?? hasZones;

    // Aktif bolge: degerin icinde bulundugu esik bolgesi.
    const activeZone = zones?.find((z) => {
      const lo = Math.min(z.from, z.to);
      const hi = Math.max(z.from, z.to);
      return clampedValue >= lo && clampedValue <= hi;
    });
    const valueColor = activeZone ? toneStroke[activeZone.tone] : undefined;

    // Ibre acisi ve tepe/kuyruk noktalari.
    const needleAngle = angleFor(clampedValue);
    const needleTip = point(r - sw * 0.1, needleAngle);
    const needleTail = point(-(sw * 0.6), needleAngle);
    const needleWidth = Math.max(2, sw * 0.16);
    const hubRadius = Math.max(4, sw * 0.42);

    const bottomArcY = span === 270 ? cy + r * Math.sin(rad(45)) : cy;
    const height = Math.ceil(bottomArcY + (showRange ? 22 : sw / 2 + 8));
    const valueCenterY = span === 270 ? cy : cy - r * 0.34;
    const rangeFontSize = Math.max(10, Math.round(size * 0.055));

    const summary = `Gosterge: ${clampedValue}${unit ? ` ${unit}` : ""}${
      typeof label === "string" ? `, ${label}` : ""
    }. Aralik ${min} ile ${max} arasi.`;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={summary}
        className={cn("relative inline-block max-w-full", className)}
        style={{ width: size, height }}
        {...props}
      >
        <svg
          width={size}
          height={height}
          viewBox={`0 0 ${size} ${height}`}
          className="block h-auto max-w-full overflow-visible"
          aria-hidden="true"
        >
          {/* Iz: tam yay, yumusak uclar */}
          <path
            d={describeArc(r, startAngle, startAngle + span)}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={sw}
            strokeLinecap="round"
          />

          {/* Esik bolgeleri veya primary dolu yay */}
          {hasZones ? (
            zones!.map((zone, index) => (
              <path
                key={index}
                d={describeArc(
                  r,
                  angleFor(Math.min(zone.from, zone.to)),
                  angleFor(Math.max(zone.from, zone.to))
                )}
                fill="none"
                stroke={toneStroke[zone.tone]}
                strokeWidth={sw}
                strokeLinecap="butt"
              />
            ))
          ) : clampedValue > min ? (
            <path
              d={describeArc(r, startAngle, needleAngle)}
              fill="none"
              stroke={toneStroke.primary}
              strokeWidth={sw}
              strokeLinecap="round"
            />
          ) : null}

          {/* Ibre + gobek */}
          {withNeedle ? (
            <>
              <line
                x1={needleTail.x}
                y1={needleTail.y}
                x2={needleTip.x}
                y2={needleTip.y}
                stroke="hsl(var(--foreground))"
                strokeWidth={needleWidth}
                strokeLinecap="round"
              />
              <circle
                cx={cx}
                cy={cy}
                r={hubRadius}
                fill="hsl(var(--background))"
                stroke="hsl(var(--foreground))"
                strokeWidth={Math.max(2, needleWidth * 0.9)}
              />
            </>
          ) : null}

          {/* Uc etiketleri: min / max */}
          {showRange ? (
            <>
              <text
                x={point(r, startAngle).x}
                y={point(r, startAngle).y + 16}
                textAnchor="middle"
                fontSize={rangeFontSize}
                fill="hsl(var(--muted-foreground))"
                className="tabular-nums"
              >
                {min}
              </text>
              <text
                x={point(r, startAngle + span).x}
                y={point(r, startAngle + span).y + 16}
                textAnchor="middle"
                fontSize={rangeFontSize}
                fill="hsl(var(--muted-foreground))"
                className="tabular-nums"
              >
                {max}
              </text>
            </>
          ) : null}
        </svg>

        {/* Merkez: buyuk deger + birim + etiket */}
        <div
          className="pointer-events-none absolute inset-x-0 flex flex-col items-center text-center leading-none"
          style={{ top: valueCenterY, transform: "translateY(-50%)" }}
        >
          <span
            className="font-bold tabular-nums text-foreground"
            style={{
              fontSize: Math.round(size * 0.17),
              color: valueColor,
            }}
          >
            {valueLabel ?? value}
            {unit ? (
              <span
                className="ml-0.5 font-semibold text-muted-foreground"
                style={{ fontSize: Math.round(size * 0.075) }}
              >
                {unit}
              </span>
            ) : null}
          </span>
          {label ? (
            <span className="mt-1.5 text-xs font-medium text-muted-foreground">
              {label}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);
GaugeChart.displayName = "GaugeChart";

export { GaugeChart };
