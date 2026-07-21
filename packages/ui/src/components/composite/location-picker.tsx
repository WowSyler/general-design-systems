"use client";

/**
 * LocationPicker — Konum secici (Randevu/Dolap adres secimi).
 * Adres arama girisi + stilize harita placeholder uzerinde tiklama ya da
 * surukle-birak edilebilir bir igne ile konum belirleme; altinda secili
 * adres onizlemesi ve "Bu konumu kullan" onay dugmesi bulunur. Arama
 * onerileri secildiginde igne ilgili noktaya tasinir; haritaya dokunmak
 * veya igneyi suruklemek koordinat bazli bir konum secer. Klavyeyle
 * (Tab ile igneye odaklanip ok tuslariyla) konum ince ayarlanabilir.
 * Icsel durumu kendisi yonetir; degisimleri onChange, onayi onConfirm
 * ile disari bildirir.
 */
import * as React from "react";
import { Crosshair, MapPin, Navigation, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface LocationPickerPoint {
  /** Harita genisligine gore 0-100 arasi yatay konum. */
  x: number;
  /** Harita yuksekligine gore 0-100 arasi dikey konum. */
  y: number;
}

export interface LocationPickerSuggestion {
  id: string;
  /** Ana adres satiri (or. sokak/mahalle). */
  label: string;
  /** Ikincil satir (or. ilce, sehir). */
  description?: string;
  /** Onerinin harita uzerindeki noktasi. */
  point: LocationPickerPoint;
}

export interface LocationPickerValue {
  point: LocationPickerPoint;
  address: string;
  description?: string;
}

export interface LocationPickerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  suggestions?: LocationPickerSuggestion[];
  /** Baslangicta igne konumu. */
  defaultPoint?: LocationPickerPoint;
  /** Baslangicta secili adres. */
  defaultAddress?: string;
  searchPlaceholder?: string;
  confirmLabel?: string;
  emptyMessage?: string;
  /** Konum her degistiginde (arama/tiklama/surukleme) cagrilir. */
  onChange?: (value: LocationPickerValue) => void;
  /** "Bu konumu kullan" tiklaninca cagrilir. */
  onConfirm?: (value: LocationPickerValue) => void;
}

type SelectionSource = "search" | "map";

interface Selection {
  point: LocationPickerPoint;
  address: string;
  description?: string;
  source: SelectionSource;
}

const STEP = 3;

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

/** x/y yuzdesinden gercekci gorunumlu (Istanbul cevresi) sahte koordinat uretir. */
function coordLabel(point: LocationPickerPoint): string {
  const lat = 41.095 - (point.y / 100) * 0.15;
  const lng = 28.945 + (point.x / 100) * 0.22;
  return `${lat.toFixed(5)}° K, ${lng.toFixed(5)}° D`;
}

const LocationPicker = React.forwardRef<HTMLDivElement, LocationPickerProps>(
  (
    {
      suggestions = [],
      defaultPoint,
      defaultAddress,
      searchPlaceholder = "Adres, mahalle veya sokak ara…",
      confirmLabel = "Bu konumu kullan",
      emptyMessage = "Eslesen adres bulunamadi.",
      onChange,
      onConfirm,
      className,
      ...props
    },
    ref
  ) => {
    const mapRef = React.useRef<HTMLDivElement>(null);
    const [query, setQuery] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [dragging, setDragging] = React.useState(false);
    const [confirmed, setConfirmed] = React.useState(false);
    const [selection, setSelection] = React.useState<Selection | null>(() =>
      defaultPoint
        ? {
            point: defaultPoint,
            address: defaultAddress ?? "Haritada secilen konum",
            description: defaultAddress ? undefined : coordLabel(defaultPoint),
            source: defaultAddress ? "search" : "map",
          }
        : null
    );

    const emit = React.useCallback(
      (next: Selection) => {
        setSelection(next);
        setConfirmed(false);
        onChange?.({
          point: next.point,
          address: next.address,
          description: next.description,
        });
      },
      [onChange]
    );

    const filtered = React.useMemo(() => {
      const q = query.trim().toLocaleLowerCase("tr-TR");
      if (!q) return suggestions;
      return suggestions.filter((s) =>
        `${s.label} ${s.description ?? ""}`.toLocaleLowerCase("tr-TR").includes(q)
      );
    }, [query, suggestions]);

    const pointFromEvent = (
      event: React.PointerEvent<HTMLDivElement>
    ): LocationPickerPoint | null => {
      const rect = mapRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) return null;
      return {
        x: clamp(((event.clientX - rect.left) / rect.width) * 100),
        y: clamp(((event.clientY - rect.top) / rect.height) * 100),
      };
    };

    const setMapPoint = (point: LocationPickerPoint) => {
      emit({
        point,
        address: "Haritada secilen konum",
        description: coordLabel(point),
        source: "map",
      });
    };

    const selectSuggestion = (suggestion: LocationPickerSuggestion) => {
      emit({
        point: suggestion.point,
        address: suggestion.label,
        description: suggestion.description,
        source: "search",
      });
      setQuery(suggestion.label);
      setOpen(false);
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      const point = pointFromEvent(event);
      if (!point) return;
      setMapPoint(point);
      setDragging(true);
      mapRef.current?.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      const point = pointFromEvent(event);
      if (point) setMapPoint(point);
    };

    const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      setDragging(false);
      if (mapRef.current?.hasPointerCapture(event.pointerId)) {
        mapRef.current.releasePointerCapture(event.pointerId);
      }
    };

    const nudge = (dx: number, dy: number) => {
      const base = selection?.point ?? { x: 50, y: 50 };
      setMapPoint({ x: clamp(base.x + dx), y: clamp(base.y + dy) });
    };

    const handlePinKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          nudge(0, -STEP);
          break;
        case "ArrowDown":
          event.preventDefault();
          nudge(0, STEP);
          break;
        case "ArrowLeft":
          event.preventDefault();
          nudge(-STEP, 0);
          break;
        case "ArrowRight":
          event.preventDefault();
          nudge(STEP, 0);
          break;
        default:
          break;
      }
    };

    const handleConfirm = () => {
      if (!selection) return;
      setConfirmed(true);
      onConfirm?.({
        point: selection.point,
        address: selection.address,
        description: selection.description,
      });
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full max-w-md flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        {/* Arama girisi + oneriler */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="text"
            role="combobox"
            aria-expanded={open && filtered.length > 0}
            aria-autocomplete="list"
            value={query}
            placeholder={searchPlaceholder}
            className="h-11 pl-9"
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpen(false);
            }}
          />
          {open && query.trim().length > 0 ? (
            <div
              role="listbox"
              aria-label="Adres onerileri"
              className="absolute z-20 mt-1.5 max-h-60 w-full overflow-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
            >
              {filtered.length > 0 ? (
                filtered.map((suggestion) => {
                  const active = selection?.address === suggestion.label;
                  return (
                    <button
                      key={suggestion.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => selectSuggestion(suggestion)}
                      className={cn(
                        "flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/60"
                      )}
                    >
                      <MapPin
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {suggestion.label}
                        </span>
                        {suggestion.description ? (
                          <span className="block truncate text-xs text-muted-foreground">
                            {suggestion.description}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="px-2.5 py-3 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* Stilize harita + igne */}
        <div
          ref={mapRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          className={cn(
            "relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-xl border border-border bg-muted",
            dragging ? "cursor-grabbing" : "cursor-crosshair"
          )}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 75"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Park alani */}
            <rect
              x={6}
              y={8}
              width={26}
              height={20}
              rx={2}
              fill="hsl(var(--success))"
              fillOpacity={0.14}
            />
            {/* Su kanali */}
            <path
              d="M0,58 C22,52 30,66 52,60 C74,54 86,66 100,60 L100,75 L0,75 Z"
              fill="hsl(var(--info))"
              fillOpacity={0.16}
            />
            {/* Sokak izgarasi */}
            <g stroke="hsl(var(--border))" strokeWidth={0.6}>
              <line x1={0} y1={20} x2={100} y2={20} />
              <line x1={0} y1={40} x2={100} y2={40} />
              <line x1={20} y1={0} x2={20} y2={75} />
              <line x1={48} y1={0} x2={48} y2={75} />
              <line x1={72} y1={0} x2={72} y2={75} />
            </g>
            {/* Ana cadde */}
            <line
              x1={0}
              y1={4}
              x2={100}
              y2={70}
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.28}
              strokeWidth={1.4}
            />
            {/* Yapi bloklari */}
            <g fill="hsl(var(--foreground))" fillOpacity={0.05}>
              <rect x={54} y={24} width={12} height={10} rx={1} />
              <rect x={78} y={44} width={14} height={12} rx={1} />
              <rect x={26} y={46} width={14} height={9} rx={1} />
            </g>
          </svg>

          {/* Bos durum ipucu */}
          {!selection ? (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6 text-center">
              <span className="rounded-full bg-background/80 p-2.5 text-muted-foreground shadow-sm backdrop-blur-sm">
                <Crosshair className="size-5" />
              </span>
              <p className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
                Konumu isaretlemek icin haritaya dokunun
              </p>
            </div>
          ) : null}

          {/* Igne */}
          {selection ? (
            <button
              type="button"
              aria-label={`Secili konum: ${selection.address}. Ok tuslariyla ince ayar yapin.`}
              onKeyDown={handlePinKeyDown}
              onClick={(event) => event.stopPropagation()}
              style={{
                left: `${selection.point.x}%`,
                top: `${selection.point.y}%`,
              }}
              className={cn(
                "absolute z-10 -translate-x-1/2 -translate-y-full rounded-full text-primary outline-none transition-[filter] duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                dragging ? "cursor-grabbing" : "cursor-grab"
              )}
            >
              <span className="absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-primary/25 blur-[2px]" />
              <MapPin
                className="relative size-8 drop-shadow-md [&>circle]:fill-primary-foreground"
                strokeWidth={2.25}
                aria-hidden="true"
              />
              <span
                className="absolute left-1/2 top-[70%] size-6 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse rounded-full bg-primary/20"
                aria-hidden="true"
              />
            </button>
          ) : null}
        </div>

        {/* Secili adres onizlemesi */}
        <div
          className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-3"
          aria-live="polite"
        >
          <span
            className="mt-0.5 rounded-lg bg-primary/10 p-1.5 text-primary"
            aria-hidden="true"
          >
            <Navigation className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Secili adres
            </p>
            {selection ? (
              <>
                <p className="truncate text-sm font-semibold text-foreground">
                  {selection.address}
                </p>
                {selection.description ? (
                  <p className="truncate text-xs tabular-nums text-muted-foreground">
                    {selection.description}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Henuz konum secilmedi.
              </p>
            )}
          </div>
        </div>

        <Button
          type="button"
          disabled={!selection}
          onClick={handleConfirm}
          className="h-11 w-full"
        >
          {confirmed ? "Konum kaydedildi" : confirmLabel}
        </Button>
      </div>
    );
  }
);
LocationPicker.displayName = "LocationPicker";

export { LocationPicker };
