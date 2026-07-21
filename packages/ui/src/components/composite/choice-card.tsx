/**
 * ChoiceCard — Onboarding hedef/yol secim karti (GlowScan cilt-hedefi, Fisly kullanim-amaci).
 * Toggle-card'dan buyuk, resimli bir secenek karti: buyuk ikon/emoji illustrasyon +
 * baslik + aciklama + opsiyonel rozet. Secili durumda ring-primary + Check gosterir.
 * Genelde 2-4 secenekle grid icinde ChoiceCardGroup ile radiogroup olarak kullanilir.
 */
import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ChoiceCardProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "title"> {
  /** Buyuk ikon/emoji illustrasyon (emoji stringi veya lucide ikonu). */
  icon?: React.ReactNode;
  /** Kart basligi (secenek adi). */
  title: React.ReactNode;
  /** Kisa aciklama. */
  description?: React.ReactNode;
  /** Opsiyonel rozet metni (or. "Onerilen"). */
  badge?: React.ReactNode;
  /** Kartin secili olup olmadigi. */
  selected?: boolean;
}

const ChoiceCard = React.forwardRef<HTMLButtonElement, ChoiceCardProps>(
  (
    { icon, title, description, badge, selected = false, disabled, className, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={selected}
        disabled={disabled}
        className={cn(
          "group relative flex w-full flex-col items-start gap-3 rounded-xl border bg-card p-5 text-left text-card-foreground transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          selected
            ? "border-transparent ring-2 ring-primary shadow-glow"
            : "shadow-sm hover:-translate-y-0.5 hover:border-ring hover:shadow-md",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        {...props}
      >
        {/* Secim gostergesi (radio) */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute right-4 top-4 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
            selected
              ? "border-transparent bg-primary text-primary-foreground shadow-sm"
              : "border-muted-foreground/30 bg-transparent",
          )}
        >
          <Check
            className={cn(
              "size-3 transition-transform duration-200",
              selected ? "scale-100" : "scale-0",
            )}
          />
        </span>

        {/* Illustrasyon */}
        {icon != null ? (
          <span
            aria-hidden="true"
            className={cn(
              "flex size-14 items-center justify-center rounded-xl text-3xl leading-none transition-colors duration-200 [&_svg]:size-7",
              selected
                ? "bg-primary/15 text-primary"
                : "bg-muted text-foreground group-hover:bg-primary/10 group-hover:text-primary",
            )}
          >
            {icon}
          </span>
        ) : null}

        {/* Baslik + rozet */}
        <div className="flex w-full flex-wrap items-center gap-2 pr-6">
          <span className="text-base font-semibold leading-tight">{title}</span>
          {badge != null ? (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              {badge}
            </span>
          ) : null}
        </div>

        {/* Aciklama */}
        {description != null ? (
          <span className="text-sm text-muted-foreground">{description}</span>
        ) : null}
      </button>
    );
  },
);
ChoiceCard.displayName = "ChoiceCard";

export interface ChoiceCardOption {
  /** Benzersiz secenek degeri. */
  value: string;
  /** Buyuk ikon/emoji illustrasyon. */
  icon?: React.ReactNode;
  /** Secenek basligi. */
  title: React.ReactNode;
  /** Kisa aciklama. */
  description?: React.ReactNode;
  /** Opsiyonel rozet metni. */
  badge?: React.ReactNode;
  /** Secenegin devre disi olup olmadigi. */
  disabled?: boolean;
}

export interface ChoiceCardGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Gosterilecek secenekler (genelde 2-4 adet). */
  options: ChoiceCardOption[];
  /** Secili secenegin degeri. */
  value?: string;
  /** Secim degistiginde cagrilir. */
  onValueChange?: (value: string) => void;
  /** Genis ekranda sutun sayisi (mobilde daralir). */
  columns?: 1 | 2 | 3 | 4;
  /** Grup icin erisilebilir etiket. */
  label?: string;
}

const columnClasses: Record<1 | 2 | 3 | 4, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

const ChoiceCardGroup = React.forwardRef<HTMLDivElement, ChoiceCardGroupProps>(
  (
    { options, value, onValueChange, columns = 2, label, className, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={label}
        className={cn("grid gap-3", columnClasses[columns], className)}
        {...props}
      >
        {options.map((option) => (
          <ChoiceCard
            key={option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            badge={option.badge}
            disabled={option.disabled}
            selected={option.value === value}
            onClick={() => onValueChange?.(option.value)}
          />
        ))}
      </div>
    );
  },
);
ChoiceCardGroup.displayName = "ChoiceCardGroup";

export { ChoiceCard, ChoiceCardGroup };
