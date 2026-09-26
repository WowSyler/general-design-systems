/**
 * TimeSlotPicker — randevu saat dilimi seçici (Randevu, GlowScan danışan).
 * Dilimler hap butonlar ızgarasında; dolu/geçmiş dilimler devre dışı ve üstü
 * çizili. `sections` ile "Sabah / Öğleden sonra / Akşam" gruplanabilir.
 * Sütun sayısı telefonda 3, tablette 5.
 */
import * as React from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { resolveResponsiveValue, useBreakpoint, type ResponsiveValue } from "../hooks/useBreakpoint";
import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

export interface TimeSlot {
  /** Değer (ör. "09:30"). */
  value: string;
  /** Görünen etiket; varsayılan value. */
  label?: string;
  disabled?: boolean;
}

export interface TimeSlotSection {
  title: string;
  slots: TimeSlot[];
}

export interface TimeSlotPickerProps {
  /** Düz dilim listesi (sections yoksa). */
  slots?: TimeSlot[];
  sections?: TimeSlotSection[];
  value: string | null;
  onValueChange: (value: string) => void;
  columns?: number | ResponsiveValue<number>;
  /** Hiç uygun dilim yokken gösterilecek metin. */
  emptyText?: string;
  style?: StyleProp<ViewStyle>;
}

export function TimeSlotPicker({
  slots,
  sections,
  value,
  onValueChange,
  columns = { base: 3, md: 5 },
  emptyText = "Bu gün için uygun saat yok.",
  style,
}: TimeSlotPickerProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const { breakpoint } = useBreakpoint();
  const count = Math.max(1, typeof columns === "number" ? columns : (resolveResponsiveValue(columns, breakpoint) ?? 3));
  const groups: TimeSlotSection[] = sections ?? [{ title: "", slots: slots ?? [] }];
  const total = groups.reduce((n, g) => n + g.slots.length, 0);
  const gap = theme.space.sm;

  if (total === 0) {
    return (
      <View style={[{ padding: theme.space.lg }, style]}>
        <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14, textAlign: "center" }}>
          {emptyText}
        </DsText>
      </View>
    );
  }

  return (
    <View style={[{ rowGap: theme.space.lg }, style]}>
      {groups.map((group) => (
        <View key={group.title || "all"} style={{ rowGap: theme.space.sm }}>
          {group.title ? (
            <DsText role="heading" style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["xs"] ?? 12, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase" }}>
              {group.title}
            </DsText>
          ) : null}
          <View
            role="radiogroup"
            aria-label={group.title || "Saat"}
            style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -gap / 2, rowGap: gap }}
          >
            {group.slots.map((slot) => {
              const selected = slot.value === value;
              const disabled = slot.disabled === true;
              return (
                <View key={slot.value} style={{ width: `${100 / count}%`, paddingHorizontal: gap / 2 }}>
                  <Pressable
                    role="radio"
                    aria-label={`${slot.label ?? slot.value}${disabled ? ", dolu" : ""}`}
                    {...ariaState({ checked: selected, disabled })}
                    disabled={disabled}
                    onPress={() => onValueChange(slot.value)}
                    style={({ pressed }) => [
                      styles.slot,
                      {
                        minHeight: MIN_TOUCH_TARGET,
                        borderRadius: theme.radius.md,
                        borderWidth: selected ? 0 : StyleSheet.hairlineWidth,
                        borderColor: theme.colors.border,
                        backgroundColor: selected ? theme.colors.primary : disabled ? theme.colors.muted : theme.colors.card,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <DsText
                      style={{
                        color: selected ? theme.colors.primaryForeground : disabled ? theme.colors.mutedForeground : theme.colors.foreground,
                        fontSize: theme.fontSize["sm"] ?? 14,
                        fontWeight: selected ? "700" : "500",
                        fontVariant: ["tabular-nums"],
                        textDecorationLine: disabled ? "line-through" : "none",
                      }}
                    >
                      {slot.label ?? slot.value}
                    </DsText>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  slot: { alignItems: "center", justifyContent: "center" },
});
