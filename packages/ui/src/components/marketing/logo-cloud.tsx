/**
 * LogoCloud — partner/musteri logo bulutu.
 * Logolari ortalanmis flex-wrap dizilimde soluk ve gri tonlu gosterir;
 * hover'da renk ve netlik geri gelir. Logo verilmemisse isim metni kullanilir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface LogoCloudItem {
  /** Marka adi (erisilebilirlik etiketi ve metin yedegi). */
  name: string;
  /** Logo gorseli/isareti; verilmezse isim metin olarak gosterilir. */
  logo?: React.ReactNode;
}

export interface LogoCloudProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gosterilecek markalar. */
  items: LogoCloudItem[];
}

export const LogoCloud = React.forwardRef<HTMLDivElement, LogoCloudProps>(
  ({ items, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center justify-center gap-x-10 gap-y-6",
          className,
        )}
        {...props}
      >
        {items.map((item) => (
          <div
            key={item.name}
            title={item.name}
            className="flex items-center opacity-60 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0"
          >
            {item.logo ?? (
              <span className="text-lg font-semibold text-muted-foreground">
                {item.name}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  },
);
LogoCloud.displayName = "LogoCloud";
