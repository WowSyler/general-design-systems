"use client";

/**
 * MessageComposer — Mesaj yazma cubugu (Dolap mesajlasma).
 * Coklu-satir, otomatik buyuyen (auto-grow) metin girisi; sol tarafta
 * fotograf/dosya ekleme ikon butonlari; sagda opsiyonel "Teklif gonder"
 * butonu ve yalnizca metin varken etkinlesen Gonder butonu icerir.
 *
 * Klavye: Enter = gonder, Shift+Enter = yeni satir. IME/kompozisyon
 * (Turkce dahil) sirasinda Enter bastirilmaz. Bilesen hem kontrollu
 * (value + onValueChange) hem kontrolsuz (defaultValue) calisir; gonderim
 * sonrasi kontrolsuz modda alan temizlenir ve odak metne geri doner.
 * Tema-agnostik; yalnizca semantik token kullanir.
 */
import * as React from "react";
import { ImagePlus, Paperclip, SendHorizontal, Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/** SSR'da uyari vermeyen izomorfik layout-effect. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface MessageComposerProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** Kontrollu deger. Verilirse onValueChange ile birlikte kullanilmali. */
  value?: string;
  /** Kontrolsuz baslangic degeri. */
  defaultValue?: string;
  /** Her metin degisikliginde tetiklenir. */
  onValueChange?: (value: string) => void;
  /** Gonderim (Enter veya Gonder butonu). Guncel metni dondurur. */
  onSend?: (value: string) => void;
  /** Fotograf ekleme ikonuna tiklandiginda. */
  onAttachPhoto?: () => void;
  /** Dosya ekleme ikonuna tiklandiginda. */
  onAttachFile?: () => void;
  /** Verilirse "Teklif gonder" butonu gosterilir ve tiklaninca cagrilir. */
  onSendOffer?: () => void;
  /** Metin alani yer tutucusu. */
  placeholder?: string;
  /** Metin alani icin erisilebilir etiket (gorunmez). */
  "aria-label"?: string;
  /** Auto-grow ust siniri (satir sayisi). Varsayilan 6. */
  maxRows?: number;
  /** Maksimum karakter sayisi (verilirse sayac gosterilir). */
  maxLength?: number;
  /** Fotograf/dosya ekleme butonlarini gizle. */
  hideAttachments?: boolean;
  /** "Teklif gonder" buton etiketi. */
  offerLabel?: string;
  /** Tum girdiyi devre disi birak. */
  disabled?: boolean;
}

const MessageComposer = React.forwardRef<HTMLFormElement, MessageComposerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      onSend,
      onAttachPhoto,
      onAttachFile,
      onSendOffer,
      placeholder = "Bir mesaj yazin...",
      "aria-label": ariaLabel = "Mesaj",
      maxRows = 6,
      maxLength,
      hideAttachments = false,
      offerLabel = "Teklif gonder",
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const currentValue = isControlled ? value : internalValue;

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const setValue = React.useCallback(
      (next: string) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange]
    );

    // Auto-grow: yuksekligi icerige gore ayarla, maxRows'ta sinirla.
    const resize = React.useCallback(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      const styles = window.getComputedStyle(el);
      const lineHeight = parseFloat(styles.lineHeight) || 20;
      const paddingY =
        (parseFloat(styles.paddingTop) || 0) + (parseFloat(styles.paddingBottom) || 0);
      const borderY =
        (parseFloat(styles.borderTopWidth) || 0) + (parseFloat(styles.borderBottomWidth) || 0);
      const maxHeight = lineHeight * maxRows + paddingY + borderY;
      const needed = el.scrollHeight + borderY;
      const next = Math.min(needed, maxHeight);
      el.style.height = `${next}px`;
      el.style.overflowY = needed > maxHeight ? "auto" : "hidden";
    }, [maxRows]);

    useIsomorphicLayoutEffect(() => {
      resize();
    }, [currentValue, resize]);

    const trimmed = currentValue.trim();
    const canSend = trimmed.length > 0 && !disabled;

    const submit = React.useCallback(() => {
      if (!canSend) return;
      onSend?.(currentValue);
      if (!isControlled) setInternalValue("");
      // Gonderimden sonra odak metne geri donsun.
      window.requestAnimationFrame(() => textareaRef.current?.focus());
    }, [canSend, currentValue, isControlled, onSend]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey &&
        !event.nativeEvent.isComposing
      ) {
        event.preventDefault();
        submit();
      }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submit();
    };

    const overLimit = maxLength != null && currentValue.length > maxLength * 0.9;

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        aria-disabled={disabled || undefined}
        className={cn(
          "rounded-2xl border border-input bg-card shadow-sm transition-all duration-200",
          "focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/15",
          disabled && "pointer-events-none opacity-60",
          className
        )}
        {...props}
      >
        <div className="px-3.5 pt-3">
          <Textarea
            ref={textareaRef}
            rows={1}
            value={currentValue}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label={ariaLabel}
            maxLength={maxLength}
            disabled={disabled}
            className="min-h-0 pointer-coarse:min-h-11 resize-none border-0 bg-transparent p-0 text-sm leading-relaxed shadow-none hover:border-0 focus-visible:border-0 focus-visible:ring-0 md:text-sm"
          />
        </div>

        <div className="flex items-center justify-between gap-2 px-2 pb-2 pt-1.5">
          {hideAttachments ? (
            <span aria-hidden="true" />
          ) : (
            <div className="flex items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onAttachPhoto}
                disabled={disabled}
                aria-label="Fotograf ekle"
                className="size-8 rounded-full text-muted-foreground hover:text-foreground"
              >
                <ImagePlus />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onAttachFile}
                disabled={disabled}
                aria-label="Dosya ekle"
                className="size-8 rounded-full text-muted-foreground hover:text-foreground"
              >
                <Paperclip />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {maxLength != null ? (
              <span
                className={cn(
                  "text-xs tabular-nums text-muted-foreground transition-colors",
                  overLimit && "font-medium text-warning",
                  currentValue.length >= maxLength && "text-destructive"
                )}
                aria-live="polite"
              >
                {currentValue.length}/{maxLength}
              </span>
            ) : null}

            {onSendOffer ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onSendOffer}
                disabled={disabled}
                className="rounded-full"
              >
                <Tag />
                {offerLabel}
              </Button>
            ) : null}

            <Button
              type="submit"
              size="icon"
              disabled={!canSend}
              aria-label="Mesaji gonder"
              className="size-8 rounded-full"
            >
              <SendHorizontal className="rtl:-scale-x-100" />
            </Button>
          </div>
        </div>
      </form>
    );
  }
);
MessageComposer.displayName = "MessageComposer";

export { MessageComposer };
