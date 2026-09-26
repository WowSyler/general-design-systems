/**
 * StatusChip — nokta + etiketli durum hapı (sipariş/senkron/randevu durumu).
 * Tonlar: success, warning, destructive, info, neutral, pending. Renk tek başına
 * sinyal değildir; etiket her zaman görünür. `pulse` ile canlı durum noktası
 * yanıp söner (hareketi azalt açıkken sabit).
 */
import * as React from "react";
import { Animated, View, type StyleProp, type ViewStyle } from "react-native";

import type { NativeTheme } from "@wowsyler/ds-tokens/native";

import { withAlpha } from "../internal/color";
import { DsText } from "../internal/DsText";
import { USE_NATIVE_DRIVER, useReducedMotion } from "../internal/useReducedMotion";
import { useNativeTheme } from "../theme/ThemeProvider";

export type StatusTone = "success" | "warning" | "destructive" | "info" | "neutral" | "pending";

export interface StatusChipProps {
  label: string;
  tone?: StatusTone;
  /** Canlı durum göstergesi (nokta nabız atar). */
  pulse?: boolean;
  size?: "sm" | "md";
  style?: StyleProp<ViewStyle>;
}

export function statusColor(theme: NativeTheme, tone: StatusTone): string {
  switch (tone) {
    case "success":
      return theme.colors.success;
    case "warning":
      return theme.colors.warning;
    case "destructive":
      return theme.colors.destructive;
    case "info":
      return theme.colors.info;
    case "pending":
      return theme.colors.primary;
    case "neutral":
    default:
      return theme.colors.mutedForeground;
  }
}

export function StatusChip({ label, tone = "neutral", pulse = false, size = "md", style }: StatusChipProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const reducedMotion = useReducedMotion();
  const color = statusColor(theme, tone);
  const opacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (!pulse || reducedMotion) {
      opacity.setValue(1);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: USE_NATIVE_DRIVER }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: USE_NATIVE_DRIVER }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reducedMotion, opacity]);

  const dot = size === "sm" ? 6 : 8;
  return (
    <View
      accessible
      
      aria-label={`Durum: ${label}`}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          columnGap: 6,
          paddingHorizontal: size === "sm" ? 8 : 10,
          height: size === "sm" ? 22 : 26,
          borderRadius: theme.radius.pill,
          backgroundColor: withAlpha(color, 0.12),
        },
        style,
      ]}
    >
      <Animated.View style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: color, opacity }} />
      <DsText style={{ color: tone === "neutral" ? theme.colors.foreground : color, fontSize: size === "sm" ? 11 : 12, fontWeight: "600" }}>
        {label}
      </DsText>
    </View>
  );
}
