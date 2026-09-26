/**
 * DsText — kütüphane içi metin temeli. RN Text'e tema font ailesini (gövde ya da
 * başlık — role="heading" olanlar; ağırlık haritası verildiyse ağırlığa uygun aile) ve makul bir
 * `maxFontSizeMultiplier` (varsayılan 1.6) ekler. Tüm bileşenler RN Text yerine
 * bunu kullanır; böylece NativeThemeProvider `fonts` ayarı her yere yansır.
 */
import * as React from "react";
import {
  Platform,
  StyleSheet,
  Text as RNText,
  type TextProps,
  type TextStyle,
} from "react-native";

import {
  useNativeTheme,
  type FontFamilySource,
  type NativeFonts,
} from "../theme/ThemeProvider";

export type FontRole = "body" | "heading" | "mono";

export interface DsTextProps extends TextProps {
  /** Font rolü; verilmezse header rolündeki metinler "heading", diğerleri "body". */
  fontRole?: FontRole;
}

/** Varsayılan büyütme sınırı — erişilebilir ama düzeni patlatmayan değer. */
export const DEFAULT_MAX_FONT_SCALE = 1.6;

type WeightKey = "regular" | "medium" | "semibold" | "bold";

function weightKey(weight: TextStyle["fontWeight"]): WeightKey {
  const n =
    typeof weight === "number"
      ? weight
      : weight === "bold"
        ? 700
        : weight === undefined || weight === "normal"
          ? 400
          : Number(weight);
  if (Number.isNaN(n) || n < 500) return "regular";
  if (n < 600) return "medium";
  if (n < 700) return "semibold";
  return "bold";
}

/** Font kaynağını stile çevirir; ağırlık haritasında fontWeight native'de sıfırlanır. */
export function resolveFontStyle(
  source: FontFamilySource | undefined,
  weight: TextStyle["fontWeight"],
): TextStyle | null {
  if (source === undefined) return null;
  if (typeof source === "string") return { fontFamily: source };
  const key = weightKey(weight);
  const family =
    source[key] ??
    (key === "bold" ? (source.semibold ?? source.medium) : undefined) ??
    (key === "semibold" ? (source.bold ?? source.medium) : undefined) ??
    source.regular;
  // Android'de ayrı ağırlık dosyası seçildiğinde sentetik kalınlaştırmayı önle.
  return Platform.OS === "android"
    ? { fontFamily: family, fontWeight: "normal" }
    : { fontFamily: family };
}

export function pickFont(fonts: NativeFonts, role: FontRole): FontFamilySource | undefined {
  if (role === "heading") return fonts.heading ?? fonts.body;
  if (role === "mono") return fonts.mono;
  return fonts.body;
}

export const DsText = React.forwardRef<RNText, DsTextProps>(function DsText(
  { fontRole, style, maxFontSizeMultiplier, role, accessibilityRole, ...rest },
  ref,
) {
  const { fonts } = useNativeTheme();
  const flat = StyleSheet.flatten(style) ?? {};
  const resolvedRole: FontRole =
    fontRole ??
    (role === "heading" || accessibilityRole === "header" ? "heading" : "body");
  const fontStyle = flat.fontFamily
    ? null
    : resolveFontStyle(pickFont(fonts, resolvedRole), flat.fontWeight);
  return (
    <RNText
      ref={ref}
      role={role}
      accessibilityRole={accessibilityRole}
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? DEFAULT_MAX_FONT_SCALE}
      {...rest}
      style={fontStyle ? [style, fontStyle] : style}
    />
  );
});
