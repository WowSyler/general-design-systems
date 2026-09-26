/**
 * TransactionRow — finans işlem satırı (Fisly). Kategori rozeti (ikon ya da baş
 * harf, kategori rengi), başlık + alt bilgi (tarih · kategori), sonda işaretli
 * tutar (gelir "+" ve success tonunda, gider "−" ile nötr tonda). `pending` işlemler
 * "Bekliyor" durum hapı taşır; `onPress` ile detaya gider.
 */
import * as React from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { withAlpha } from "../internal/color";
import { DsText } from "../internal/DsText";
import { formatMoney } from "../internal/format";
import { useNativeTheme } from "../theme/ThemeProvider";
import { MoneyText } from "./Money";
import { StatusChip } from "./StatusChip";

export interface TransactionRowProps {
  title: string;
  /** Pozitif = gelir, negatif = gider. */
  amount: number;
  currency?: string;
  locale?: string;
  /** Alt satır (ör. "22 Eyl · Market"). */
  subtitle?: string;
  categoryIcon?: React.ReactNode;
  /** Kategori rozeti rengi (tema chart tokenı önerilir). */
  categoryColor?: string;
  pending?: boolean;
  pendingLabel?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function TransactionRow({
  title,
  amount,
  currency,
  locale,
  subtitle,
  categoryIcon,
  categoryColor,
  pending = false,
  pendingLabel = "Bekliyor",
  onPress,
  style,
}: TransactionRowProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const tone = categoryColor ?? theme.colors.primary;
  const a11y = `${title}, ${amount < 0 ? "gider" : "gelir"} ${formatMoney(Math.abs(amount), currency, locale)}${subtitle ? `, ${subtitle}` : ""}${pending ? `, ${pendingLabel}` : ""}`;

  const body = (
    <>
      <View style={{ width: 40, height: 40, borderRadius: theme.radius.md, backgroundColor: withAlpha(tone, 0.14), alignItems: "center", justifyContent: "center" }}>
        {categoryIcon ?? (
          <DsText allowFontScaling={false} style={{ color: tone, fontWeight: "700", fontSize: 15 }}>
            {title.slice(0, 1).toLocaleUpperCase("tr-TR")}
          </DsText>
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0, rowGap: 2 }}>
        <DsText numberOfLines={1} style={{ color: theme.colors.foreground, fontSize: theme.fontSize["base"] ?? 16, fontWeight: "500" }}>
          {title}
        </DsText>
        {subtitle !== undefined ? (
          <DsText numberOfLines={1} style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14 }}>
            {subtitle}
          </DsText>
        ) : null}
      </View>
      <View style={{ alignItems: "flex-end", rowGap: 4 }}>
        <MoneyText amount={amount} currency={currency} locale={locale} signed colorize={amount > 0} />
        {pending ? <StatusChip label={pendingLabel} tone="warning" size="sm" /> : null}
      </View>
    </>
  );

  const rowStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    minHeight: MIN_TOUCH_TARGET + 12,
    paddingVertical: theme.space.sm,
    paddingHorizontal: theme.space.lg,
    columnGap: theme.space.md,
    opacity: pending ? 0.85 : 1,
  };

  if (onPress) {
    return (
      <Pressable
        role="button"
        aria-label={a11y}
        onPress={onPress}
        style={({ pressed }) => [rowStyle, pressed ? { backgroundColor: theme.colors.muted } : null, style]}
      >
        {body}
      </Pressable>
    );
  }
  return (
    <View accessible aria-label={a11y} style={[rowStyle, style]}>
      {body}
    </View>
  );
}
