/**
 * FeatureCard — ozellik tanitim karti.
 * Pazarlama sayfalarinda bir urun ozelligini ikon, baslik ve aciklama ile
 * Card tabaninda sunar; hover'da hafifce yukselir ve golgesi belirginlesir.
 */
import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface FeatureCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Ust kutuda gosterilen ikon. */
  icon?: React.ReactNode;
  /** Ozellik basligi. */
  title: React.ReactNode;
  /** Aciklama metni. */
  description?: React.ReactNode;
  /** Alt aksiyon slotu (or. "Daha fazla" linki). */
  action?: React.ReactNode;
}

export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon, title, description, action, className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "flex flex-col gap-4 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
          className,
        )}
        {...props}
      >
        {icon ? (
          <div className="w-fit rounded-xl bg-primary/10 p-3 text-primary">
            {icon}
          </div>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-semibold leading-snug tracking-tight">{title}</h3>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {children}
        {action ? <div className="mt-auto pt-1">{action}</div> : null}
      </Card>
    );
  },
);
FeatureCard.displayName = "FeatureCard";
