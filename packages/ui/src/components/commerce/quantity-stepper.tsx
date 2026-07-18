/**
 * QuantityStepper — adet artir/azalt kontrolu.
 * [-] deger [+] duzeninde outline butonlarla kontrollu
 * miktar secimi sunar; min/max sinirlarinda butonlar kapanir.
 */
"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface QuantityStepperProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Guncel adet. */
  value: number;
  /** Adet degistiginde cagrilir. */
  onValueChange: (value: number) => void;
  /** Alt sinir. */
  min?: number;
  /** Ust sinir. */
  max?: number;
  /** Tum kontrolu devre disi birakir. */
  disabled?: boolean;
}

export const QuantityStepper = React.forwardRef<
  HTMLDivElement,
  QuantityStepperProps
>(
  (
    { value, onValueChange, min = 1, max, disabled = false, className, ...props },
    ref,
  ) => {
    const canDecrement = !disabled && value > min;
    const canIncrement = !disabled && (max === undefined || value < max);

    return (
      <div
        ref={ref}
        role="group"
        className={cn("flex items-center gap-1", className)}
        {...props}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          aria-label="Azalt"
          disabled={!canDecrement}
          onClick={() => onValueChange(Math.max(value - 1, min))}
        >
          <Minus aria-hidden="true" />
        </Button>
        <div
          aria-live="polite"
          className="w-10 text-center text-sm font-medium tabular-nums"
        >
          {value}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          aria-label="Artır"
          disabled={!canIncrement}
          onClick={() =>
            onValueChange(max === undefined ? value + 1 : Math.min(value + 1, max))
          }
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>
    );
  },
);
QuantityStepper.displayName = "QuantityStepper";
