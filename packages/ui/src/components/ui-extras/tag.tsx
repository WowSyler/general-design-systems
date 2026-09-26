/**
 * Tag — Kaldirilabilir etiket cipi (Dolap etiketleri).
 * Pill formunda etiket; opsiyonel ikon ve X butonu ile kaldirma
 * aksiyonu sunar. Uc varyant: default, primary, outline.
 */
"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type TagVariant = "default" | "primary" | "outline";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Etiket metni. */
  label: string;
  /** Verildiginde X butonu gosterilir ve tiklaninca cagrilir. */
  onRemove?: () => void;
  /** Solda gosterilecek opsiyonel ikon. */
  icon?: React.ReactNode;
  variant?: TagVariant;
}

const variantClasses: Record<TagVariant, string> = {
  default: "bg-secondary text-secondary-foreground",
  primary: "bg-primary/15 text-primary",
  outline: "border bg-transparent text-foreground",
};

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ label, onRemove, icon, variant = "default", className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 [&_svg]:h-3 [&_svg]:w-3",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <span>{label}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Kaldır"
          className="-me-1 ms-0.5 inline-flex h-4 w-4 touch-hitbox items-center justify-center rounded-full transition-all duration-200 hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      ) : null}
    </span>
  )
);
Tag.displayName = "Tag";

export { Tag };
