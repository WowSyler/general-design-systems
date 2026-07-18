/**
 * Spinner — Yuklenme gostergesi.
 * Donen Loader2 ikonu ile bekleme durumunu belirtir; sr-only etiket ve
 * role="status" ile ekran okuyuculara duyurulur.
 */
import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  /** Ekran okuyucu etiketi. Varsayilan "Yükleniyor". */
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = "md", label = "Yükleniyor", className, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <Loader2
        className={cn("animate-spin text-muted-foreground", sizeClasses[size])}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  )
);
Spinner.displayName = "Spinner";

export { Spinner };
