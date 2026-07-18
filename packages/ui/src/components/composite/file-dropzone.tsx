/**
 * FileDropzone — Gorsel dosya birakma alani (yalnizca gorunum).
 * Kesikli cerceve, ortalanmis ikon + etiket + ipucu; hover'da
 * cerceve ring rengine, zemin accent'e doner. Gercek input icermez.
 */
import * as React from "react";
import { UploadCloud } from "lucide-react";

import { cn } from "@/lib/utils";

export interface FileDropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Ana etiket. Varsayilan "Dosyaları buraya bırakın". */
  label?: React.ReactNode;
  /** Etiketin altinda kucuk ipucu metni. */
  hint?: React.ReactNode;
  icon?: React.ReactNode;
}

const FileDropzone = React.forwardRef<HTMLDivElement, FileDropzoneProps>(
  ({ label = "Dosyaları buraya bırakın", hint, icon, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors hover:border-ring hover:bg-accent/40",
        className
      )}
      {...props}
    >
      <span
        className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
        aria-hidden="true"
      >
        {icon ?? <UploadCloud className="size-6" />}
      </span>
      <div className="text-sm font-medium text-foreground">{label}</div>
      {hint ? <div className="text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  )
);
FileDropzone.displayName = "FileDropzone";

export { FileDropzone };
