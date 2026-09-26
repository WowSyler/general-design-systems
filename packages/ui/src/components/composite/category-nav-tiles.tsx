/**
 * CategoryNavTiles — Kategori kesif izgarasi (Dolap ana sayfa kategori kesfi).
 * Ikon + etiketli, tonlu ikon daireli tiklanabilir kategori karolari; 2-6
 * kolon arasi responsive bir grid halinde dizilir. Her karo href verilirse
 * <a>, verilmezse <button> olarak render edilir ve istege bagli urun sayisi
 * gosterebilir. Yaninda yatay kaydirilabilir kategori pill seridi
 * (CategoryNavTilesPillStrip) sunar; aktif pill ring/tonlu vurgu alir.
 * Tema-agnostik: hardcoded renk yok, tonlar hsl(var(--chartN)) uzerinden gelir.
 * Erisilebilir: <nav> + <ul>/<li>, aria-label, aktif pill icin aria-current.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Tonlu ikon da'iresi icin grafik renk tonu (1-5). */
export type CategoryNavTilesTone = 1 | 2 | 3 | 4 | 5;

const toneCircleClasses: Record<CategoryNavTilesTone, string> = {
  1: "bg-chart-1/15",
  2: "bg-chart-2/15",
  3: "bg-chart-3/15",
  4: "bg-chart-4/15",
  5: "bg-chart-5/15",
};

const columnClasses: Record<2 | 3 | 4 | 5 | 6, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-3 sm:grid-cols-5",
  6: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6",
};

const categoryNavTilesTileVariants = cva(
  "group relative flex flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "border bg-card text-card-foreground shadow-sm hover:-translate-y-0.5 hover:border-ring/60 hover:shadow-md",
        soft: "bg-muted/40 text-foreground hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface CategoryNavTilesItem {
  /** Kategori etiketi. */
  label: React.ReactNode;
  /** Kategori ikonu (lucide ikonu onerilir). */
  icon?: React.ReactNode;
  /** Verilirse karo <a> olarak render edilir. */
  href?: string;
  /** Istege bagli alt bilgi (or. urun sayisi). */
  count?: React.ReactNode;
  /** Ikon dairesinin renk tonu; verilmezse siraya gore atanir. */
  tone?: CategoryNavTilesTone;
  /** Karonun devre disi olup olmadigi. */
  disabled?: boolean;
  /** Karoya tiklandiginda cagrilir. */
  onClick?: React.MouseEventHandler<HTMLElement>;
}

/* -------------------------------------------------------------------------- */
/* Tek karo (ic yardimci)                                                     */
/* -------------------------------------------------------------------------- */

function CategoryNavTilesTile({
  item,
  tone,
  variant,
}: {
  item: CategoryNavTilesItem;
  tone: CategoryNavTilesTone;
  variant: "default" | "soft";
}) {
  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "flex size-12 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 [&_svg]:size-5",
          toneCircleClasses[tone],
        )}
        style={{ color: `hsl(var(--chart${tone}))` }}
      >
        {item.icon}
      </span>
      <span className="line-clamp-2 text-sm font-medium leading-tight">
        {item.label}
      </span>
      {item.count !== undefined && item.count !== null ? (
        <span className="text-xs tabular-nums text-muted-foreground">
          {item.count}
        </span>
      ) : null}
    </>
  );

  const tileClass = cn(
    categoryNavTilesTileVariants({ variant }),
    item.disabled && "pointer-events-none opacity-50",
  );

  if (item.href && !item.disabled) {
    return (
      <a href={item.href} onClick={item.onClick} className={tileClass}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={item.disabled}
      onClick={item.onClick}
      className={tileClass}
    >
      {content}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* CategoryNavTiles (grid)                                                     */
/* -------------------------------------------------------------------------- */

export interface CategoryNavTilesProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onClick">,
    VariantProps<typeof categoryNavTilesTileVariants> {
  /** Gosterilecek kategoriler. */
  items: CategoryNavTilesItem[];
  /** Genis ekranda hedeflenen sutun sayisi (mobilde daralir). */
  columns?: 2 | 3 | 4 | 5 | 6;
  /** Gezinme alani icin erisilebilir etiket. */
  label?: string;
}

const CategoryNavTiles = React.forwardRef<HTMLElement, CategoryNavTilesProps>(
  ({ items, columns = 4, variant = "default", label = "Kategoriler", className, ...props }, ref) => {
    return (
      <nav ref={ref} aria-label={label} className={cn(className)} {...props}>
        <ul role="list" className={cn("grid gap-3", columnClasses[columns])}>
          {items.map((item, index) => (
            <li key={index}>
              <CategoryNavTilesTile
                item={item}
                tone={item.tone ?? (((index % 5) + 1) as CategoryNavTilesTone)}
                variant={variant ?? "default"}
              />
            </li>
          ))}
        </ul>
      </nav>
    );
  },
);
CategoryNavTiles.displayName = "CategoryNavTiles";

/* -------------------------------------------------------------------------- */
/* CategoryNavTilesPillStrip (yatay kaydirilabilir pill seridi)               */
/* -------------------------------------------------------------------------- */

const categoryNavTilesPillVariants = cva(
  "inline-flex shrink-0 select-none items-center gap-1.5 whitespace-nowrap pointer-coarse:min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      active: {
        true: "border-transparent bg-primary bg-sheen text-primary-foreground shadow-sm",
        false:
          "border-input bg-card text-foreground hover:-translate-y-0.5 hover:border-ring/60 hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export interface CategoryNavTilesPillItem {
  /** Pill etiketi. */
  label: React.ReactNode;
  /** Istege bagli lider ikon. */
  icon?: React.ReactNode;
  /** Verilirse pill <a> olarak render edilir. */
  href?: string;
  /** Pill'in secili/aktif olup olmadigi. */
  active?: boolean;
  /** Pill'in devre disi olup olmadigi. */
  disabled?: boolean;
  /** Pill'e tiklandiginda cagrilir. */
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface CategoryNavTilesPillStripProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onClick"> {
  /** Gosterilecek pill kategorileri. */
  items: CategoryNavTilesPillItem[];
  /** Gezinme alani icin erisilebilir etiket. */
  label?: string;
}

function CategoryNavTilesPill({ item }: { item: CategoryNavTilesPillItem }) {
  const active = item.active ?? false;
  const content = (
    <>
      {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
      <span>{item.label}</span>
    </>
  );

  const pillClass = cn(
    categoryNavTilesPillVariants({ active }),
    item.disabled && "pointer-events-none opacity-50",
  );

  if (item.href && !item.disabled) {
    return (
      <a
        href={item.href}
        onClick={item.onClick}
        aria-current={active ? "page" : undefined}
        className={pillClass}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={item.disabled}
      onClick={item.onClick}
      aria-pressed={active}
      className={pillClass}
    >
      {content}
    </button>
  );
}

const CategoryNavTilesPillStrip = React.forwardRef<
  HTMLElement,
  CategoryNavTilesPillStripProps
>(({ items, label = "Kategoriler", className, ...props }, ref) => {
  return (
    <nav ref={ref} aria-label={label} className={cn("relative", className)} {...props}>
      <ul
        role="list"
        className="relative flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <li key={index}>
            <CategoryNavTilesPill item={item} />
          </li>
        ))}
      </ul>
    </nav>
  );
});
CategoryNavTilesPillStrip.displayName = "CategoryNavTilesPillStrip";

export {
  CategoryNavTiles,
  CategoryNavTilesPillStrip,
  categoryNavTilesTileVariants,
  categoryNavTilesPillVariants,
};
