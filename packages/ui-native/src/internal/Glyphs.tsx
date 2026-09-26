/**
 * Kütüphane içi küçük glifler — ikon bağımlılığı eklemeden tema renkli,
 * yön (RTL) duyarlı işaretler. Tüketiciler kendi ikon setlerini slot'larla verir.
 */
import * as React from "react";
import { StyleSheet, View } from "react-native";

import { useIsRTL } from "../theme/ThemeProvider";
import { DsText } from "./DsText";

export type ChevronDirection = "forward" | "back" | "up" | "down";

/**
 * Yön oku: "forward"/"back" yazı yönüne göre aynalanır (LTR'de forward → ›,
 * RTL'de forward → ‹). Dekoratiftir; ekran okuyucudan gizlenir.
 */
export function Chevron({
  direction = "forward",
  color,
  size = 20,
}: {
  direction?: ChevronDirection;
  color: string;
  size?: number;
}): React.JSX.Element {
  const isRTL = useIsRTL();
  let glyph: string;
  switch (direction) {
    case "up":
      glyph = "⌃";
      break;
    case "down":
      glyph = "⌄";
      break;
    case "back":
      glyph = isRTL ? "›" : "‹";
      break;
    case "forward":
    default:
      glyph = isRTL ? "‹" : "›";
  }
  const vertical = direction === "up" || direction === "down";
  return (
    <DsText
      accessible={false}
      aria-hidden
      importantForAccessibility="no"
      allowFontScaling={false}
      style={{
        color,
        fontSize: vertical ? size * 0.9 : size * 1.2,
        lineHeight: size * 1.2,
        fontWeight: "400",
        textAlign: "center",
        minWidth: size * 0.6,
      }}
    >
      {glyph}
    </DsText>
  );
}

/** Büyüteç — iki View ile çizilir (daire + sap). */
export function SearchGlyph({
  color,
  size = 18,
}: {
  color: string;
  size?: number;
}): React.JSX.Element {
  const ring = Math.round(size * 0.72);
  const stroke = Math.max(1.5, Math.round(size * 0.11));
  return (
    <View
      aria-hidden
      importantForAccessibility="no"
      style={{ width: size, height: size }}
    >
      <View
        style={{
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          borderWidth: stroke,
          borderColor: color,
        }}
      />
      <View
        style={[
          styles.handle,
          {
            width: stroke,
            height: Math.round(size * 0.4),
            backgroundColor: color,
            borderRadius: stroke,
            top: ring - stroke,
            left: ring - stroke,
          },
        ]}
      />
    </View>
  );
}

/** Kapat/temizle çarpısı. */
export function CloseGlyph({
  color,
  size = 16,
}: {
  color: string;
  size?: number;
}): React.JSX.Element {
  return (
    <DsText
      accessible={false}
      aria-hidden
      importantForAccessibility="no"
      allowFontScaling={false}
      style={{ color, fontSize: size, lineHeight: size + 2, fontWeight: "600" }}
    >
      ✕
    </DsText>
  );
}

const styles = StyleSheet.create({
  handle: {
    position: "absolute",
    transform: [{ rotate: "-45deg" }],
  },
});
