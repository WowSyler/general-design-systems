/**
 * Stack — flex tabanli dizilim yardimcisi.
 * `direction`, `gap`, `align`, `justify` ve `wrap` prop'lari ile
 * dikey/yatay yiginlar olusturur. `VStack` ve `HStack` ince sarmalayicilardir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type StackDirection = "vertical" | "horizontal";
type StackGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
type StackAlign = "start" | "center" | "end" | "stretch";
type StackJustify = "start" | "center" | "end" | "between";

const stackDirectionClasses: Record<StackDirection, string> = {
  vertical: "flex-col",
  horizontal: "flex-row",
};

const stackGapClasses: Record<StackGap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const stackAlignClasses: Record<StackAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const stackJustifyClasses: Record<StackJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dizilim yonu. Varsayilan: "vertical". */
  direction?: StackDirection;
  /** Elemanlar arasi bosluk. Varsayilan: "md". */
  gap?: StackGap;
  /** Capraz eksen hizalamasi. */
  align?: StackAlign;
  /** Ana eksen hizalamasi. */
  justify?: StackJustify;
  /** Satir sonunda alt satira gecis. */
  wrap?: boolean;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = "vertical",
      gap = "md",
      align,
      justify,
      wrap = false,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex",
        stackDirectionClasses[direction],
        stackGapClasses[gap],
        align ? stackAlignClasses[align] : undefined,
        justify ? stackJustifyClasses[justify] : undefined,
        wrap ? "flex-wrap" : undefined,
        className
      )}
      {...props}
    />
  )
);
Stack.displayName = "Stack";

type VStackProps = Omit<StackProps, "direction">;

/** Dikey Stack kisayolu. */
const VStack = React.forwardRef<HTMLDivElement, VStackProps>((props, ref) => (
  <Stack ref={ref} direction="vertical" {...props} />
));
VStack.displayName = "VStack";

type HStackProps = Omit<StackProps, "direction">;

/** Yatay Stack kisayolu. */
const HStack = React.forwardRef<HTMLDivElement, HStackProps>((props, ref) => (
  <Stack ref={ref} direction="horizontal" {...props} />
));
HStack.displayName = "HStack";

export { Stack, VStack, HStack };
export type {
  StackProps,
  VStackProps,
  HStackProps,
  StackDirection,
  StackGap,
  StackAlign,
  StackJustify,
};
