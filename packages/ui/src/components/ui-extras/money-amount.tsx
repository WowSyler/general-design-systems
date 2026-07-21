/**
 * MoneyAmount — Bicimli para tutari gosterimi.
 * Tutari Intl.NumberFormat("tr-TR") ile bicimler (binlik "." ondalik ",")
 * ve yaninda para birimi simgesini (TRY=₺, USD=$, EUR=€) gosterir.
 * tabular-nums ile rakamlar dikey hizali kalir. Isaret semantigi opsiyoneldir:
 * colored ile pozitif tutar text-success (gelir), negatif tutar text-destructive
 * (gider) olur; showSign pozitifte "+" onekini de ekler. size sm/md/lg/xl,
 * smallDecimals ile kurus/ondalik kismi kucuk gosterilir, currencyPosition ile
 * simge one/arkaya alinir. Erisim icin tam okunur bir aria-label uretilir.
 * Kullanim: Fisly her yerde tutar/bakiye, Dolap urun fiyati, gelir-gider ozeti.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Desteklenen para birimi kodlari. */
export type MoneyAmountCurrency = "TRY" | "USD" | "EUR";

/** Her para birimi icin simge ve ekran okuyucu adi. */
const currencyMeta: Record<MoneyAmountCurrency, { symbol: string; name: string }> = {
  TRY: { symbol: "₺", name: "Türk lirası" },
  USD: { symbol: "$", name: "ABD doları" },
  EUR: { symbol: "€", name: "euro" },
};

const moneyAmountVariants = cva(
  "inline-flex items-baseline whitespace-nowrap font-semibold tabular-nums leading-none",
  {
    variants: {
      size: {
        sm: "gap-0.5 text-sm",
        md: "gap-0.5 text-base",
        lg: "gap-1 text-xl",
        xl: "gap-1 text-3xl font-bold tracking-tight",
      },
      tone: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        success: "text-success",
        destructive: "text-destructive",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "default",
    },
  }
);

export interface MoneyAmountProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    Pick<VariantProps<typeof moneyAmountVariants>, "size"> {
  /** Gosterilecek tutar (pozitif gelir, negatif gider). */
  amount: number;
  /** Para birimi kodu. Varsayilan "TRY". */
  currency?: MoneyAmountCurrency;
  /** Ondalik (kurus) basamak sayisi. Varsayilan 2. */
  decimals?: number;
  /**
   * Isaret semantigini renklendirir: pozitif -> success (gelir),
   * negatif -> destructive (gider), sifir -> muted. Varsayilan false.
   */
  colored?: boolean;
  /** Pozitif tutarlarda da "+" onekini gosterir. Varsayilan false. */
  showSign?: boolean;
  /** Ondalik (kurus) kismini kucuk puntoyla gosterir. Varsayilan false. */
  smallDecimals?: boolean;
  /** Para birimi simgesinin yeri. Varsayilan "after" (tutardan sonra). */
  currencyPosition?: "before" | "after";
  /** Varsayilan simgeyi ezmek icin ozel para birimi simgesi (or. "£", "kr"). */
  symbol?: string;
}

const MoneyAmount = React.forwardRef<HTMLSpanElement, MoneyAmountProps>(
  (
    {
      amount,
      currency = "TRY",
      decimals = 2,
      colored = false,
      showSign = false,
      smallDecimals = false,
      currencyPosition = "after",
      symbol,
      size,
      className,
      ...props
    },
    ref
  ) => {
    const meta = currencyMeta[currency];
    const currencySymbol = symbol ?? meta.symbol;

    const isNegative = amount < 0;
    const isPositive = amount > 0;
    const absolute = Math.abs(amount);

    const formatter = new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    const parts = formatter.formatToParts(absolute);
    const integer = parts
      .filter((part) => part.type === "integer" || part.type === "group")
      .map((part) => part.value)
      .join("");
    const decimalSeparator =
      parts.find((part) => part.type === "decimal")?.value ?? ",";
    const fraction = parts.find((part) => part.type === "fraction")?.value;
    const hasFraction = decimals > 0 && fraction !== undefined;

    const signPrefix = isNegative ? "−" : showSign && isPositive ? "+" : "";

    const tone = colored
      ? isPositive
        ? "success"
        : isNegative
          ? "destructive"
          : "muted"
      : "default";

    const signWord = isNegative
      ? "eksi "
      : showSign && isPositive
        ? "artı "
        : "";
    const ariaLabel = `${signWord}${formatter.format(absolute)} ${meta.name}`;

    const currencyNode = (
      <span aria-hidden="true" className="font-medium opacity-80">
        {currencySymbol}
      </span>
    );

    return (
      <span
        ref={ref}
        role="text"
        aria-label={ariaLabel}
        className={cn(moneyAmountVariants({ size, tone }), className)}
        {...props}
      >
        <span aria-hidden="true" className="inline-flex items-baseline">
          {signPrefix ? <span>{signPrefix}</span> : null}
          {currencyPosition === "before" ? currencyNode : null}
          <span>{integer}</span>
          {hasFraction ? (
            <span
              className={cn(
                smallDecimals && "text-[0.7em] font-medium opacity-70"
              )}
            >
              {decimalSeparator}
              {fraction}
            </span>
          ) : null}
          {currencyPosition === "after" ? currencyNode : null}
        </span>
      </span>
    );
  }
);
MoneyAmount.displayName = "MoneyAmount";

export { MoneyAmount, moneyAmountVariants };
