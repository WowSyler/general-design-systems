/**
 * StatCard — tek metrik gösteren kart (etiket + büyük değer + opsiyonel delta).
 * Delta yönü renk + metin glifiyle (▲/▼/–) birlikte verilir; renk tek başına
 * sinyal değildir. Değer tabular rakamlarla hizalanır.
 */
import * as React from "react";
import { StyleSheet, View, Text as RNText } from "react-native";

import type { NativeTheme } from "@ds/tokens/native";

import { Card, type CardProps } from "./Card";
import { useNativeTheme } from "../theme/ThemeProvider";

export type StatTrend = "up" | "down" | "neutral";

export interface StatDelta {
  /** Delta metni (ör. "+%12"). */
  value: string;
  /** Yön: up (olumlu), down (olumsuz), neutral. */
  trend: StatTrend;
}

export interface StatCardProps extends CardProps {
  /** Metrik etiketi. */
  label: string;
  /** Biçimlenmiş metrik değeri (ör. "1.248"). */
  value: string;
  /** Önceki döneme göre değişim. */
  delta?: StatDelta;
  /** Etiket satırının sağında gösterilecek ikon. */
  icon?: React.ReactNode;
}

const TREND_GLYPH: Record<StatTrend, string> = {
  up: "▲",
  down: "▼",
  neutral: "–",
};

function trendColor(theme: NativeTheme, trend: StatTrend): string {
  switch (trend) {
    case "up":
      return theme.colors.success;
    case "down":
      return theme.colors.destructive;
    case "neutral":
    default:
      return theme.colors.mutedForeground;
  }
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  style,
  ...rest
}: StatCardProps): React.JSX.Element {
  const { theme } = useNativeTheme();

  return (
    <Card {...rest} style={[{ rowGap: theme.space.xs }, style]}>
      <View style={styles.labelRow}>
        <RNText
          style={{
            fontSize: theme.fontSize["xs"] ?? 12,
            lineHeight: 16,
            fontWeight: "400",
            color: theme.colors.mutedForeground,
          }}
          numberOfLines={1}
        >
          {label}
        </RNText>
        {icon !== undefined && icon !== null ? <View>{icon}</View> : null}
      </View>

      <RNText
        style={{
          fontSize: 28,
          lineHeight: 34,
          fontWeight: "700",
          fontVariant: ["tabular-nums"],
          color: theme.colors.foreground,
        }}
        numberOfLines={1}
      >
        {value}
      </RNText>

      {delta !== undefined ? (
        <RNText
          accessibilityLabel={`Değişim: ${delta.value}`}
          style={{
            fontSize: theme.fontSize["sm"] ?? 14,
            fontWeight: "600",
            fontVariant: ["tabular-nums"],
            color: trendColor(theme, delta.trend),
          }}
          numberOfLines={1}
        >
          {`${TREND_GLYPH[delta.trend]} ${delta.value}`}
        </RNText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
