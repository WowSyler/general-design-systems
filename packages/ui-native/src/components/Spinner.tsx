/**
 * Spinner — tema renkli yükleme göstergesi (ActivityIndicator). Ton: primary
 * (varsayılan), muted, foreground ya da onPrimary (dolu buton üstü). Opsiyonel
 * etiket yanında gösterilir ve ekran okuyucuya "meşgul" olarak bildirilir.
 */
import * as React from "react";
import { ActivityIndicator, View, type ViewProps } from "react-native";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

export type SpinnerTone = "primary" | "muted" | "foreground" | "onPrimary";

export interface SpinnerProps extends ViewProps {
  size?: "small" | "large";
  tone?: SpinnerTone;
  /** Görünür etiket (ör. "Yükleniyor…"). */
  label?: string;
}

export function Spinner({
  size = "small",
  tone = "primary",
  label,
  style,
  accessibilityLabel,
  ...rest
}: SpinnerProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const color =
    tone === "muted"
      ? theme.colors.mutedForeground
      : tone === "foreground"
        ? theme.colors.foreground
        : tone === "onPrimary"
          ? theme.colors.primaryForeground
          : theme.colors.primary;

  return (
    <View
      accessible
      role="progressbar"
      aria-label={accessibilityLabel ?? label ?? "Yükleniyor"}
      {...ariaState({ busy: true })}
      {...rest}
      style={[{ flexDirection: "row", alignItems: "center", columnGap: theme.space.sm }, style]}
    >
      <View aria-hidden importantForAccessibility="no-hide-descendants">
        <ActivityIndicator size={size} color={color} />
      </View>
      {label !== undefined ? (
        <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14 }}>
          {label}
        </DsText>
      ) : null}
    </View>
  );
}
