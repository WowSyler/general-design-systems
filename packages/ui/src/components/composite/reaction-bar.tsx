"use client";

/**
 * ReactionBar — Sosyal tepki/reaksiyon cubugu (Dolap/GlowScan/DeployLens).
 * Emoji ya da ikon tepkileri (begen, kalp, alkis...) her biri kendi sayaci
 * ile yan yana chip olarak gosterir; her chip toggle davranir ve secili
 * durumda vurgulanir. Opsiyonel "tepki ekle" popover'i ile hazir tepki
 * setinden yeni bir tepki secilebilir.
 *
 * Kontrollu (value + onChange) ya da kontrolsuz (defaultValue) kullanilir.
 * Sayac modeli: item.count = "sizin disinizdaki" tepki sayisidir; kullanici
 * bir tepkiyi acinca goruntulenen sayac +1 artar, kapatinca eski degerine
 * doner. Boylece prop mutasyonu olmadan canli artis/azalis saglanir.
 *
 * Erisilebilirlik: her chip <button aria-pressed> + aria-label, klavye ile
 * odaklanip Enter/Space ile toggle edilir; focus-visible ring uygulanir.
 */
import * as React from "react";
import { SmilePlus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const reactionBarChipVariants = cva(
  "group inline-flex select-none items-center gap-1.5 rounded-full border font-medium leading-none tabular-nums transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:transition-transform",
  {
    variants: {
      size: {
        sm: "h-7 px-2 text-xs [&_svg]:size-3.5",
        md: "h-8 px-2.5 text-sm [&_svg]:size-4",
        lg: "h-9 px-3 text-sm [&_svg]:size-4",
      },
      active: {
        true: "border-primary/40 bg-primary/10 text-primary shadow-sm",
        false:
          "border-border bg-background text-muted-foreground hover:-translate-y-0.5 hover:border-ring/50 hover:bg-accent hover:text-foreground hover:shadow-sm",
      },
    },
    defaultVariants: {
      size: "md",
      active: false,
    },
  }
);

const emojiSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
} as const;

export interface ReactionBarItem {
  /** Benzersiz tepki kimligi (or. "like", "heart"). */
  id: string;
  /** Erisilebilir etiket (or. "Begen"). */
  label: string;
  /** Gorsel: emoji dizesi ("👍") ya da lucide ikon dugumu. */
  emoji?: React.ReactNode;
  /** Sizin disinizdaki tepki sayisi; siz acinca +1 gosterilir. */
  count?: number;
}

export interface ReactionBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    VariantProps<typeof reactionBarChipVariants> {
  /** Cubukta gosterilecek tepkiler. */
  reactions: ReactionBarItem[];
  /** Kontrollu: kullanicinin secili tepki kimlikleri. */
  value?: string[];
  /** Kontrolsuz baslangic secimi. */
  defaultValue?: string[];
  /** Secim degisince calisir; ikinci arg degisen tepkinin kimligidir. */
  onChange?: (value: string[], toggledId: string) => void;
  /** true ise ayni anda birden fazla tepki secilebilir (varsayilan). */
  allowMultiple?: boolean;
  /** "Tepki ekle" popover'inda sunulacak hazir tepkiler; verilirse + dugmesi cikar. */
  addOptions?: ReactionBarItem[];
  /** Popover'dan bir tepki secilince calisir. */
  onAddReaction?: (reaction: ReactionBarItem) => void;
  /** Ekle dugmesi/popover baslik metni. */
  addLabel?: string;
  /** Toplam sayac 0 iken de sayiyi goster (varsayilan gizle). */
  showZeroCount?: boolean;
  /** Tum chip'leri devre disi birakir. */
  disabled?: boolean;
}

const ReactionBar = React.forwardRef<HTMLDivElement, ReactionBarProps>(
  (
    {
      reactions,
      value,
      defaultValue,
      onChange,
      allowMultiple = true,
      addOptions,
      onAddReaction,
      addLabel = "Tepki ekle",
      showZeroCount = false,
      size = "md",
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<string[]>(
      defaultValue ?? []
    );
    const current = isControlled ? value : internalValue;

    // Popover'dan eklenen ve reactions prop'unda olmayan tepkiler.
    const [addedItems, setAddedItems] = React.useState<ReactionBarItem[]>([]);
    const [addOpen, setAddOpen] = React.useState(false);

    const items = React.useMemo(() => {
      const extras = addedItems.filter(
        (added) => !reactions.some((base) => base.id === added.id)
      );
      return [...reactions, ...extras];
    }, [reactions, addedItems]);

    const setSelection = (next: string[], toggledId: string) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next, toggledId);
    };

    const toggle = (id: string) => {
      const active = current.includes(id);
      const next = allowMultiple
        ? active
          ? current.filter((item) => item !== id)
          : [...current, id]
        : active
          ? []
          : [id];
      setSelection(next, id);
    };

    const chipSize = size ?? "md";
    const resolvedEmojiClass = emojiSizeClasses[chipSize];

    const availableOptions = (addOptions ?? []).filter(
      (option) => !items.some((item) => item.id === option.id)
    );

    const handleAdd = (option: ReactionBarItem) => {
      if (!items.some((item) => item.id === option.id)) {
        setAddedItems((prev) => [...prev, { ...option, count: option.count ?? 0 }]);
      }
      if (!current.includes(option.id)) {
        const next = allowMultiple ? [...current, option.id] : [option.id];
        setSelection(next, option.id);
      }
      onAddReaction?.(option);
      setAddOpen(false);
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap items-center gap-1.5", className)}
        {...props}
      >
        {items.map((item) => {
          const active = current.includes(item.id);
          const displayCount = (item.count ?? 0) + (active ? 1 : 0);
          const showCount = showZeroCount || displayCount > 0;
          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              aria-label={
                showCount
                  ? `${item.label}, ${displayCount} tepki`
                  : item.label
              }
              onClick={() => toggle(item.id)}
              className={cn(reactionBarChipVariants({ size: chipSize, active }))}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "leading-none transition-transform duration-200 group-hover:scale-110 group-active:scale-95",
                  resolvedEmojiClass
                )}
              >
                {item.emoji ?? item.label.slice(0, 1)}
              </span>
              {showCount ? (
                <span className="tabular-nums">{displayCount}</span>
              ) : null}
            </button>
          );
        })}

        {availableOptions.length > 0 ? (
          <Popover open={addOpen} onOpenChange={setAddOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                aria-label={addLabel}
                className={cn(
                  reactionBarChipVariants({ size: chipSize, active: false }),
                  "px-2 text-muted-foreground"
                )}
              >
                <SmilePlus aria-hidden="true" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-auto p-2"
              aria-label={addLabel}
            >
              <div className="mb-1.5 px-1 text-xs font-medium text-muted-foreground">
                {addLabel}
              </div>
              <div className="flex flex-wrap gap-1">
                {availableOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-label={option.label}
                    title={option.label}
                    onClick={() => handleAdd(option)}
                    className="flex size-9 items-center justify-center rounded-md text-lg leading-none transition-all duration-200 hover:scale-110 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-5"
                  >
                    <span aria-hidden="true">
                      {option.emoji ?? option.label.slice(0, 1)}
                    </span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
    );
  }
);
ReactionBar.displayName = "ReactionBar";

export { ReactionBar, reactionBarChipVariants };
