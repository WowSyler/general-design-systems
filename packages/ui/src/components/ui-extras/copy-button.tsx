/**
 * CopyButton — Panoya kopyalama butonu ve inline kopya alani.
 * navigator.clipboard.writeText ile degeri panoya yazar; basildiginda
 * Copy ikonu Check'e doner, etiket "Kopyalandi" olur ve 2 sn sonra eski
 * haline geri doner. Guvensiz baglamlar icin gizli textarea + execCommand
 * yedegi vardir. Uc kullanim: icon-only buton, etiketli buton ve CopyField
 * (solda monospace deger, sagda kopya butonu).
 * Kullanim: DeployLens deploy ID/URL, Fisly IBAN, API anahtari gibi tek
 * dokunusla panoya alinacak degerler.
 */
"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Degeri panoya yazar; clipboard API yoksa gizli textarea yedegine duser. */
async function writeToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Izin reddi/guvensiz baglam: asagidaki yedege gec.
  }

  try {
    if (typeof document === "undefined") return false;
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/** "Kopyalandi" durumunu tutar; timeout sonunda kendini sifirlar. */
function useCopyState(timeout: number) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const copy = React.useCallback(
    async (text: string) => {
      const ok = await writeToClipboard(text);
      if (!ok) return false;
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), timeout);
      return true;
    },
    [timeout]
  );

  return { copied, copy };
}

/** Ust uste bindirilmis Copy/Check ikonu; kopyalaninca yumusakca gecis yapar. */
function CopyGlyph({ copied }: { copied: boolean }) {
  return (
    <span
      className="relative inline-flex size-4 shrink-0 items-center justify-center"
      aria-hidden="true"
    >
      <Copy
        className={cn(
          "transition-all duration-200",
          copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      />
      <Check
        className={cn(
          "absolute inset-0 m-auto text-success transition-all duration-200",
          copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      />
    </span>
  );
}

export interface CopyButtonProps
  extends Omit<
    React.ComponentProps<typeof Button>,
    "value" | "children" | "onCopy"
  > {
  /** Panoya kopyalanacak metin. */
  value: string;
  /** Verilirse etiketli buton; verilmezse icon-only buton uretir. */
  label?: string;
  /** Kopyalandiktan sonra gosterilecek metin/aria durumu. */
  copiedLabel?: string;
  /** Eski haline donus suresi (ms). */
  timeout?: number;
  /** Basarili kopyalamadan sonra tetiklenir. */
  onCopy?: (value: string) => void;
}

/**
 * CopyButton — Tek deger kopyalayan buton (icon-only veya etiketli).
 */
const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      label,
      copiedLabel = "Kopyalandı",
      timeout = 2000,
      onCopy,
      variant = "outline",
      size,
      className,
      disabled,
      onClick,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const { copied, copy } = useCopyState(timeout);
    const isIconOnly = !label;
    const resolvedSize = size ?? (isIconOnly ? "icon" : "default");

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      const ok = await copy(value);
      if (ok) onCopy?.(value);
    };

    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={resolvedSize}
        disabled={disabled}
        onClick={handleClick}
        data-copied={copied ? "" : undefined}
        aria-label={isIconOnly ? ariaLabel ?? "Kopyala" : ariaLabel}
        className={className}
        {...props}
      >
        <CopyGlyph copied={copied} />
        {label ? <span>{copied ? copiedLabel : label}</span> : null}
        <span className="sr-only" role="status" aria-live="polite">
          {copied ? copiedLabel : ""}
        </span>
      </Button>
    );
  }
);
CopyButton.displayName = "CopyButton";

export interface CopyFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onCopy"> {
  /** Gosterilen ve kopyalanacak deger. */
  value: string;
  /** Erisilebilirlik icin degerin adi (or. "IBAN", "Deploy URL"). */
  label?: string;
  /** Kopyalandiktan sonra gosterilecek aria durumu. */
  copiedLabel?: string;
  /** Eski haline donus suresi (ms). */
  timeout?: number;
  /** Basarili kopyalamadan sonra tetiklenir. */
  onCopy?: (value: string) => void;
  /** Uzun degeri tek satirda kirpar (varsayilan acik). */
  truncate?: boolean;
  /** Butonu ve secimi devre disi birakir. */
  disabled?: boolean;
}

/**
 * CopyField — Solda monospace deger, sagda icon-only kopya butonu.
 */
const CopyField = React.forwardRef<HTMLDivElement, CopyFieldProps>(
  (
    {
      value,
      label,
      copiedLabel = "Kopyalandı",
      timeout = 2000,
      onCopy,
      truncate = true,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-input bg-muted/40 py-1 ps-3 pe-1 transition-all duration-200 focus-within:ring-2 focus-within:ring-ring",
          disabled && "opacity-60",
          className
        )}
        {...props}
      >
        {label ? <span className="sr-only">{label}</span> : null}
        <code
          className={cn(
            "min-w-0 flex-1 select-all font-mono text-sm text-foreground tabular-nums",
            truncate && "truncate"
          )}
        >
          {value}
        </code>
        <CopyButton
          value={value}
          copiedLabel={copiedLabel}
          timeout={timeout}
          onCopy={onCopy}
          disabled={disabled}
          variant="ghost"
          className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
          aria-label={label ? `${label} değerini kopyala` : "Kopyala"}
        />
      </div>
    );
  }
);
CopyField.displayName = "CopyField";

export { CopyButton, CopyField };
