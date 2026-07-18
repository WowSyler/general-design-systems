/**
 * Prose — Makale tipografisi sarmalayicisi.
 * Baslik, paragraf, liste, alinti ve kod ogelerini arbitrary
 * variant'larla stiller; harici tipografi eklentisi gerektirmez.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Prose = React.forwardRef<HTMLDivElement, ProseProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "max-w-prose text-foreground [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:leading-7 [&_p]:mb-4 [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-l-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:font-mono [&_code]:text-sm [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Prose.displayName = "Prose";

export { Prose };
