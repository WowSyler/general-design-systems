/**
 * BentoGrid + BentoCard — modern bento düzeni.
 * Değişken boyutlu (colSpan/rowSpan) kartlardan oluşan asimetrik ızgara;
 * her kart arkaya konumlanan dekoratif bir katman (background) taşıyabilir.
 * Fisly/DeployLens panoları için imza yerleşim; tema-agnostik ve tokenize.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export type BentoGridProps = React.HTMLAttributes<HTMLDivElement>;

export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(180px,auto)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
BentoGrid.displayName = "BentoGrid";

/** Sütun genişliği — küçük ekranda tek sütun, kırılım noktalarında büyür. */
const colSpanClasses: Record<1 | 2 | 3, string> = {
  1: "col-span-1",
  2: "col-span-1 sm:col-span-2",
  3: "col-span-1 sm:col-span-2 lg:col-span-3",
};

/** Satır yüksekliği — mobilde tek satır, sm ve üzerinde iki satıra uzar. */
const rowSpanClasses: Record<1 | 2, string> = {
  1: "row-span-1",
  2: "row-span-1 sm:row-span-2",
};

export interface BentoCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Kaç sütun kaplayacağı. */
  colSpan?: 1 | 2 | 3;
  /** Kaç satır kaplayacağı. */
  rowSpan?: 1 | 2;
  /** Başlık üstü küçük etiket. */
  eyebrow?: React.ReactNode;
  /** Kart başlığı. */
  title: React.ReactNode;
  /** Açıklama metni. */
  description?: React.ReactNode;
  /** Sol üstte gösterilen ikon. */
  icon?: React.ReactNode;
  /** Alt kısımda gösterilen aksiyon (ör. buton/link). */
  action?: React.ReactNode;
  /** Arkaya konumlanan dekoratif katman (ör. bg-aurora). */
  background?: React.ReactNode;
}

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  (
    {
      colSpan = 1,
      rowSpan = 1,
      eyebrow,
      title,
      description,
      icon,
      action,
      background,
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        colSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
        className,
      )}
      {...props}
    >
      {background ? (
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          {background}
        </div>
      ) : null}
      <div className="relative z-10 flex h-full flex-col">
        {icon ? (
          <div className="mb-4 inline-flex w-fit rounded-xl bg-primary/10 p-2.5 text-primary">
            {icon}
          </div>
        ) : null}
        {eyebrow ? (
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {eyebrow}
          </div>
        ) : null}
        <h3 className="mt-1 text-lg font-semibold text-card-foreground">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        ) : null}
        {children}
        {action ? <div className="mt-auto pt-4">{action}</div> : null}
      </div>
    </div>
  ),
);
BentoCard.displayName = "BentoCard";
