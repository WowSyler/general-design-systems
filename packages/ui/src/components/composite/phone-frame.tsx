/**
 * PhoneFrame — Telefon mockup cercevesi.
 * Mobil ekran tasarimlarini centik ve home cizgisiyle birlikte
 * gercekci bir cihaz cercevesi icinde sunar. Icerik dikey flex
 * duzeninde akar; alt gezinme mt-auto ile tabana yaslanabilir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type PhoneFrameSize = "sm" | "md";

export interface PhoneFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cerceve genisligi: sm 280px, md 340px. Varsayilan "md". */
  size?: PhoneFrameSize;
}

const sizeClasses: Record<PhoneFrameSize, string> = {
  sm: "w-[280px]",
  md: "w-[340px]",
};

const PhoneFrame = React.forwardRef<HTMLDivElement, PhoneFrameProps>(
  ({ size = "md", className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-[2.75rem] border-[6px] border-foreground/85 bg-background shadow-2xl",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <div className="mx-auto h-6 w-28 rounded-b-2xl bg-foreground/85" aria-hidden="true" />
      <div className="flex min-h-[520px] flex-col">{children}</div>
      <div
        className="mx-auto mb-2 mt-2 h-1 w-24 rounded-full bg-foreground/30"
        aria-hidden="true"
      />
    </div>
  )
);
PhoneFrame.displayName = "PhoneFrame";

export { PhoneFrame };
