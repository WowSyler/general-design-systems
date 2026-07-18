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

import { useNativeTheme } from "../theme/ThemeProvider";

export type CardElevation = "none" | "low" | "medium";

export interface CardProps extends ViewProps {
  /** Gölge önayarı; varsayılan "low". */
  elevation?: CardElevation;
}

/** Gölge önayarları — shadowColor "#000000" bu presetlerde serbesttir. */
export const ELEVATION_PRESETS: Record<CardElevation, ViewStyle> = {
  none: {},
  low: {
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  medium: {
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
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
        ELEVATION_PRESETS[elevation],
        style,
      ]}
    >
      {children}
    </View>
  );
}
