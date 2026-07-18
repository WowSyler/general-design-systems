/**
 * ShimmerButton — cila süpürmeli + glow imza buton.
 * Primary zemin üzerinde ince bir beyaz parıltı bandı sürekli soldan
 * sağa süpürür (animate-shine-sweep) ve buton tema-tonlu bir glow gölgesi
 * taşır. Duraıan/yakalama hâlinde parıltı bandı başlangıç karesinde donar
 * (görünmez), buton yine anlamlı ve tam görünürdür. prefers-reduced-motion'da
 * süpürme durur.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ children, leftIcon, rightIcon, className, type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "group relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-xl bg-primary px-5 py-2.5 font-medium text-primary-foreground shadow-glow transition-all hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
          className
        )}
        {...props}
      >
        {/* Cila süpürme bandı — ince skew'li beyaz şerit. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 -z-0 w-1/4 bg-white/25 blur-[1px] animate-shine-sweep motion-reduce:animate-none"
        />

        <span className="relative z-10 inline-flex items-center gap-2 [&>svg]:size-4">
          {leftIcon ? (
            <span aria-hidden="true" className="flex items-center">
              {leftIcon}
            </span>
          ) : null}
          {children}
          {rightIcon ? (
            <span aria-hidden="true" className="flex items-center">
              {rightIcon}
            </span>
          ) : null}
        </span>
      </button>
    );
  }
);
ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };
