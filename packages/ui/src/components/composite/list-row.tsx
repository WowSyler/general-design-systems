/**
 * ListRow / ListGroup — Uygulama liste satiri ve grubu.
 * ListRow: bas ikon, baslik/altbaslik, meta ve kuyruk alani; onClick
 * verildiginde tiklanabilir olur ve kuyruk yoksa ChevronRight gosterir.
 * ListGroup: satirlari divide-y ile ayrilmis kart icinde toplar.
 */
"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ListRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const ListRow = React.forwardRef<HTMLDivElement, ListRowProps>(
  (
    { leading, title, subtitle, meta, trailing, onClick, className, ...props },
    ref
  ) => {
    const clickable = Boolean(onClick);
    const resolvedTrailing =
      trailing ??
      (clickable ? (
        <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
      ) : null);

    return (
      <div
        ref={ref}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          clickable
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.currentTarget.click();
                }
              }
            : undefined
        }
        className={cn(
          "flex min-h-[44px] items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
          clickable &&
            "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          className
        )}
        {...props}
      >
        {leading ? (
          <span className="flex shrink-0 items-center text-muted-foreground">
            {leading}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">{title}</div>
          {subtitle ? (
            <div className="truncate text-sm text-muted-foreground">{subtitle}</div>
          ) : null}
        </div>
        {meta ? (
          <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
            {meta}
          </span>
        ) : null}
        {resolvedTrailing ? (
          <span className="flex shrink-0 items-center">{resolvedTrailing}</span>
        ) : null}
      </div>
    );
  }
);
ListRow.displayName = "ListRow";

export type ListGroupProps = React.HTMLAttributes<HTMLDivElement>;

const ListGroup = React.forwardRef<HTMLDivElement, ListGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("divide-y rounded-xl border bg-card", className)}
      {...props}
    />
  )
);
ListGroup.displayName = "ListGroup";

export { ListRow, ListGroup };
