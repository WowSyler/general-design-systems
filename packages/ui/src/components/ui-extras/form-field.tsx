/**
 * LabeledField — Etiket + kontrol + ipucu/hata sarmalayicisi.
 * Herhangi bir form kontrolunu dikey dizilimde Label, opsiyonel ipucu
 * ve hata metniyle sarar. Kontrolu (children) oldugu gibi render eder.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface LabeledFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alan etiketi. */
  label: string;
  /** Kontrolun id degeri (Label htmlFor baglantisi). */
  htmlFor?: string;
  /** Yardimci ipucu metni; hata varken gizlenir. */
  hint?: string;
  /** Hata metni; role="alert" ile duyurulur. */
  error?: string;
  /** Zorunlu alan isareti (kirmizi yildiz + sr-only metin). */
  required?: boolean;
  /** Form kontrolu (Input, Select vb.) — oldugu gibi render edilir. */
  children: React.ReactNode;
}

const LabeledField = React.forwardRef<HTMLDivElement, LabeledFieldProps>(
  (
    { label, htmlFor, hint, error, required, children, className, ...props },
    ref
  ) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props}>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-0.5 text-destructive">
              *
            </span>
            <span className="sr-only">(zorunlu)</span>
          </>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
);
LabeledField.displayName = "LabeledField";

export { LabeledField };
