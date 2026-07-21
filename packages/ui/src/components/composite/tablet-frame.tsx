/**
 * TabletFrame — Tablet cihaz çerçevesi (PhoneFrame kardeşi).
 * Tablet gövdesi, ince tekdüze kenar (bezel), kamera noktası ve
 * yatay/dikey (orientation) seçeneğiyle ekran alanındaki çocuğu
 * gerçekçi bir cihaz çerçevesinde sunar. Vitrin/önizleme amaçlıdır.
 * İçerik ekran alanında dikey flex düzeninde akar; akışkandır ve
 * dar ekranlarda max-w-full ile küçülür.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type TabletFrameOrientation = "portrait" | "landscape";
type TabletFrameSize = "sm" | "md";

export interface TabletFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cihaz yönü: dikey ("portrait") veya yatay ("landscape"). Varsayılan "portrait". */
  orientation?: TabletFrameOrientation;
  /** Çerçeve genişliği ölçeği. Varsayılan "md". */
  size?: TabletFrameSize;
}

/** Yön + boyuta göre gövde genişliği (akışkan; max-w-full ile küçülür). */
const bodyWidth: Record<TabletFrameOrientation, Record<TabletFrameSize, string>> = {
  portrait: {
    sm: "w-[340px]",
    md: "w-[440px]",
  },
  landscape: {
    sm: "w-[480px]",
    md: "w-[640px]",
  },
};

/** Ekran alanının en-boy oranı. */
const screenAspect: Record<TabletFrameOrientation, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

/** Kamera noktası konumu: dikeyde üst-orta, yatayda sol-orta. */
const cameraPosition: Record<TabletFrameOrientation, string> = {
  portrait: "left-1/2 top-1.5 -translate-x-1/2 sm:top-2",
  landscape: "top-1/2 left-1.5 -translate-y-1/2 sm:left-2",
};

const TabletFrame = React.forwardRef<HTMLDivElement, TabletFrameProps>(
  (
    { orientation = "portrait", size = "md", className, children, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "relative min-w-0 max-w-full rounded-[1.75rem] bg-foreground/90 p-2.5 shadow-2xl sm:rounded-[2rem] sm:p-3.5",
        bodyWidth[orientation][size],
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute z-10 size-2 rounded-full bg-background/40 ring-1 ring-inset ring-background/20",
          cameraPosition[orientation]
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-[1rem] bg-background sm:rounded-[1.25rem]",
          screenAspect[orientation]
        )}
      >
        {children}
      </div>
    </div>
  )
);
TabletFrame.displayName = "TabletFrame";

export { TabletFrame };
