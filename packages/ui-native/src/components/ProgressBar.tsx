/**
 * ProgressBar — 0-100 arası değeri yatay çubukla gösteren ilerleme bileşeni.
 * Ray (track) colors.muted zeminli, dolgu (fill) ton rengiyle boyanır ve
 * değer değiştikçe genişliği Animated ile yumuşakça geçer. Opsiyonel etiket ve
 * "%NN" yüzde metni gösterilebilir. role="progressbar" +
 * aria-value* ile ekran okuyucuya sayısal değer bildirilir.
 * (Web tarafındaki Progress bileşeninden ayrışmak için ProgressBar adı kullanılır.)
 */
import * as React from "react";
import {
  Animated,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

import type { NativeTheme } from "@wowsyler/ds-tokens/native";

import { DsText as RNText } from "../internal/DsText";
import { useReducedMotion } from "../internal/useReducedMotion";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaValue } from "../internal/a11y";

export type ProgressBarTone =
  | "primary"
  | "success"
  | "warning"
  | "destructive"
  | "info";

export type ProgressBarSize = "sm" | "md" | "lg";

export interface ProgressBarProps extends ViewProps {
  /** 0-100 arası değer; aralık dışı değerler kırpılır. */
  value: number;
  /** Dolgu rengi tonu; varsayılan "primary". */
  tone?: ProgressBarTone;
  /** Ray kalınlığı: sm(4) / md(8) / lg(12); varsayılan "md". */
  size?: ProgressBarSize;
  /** Rayın üstünde gösterilecek opsiyonel etiket. */
  label?: string;
  /** Sağda "%NN" metni gösterilsin mi; varsayılan false. */
  showValue?: boolean;
  /** Değişimde genişlik animasyonunun süresi (ms); varsayılan 400. */
  animationDuration?: number;
}

const SIZE_HEIGHT: Record<ProgressBarSize, number> = {
  sm: 4,
  md: 8,
  lg: 12,
};

function toneColor(theme: NativeTheme, tone: ProgressBarTone): string {
  switch (tone) {
    case "success":
      return theme.colors.success;
    case "warning":
      return theme.colors.warning;
    case "destructive":
      return theme.colors.destructive;
    case "info":
      return theme.colors.info;
    case "primary":
    default:
      return theme.colors.primary;
  }
}

export function ProgressBar({
  value,
  tone = "primary",
  size = "md",
  label,
  showValue = false,
  animationDuration = 400,
  style,
  accessibilityLabel,
  ...rest
}: ProgressBarProps): React.JSX.Element {
  const { theme } = useNativeTheme();

  const clamped = Math.min(100, Math.max(0, value));
  const fillColor = toneColor(theme, tone);
  const trackHeight = SIZE_HEIGHT[size];

  const progress = React.useRef(new Animated.Value(clamped)).current;
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (reducedMotion) {
      progress.setValue(clamped);
      return undefined;
    }
    const animation = Animated.timing(progress, {
      toValue: clamped,
      duration: animationDuration,
      // Genişlik animasyonu düzen (layout) etkilediğinden yerel sürücü kullanılamaz.
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [clamped, animationDuration, progress, reducedMotion]);

  const fillWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const hasHeader = label !== undefined || showValue;

  return (
    <View
      role="progressbar"
      aria-label={accessibilityLabel ?? label ?? "İlerleme"}
      {...ariaValue({ min: 0, max: 100, now: Math.round(clamped) })}
      {...rest}
      style={[{ rowGap: theme.space.xs }, style]}
    >
      {hasHeader ? (
        <View style={styles.header}>
          {label !== undefined ? (
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
          ) : (
            <View />
          )}
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
      ) : null}

      <View
        style={[
          styles.track,
          {
            height: trackHeight,
            backgroundColor: theme.colors.muted,
            borderRadius: theme.radius.pill,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              width: fillWidth,
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
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
