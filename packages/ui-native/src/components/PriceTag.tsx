/**
 * PriceTag — fiyat etiketi (Dolap). Güncel fiyat vurgulu; `originalPrice`
 * verilirse üstü çizili eski fiyat ve otomatik "%NN" indirim rozeti. Ekran
 * okuyucu "Fiyat 450 ₺, önceki 600 ₺, yüzde 25 indirim" okur.
 */
import * as React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { withAlpha } from "../internal/color";
import { DsText } from "../internal/DsText";
import { formatMoney } from "../internal/format";
import { useNativeTheme } from "../theme/ThemeProvider";

export interface PriceTagProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  locale?: string;
  /** Kuruş gösterimi; varsayılan 0 (tam sayı fiyat). */
  fractionDigits?: number;
  size?: "sm" | "md" | "lg";
  /** İndirim rozetini gizle. */
  hideDiscount?: boolean;
  style?: StyleProp<ViewStyle>;
}

const FONT = { sm: 14, md: 18, lg: 24 } as const;

export function PriceTag({
  price,
  originalPrice,
  currency,
  locale,
  fractionDigits = 0,
  size = "md",
  hideDiscount = false,
  style,
}: PriceTagProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const discounted = originalPrice !== undefined && originalPrice > price;
  const pct = discounted ? Math.round((1 - price / originalPrice!) * 100) : 0;
  const now = formatMoney(price, currency, locale, fractionDigits);
  const was = discounted ? formatMoney(originalPrice!, currency, locale, fractionDigits) : null;

  return (
    <View
      accessible
      
      aria-label={`Fiyat ${now}${was ? `, önceki ${was}, yüzde ${pct} indirim` : ""}`}
      style={[{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", columnGap: theme.space.sm, rowGap: 2 }, style]}
    >
      <DsText style={{ color: discounted ? theme.colors.destructive : theme.colors.foreground, fontSize: FONT[size], fontWeight: "700", fontVariant: ["tabular-nums"] }}>
        {now}
      </DsText>
      {was !== null ? (
        <DsText style={{ color: theme.colors.mutedForeground, fontSize: FONT[size] * 0.72, textDecorationLine: "line-through", fontVariant: ["tabular-nums"] }}>
          {was}
        </DsText>
      ) : null}
      {discounted && !hideDiscount ? (
        <View style={{ backgroundColor: withAlpha(theme.colors.destructive, 0.12), borderRadius: theme.radius.pill, paddingHorizontal: 6, paddingVertical: 1 }}>
          <DsText style={{ color: theme.colors.destructive, fontSize: 11, fontWeight: "700" }}>{`%${pct}`}</DsText>
        </View>
      ) : null}
    </View>
  );
}
