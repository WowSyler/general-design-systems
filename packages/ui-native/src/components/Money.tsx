/**
 * MoneyText / CurrencyInput — para tutarları.
 * MoneyText: tutarı yerel ayar + para birimiyle biçimler (Intl; tr-TR / TRY
 * varsayılan), tabular rakamlar. `signed` ile +/− işareti, `colorize` ile
 * gelir (success) / gider (destructive) tonu. Ekran okuyucu tam tutarı okur.
 * CurrencyInput: para birimi sembollü tutar girişi; değer sayı olarak döner,
 * odaktan çıkınca biçimlenir.
 */
import * as React from "react";
import { TextInput, type StyleProp, type TextStyle } from "react-native";

import { DsText } from "../internal/DsText";
import { currencySymbol, formatMoney, formatNumber, parseAmount, DEFAULT_CURRENCY, DEFAULT_LOCALE } from "../internal/format";
import { useNativeTheme } from "../theme/ThemeProvider";
import { Input, type InputProps } from "./Input";

export type MoneySize = "sm" | "md" | "lg" | "xl";

export interface MoneyTextProps {
  amount: number;
  currency?: string;
  locale?: string;
  fractionDigits?: number;
  /** Pozitifte "+" gösterir. */
  signed?: boolean;
  /** Pozitif → success, negatif → destructive tonu. */
  colorize?: boolean;
  size?: MoneySize;
  /** Metin tonu (colorize yoksa); varsayılan foreground. */
  tone?: "default" | "muted";
  style?: StyleProp<TextStyle>;
}

const SIZE: Record<MoneySize, { fontSize: number; lineHeight: number; weight: TextStyle["fontWeight"] }> = {
  sm: { fontSize: 14, lineHeight: 18, weight: "600" },
  md: { fontSize: 16, lineHeight: 22, weight: "600" },
  lg: { fontSize: 22, lineHeight: 28, weight: "700" },
  xl: { fontSize: 32, lineHeight: 38, weight: "700" },
};

export function MoneyText({
  amount,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE,
  fractionDigits = 2,
  signed = false,
  colorize = false,
  size = "md",
  tone = "default",
  style,
}: MoneyTextProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const abs = formatMoney(Math.abs(amount), currency, locale, fractionDigits);
  const sign = amount < 0 ? "−" : signed && amount > 0 ? "+" : "";
  const color = colorize
    ? amount > 0
      ? theme.colors.success
      : amount < 0
        ? theme.colors.destructive
        : theme.colors.foreground
    : tone === "muted"
      ? theme.colors.mutedForeground
      : theme.colors.foreground;
  const s = SIZE[size];
  return (
    <DsText
      aria-label={`${amount < 0 ? "eksi " : signed && amount > 0 ? "artı " : ""}${abs}`}
      style={[
        { color, fontSize: s.fontSize, lineHeight: s.lineHeight, fontWeight: s.weight, fontVariant: ["tabular-nums"] },
        style,
      ]}
    >
      {`${sign}${abs}`}
    </DsText>
  );
}

export interface CurrencyInputProps
  extends Omit<InputProps, "value" | "onChangeText" | "left" | "keyboardType" | "defaultValue"> {
  value: number | null;
  onChangeValue: (value: number | null) => void;
  currency?: string;
  locale?: string;
  fractionDigits?: number;
}

export const CurrencyInput = React.forwardRef<TextInput, CurrencyInputProps>(function CurrencyInput(
  { value, onChangeValue, currency = DEFAULT_CURRENCY, locale = DEFAULT_LOCALE, fractionDigits = 2, onBlur, onFocus, ...rest },
  ref,
): React.JSX.Element {
  const { theme } = useNativeTheme();
  const format = React.useCallback(
    (v: number | null) => (v === null ? "" : formatNumber(v, fractionDigits, locale)),
    [fractionDigits, locale],
  );
  const [text, setText] = React.useState(() => format(value));
  const [editing, setEditing] = React.useState(false);

  // Dışarıdan değer değişirse (ve kullanıcı yazmıyorsa) metni eşitle.
  React.useEffect(() => {
    if (!editing) setText(format(value));
  }, [value, editing, format]);

  return (
    <Input
      ref={ref}
      value={text}
      keyboardType="decimal-pad"
      inputMode="decimal"
      onChangeText={(t) => {
        setText(t);
        onChangeValue(parseAmount(t));
      }}
      onFocus={(e) => {
        setEditing(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setEditing(false);
        setText(format(parseAmount(text)));
        onBlur?.(e);
      }}
      left={
        <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["base"] ?? 16, fontWeight: "600" }}>
          {currencySymbol(currency, locale)}
        </DsText>
      }
      {...rest}
      style={[{ fontVariant: ["tabular-nums"] }, rest.style]}
    />
  );
});
