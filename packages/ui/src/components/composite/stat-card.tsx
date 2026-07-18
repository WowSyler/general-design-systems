/**
 * StatCard — Dashboard KPI karti (DeployLens/Randevu/Fisly).
 * Etiket, deger, opsiyonel trend (delta), ikon ve alt bilgi gosterir;
 * loading durumunda Skeleton yer tutuculari render eder.
 */
import * as React from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatCardTrend = "up" | "down" | "neutral";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  delta?: { value: React.ReactNode; trend: StatCardTrend };
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
}

const trendClasses: Record<StatCardTrend, string> = {
  up: "text-success",
  down: "text-destructive",
  neutral: "text-muted-foreground",
};

const trendIcons: Record<StatCardTrend, React.ReactNode> = {
  up: <TrendingUp className="size-3.5" aria-hidden="true" />,
  down: <TrendingDown className="size-3.5" aria-hidden="true" />,
  neutral: <Minus className="size-3.5" aria-hidden="true" />,
};

const trendText: Record<StatCardTrend, string> = {
  up: "artis",
  down: "dusus",
  neutral: "degisim yok",
};

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ label, value, delta, icon, footer, loading = false, className, ...props }, ref) => {
    if (loading) {
      return (
        <Card ref={ref} className={cn(className)} {...props}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-8 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-20" />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium text-muted-foreground">{label}</div>
          {icon ? (
            <div className="rounded-lg bg-primary/10 p-2 text-primary" aria-hidden="true">
              {icon}
            </div>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-2xl font-bold tabular-nums text-foreground">{value}</div>
          {delta ? (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium tabular-nums",
                trendClasses[delta.trend]
              )}
            >
              {trendIcons[delta.trend]}
              <span>{delta.value}</span>
              <span className="sr-only">({trendText[delta.trend]})</span>
            </div>
          ) : null}
          {footer ? <div className="text-xs text-muted-foreground">{footer}</div> : null}
        </CardContent>
      </Card>
    );
  }
);
StatCard.displayName = "StatCard";

export { StatCard };
