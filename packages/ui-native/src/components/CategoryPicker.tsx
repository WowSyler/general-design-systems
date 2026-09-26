/**
 * CategoryPicker — ikonlu kategori döşemeleri ızgarası (Fisly harcama kategorisi,
 * Dolap kategori seçimi). Tek seçim; seçili döşeme primary çerçeve + tonlu zemin.
 * Sütun sayısı telefonda 4, tablette 6 (kırılım haritasıyla değiştirilebilir).
 * Her kategori opsiyonel `color` (tema chart tokenı önerilir) taşıyabilir.
 */
import * as React from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { resolveResponsiveValue, useBreakpoint, type ResponsiveValue } from "../hooks/useBreakpoint";
import { withAlpha } from "../internal/color";
import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

export interface CategoryOption<T extends string = string> {
  value: T;
  label: string;
  /** İkon düğümü (ör. emoji ya da vektör ikon). */
  icon?: React.ReactNode;
  /** Döşeme vurgu rengi; verilmezse primary. */
  color?: string;
  disabled?: boolean;
}

export interface CategoryPickerProps<T extends string = string> {
  options: ReadonlyArray<CategoryOption<T>>;
  value: T | null;
  onValueChange: (value: T) => void;
  columns?: number | ResponsiveValue<number>;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function CategoryPicker<T extends string = string>({
  options,
  value,
  onValueChange,
  columns = { base: 4, md: 6 },
  accessibilityLabel = "Kategori",
  style,
}: CategoryPickerProps<T>): React.JSX.Element {
  const { theme } = useNativeTheme();
  const { breakpoint } = useBreakpoint();
  const count = Math.max(1, typeof columns === "number" ? columns : (resolveResponsiveValue(columns, breakpoint) ?? 4));
  const gap = theme.space.sm;

  return (
    <View
      role="radiogroup"
      aria-label={accessibilityLabel}
      style={[{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -gap / 2, rowGap: gap }, style]}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        const tone = opt.color ?? theme.colors.primary;
        const isDisabled = opt.disabled === true;
        return (
          <View key={opt.value} style={{ width: `${100 / count}%`, paddingHorizontal: gap / 2 }}>
            <Pressable
              role="radio"
              aria-label={opt.label}
              {...ariaState({ checked: selected, disabled: isDisabled })}
              disabled={isDisabled}
              onPress={() => onValueChange(opt.value)}
              style={({ pressed }) => [
                styles.tile,
                {
                  minHeight: MIN_TOUCH_TARGET + 28,
                  borderRadius: theme.radius.lg,
                  padding: theme.space.sm,
                  rowGap: theme.space.xs,
                  borderWidth: selected ? 2 : StyleSheet.hairlineWidth,
                  borderColor: selected ? tone : theme.colors.border,
                  backgroundColor: selected ? withAlpha(tone, 0.1) : theme.colors.card,
                  opacity: isDisabled ? 0.45 : pressed ? 0.75 : 1,
                },
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: withAlpha(tone, 0.16) }]}>
                {opt.icon ?? (
                  <DsText allowFontScaling={false} style={{ color: tone, fontWeight: "700", fontSize: 16 }}>
                    {opt.label.slice(0, 1).toLocaleUpperCase("tr-TR")}
                  </DsText>
                )}
              </View>
              <DsText
                numberOfLines={1}
                style={{
                  color: selected ? theme.colors.foreground : theme.colors.mutedForeground,
                  fontSize: theme.fontSize["xs"] ?? 12,
                  fontWeight: selected ? "600" : "500",
                  textAlign: "center",
                }}
              >
                {opt.label}
              </DsText>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: "center", justifyContent: "center" },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
});
