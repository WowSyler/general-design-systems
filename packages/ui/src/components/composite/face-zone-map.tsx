/**
 * FaceZoneMap — Yuz bolge haritasi (GlowScan bolgesel cilt analizi).
 * Stilize bir yuz SVG'si uzerinde tiklanabilir/vurgulanabilir anatomik
 * bolgeler (alin, goz cevresi, burun, yanaklar, cene) her biri skoruna
 * gore tonlu bir durum rengiyle (iyi/orta/dikkat) boyanir. Secili bolge
 * yaninda skor, durum rozeti ve aciklama iceren detay panelinde gosterilir.
 * Kontrollu bilesendir: secim `selectedZoneId` ile disaridan yonetilir,
 * tiklama/klavye `onZoneSelect` ile bildirilir. SVG bir etiketli grup,
 * her bolge role="button" olarak klavyeyle erisilebilir.
 */
import * as React from "react";
import { ScanFace } from "lucide-react";

import { cn } from "@/lib/utils";

export type FaceZoneMapZoneId =
  | "alin"
  | "goz-cevresi"
  | "burun"
  | "sol-yanak"
  | "sag-yanak"
  | "cene";

export type FaceZoneMapStatus = "iyi" | "orta" | "dikkat";

export interface FaceZoneMapZone {
  id: FaceZoneMapZoneId;
  /** 0-100 arasi bolge skoru. */
  score: number;
  /** Belirtilmezse skordan turetilir (>=80 iyi, >=60 orta, aksi dikkat). */
  status?: FaceZoneMapStatus;
  /** Varsayilan Turkce etiketi ezmek icin. */
  label?: string;
  /** Detay panelinde gosterilecek aciklama. */
  description?: React.ReactNode;
}

export interface FaceZoneMapProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect" | "title"> {
  zones: FaceZoneMapZone[];
  /** Su an secili ve detayi gosterilen bolge. */
  selectedZoneId?: FaceZoneMapZoneId;
  /** Bir bolge tiklandiginda/Enter'landiginda cagrilir. */
  onZoneSelect?: (id: FaceZoneMapZoneId) => void;
  /** Kart basligi (opsiyonel). */
  title?: React.ReactNode;
}

type ZoneShape =
  | { type: "ellipse"; cx: number; cy: number; rx: number; ry: number }
  | { type: "path"; d: string };

interface ZoneGeometry {
  label: string;
  /** Skor rakaminin yerlesecegi merkez. */
  center: [number, number];
  shapes: ZoneShape[];
}

const FACE_OUTLINE =
  "M120,22 C168,22 200,60 200,112 C200,158 188,205 156,238 " +
  "C144,250 132,258 120,258 C108,258 96,250 84,238 " +
  "C52,205 40,158 40,112 C40,60 72,22 120,22 Z";

const ZONE_GEOMETRY: Record<FaceZoneMapZoneId, ZoneGeometry> = {
  alin: {
    label: "Alin",
    center: [120, 68],
    shapes: [{ type: "ellipse", cx: 120, cy: 68, rx: 52, ry: 26 }],
  },
  "goz-cevresi": {
    label: "Goz Cevresi",
    center: [120, 100],
    shapes: [
      { type: "ellipse", cx: 92, cy: 106, rx: 19, ry: 11 },
      { type: "ellipse", cx: 148, cy: 106, rx: 19, ry: 11 },
    ],
  },
  burun: {
    label: "Burun",
    center: [120, 140],
    shapes: [{ type: "ellipse", cx: 120, cy: 140, rx: 15, ry: 30 }],
  },
  "sol-yanak": {
    label: "Sol Yanak",
    center: [82, 158],
    shapes: [{ type: "ellipse", cx: 82, cy: 158, rx: 24, ry: 22 }],
  },
  "sag-yanak": {
    label: "Sag Yanak",
    center: [158, 158],
    shapes: [{ type: "ellipse", cx: 158, cy: 158, rx: 24, ry: 22 }],
  },
  cene: {
    label: "Cene",
    center: [120, 210],
    shapes: [{ type: "ellipse", cx: 120, cy: 210, rx: 40, ry: 30 }],
  },
};

interface StatusMeta {
  label: string;
  aria: string;
  /** SVG bolgesinin currentColor tonu. */
  text: string;
  /** Rozet dolgu/halka. */
  badge: string;
  /** Nokta ve ilerleme dolgusu. */
  solid: string;
}

const STATUS_META: Record<FaceZoneMapStatus, StatusMeta> = {
  iyi: {
    label: "Iyi",
    aria: "durum iyi",
    text: "text-success",
    badge: "bg-success/10 text-success ring-success/25",
    solid: "bg-success",
  },
  orta: {
    label: "Orta",
    aria: "durum orta",
    text: "text-warning",
    badge: "bg-warning/10 text-warning ring-warning/25",
    solid: "bg-warning",
  },
  dikkat: {
    label: "Dikkat",
    aria: "durum dikkat",
    text: "text-destructive",
    badge: "bg-destructive/10 text-destructive ring-destructive/25",
    solid: "bg-destructive",
  },
};

const STATUS_ORDER: FaceZoneMapStatus[] = ["iyi", "orta", "dikkat"];

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function statusFromScore(score: number): FaceZoneMapStatus {
  if (score >= 80) return "iyi";
  if (score >= 60) return "orta";
  return "dikkat";
}

function resolveStatus(zone: FaceZoneMapZone): FaceZoneMapStatus {
  return zone.status ?? statusFromScore(zone.score);
}

const FaceZoneMap = React.forwardRef<HTMLDivElement, FaceZoneMapProps>(
  ({ zones, selectedZoneId, onZoneSelect, title, className, ...props }, ref) => {
    const selectedZone = zones.find((zone) => zone.id === selectedZoneId);

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        {title ? (
          <div className="mb-4 flex items-center gap-2">
            <span
              className="rounded-lg bg-primary/10 p-1.5 text-primary"
              aria-hidden="true"
            >
              <ScanFace className="size-4" />
            </span>
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          </div>
        ) : null}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch">
          <div className="flex flex-col items-center gap-3 sm:w-[46%]">
            <svg
              role="group"
              aria-label="Yuz bolge haritasi"
              viewBox="0 0 240 290"
              className="h-auto w-full max-w-[240px]"
            >
              <path
                d={FACE_OUTLINE}
                fill="hsl(var(--muted))"
                fillOpacity={0.5}
                stroke="hsl(var(--border))"
                strokeWidth={2}
              />

              {zones.map((zone) => {
                const geometry = ZONE_GEOMETRY[zone.id];
                if (!geometry) return null;

                const status = resolveStatus(zone);
                const meta = STATUS_META[status];
                const selected = zone.id === selectedZoneId;
                const label = zone.label ?? geometry.label;
                const [cx, cy] = geometry.center;

                return (
                  <g
                    key={zone.id}
                    role="button"
                    tabIndex={0}
                    // Küçük anatomik bölgeler için eşdeğer 44px'lik seçici aşağıda (WCAG 2.5.8 "equivalent")
                    data-touch-equivalent=""
                    aria-pressed={selected}
                    aria-label={`${label}, skor ${Math.round(
                      clampScore(zone.score)
                    )} / 100, ${meta.aria}`}
                    onClick={() => onZoneSelect?.(zone.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onZoneSelect?.(zone.id);
                      }
                    }}
                    className={cn(
                      "cursor-pointer outline-none transition-all duration-200 [&>*]:transition-all [&>*]:duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      meta.text
                    )}
                  >
                    {geometry.shapes.map((shape, index) =>
                      shape.type === "ellipse" ? (
                        <ellipse
                          key={index}
                          cx={shape.cx}
                          cy={shape.cy}
                          rx={shape.rx}
                          ry={shape.ry}
                          fill="currentColor"
                          fillOpacity={selected ? 0.34 : 0.16}
                          stroke="currentColor"
                          strokeOpacity={selected ? 1 : 0.55}
                          strokeWidth={selected ? 2.5 : 1.5}
                        />
                      ) : (
                        <path
                          key={index}
                          d={shape.d}
                          fill="currentColor"
                          fillOpacity={selected ? 0.34 : 0.16}
                          stroke="currentColor"
                          strokeOpacity={selected ? 1 : 0.55}
                          strokeWidth={selected ? 2.5 : 1.5}
                        />
                      )
                    )}
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="hsl(var(--foreground))"
                      className="pointer-events-none select-none text-[11px] font-bold tabular-nums"
                    >
                      {Math.round(clampScore(zone.score))}
                    </text>
                  </g>
                );
              })}
            </svg>

            {onZoneSelect ? (
              <div
                role="group"
                aria-label="Bölge seç"
                className="hidden flex-wrap justify-center gap-2 pointer-coarse:flex"
              >
                {zones.map((zone) => {
                  const geometry = ZONE_GEOMETRY[zone.id];
                  if (!geometry) return null;
                  const selected = zone.id === selectedZoneId;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onZoneSelect(zone.id)}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        selected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {zone.label ?? geometry.label}
                      <span className="tabular-nums text-xs">
                        {Math.round(clampScore(zone.score))}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              {STATUS_ORDER.map((status) => (
                <li
                  key={status}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      STATUS_META[status].solid
                    )}
                    aria-hidden="true"
                  />
                  {STATUS_META[status].label}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1">
            {selectedZone ? (
              (() => {
                const status = resolveStatus(selectedZone);
                const meta = STATUS_META[status];
                const label =
                  selectedZone.label ?? ZONE_GEOMETRY[selectedZone.id].label;
                const score = clampScore(selectedZone.score);

                return (
                  <div className="flex h-full flex-col gap-3 rounded-lg bg-muted/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Secili bolge
                        </p>
                        <h3 className="text-base font-semibold text-foreground">
                          {label}
                        </h3>
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                          meta.badge
                        )}
                      >
                        <span
                          className={cn("size-1.5 rounded-full", meta.solid)}
                          aria-hidden="true"
                        />
                        {meta.label}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold tabular-nums text-foreground">
                        {Math.round(score)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / 100
                      </span>
                    </div>

                    <div
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(score)}
                      aria-label={`${label} skoru`}
                      className="h-2 w-full overflow-hidden rounded-full bg-muted"
                    >
                      <div
                        className={cn(
                          "h-full rounded-full transition-[width] duration-500",
                          meta.solid
                        )}
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    {selectedZone.description ? (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {selectedZone.description}
                      </p>
                    ) : null}
                  </div>
                );
              })()
            ) : (
              <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-6 text-center">
                <ScanFace
                  className="size-6 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground">
                  Bir bolge secerek bolgesel analiz detaylarini gorun.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
FaceZoneMap.displayName = "FaceZoneMap";

export { FaceZoneMap };
