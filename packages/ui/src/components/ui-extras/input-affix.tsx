/**
 * InputAffix — Onek/sonek ekli metin girisi sarmalayici.
 * Solda ve/veya sagda segment addon (or. TL, .com, @) veya satir-ici
 * ikon barindirabilen bir input grubu. Icini standart <input> olarak
 * render eder; odakta tum grup halka ile aydinlanir (focus-within).
 * sm/md/lg boyut, invalid (border-destructive + ring) ve disabled durumu.
 * Fisly tutar, Dolap fiyat ve genel form alanlari icin.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputAffixVariants = cva(
  "flex w-full items-stretch overflow-hidden rounded-md border border-input bg-transparent shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-ring/40 focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/15",
  {
    variants: {
      inputSize: {
        sm: "h-8 text-xs pointer-coarse:h-[2.875rem]",
        md: "h-9 text-sm pointer-coarse:h-[2.875rem]",
        lg: "h-11 text-base pointer-coarse:h-[2.875rem]",
      },
      invalid: {
        true: "border-destructive hover:border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
        false: "",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      inputSize: "md",
      invalid: false,
      disabled: false,
    },
  }
);

type InputAffixSize = "sm" | "md" | "lg";

const sizeConfig: Record<
  InputAffixSize,
  { field: string; addon: string; icon: string }
> = {
  sm: { field: "px-2.5 gap-1.5", addon: "px-2.5", icon: "[&_svg]:size-3.5" },
  md: { field: "px-3 gap-2", addon: "px-3", icon: "[&_svg]:size-4" },
  lg: { field: "px-3.5 gap-2", addon: "px-3.5", icon: "[&_svg]:size-4" },
};

export interface InputAffixProps
  extends Omit<
      React.ComponentProps<"input">,
      "size" | "prefix" | "disabled"
    >,
    Pick<VariantProps<typeof inputAffixVariants>, "invalid"> {
  /** Girisin gorsel boyutu. */
  inputSize?: InputAffixSize;
  /** Solda segment addon (or. "TL", "@", "https://"). */
  leadingAddon?: React.ReactNode;
  /** Sagda segment addon (or. ".com", "TL", "/ay"). */
  trailingAddon?: React.ReactNode;
  /** Sol tarafta satir-ici ikon (segment degil, alan icinde). */
  leadingIcon?: React.ReactNode;
  /** Sag tarafta satir-ici ikon (segment degil, alan icinde). */
  trailingIcon?: React.ReactNode;
  /** Dis sarmalayiciya uygulanan sinif. */
  wrapperClassName?: string;
  disabled?: boolean;
}

const InputAffix = React.forwardRef<HTMLInputElement, InputAffixProps>(
  (
    {
      inputSize = "md",
      invalid = false,
      leadingAddon,
      trailingAddon,
      leadingIcon,
      trailingIcon,
      wrapperClassName,
      className,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const s = sizeConfig[inputSize];
    const addonClass = cn(
      "inline-flex shrink-0 select-none items-center whitespace-nowrap bg-muted font-medium text-muted-foreground",
      s.addon,
      s.icon
    );

    return (
      <div
        className={cn(
          inputAffixVariants({ inputSize, invalid, disabled }),
          wrapperClassName
        )}
      >
        {leadingAddon != null ? (
          <span className={cn(addonClass, "border-e border-input")}>
            {leadingAddon}
          </span>
        ) : null}

        <div className={cn("flex min-w-0 flex-1 items-center", s.field, s.icon)}>
          {leadingIcon != null ? (
            <span
              className="pointer-events-none shrink-0 text-muted-foreground"
              aria-hidden="true"
            >
              {leadingIcon}
            </span>
          ) : null}

          <input
            ref={ref}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            className={cn(
              "h-full w-full min-w-0 bg-transparent p-0 text-inherit outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />

          {trailingIcon != null ? (
            <span
              className="pointer-events-none shrink-0 text-muted-foreground"
              aria-hidden="true"
            >
              {trailingIcon}
            </span>
          ) : null}
        </div>

        {trailingAddon != null ? (
          <span className={cn(addonClass, "border-s border-input")}>
            {trailingAddon}
          </span>
        ) : null}
      </div>
    );
  }
);
InputAffix.displayName = "InputAffix";

export { InputAffix, inputAffixVariants };
