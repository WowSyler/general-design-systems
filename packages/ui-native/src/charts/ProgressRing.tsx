/**
 * ProgressRing — dairesel ilerleme (GlowScan genel skor, Fisly tasarruf hedefi).
 * 0-100 değer; ton (primary/success/warning/destructive) ya da özel renk.
 * Ortada değer ve etiket. Ekran okuyucuya "progressbar" olarak bildirilir.
 */
import * as React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaValue } from "../internal/a11y";

export interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  tone?: "primary" | "success" | "warning" | "destructive";
  color?: string;
  /** Ortadaki değer metni; varsayılan "%NN". */
  valueText?: string;
  label?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth,
  tone = "primary",
  color,
  valueText,
  label,
  accessibilityLabel,
  style,
}: ProgressRingProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const clamped = Math.max(0, Math.min(100, value));
  const stroke = strokeWidth ?? Math.max(6, Math.round(size * 0.09));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const fill = color ?? theme.colors[tone];

  return (
    <View
      accessible
      role="progressbar"
      aria-label={accessibilityLabel ?? label ?? "İlerleme"}
      {...ariaValue({ min: 0, max: 100, now: Math.round(clamped) })}
      style={[{ width: size, height: size }, style]}
    >
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={theme.colors.muted} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={fill}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${(clamped / 100) * c} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ position: "absolute", top: 0, bottom: 0, start: 0, end: 0, alignItems: "center", justifyContent: "center" }}>
        <DsText fontRole="heading" style={{ color: theme.colors.foreground, fontSize: Math.round(size * 0.22), fontWeight: "700", fontVariant: ["tabular-nums"] }}>
          {valueText ?? `%${Math.round(clamped)}`}
        </DsText>
        {label !== undefined ? (
          <DsText numberOfLines={1} style={{ color: theme.colors.mutedForeground, fontSize: Math.max(10, Math.round(size * 0.1)) }}>{label}</DsText>
        ) : null}
      </View>
    </View>
  );
}
