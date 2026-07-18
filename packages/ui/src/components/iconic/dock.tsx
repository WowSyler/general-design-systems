/**
 * Dock — macOS tarzı büyüteç dock.
 * Mobil / uygulama başlatıcı için imza bir gezinme çubuğu: fare
 * yaklaştıkça öğeler yakınlık bazlı büyür (macOS magnification), her
 * öğede üstte beliren etiket tooltip'i vardır. Yakalama/duraıan hâlde
 * (fare yok) tüm öğeler normal boyda ve tam görünür; büyüteç yalnızca
 * gerçek imleç hareketinde tetiklenir, bu yüzden statik render deterministiktir.
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface DockItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export interface DockProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: DockItem[];
  /** Büyüteç etkisinin eklediği en fazla ölçek (0 = kapalı). Varsayılan 0.45. */
  magnification?: number;
  /** Etkinin komşu öğelere yayıldığı yarıçap (px). Varsayılan 110. */
  radius?: number;
}

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    { items, magnification = 0.45, radius = 110, className, ...props },
    ref
  ) => {
    const itemsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
    // Boş dizi = duraıan hâl → her öğe scales[i] ?? 1 = 1 (deterministik ilk render).
    const [scales, setScales] = React.useState<number[]>([]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const next = itemsRef.current.map((el) => {
        if (!el) return 1;
        // offsetLeft/offsetWidth layout metrikleridir; transform: scale
        // bunları etkilemez → geri besleme (jitter) oluşmaz.
        const center = el.offsetLeft + el.offsetWidth / 2;
        const distance = Math.abs(localX - center);
        const t = Math.max(0, 1 - distance / radius);
        const eased = t * t * (3 - 2 * t); // smoothstep
        return 1 + magnification * eased;
      });
      setScales(next);
    };

    const handleMouseLeave = () => setScales([]);

    return (
      <div
        ref={ref}
        role="toolbar"
        aria-label="Uygulama dock"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative mx-auto flex w-fit items-end gap-2 rounded-2xl border bg-card/80 p-2 shadow-lg backdrop-blur-md",
          className
        )}
        {...props}
      >
        {items.map((item, index) => {
          const scale = scales[index] ?? 1;
          return (
            <button
              key={index}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              type="button"
              aria-label={item.label}
              aria-current={item.active ? "true" : undefined}
              onClick={item.onClick}
              style={{ transform: `scale(${scale})`, transformOrigin: "bottom" }}
              className={cn(
                "group relative flex min-h-11 min-w-11 items-center justify-center rounded-xl transition-transform duration-150 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <span
                aria-hidden="true"
                className="flex size-6 items-center justify-center [&>svg]:size-6"
              >
                {item.icon}
              </span>

              {/* Etiket tooltip'i — hover'da üstte belirir (statik yakalamada gizli). */}
              <span
                role="tooltip"
                className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 scale-90 whitespace-nowrap rounded-md border bg-popover px-2 py-1 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none"
              >
                {item.label}
              </span>

              {/* Aktiflik için renk dışı ikinci sinyal: alt nokta. */}
              {item.active ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0.5 size-1 rounded-full bg-primary"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    );
  }
);
Dock.displayName = "Dock";

export { Dock };
