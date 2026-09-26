/**
 * MetricBar — 0-100 arası değeri yatay çubukla gösteren ilerleme/metric bileşeni.
 * Ray: 8pt yükseklik, colors.muted, pill yarıçap; dolgu genişliği %değer.
 * role="progressbar" + aria-value* ile ekran okuyucuya
 * sayısal değer bildirilir; showValue ile "%NN" metni de gösterilir.
 */
import * as React from "react";
import {
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

import type { NativeTheme } from "@wowsyler/ds-tokens/native";

import { DsText as RNText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaValue } from "../internal/a11y";

export type MetricTone = "primary" | "success" | "warning" | "destructive";

export interface MetricBarProps extends ViewProps {
  /** Metrik etiketi. */
  label: string;
  /** 0-100 arası değer; aralık dışı değerler kırpılır. */
  value: number;
  /** Dolgu rengi tonu; varsayılan "primary". */
  tone?: MetricTone;
  /** Sağda "%NN" metni gösterilsin mi; varsayılan true. */
  showValue?: boolean;
}

function toneColor(theme: NativeTheme, tone: MetricTone): string {
  switch (tone) {
    case "success":
      return theme.colors.success;
    case "warning":
      return theme.colors.warning;
    case "destructive":
      return theme.colors.destructive;
    case "primary":
    default:
      return theme.colors.primary;
  }
}

export function MetricBar({
  label,
  value,
  tone = "primary",
  showValue = true,
  style,
  ...rest
}: MetricBarProps): React.JSX.Element {
  const { theme } = useNativeTheme();

  const clamped = Math.min(100, Math.max(0, value));
  const fillColor = toneColor(theme, tone);

  return (
    <View
      role="progressbar"
      aria-label={label}
      {...ariaValue({ min: 0, max: 100, now: clamped })}
      {...rest}
      style={[{ rowGap: theme.space.xs }, style]}
    >
      <View style={styles.header}>
        <RNText
          style={{
            fontSize: theme.fontSize["sm"] ?? 14,
            fontWeight: "500",
            color: theme.colors.foreground,
          }}
          numberOfLines={1}
        >
          {label}
        </RNText>
        {showValue ? (
          <RNText
            style={{
              fontSize: theme.fontSize["sm"] ?? 14,
              fontWeight: "600",
              fontVariant: ["tabular-nums"],
              color: theme.colors.mutedForeground,
            }}
          >
            {`%${Math.round(clamped)}`}
          </RNText>
        ) : null}
      </View>

      <View
        style={[
          styles.track,
          {
            backgroundColor: theme.colors.muted,
            borderRadius: theme.radius.pill,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clamped}%`,
              backgroundColor: fillColor,
              borderRadius: theme.radius.pill,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  track: {
    height: 8,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
