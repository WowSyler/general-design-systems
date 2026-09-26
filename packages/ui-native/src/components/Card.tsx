/**
 * Card — yüzey bileşeni. colors.card zemin, radius.lg köşe, hairline border
 * ve space.lg iç boşluk kullanır. Gölge önayarları GlowScan/Fisly konvansiyonu:
 * none / low (0.08, r8, y2, e2) / medium (0.12, r16, y6, e6).
 */
import * as React from "react";
import {
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { shadowStyle, type ShadowSpec } from "../internal/shadow";
import { useNativeTheme } from "../theme/ThemeProvider";

export type CardElevation = "none" | "low" | "medium";

export interface CardProps extends ViewProps {
  /** Gölge önayarı; varsayılan "low". */
  elevation?: CardElevation;
}

const ELEVATION_SPEC: Record<Exclude<CardElevation, "none">, Omit<ShadowSpec, "color">> = {
  low: { opacity: 0.08, radius: 8, offsetY: 2, elevation: 2 },
  medium: { opacity: 0.12, radius: 16, offsetY: 6, elevation: 6 },
};

/** Temanın tonlu gölge rengiyle yükselti stili (web'de boxShadow, native'de shadow*). */
export function elevationStyle(elevation: CardElevation, color: string): ViewStyle {
  return elevation === "none" ? {} : shadowStyle({ color, ...ELEVATION_SPEC[elevation] });
}

/**
 * Gölge önayarları (nötr siyah). Geriye dönük uyumluluk için korunur; tema
 * içinde `elevationStyle(level, theme.colors.shadowColor)` tercih edin.
 */
export const ELEVATION_PRESETS: Record<CardElevation, ViewStyle> = {
  none: {},
  low: elevationStyle("low", "#000000"),
  medium: elevationStyle("medium", "#000000"),
};

export function Card({
  elevation = "low",
  style,
  children,
  ...rest
}: CardProps): React.JSX.Element {
  const { theme } = useNativeTheme();

  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.border,
          padding: theme.space.lg,
        },
        elevationStyle(elevation, theme.colors.shadowColor),
        style,
      ]}
    >
      {children}
    </View>
  );
}
