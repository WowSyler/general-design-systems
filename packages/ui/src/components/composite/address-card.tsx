/**
 * AddressCard — Kayitli adres karti (Dolap/Randevu adres defteri).
 * Adres basligini tur ikonu + rozetiyle (Ev / Is / Diger), alici adini,
 * telefonu ve tam adresi gosterir; opsiyonel "Varsayilan" rozeti tasir.
 * onSelect verildiginde kart secilebilir hale gelir: sol tarafta radio
 * gostergesi cikar, role=radio + aria-checked ile erisilebilir olur ve
 * klavyeden (Bosluk/Enter) secilebilir. onEdit/onDelete ile Duzenle/Sil
 * eylemleri baglanir. Sunumsal ve tema-agnostiktir; loading durumunda
 * Skeleton yer tutuculari render eder.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Briefcase,
  Home,
  MapPin,
  Pencil,
  Phone,
  Star,
  Trash2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Adres turu — ikon ve varsayilan etiketi belirler. */
export type AddressCardType = "home" | "work" | "other";

interface AddressTypeConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const typeConfig: Record<AddressCardType, AddressTypeConfig> = {
  home: { label: "Ev", icon: Home },
  work: { label: "İş", icon: Briefcase },
  other: { label: "Diğer", icon: MapPin },
};

const addressCardVariants = cva(
  "relative flex gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-sm transition-all duration-300",
  {
    variants: {
      selected: {
        true: "border-primary ring-1 ring-primary/40 bg-primary/[0.03]",
        false: "border-border",
      },
      selectable: {
        true: "cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        false: "",
      },
    },
    defaultVariants: {
      selected: false,
      selectable: false,
    },
  }
);

export interface AddressCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onSelect">,
    Omit<VariantProps<typeof addressCardVariants>, "selectable"> {
  /** Adres turu: ikon + rozet metnini belirler. */
  type?: AddressCardType;
  /** Tur rozetinin metnini gecersiz kilar (or. "Yazlik", "Ofis"). */
  typeLabel?: React.ReactNode;
  /** Alici / adres sahibi adi. */
  recipient: React.ReactNode;
  /** Telefon numarasi (opsiyonel). */
  phone?: React.ReactNode;
  /** Acik / tam adres metni. */
  address: React.ReactNode;
  /** Varsayilan adres rozetini gosterir. */
  isDefault?: boolean;
  /** Varsayilan rozet metni. */
  defaultLabel?: string;
  /** Secili durum (radio gostergesi). onSelect ile birlikte kullanilir. */
  selected?: boolean;
  /** Verildiginde kart secilebilir olur; tiklama/klavye ile tetiklenir. */
  onSelect?: () => void;
  /** "Duzenle" eylemi; verilmezse buton gizlenir. */
  onEdit?: React.MouseEventHandler<HTMLButtonElement>;
  /** "Sil" eylemi; verilmezse buton gizlenir. */
  onDelete?: React.MouseEventHandler<HTMLButtonElement>;
  /** Duzenle buton metni. */
  editLabel?: string;
  /** Sil buton metni. */
  deleteLabel?: string;
  /** Yukleme durumu (skeleton yer tutucular). */
  loading?: boolean;
}

const AddressCard = React.forwardRef<HTMLDivElement, AddressCardProps>(
  (
    {
      type = "home",
      typeLabel,
      recipient,
      phone,
      address,
      isDefault = false,
      defaultLabel = "Varsayılan",
      selected = false,
      onSelect,
      onEdit,
      onDelete,
      editLabel = "Düzenle",
      deleteLabel = "Sil",
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(addressCardVariants({ selectable: false }), className)}
          {...props}
        >
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-full max-w-xs" />
          </div>
        </div>
      );
    }

    const config = typeConfig[type];
    const Icon = config.icon;
    const label = typeLabel ?? config.label;
    const selectable = Boolean(onSelect);

    const handleSelect = () => onSelect?.();

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        onSelect?.();
      }
    };

    const stop = (handler?: React.MouseEventHandler<HTMLButtonElement>) =>
      handler
        ? (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            handler(event);
          }
        : undefined;

    const ariaLabel = `${
      typeof label === "string" ? label : config.label
    } adresi, ${typeof recipient === "string" ? recipient : ""}${
      isDefault ? `, ${defaultLabel.toLocaleLowerCase("tr-TR")}` : ""
    }`;

    return (
      <div
        ref={ref}
        role={selectable ? "radio" : "group"}
        aria-checked={selectable ? selected : undefined}
        aria-label={ariaLabel}
        tabIndex={selectable ? 0 : undefined}
        onClick={selectable ? handleSelect : undefined}
        onKeyDown={selectable ? handleKeyDown : undefined}
        className={cn(addressCardVariants({ selected, selectable }), className)}
        {...props}
      >
        {selectable ? (
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              selected ? "border-primary" : "border-input"
            )}
          >
            {selected ? (
              <span className="size-2.5 rounded-full bg-primary" />
            ) : null}
          </span>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* Ust satir: tur rozeti + varsayilan rozeti + eylemler */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </span>
              {isDefault ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                  <Star className="size-3 fill-current" aria-hidden="true" />
                  {defaultLabel}
                </span>
              ) : null}
            </div>

            {onEdit || onDelete ? (
              <div className="flex shrink-0 items-center gap-1">
                {onEdit ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={stop(onEdit)}
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil aria-hidden="true" />
                    <span className="sr-only sm:not-sr-only">{editLabel}</span>
                  </Button>
                ) : null}
                {onDelete ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={stop(onDelete)}
                    className="h-8 px-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 aria-hidden="true" />
                    <span className="sr-only sm:not-sr-only">{deleteLabel}</span>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Alici adi */}
          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <User className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="truncate">{recipient}</span>
          </div>

          {/* Telefon */}
          {phone ? (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="size-4 shrink-0" aria-hidden="true" />
              <span className="tabular-nums">{phone}</span>
            </div>
          ) : null}

          {/* Tam adres */}
          <div className="flex items-start gap-1.5 text-sm leading-relaxed text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{address}</span>
          </div>
        </div>
      </div>
    );
  }
);
AddressCard.displayName = "AddressCard";

export { AddressCard, addressCardVariants };
