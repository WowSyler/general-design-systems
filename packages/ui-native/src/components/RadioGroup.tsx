/**
 * RadioGroup — tek seçimli seçenek listesi. Her seçenek başlık + opsiyonel
 * açıklama taşır; tüm satır dokunulabilir (≥ 44pt). `variant="card"` seçenekleri
 * çerçeveli kart olarak gösterir (plan/teslimat seçimi). Yön: dikey ya da yatay.
 */
import * as React from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { withAlpha } from "../internal/color";
import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

export interface RadioOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
  /** Sonda gösterilecek düğüm (fiyat, rozet vb.). */
  trailing?: React.ReactNode;
}

export interface RadioGroupProps<T extends string = string> {
  options: ReadonlyArray<RadioOption<T>>;
  value: T | null;
  onValueChange: (value: T) => void;
  orientation?: "vertical" | "horizontal";
  variant?: "plain" | "card";
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function RadioGroup<T extends string = string>({
  options,
  value,
  onValueChange,
  orientation = "vertical",
  variant = "plain",
  disabled = false,
  accessibilityLabel,
  style,
}: RadioGroupProps<T>): React.JSX.Element {
  const { theme } = useNativeTheme();
  const isCard = variant === "card";

  return (
    <View
      role="radiogroup"
      aria-label={accessibilityLabel}
      style={[
        orientation === "horizontal"
          ? { flexDirection: "row", flexWrap: "wrap", columnGap: theme.space.lg, rowGap: theme.space.sm }
          : { rowGap: isCard ? theme.space.sm : 0 },
        style,
      ]}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        const isDisabled = disabled || opt.disabled === true;
        return (
          <Pressable
            key={opt.value}
            role="radio"
            aria-label={opt.description ? `${opt.label}, ${opt.description}` : opt.label}
            {...ariaState({ checked: selected, disabled: isDisabled })}
            disabled={isDisabled}
            onPress={() => onValueChange(opt.value)}
            style={({ pressed }) => [
              styles.row,
              { columnGap: theme.space.md, minHeight: MIN_TOUCH_TARGET },
              isCard
                ? {
                    padding: theme.space.md,
                    borderRadius: theme.radius.lg,
                    borderWidth: selected ? 2 : StyleSheet.hairlineWidth,
                    borderColor: selected ? theme.colors.primary : theme.colors.border,
                    backgroundColor: selected ? withAlpha(theme.colors.primary, 0.06) : theme.colors.card,
                  }
                : { paddingVertical: theme.space.xs },
              isDisabled ? styles.disabled : null,
              pressed && !isDisabled ? styles.pressed : null,
            ]}
          >
            <View
              style={[
                styles.outer,
                { borderColor: selected ? theme.colors.primary : theme.colors.input },
              ]}
            >
              {selected ? <View style={[styles.inner, { backgroundColor: theme.colors.primary }]} /> : null}
            </View>
            <View style={{ flex: orientation === "vertical" ? 1 : undefined, rowGap: 2 }}>
              <DsText style={{ color: theme.colors.foreground, fontSize: theme.fontSize["base"] ?? 16, fontWeight: isCard ? "600" : "400" }}>
                {opt.label}
              </DsText>
              {opt.description !== undefined ? (
                <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14, lineHeight: 18 }}>
                  {opt.description}
                </DsText>
              ) : null}
            </View>
            {opt.trailing}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  outer: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  inner: { width: 10, height: 10, borderRadius: 5 },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.7 },
});
