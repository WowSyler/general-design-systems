/**
 * GradientMesh — dekoratif statik mesh blob katmanı (imza atmosfer süsü).
 * Tema gradyan renklerinden düşük opaklıkta, güçlü blur'lu daireler konumlanır;
 * animasyonsuz olduğu için her yerde (yakalama dâhil) güvenli ve durağandır.
 * aria-hidden ve pointer-events-none; bir kabın arkasında dekor olarak kullanılır.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface GradientMeshProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Yerleştirilecek blob sayısı (varsayılan 3). */
  blobs?: 3 | 4;
}

const BLOBS: string[] = [
  "start-[-12%] top-[-18%] size-72 bg-gradient-from/30",
  "end-[-10%] top-[8%] size-80 bg-gradient-to/25",
  "bottom-[-22%] start-[24%] size-72 bg-primary/20",
  "bottom-[6%] end-[16%] size-64 bg-gradient-to/20",
];

export const GradientMesh = React.forwardRef<HTMLDivElement, GradientMeshProps>(
  ({ blobs = 3, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden",
          className,
        )}
        {...props}
      >
        {BLOBS.slice(0, blobs).map((blob, index) => (
          <div
            key={index}
            className={cn("absolute rounded-full blur-3xl", blob)}
          />
        ))}
      </div>
    );
  },
);
GradientMesh.displayName = "GradientMesh";
