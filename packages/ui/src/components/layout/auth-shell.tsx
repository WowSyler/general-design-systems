/**
 * AuthShell — ortalanmis kimlik dogrulama sayfasi iskeleti.
 * Icerigi ekranin ortasina yerlestirir; ustte istege bagli logo,
 * altta kucuk soluk metinli footer alani bulunur.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type AuthShellMaxWidth = "sm" | "md";

const authMaxWidthClasses: Record<AuthShellMaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
};

interface AuthShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icerigin ustunde gorunen logo alani. */
  logo?: React.ReactNode;
  /** Icerigin altinda gorunen kucuk soluk metin. */
  footer?: React.ReactNode;
  /** Icerik genisligi. Varsayilan: "sm". */
  maxWidth?: AuthShellMaxWidth;
}

const AuthShell = React.forwardRef<HTMLDivElement, AuthShellProps>(
  ({ className, logo, footer, maxWidth = "sm", children, ...props }, ref) => {
    const maxWidthClass = authMaxWidthClasses[maxWidth];

    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4",
          className
        )}
        {...props}
      >
        {logo ? (
          <div className="mb-6 flex items-center justify-center">{logo}</div>
        ) : null}
        <div className={cn("w-full", maxWidthClass)}>{children}</div>
        {footer ? (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        ) : null}
      </div>
    );
  }
);
AuthShell.displayName = "AuthShell";

export { AuthShell };
export type { AuthShellProps, AuthShellMaxWidth };
