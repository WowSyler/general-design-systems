/**
 * AvatarGroup — Üst üste binen avatar yığını.
 * Ekip üyeleri veya katılımcıları kompakt biçimde gösterir;
 * limit aşımında "+N" dairesi ile kalan sayıyı belirtir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface AvatarGroupItem {
  initials: string;
  label?: string;
}

export interface AvatarGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: AvatarGroupItem[];
  max?: number;
  size?: "sm" | "md";
}

const sizeClasses: Record<NonNullable<AvatarGroupProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
};

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ items, max = 4, size = "md", className, ...props }, ref) => {
    const visible = items.slice(0, max);
    const overflow = items.length - visible.length;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={`${items.length} kişi`}
        className={cn("flex items-center -space-x-2", className)}
        {...props}
      >
        {visible.map((item, index) => (
          <Avatar
            key={`${item.initials}-${index}`}
            title={item.label}
            className={cn("ring-2 ring-background", sizeClasses[size])}
          >
            <AvatarFallback className="font-medium">
              {item.initials}
            </AvatarFallback>
          </Avatar>
        ))}
        {overflow > 0 ? (
          <div
            aria-label={`${overflow} kişi daha`}
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground ring-2 ring-background",
              sizeClasses[size]
            )}
          >
            +{overflow}
          </div>
        ) : null}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
