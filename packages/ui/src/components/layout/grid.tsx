/**
 * Grid — responsive kolon duzeni.
 * `cols` prop'u ile her kirilim noktasi (base/sm/md/lg) icin kolon sayisi,
 * `gap` prop'u ile elemanlar arasi bosluk belirlenir.
 * Tum sinif adlari statik literal haritalardan secilir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type GridColCount = 1 | 2 | 3 | 4 | 5 | 6;

interface GridCols {
  base?: GridColCount;
  sm?: GridColCount;
  md?: GridColCount;
  lg?: GridColCount;
}

type GridGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";

const gridGapClasses: Record<GridGap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const gridBaseColClasses: Record<GridColCount, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const gridSmColClasses: Record<GridColCount, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
};

const gridMdColClasses: Record<GridColCount, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

const gridLgColClasses: Record<GridColCount, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Kirilim noktasi basina kolon sayilari. Varsayilan: { base: 1, sm: 2, lg: 3 }. */
  cols?: GridCols;
  /** Elemanlar arasi bosluk. Varsayilan: "md". */
  gap?: GridGap;
}

const defaultCols: GridCols = { base: 1, sm: 2, lg: 3 };

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = defaultCols, gap = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid",
        gridGapClasses[gap],
        cols.base !== undefined ? gridBaseColClasses[cols.base] : undefined,
        cols.sm !== undefined ? gridSmColClasses[cols.sm] : undefined,
        cols.md !== undefined ? gridMdColClasses[cols.md] : undefined,
        cols.lg !== undefined ? gridLgColClasses[cols.lg] : undefined,
        className
      )}
      {...props}
    />
  )
);
Grid.displayName = "Grid";

export { Grid };
export type { GridProps, GridCols, GridColCount, GridGap };
