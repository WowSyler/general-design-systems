"use client";
/**
 * BulkActionBar — Coklu secim sonrasi beliren yapiskan (sticky) eylem cubugu.
 * Bir liste/tabloda ogeler secilince alttan animate-fade-up ile girer:
 * "N secildi" sayaci + toplu aksiyon butonlari (Sil/Arsivle/Disa aktar) +
 * secimi temizle butonu. count 0 olunca kaybolur. Escape secimi temizler.
 * DeployLens/Fisly/Dolap liste toplu islem senaryolari icin uygundur.
 */
import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const bulkActionBarVariants = cva(
  "z-30 mx-auto flex w-full max-w-3xl flex-wrap items-center gap-3 rounded-2xl border border-border bg-card/95 px-3 py-2.5 text-card-foreground shadow-xl backdrop-blur supports-[backdrop-filter]:bg-card/80 animate-fade-up",
  {
    variants: {
      position: {
        fixed: "fixed inset-x-4 bottom-6",
        sticky: "sticky bottom-6",
        static: "relative",
      },
      tone: {
        default: "",
        primary: "border-primary/30 bg-primary/5 supports-[backdrop-filter]:bg-primary/10",
      },
    },
    defaultVariants: {
      position: "sticky",
      tone: "default",
    },
  }
);

export interface BulkActionBarAction {
  /** Benzersiz anahtar. */
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: React.ComponentProps<typeof Button>["variant"];
  disabled?: boolean;
}

export interface BulkActionBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bulkActionBarVariants> {
  /** Secili oge sayisi. 0 ise cubuk gizlenir. */
  count: number;
  /** Sagda dizilen toplu aksiyon butonlari. */
  actions?: BulkActionBarAction[];
  /** Secimi temizle tetiklenince cagrilir (X butonu + Escape). */
  onClearSelection?: () => void;
  /** Sayac metnini ozellestir: (n) => "n secildi". */
  countLabel?: (count: number) => React.ReactNode;
  /** Secimi temizle butonunun erisilebilir etiketi. */
  clearLabel?: string;
  /** count 0 olsa bile gorunur kalir (statik onizleme/story icin). */
  forceVisible?: boolean;
}

const BulkActionBar = React.forwardRef<HTMLDivElement, BulkActionBarProps>(
  (
    {
      count,
      actions = [],
      onClearSelection,
      countLabel = (n) => `${n} secildi`,
      clearLabel = "Secimi temizle",
      forceVisible = false,
      position,
      tone,
      className,
      ...props
    },
    ref
  ) => {
    const visible = forceVisible || count > 0;

    React.useEffect(() => {
      if (!visible || !onClearSelection) return;
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") onClearSelection();
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [visible, onClearSelection]);

    if (!visible) return null;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Toplu islem cubugu"
        className={cn(bulkActionBarVariants({ position, tone }), className)}
        {...props}
      >
        <div className="flex min-w-0 items-center gap-2 pl-1">
          <span
            className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-primary px-2 text-sm font-semibold tabular-nums text-primary-foreground shadow-sm"
            aria-hidden="true"
          >
            {count}
          </span>
          <span
            className="truncate text-sm font-medium text-foreground"
            aria-live="polite"
          >
            {countLabel(count)}
          </span>
        </div>

        {actions.length > 0 ? (
          <>
            <Separator
              orientation="vertical"
              className="mx-1 hidden h-6 sm:block"
            />
            <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  type="button"
                  size="sm"
                  variant={action.variant ?? "ghost"}
                  disabled={action.disabled}
                  onClick={action.onClick}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </>
        ) : null}

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onClearSelection}
          aria-label={clearLabel}
          className={cn("size-8 shrink-0", actions.length > 0 ? "ml-1" : "ml-auto")}
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
    );
  }
);
BulkActionBar.displayName = "BulkActionBar";

export { BulkActionBar, bulkActionBarVariants };
