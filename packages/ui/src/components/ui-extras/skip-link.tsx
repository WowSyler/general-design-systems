/**
 * SkipLink — Icerige atla baglantisi (erisilebilirlik).
 * Normalde sr-only ile gizlidir; klavye ile focus alindiginda
 * (focus:not-sr-only) sol-ust kosede belirir ve href ile sayfanin
 * ana icerik bolgesine (or. #ana-icerik) atlar. app-shell'in en
 * basina, ilk odaklanabilir oge olarak yerlestirilir. Klavye
 * kullanicilari tekrar eden gezinme/menu bloklarini atlayabilir.
 * SkipLinkGroup ile birden fazla atlama baglantisi gruplanir.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const skipLinkVariants = cva(
  "sr-only rounded-md text-sm font-medium shadow-lg ring-1 ring-border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:items-center focus:gap-2 focus:px-4 focus:py-2 focus:animate-fade-up [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary bg-sheen text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "bg-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface SkipLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof skipLinkVariants> {
  /** Atlanacak hedef; ana icerik bolgesinin id'si (or. "#ana-icerik"). */
  href: string;
}

const SkipLink = React.forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ className, variant, children = "İçeriğe atla", ...props }, ref) => (
    <a
      ref={ref}
      className={cn(skipLinkVariants({ variant }), className)}
      {...props}
    >
      {children}
    </a>
  )
);
SkipLink.displayName = "SkipLink";

export interface SkipLinkGroupProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Ekran okuyucular icin gezinme bolgesi etiketi. */
  label?: string;
}

const SkipLinkGroup = React.forwardRef<HTMLElement, SkipLinkGroupProps>(
  ({ className, label = "Atlama bağlantıları", children, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label={label}
      className={cn("contents", className)}
      {...props}
    >
      {children}
    </nav>
  )
);
SkipLinkGroup.displayName = "SkipLinkGroup";

export { SkipLink, SkipLinkGroup, skipLinkVariants };
