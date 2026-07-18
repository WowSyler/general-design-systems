/**
 * Kbd — Klavye tusu kapagi.
 * Kisayol tuslarini fiziksel tus gorunumunde gosterir; KbdGroup ile
 * yan yana kombinasyonlar (or. ⌘K) olusturulur.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export type KbdProps = React.HTMLAttributes<HTMLElement>;

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Kbd.displayName = "Kbd";

export type KbdGroupProps = React.HTMLAttributes<HTMLSpanElement>;

const KbdGroup = React.forwardRef<HTMLSpanElement, KbdGroupProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
);
KbdGroup.displayName = "KbdGroup";

export { Kbd, KbdGroup };
