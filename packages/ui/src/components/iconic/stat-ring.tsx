/**
 * StatRing — Gösterişli dairesel ilerleme halkası.
 * ProgressRing'den daha çarpıcı: iz `--muted` tonunda, dolgu marka
 * gradyanı (`--gradient-from` → `--gradient-to`) stroke'u ve SVG glow
 * (feDropShadow) filtresiyle çizilir; uçlar yuvarlak. Merkezde `label`
 * ya da büyük yüzde değeri, altında opsiyonel `caption`. Değer proptan
 * doğrudan türetildiği için statik yakalamada tam dolu görünür.
 * role="meter" ile erişilebilir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface StatRingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 0-100 arası ilerleme değeri. */
  value: number;
  /** Piksel cinsinden çap. Varsayılan 140. */
  size?: number;
  /** Halka kalınlığı. Varsayılan size tabanlı (~size*0.085). */
  strokeWidth?: number;
  /** Merkez içeriği; yoksa büyük yüzde değeri yazılır. */
  label?: React.ReactNode;
  /** Merkez değerin altındaki açıklama. */
  caption?: React.ReactNode;
}

const StatRing = React.forwardRef<HTMLDivElement, StatRingProps>(
  ({ value, size = 140, strokeWidth, label, caption, className, ...props }, ref) => {
    const gradientId = React.useId();
    const glowId = React.useId();

    const clamped = Math.min(100, Math.max(0, value));
    const sw = strokeWidth ?? Math.round(size * 0.085);
    const radius = (size - sw) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - clamped / 100);

    const ariaLabel =
      typeof caption === "string"
        ? `${caption}: %${Math.round(clamped)}`
        : `İlerleme: %${Math.round(clamped)}`;

    return (
      <div
        ref={ref}
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
        aria-label={ariaLabel}
        className={cn(
          "relative inline-flex flex-col items-center justify-center",
          className,
        )}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--gradient-from))" />
              <stop offset="100%" stopColor="hsl(var(--gradient-to))" />
            </linearGradient>
            <filter
              id={glowId}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation={sw * 0.35}
                floodColor="hsl(var(--primary))"
                floodOpacity="0.55"
              />
            </filter>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={sw}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter={`url(#${glowId})`}
            className="transition-all duration-500 ease-out motion-reduce:transition-none"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 px-4 text-center">
          <span className="font-display text-4xl font-bold tabular-nums leading-none text-foreground">
            {label ?? `%${Math.round(clamped)}`}
          </span>
          {caption ? (
            <span className="text-xs font-medium text-muted-foreground">
              {caption}
            </span>
          ) : null}
        </div>
      </div>
    );
  },
);
StatRing.displayName = "StatRing";

export { StatRing };
