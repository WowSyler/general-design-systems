/**
 * Rating — yıldız puanı. Salt görüntü (yarım yıldız destekli, ör. 4.5) ya da
 * `onChange` verilirse etkileşimli (her yıldız ≥ 44pt dokunma hedefi,
 * "adjustable" rolü + artır/azalt eylemleri). Opsiyonel değerlendirme sayısı.
 * Yıldız sırası yazı yönünü izler.
 */
import * as React from "react";
import { Pressable, View, type AccessibilityActionEvent, type StyleProp, type ViewStyle } from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaValue } from "../internal/a11y";

export interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: number;
  /** Değerlendirme sayısı (ör. 128) — yanında "(128)" yazar. */
  count?: number;
  /** Sayısal değeri yıldızların yanında göster (ör. "4,5"). */
  showValue?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function Rating({
  value,
  onChange,
  max = 5,
  size = 18,
  count,
  showValue = false,
  accessibilityLabel = "Puan",
  style,
}: RatingProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const interactive = onChange !== undefined;
  const clamped = Math.max(0, Math.min(max, value));
  const filledColor = theme.colors.warning;
  const emptyColor = theme.colors.border;

  const onAction = (e: AccessibilityActionEvent) => {
    if (!onChange) return;
    if (e.nativeEvent.actionName === "increment") onChange(Math.min(max, Math.round(clamped) + 1));
    if (e.nativeEvent.actionName === "decrement") onChange(Math.max(1, Math.round(clamped) - 1));
  };

  const star = (i: number) => {
    const fill = Math.max(0, Math.min(1, clamped - i));
    return (
      <View key={i} style={{ width: size, height: size * 1.15, justifyContent: "center" }}>
        <DsText allowFontScaling={false} style={{ color: emptyColor, fontSize: size, lineHeight: size * 1.15 }}>★</DsText>
        {fill > 0 ? (
          <View style={{ position: "absolute", top: 0, bottom: 0, start: 0, width: `${fill * 100}%`, overflow: "hidden" }}>
            <DsText allowFontScaling={false} style={{ color: filledColor, fontSize: size, lineHeight: size * 1.15 }}>★</DsText>
          </View>
        ) : null}
      </View>
    );
  };

  const formatted = clamped.toLocaleString("tr-TR", { maximumFractionDigits: 1 });

  return (
    <View
      accessible
      role={interactive ? "slider" : undefined}
      aria-label={`${accessibilityLabel}: ${max} üzerinden ${formatted}${count !== undefined ? `, ${count} değerlendirme` : ""}`}
      {...ariaValue(interactive ? { min: 0, max, now: Math.round(clamped) } : undefined)}
      accessibilityActions={interactive ? [{ name: "increment" }, { name: "decrement" }] : undefined}
      onAccessibilityAction={interactive ? onAction : undefined}
      style={[{ flexDirection: "row", alignItems: "center", columnGap: interactive ? 0 : 2 }, style]}
    >
      {Array.from({ length: max }, (_, i) =>
        interactive ? (
          <Pressable
            key={i}
            accessible={false}
            onPress={() => onChange?.(i + 1)}
            style={{ minWidth: MIN_TOUCH_TARGET, minHeight: MIN_TOUCH_TARGET, alignItems: "center", justifyContent: "center" }}
          >
            {star(i)}
          </Pressable>
        ) : (
          star(i)
        ),
      )}
      {showValue ? (
        <DsText style={{ color: theme.colors.foreground, fontSize: theme.fontSize["sm"] ?? 14, fontWeight: "600", marginStart: 6, fontVariant: ["tabular-nums"] }}>
          {formatted}
        </DsText>
      ) : null}
      {count !== undefined ? (
        <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14, marginStart: 4 }}>{`(${count})`}</DsText>
      ) : null}
    </View>
  );
}
