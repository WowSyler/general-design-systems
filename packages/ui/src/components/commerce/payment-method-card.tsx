/**
 * PaymentMethodCard — kayitli odeme yontemi karti (Fisly/Dolap/Randevu odeme).
 * Kart markasi isareti (Visa/Mastercard/Amex/Troy basit SVG), maskeli son dort
 * hane, son kullanma tarihi, opsiyonel kart sahibi, 'Varsayilan' rozeti ve
 * secili durumu (radio) gosterir; duzenle/sil aksiyonlarini yan yana sunar.
 * onSelect verildiginde bilgi bolumu role=radio olarak klavyeyle secilebilir.
 * Ayrica yeni kart eklemek icin kesikli 'Kart ekle' varyanti (PaymentMethodCardAdd).
 * Tema-agnostik: marka renkleri semantik tokenlarla yaklasiklanir.
 */
import * as React from "react";
import { Check, CreditCard, Pencil, Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PaymentMethodCardBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "troy"
  | "generic";

const brandLabels: Record<PaymentMethodCardBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  troy: "Troy",
  generic: "Kart",
};

/** Marka isaretini sabit boyutlu bir cip icinde render eder. */
function BrandMark({ brand }: { brand: PaymentMethodCardBrand }) {
  let mark: React.ReactNode;
  switch (brand) {
    case "visa":
      mark = (
        <span className="font-display text-sm font-black italic leading-none tracking-tight text-info">
          VISA
        </span>
      );
      break;
    case "mastercard":
      mark = (
        <span className="relative flex h-4 w-[26px] items-center">
          <span className="absolute left-0 size-4 rounded-full bg-destructive" />
          <span className="absolute right-0 size-4 rounded-full bg-warning mix-blend-multiply" />
        </span>
      );
      break;
    case "amex":
      mark = (
        <span className="text-[9px] font-black uppercase leading-none tracking-tight text-info">
          Amex
        </span>
      );
      break;
    case "troy":
      mark = (
        <span className="text-sm font-black lowercase leading-none tracking-tighter text-success">
          troy
        </span>
      );
      break;
    default:
      mark = (
        <CreditCard aria-hidden="true" className="size-5 text-muted-foreground" />
      );
  }

  return (
    <span className="flex h-7 w-11 shrink-0 items-center justify-center rounded-md border bg-background">
      {mark}
    </span>
  );
}

export interface PaymentMethodCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Kart markasi. Bilinmiyorsa 'generic'. */
  brand?: PaymentMethodCardBrand;
  /** Kartin son dort hanesi (or. "4242"). */
  last4: string;
  /** Son kullanma tarihi (or. "08/27"). */
  expiry?: string;
  /** Kart sahibi adi (opsiyonel). */
  holder?: React.ReactNode;
  /** Varsayilan odeme yontemi rozetini gosterir. */
  isDefault?: boolean;
  /** Radio secili durumu. */
  selected?: boolean;
  /**
   * Radio gostergesini gosterir. Verilmezse onSelect varligindan turetilir.
   */
  selectable?: boolean;
  /** Bilgi bolumu secildiginde cagrilir; verilirse alan role=radio olur. */
  onSelect?: () => void;
  /** Duzenle butonu tiklandiginda cagrilir; verilmezse buton gizlenir. */
  onEdit?: () => void;
  /** Sil butonu tiklandiginda cagrilir; verilmezse buton gizlenir. */
  onRemove?: () => void;
  /** Duzenle butonu erisilebilir etiketi. */
  editLabel?: string;
  /** Sil butonu erisilebilir etiketi. */
  removeLabel?: string;
}

const PaymentMethodCard = React.forwardRef<
  HTMLDivElement,
  PaymentMethodCardProps
>(
  (
    {
      brand = "generic",
      last4,
      expiry,
      holder,
      isDefault = false,
      selected = false,
      selectable,
      onSelect,
      onEdit,
      onRemove,
      editLabel = "Kartı düzenle",
      removeLabel = "Kartı sil",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const showRadio = selectable ?? Boolean(onSelect);
    const hasMeta = Boolean(holder) || Boolean(expiry);

    const ariaParts = [`${brandLabels[brand]} kart`, `son dört hane ${last4}`];
    if (expiry) ariaParts.push(`son kullanma ${expiry}`);
    if (isDefault) ariaParts.push("varsayılan kart");
    const ariaLabel = ariaParts.join(", ");

    const info = (
      <>
        {showRadio ? (
          <span
            aria-hidden="true"
            className={cn(
              "relative flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              selected ? "border-primary" : "border-input",
            )}
          >
            {selected ? (
              <span className="size-2 rounded-full bg-primary" />
            ) : null}
          </span>
        ) : null}
        <BrandMark brand={brand} />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium tracking-wider tabular-nums text-foreground">
              •••• {last4}
            </span>
            {isDefault ? (
              <Badge
                variant="secondary"
                className="gap-1 px-1.5 py-0 text-[10px] font-medium"
              >
                <Check className="size-3" aria-hidden="true" />
                Varsayılan
              </Badge>
            ) : null}
          </span>
          {hasMeta ? (
            <span className="truncate text-xs text-muted-foreground">
              {holder ? <span className="text-foreground/70">{holder}</span> : null}
              {holder && expiry ? " · " : null}
              {expiry ? `Son kullanma ${expiry}` : null}
            </span>
          ) : null}
        </span>
      </>
    );

    return (
      <div
        ref={ref}
        data-selected={selected ? "true" : undefined}
        className={cn(
          "group flex items-center gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-sm transition-all duration-200",
          onSelect ? "hover:-translate-y-0.5 hover:shadow-md" : null,
          selected
            ? "border-primary shadow-md ring-2 ring-primary/25"
            : "border-border",
          className,
        )}
        {...props}
      >
        {onSelect ? (
          <button
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={ariaLabel}
            onClick={onSelect}
            className="flex flex-1 items-center gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
          >
            {info}
          </button>
        ) : (
          <div className="flex flex-1 items-center gap-3">{info}</div>
        )}

        {children}

        {onEdit || onRemove ? (
          <div className="flex shrink-0 items-center gap-1">
            {onEdit ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                aria-label={editLabel}
                onClick={onEdit}
              >
                <Pencil aria-hidden="true" />
              </Button>
            ) : null}
            {onRemove ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive"
                aria-label={removeLabel}
                onClick={onRemove}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);
PaymentMethodCard.displayName = "PaymentMethodCard";

export interface PaymentMethodCardAddProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Buton metni. Varsayilan "Yeni kart ekle". */
  label?: React.ReactNode;
}

const PaymentMethodCardAdd = React.forwardRef<
  HTMLButtonElement,
  PaymentMethodCardAddProps
>(({ label = "Yeni kart ekle", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input bg-card/40 p-4 text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-ring/60 hover:bg-accent hover:text-accent-foreground active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        className,
      )}
      {...props}
    >
      <Plus
        aria-hidden="true"
        className="size-4 shrink-0 transition-transform duration-200 group-hover:rotate-90"
      />
      {label}
    </button>
  );
});
PaymentMethodCardAdd.displayName = "PaymentMethodCardAdd";

export { PaymentMethodCard, PaymentMethodCardAdd };
export type { PaymentMethodCardBrand };
