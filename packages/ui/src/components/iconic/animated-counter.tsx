"use client";

/**
 * AnimatedCounter — Görünürlükte 0'dan hedefe sayan büyük istatistik.
 * IntersectionObserver ile ekrana girince animasyon tetiklenir; ANCAK
 * ilk render ve prefers-reduced-motion durumunda DOĞRUDAN hedef değer
 * gösterilir (statik yakalama daima final değeri görür). Değer
 * `tabular-nums` ile sabit genişlikte, `font-display` başlık fontuyla çizilir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface AnimatedCounterProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "prefix"> {
  /** Sayılacak hedef değer. */
  value: number;
  /** Değeri metne çeviren biçimleyici. Varsayılan: tr-TR yerel biçim. */
  format?: (n: number) => string;
  /** Sayının başına eklenen içerik (ör. "₺"). */
  prefix?: React.ReactNode;
  /** Sayının sonuna eklenen içerik (ör. "%"). */
  suffix?: React.ReactNode;
  /** Sayma süresi (ms). Varsayılan 1200. */
  durationMs?: number;
}

const defaultFormat = (n: number) => Math.round(n).toLocaleString("tr-TR");

const AnimatedCounter = React.forwardRef<HTMLSpanElement, AnimatedCounterProps>(
  (
    {
      value,
      format = defaultFormat,
      prefix,
      suffix,
      durationMs = 1200,
      className,
      ...props
    },
    ref,
  ) => {
    // Başlangıç durumu = final değer (deterministik SSR + statik yakalama).
    const [display, setDisplay] = React.useState(value);
    const nodeRef = React.useRef<HTMLSpanElement | null>(null);
    const startedRef = React.useRef(false);
    const rafRef = React.useRef<number | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLSpanElement | null) => {
        nodeRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
      },
      [ref],
    );

    React.useEffect(() => {
      const node = nodeRef.current;
      if (!node) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Reduced-motion veya IO yoksa: animasyon yok, hedef değeri koru.
      if (prefersReduced || typeof IntersectionObserver === "undefined") {
        setDisplay(value);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !startedRef.current) {
              startedRef.current = true;
              const start = performance.now();
              const step = (now: number) => {
                const t = Math.min(1, (now - start) / durationMs);
                const eased = 1 - Math.pow(1 - t, 3);
                setDisplay(value * eased);
                if (t < 1) {
                  rafRef.current = requestAnimationFrame(step);
                } else {
                  setDisplay(value);
                }
              };
              rafRef.current = requestAnimationFrame(step);
            }
          }
        },
        { threshold: 0.4 },
      );

      observer.observe(node);
      return () => {
        observer.disconnect();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [value, durationMs]);

    const prefixText = typeof prefix === "string" ? prefix : "";
    const suffixText = typeof suffix === "string" ? suffix : "";

    return (
      <span
        ref={setRefs}
        className={cn(
          "font-display text-4xl font-bold tabular-nums text-foreground",
          className,
        )}
        {...props}
      >
        <span className="sr-only">
          {prefixText}
          {format(value)}
          {suffixText}
        </span>
        <span aria-hidden="true">
          {prefix}
          {format(display)}
          {suffix}
        </span>
      </span>
    );
  },
);
AnimatedCounter.displayName = "AnimatedCounter";

export { AnimatedCounter };
