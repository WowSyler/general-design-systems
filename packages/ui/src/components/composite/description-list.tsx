"use client";

/**
 * DescriptionList — dt/dd etiket-deger listesi (detay/ozet paneli).
 * Semantik <dl>/<dt>/<dd> kullanir; her satir <div> ile gruplanir.
 * orientation:
 *   - horizontal: etiket solda sabit genislikte, deger sagda (mobilde alt alta).
 *   - vertical: etiket ustte, deger altta.
 *   - grid: responsive iki kolon (mobilde tek kolon), her oge etiket/deger yigini.
 * bordered: kart cercevesi + satir ayraclari. divided: yalnizca ayrac cizgileri.
 * Opsiyonel kopyalanabilir deger (copyable): panoya kopyalar, gecici onay ikonu
 * gosterir. Ozet/detay panosu olarak DeployLens/Dolap/Randevu/GlowScan/Fisly'de
 * tekrar eden bir desen. Tema-agnostik, salt sunum (kopya butonu haric).
 */
import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export type DescriptionListOrientation = "horizontal" | "vertical" | "grid";

export interface DescriptionListItem {
  /** Etiket (dt). */
  term: React.ReactNode;
  /** Deger (dd). */
  description: React.ReactNode;
  /** Etiketin solunda gosterilecek opsiyonel ikon (lucide size-4). */
  icon?: React.ReactNode;
  /** Deger panoya kopyalanabilir olsun mu. */
  copyable?: boolean;
  /** Kopyalanacak ham metin. Verilmezse ve description string ise o kullanilir. */
  copyValue?: string;
  /** Satir <div> ogesine ek sinif. */
  className?: string;
}

const descriptionListVariants = cva("text-sm text-foreground", {
  variants: {
    orientation: {
      horizontal: "",
      vertical: "",
      grid: "grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2",
    },
    bordered: {
      true: "rounded-xl border border-border bg-card overflow-hidden",
      false: "",
    },
    divided: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    // Non-grid: ayrac cizgileri (bordered veya divided istendiginde)
    { orientation: "horizontal", divided: true, class: "divide-y divide-border" },
    { orientation: "vertical", divided: true, class: "divide-y divide-border" },
    { orientation: "horizontal", bordered: true, class: "divide-y divide-border" },
    { orientation: "vertical", bordered: true, class: "divide-y divide-border" },
    // Non-grid, cerceve/ayrac yoksa: satirlar arasi bosluk
    { orientation: "horizontal", bordered: false, divided: false, class: "space-y-3" },
    { orientation: "vertical", bordered: false, divided: false, class: "space-y-3" },
    // Grid + cerceve: ic dolgu
    { orientation: "grid", bordered: true, class: "p-4 sm:p-5" },
  ],
  defaultVariants: { orientation: "horizontal", bordered: false, divided: false },
});

export interface DescriptionListProps
  extends Omit<React.HTMLAttributes<HTMLDListElement>, "children"> {
  /** Etiket-deger ciftleri. */
  items: DescriptionListItem[];
  /** Yerlesim: horizontal (varsayilan) | vertical | grid. */
  orientation?: DescriptionListOrientation;
  /** Kart cercevesi + satir ayraclari. */
  bordered?: boolean;
  /** Yalnizca satir ayrac cizgileri (grid'de etkisizdir). */
  divided?: boolean;
  /** Horizontal yerlesimde etiket kolonu genislik sinifi (varsayilan sm:w-48). */
  termWidth?: string;
}

/** Panoya kopyalayan kucuk ikon butonu; kopyalaninca gecici onay gosterir. */
function DescriptionListCopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const handleCopy = React.useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  }, [value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Kopyalandi" : "Kopyala"}
      className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background active:scale-[0.95]"
    >
      {copied ? (
        <Check className="size-3.5 text-success" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
    </button>
  );
}

const DescriptionList = React.forwardRef<HTMLDListElement, DescriptionListProps>(
  (
    {
      items,
      orientation = "horizontal",
      bordered = false,
      divided = false,
      termWidth,
      className,
      ...props
    },
    ref
  ) => {
    const isGrid = orientation === "grid";
    const isHorizontal = orientation === "horizontal";

    const rowClass = cn(
      isHorizontal
        ? "flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4"
        : "flex flex-col gap-1",
      // Non-grid ic dolgu (cerceve veya ayrac varken)
      !isGrid && bordered && "px-4 py-3 sm:px-5",
      !isGrid && !bordered && divided && "py-3"
    );

    return (
      <dl
        ref={ref}
        className={cn(
          descriptionListVariants({ orientation, bordered, divided }),
          className
        )}
        {...props}
      >
        {items.map((item, index) => {
          const copyStr =
            item.copyValue ??
            (typeof item.description === "string" ? item.description : undefined);
          const showCopy = Boolean(item.copyable && copyStr);

          return (
            <div key={index} className={cn(rowClass, item.className)}>
              <dt
                className={cn(
                  "flex items-center gap-1.5 font-medium text-muted-foreground [&_svg]:size-4",
                  isHorizontal && (termWidth ?? "sm:w-48 sm:shrink-0")
                )}
              >
                {item.icon ? (
                  <span className="shrink-0 text-muted-foreground" aria-hidden="true">
                    {item.icon}
                  </span>
                ) : null}
                <span>{item.term}</span>
              </dt>
              <dd
                className={cn(
                  "min-w-0 text-foreground",
                  isHorizontal && "sm:flex-1"
                )}
              >
                {showCopy ? (
                  <span className="flex items-center gap-1.5">
                    <span className="min-w-0 break-words tabular-nums">
                      {item.description}
                    </span>
                    <DescriptionListCopyButton value={copyStr as string} />
                  </span>
                ) : (
                  item.description
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    );
  }
);
DescriptionList.displayName = "DescriptionList";

export { DescriptionList, descriptionListVariants };
