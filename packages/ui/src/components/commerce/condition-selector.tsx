"use client";

/**
 * ConditionSelector — ikinci-el urun durum secici (radio-kart listesi).
 * Her secenek renk-kodlu bir nokta, kisa aciklama ve secili durumda tonlu
 * bir ring ile sunulur. Klavye ile gezilebilir (Ok/Home/End, Space/Enter),
 * role="radiogroup" + role="radio" ve roving tabindex semasi kullanir.
 * Kilavuz (guide) tooltip'i baslik yaninda bilgi ikonu olarak gosterilir.
 * Ayrica salt-gosterim rozet varyanti ConditionBadge, kart uzerinde durum
 * etiketlemek icin ayni ton haritasini paylasir.
 * value + onValueChange ile kontrollu kullanim. Dolap ilan olusturma akisi.
 */
import * as React from "react";
import { Info } from "lucide-react";

import { cn, logicalArrowKey } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ConditionTone = "success" | "info" | "warning" | "muted" | "primary";

export interface ConditionOption {
  /** Benzersiz deger (onValueChange ile geri doner). */
  value: string;
  /** Kart basligi. */
  label: string;
  /** Kisa aciklama satiri. */
  description?: string;
  /** Renk tonu: nokta, secili ring ve rozet tintini belirler. */
  tone?: ConditionTone;
}

export type ConditionValue = string;

/** Dolap ikinci-el akisinin varsayilan durum secenekleri. */
export const conditionOptions: ConditionOption[] = [
  {
    value: "yeni-etiketli",
    label: "Etiketli yeni",
    description: "Hiç kullanılmadı, orijinal etiketi hâlâ üzerinde.",
    tone: "success",
  },
  {
    value: "az-kullanilmis",
    label: "Az kullanılmış",
    description: "Birkaç kez giyildi, gözle görülür kusuru yok.",
    tone: "info",
  },
  {
    value: "iyi",
    label: "İyi",
    description: "Düzenli kullanıldı, hafif kullanım izleri taşıyor.",
    tone: "warning",
  },
  {
    value: "orta",
    label: "Orta",
    description: "Belirgin kullanım izi var, açıklamada detaylandırıldı.",
    tone: "muted",
  },
];

const toneDot: Record<ConditionTone, string> = {
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  muted: "bg-muted-foreground",
  primary: "bg-primary",
};

const toneSelected: Record<ConditionTone, string> = {
  success: "border-success ring-success/40 bg-success/5",
  info: "border-info ring-info/40 bg-info/5",
  warning: "border-warning ring-warning/40 bg-warning/5",
  muted: "border-foreground/50 ring-foreground/25 bg-muted/40",
  primary: "border-primary ring-primary/40 bg-primary/5",
};

const toneBadge: Record<ConditionTone, string> = {
  success: "border-success/30 bg-success/10 text-success",
  info: "border-info/30 bg-info/10 text-info",
  warning: "border-warning/30 bg-warning/10 text-warning",
  muted: "border-border bg-muted text-muted-foreground",
  primary: "border-primary/30 bg-primary/10 text-primary",
};

function resolveTone(tone?: ConditionTone): ConditionTone {
  return tone ?? "primary";
}

function resolveOption(
  value: string | undefined,
  options: ConditionOption[],
): ConditionOption | undefined {
  return options.find((option) => option.value === value);
}

export interface ConditionSelectorProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  /** Secili durum degeri (kontrollu). */
  value?: string;
  /** Secim degistiginde cagrilir. disabled iken tetiklenmez. */
  onValueChange?: (value: string) => void;
  /** Durum secenekleri. Verilmezse varsayilan Dolap secenekleri kullanilir. */
  options?: ConditionOption[];
  /** Grup basligi (label). */
  label?: React.ReactNode;
  /** Baslik yaninda bilgi ikonu + tooltip icinde gosterilecek kilavuz metni. */
  guide?: React.ReactNode;
  /** Tum grubu devre disi birakir. */
  disabled?: boolean;
  /** label verilmezse erisilebilir grup etiketi. */
  "aria-label"?: string;
}

export const ConditionSelector = React.forwardRef<
  HTMLDivElement,
  ConditionSelectorProps
>(
  (
    {
      value,
      onValueChange,
      options = conditionOptions,
      label,
      guide,
      disabled = false,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const labelId = label ? `${id ?? reactId}-label` : undefined;
    const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    const rawIndex = options.findIndex((option) => option.value === value);
    const focusableIndex = rawIndex === -1 ? 0 : rawIndex;

    const commit = (index: number) => {
      const option = options[index];
      if (!option) return;
      onValueChange?.(option.value);
      itemRefs.current[index]?.focus();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled || options.length === 0) return;
      const count = options.length;
      let nextIndex: number | null = null;
      switch (logicalArrowKey(event.key, event.currentTarget)) {
        case "ArrowDown":
        case "ArrowRight":
          nextIndex = rawIndex === -1 ? 0 : (rawIndex + 1) % count;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          nextIndex = rawIndex === -1 ? count - 1 : (rawIndex - 1 + count) % count;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = count - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      commit(nextIndex);
    };

    return (
      <div ref={ref} className={cn("space-y-2.5", className)} id={id} {...props}>
        {label ? (
          <div className="flex items-center gap-1.5">
            <span
              id={labelId}
              className="text-sm font-medium text-foreground"
            >
              {label}
            </span>
            {guide ? (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Durum seçimi hakkında bilgi"
                      className="inline-flex size-4 items-center justify-center touch-hitbox rounded-full text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                    >
                      <Info className="size-3.5" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-64 text-start font-normal">
                    {guide}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}
          </div>
        ) : null}

        <div
          role="radiogroup"
          aria-labelledby={labelId}
          aria-label={label ? undefined : props["aria-label"] ?? "Ürün durumu"}
          aria-disabled={disabled || undefined}
          onKeyDown={handleKeyDown}
          className="grid gap-2"
        >
          {options.map((option, index) => {
            const tone = resolveTone(option.tone);
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={disabled}
                tabIndex={index === focusableIndex ? 0 : -1}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                onClick={() => {
                  if (disabled) return;
                  onValueChange?.(option.value);
                }}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-lg border bg-card p-3 text-start outline-none ring-offset-background transition-all duration-200",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  selected
                    ? cn("ring-2 shadow-sm", toneSelected[tone])
                    : "border-border hover:-translate-y-0.5 hover:border-ring/50 hover:shadow-sm",
                )}
              >
                <span className="relative mt-0.5 flex size-4 shrink-0 items-center justify-center">
                  <span
                    className={cn(
                      "size-4 rounded-full border transition-colors duration-200",
                      selected ? "border-transparent" : "border-input",
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "absolute inline-flex rounded-full transition-all duration-200",
                      toneDot[tone],
                      selected ? "size-2.5" : "size-2 opacity-70",
                    )}
                    aria-hidden="true"
                  />
                </span>

                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span
                      className={cn("size-2 shrink-0 rounded-full", toneDot[tone])}
                      aria-hidden="true"
                    />
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);
ConditionSelector.displayName = "ConditionSelector";

export interface ConditionBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Gosterilecek durum degeri. */
  value: string;
  /** Deger -> etiket cozumu icin secenek listesi. */
  options?: ConditionOption[];
  /** Renk-kodlu nokta gosterimi. */
  showDot?: boolean;
}

/**
 * ConditionBadge — salt-gosterim durum rozeti.
 * ProductCard/CartLineItem gibi kart yuzeylerinde ikinci-el durumunu
 * tonlu bir rozet olarak etiketler. ConditionSelector ile ayni ton
 * ve etiket haritasini paylasir.
 */
export const ConditionBadge = React.forwardRef<
  HTMLSpanElement,
  ConditionBadgeProps
>(
  (
    { value, options = conditionOptions, showDot = true, className, ...props },
    ref,
  ) => {
    const option = resolveOption(value, options);
    const tone = resolveTone(option?.tone);
    const label = option?.label ?? value;

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
          toneBadge[tone],
          className,
        )}
        {...props}
      >
        {showDot ? (
          <span
            className={cn("size-1.5 shrink-0 rounded-full", toneDot[tone])}
            aria-hidden="true"
          />
        ) : null}
        {label}
      </span>
    );
  },
);
ConditionBadge.displayName = "ConditionBadge";
