/**
 * Container — icerigi yatayda ortalayan sarmalayici bilesen.
 * `size` prop'u ile maksimum genislik kademeli olarak secilir;
 * her boyutta responsive yatay padding uygulanir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

const containerSizeClasses: Record<ContainerSize, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-2xl",
  full: "max-w-full",
};

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maksimum genislik kademesi. Varsayilan: "xl". */
  size?: ContainerSize;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "xl", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        containerSizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Container.displayName = "Container";

export { Container };
export type { ContainerProps, ContainerSize };
