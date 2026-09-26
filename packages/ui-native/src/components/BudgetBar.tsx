/**
 * BudgetBar — bütçe kullanım çubuğu (Fisly). Harcanan / limit; %80 üzeri
 * uyarı, %100 üzeri aşım (destructive) tonu ve "₺X aşıldı" metni. Opsiyonel
 * kategori adı ve rengi. Ekran okuyucuya yüzde + kalan/aşım tutarı okunur.
 */
import * as React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { DsText } from "../internal/DsText";
import { formatMoney } from "../internal/format";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaValue } from "../internal/a11y";

export interface BudgetBarProps {
  label: string;
  spent: number;
  limit: number;
  currency?: string;
  locale?: string;
  /** Normal durumdaki dolgu rengi; varsayılan primary. */
  color?: string;
  /** Uyarı eşiği (0-1); varsayılan 0.8. */
  warnAt?: number;
  style?: StyleProp<ViewStyle>;
}

export function BudgetBar({
  label,
  spent,
  limit,
  currency,
  locale,
  color,
  warnAt = 0.8,
  style,
}: BudgetBarProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const ratio = limit > 0 ? spent / limit : 0;
  const over = ratio > 1;
  const warn = !over && ratio >= warnAt;
  const fill = over ? theme.colors.destructive : warn ? theme.colors.warning : (color ?? theme.colors.primary);
  const pct = Math.round(ratio * 100);
  const remaining = limit - spent;
  const status = over
    ? `${formatMoney(-remaining, currency, locale)} aşıldı`
    : `${formatMoney(remaining, currency, locale)} kaldı`;

  return (
    <View
      accessible
      role="progressbar"
      aria-label={`${label}: ${formatMoney(spent, currency, locale)} / ${formatMoney(limit, currency, locale)}, %${pct}, ${status}`}
      {...ariaValue({ min: 0, max: 100, now: Math.min(100, pct) })}
      style={[{ rowGap: theme.space.xs }, style]}
    >
      <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: theme.space.sm }}>
        <DsText numberOfLines={1} style={{ flex: 1, color: theme.colors.foreground, fontSize: theme.fontSize["sm"] ?? 14, fontWeight: "600" }}>
          {label}
        </DsText>
        <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["xs"] ?? 12, fontVariant: ["tabular-nums"] }}>
          {`${formatMoney(spent, currency, locale, 0)} / ${formatMoney(limit, currency, locale, 0)}`}
        </DsText>
      </View>
      <View style={{ height: 8, borderRadius: theme.radius.pill, backgroundColor: theme.colors.muted, overflow: "hidden" }}>
        <View style={{ width: `${Math.min(100, Math.max(0, ratio * 100))}%`, height: "100%", borderRadius: theme.radius.pill, backgroundColor: fill }} />
      </View>
      <DsText style={{ color: over ? theme.colors.destructive : warn ? theme.colors.warning : theme.colors.mutedForeground, fontSize: theme.fontSize["xs"] ?? 12, fontWeight: over || warn ? "600" : "400" }}>
        {`%${pct} · ${status}`}
      </DsText>
    </View>
  );
}
