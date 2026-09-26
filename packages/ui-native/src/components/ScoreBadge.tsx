/**
 * ScoreBadge — 0-max arası puanı hap (pill) rozet içinde gösterir (ör. 8.4/10).
 * Zemin colors.secondary; değer colors.primary, 700 ağırlık ve tabular rakamlarla
 * hizalı; "/max" bölümü daha küçük ve soluk. Ekran okuyucu için
 * "Skor: X / max" etiketi verilir.
 */
import * as React from "react";
import {
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

import { DsText as RNText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";

export interface ScoreBadgeProps extends ViewProps {
  /** Gösterilecek puan (bir ondalıkla yuvarlanır). */
  value: number;
  /** Üst sınır; varsayılan 10. */
  max?: number;
}

export function ScoreBadge({
  value,
  max = 10,
  style,
  ...rest
}: ScoreBadgeProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const display = value.toFixed(1);

  return (
    <View
      accessible
      
      aria-label={`Skor: ${display} / ${max}`}
      {...rest}
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.secondary,
          borderRadius: theme.radius.pill,
          paddingHorizontal: theme.space.md,
          paddingVertical: theme.space.xs,
        },
        style,
      ]}
    >
      <RNText
        style={{
          color: theme.colors.primary,
          fontSize: theme.fontSize["lg"] ?? 18,
          fontWeight: "700",
          fontVariant: ["tabular-nums"],
        }}
      >
        {display}
      </RNText>
      <RNText
        style={{
          color: theme.colors.mutedForeground,
          fontSize: theme.fontSize["xs"] ?? 12,
          fontWeight: "500",
          fontVariant: ["tabular-nums"],
        }}
      >
        {`/${max}`}
      </RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "baseline",
    alignSelf: "flex-start",
  },
});
