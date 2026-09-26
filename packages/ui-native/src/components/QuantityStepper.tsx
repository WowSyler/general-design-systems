/**
 * QuantityStepper — − değer + adım denetimi (sepet adedi, kişi sayısı).
 * Sınırlarda ilgili buton devre dışı kalır. −/+ butonlarının dokunma kutusu
 * 44pt'dir (görsel boyut aynı; `bleed` ile hap yüksekliği değişmez).
 * Erişilebilirlik: native'de değer kapsayıcısı "adjustable" (slider) rolünde,
 * increment/decrement eylemleriyle çalışır. Web'de bu eylemler desteklenmediği
 * için (klavyeyle ayarlanamayan bir slider yanıltıcı olur) değer, adıyla
 * birlikte değişimi duyuran bir durum bölgesidir (role="status"); ayarlama
 * −/+ butonlarıyla yapılır.
 */
import * as React from "react";
import {
  Platform,
  StyleSheet,
  View,
  type AccessibilityActionEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { IconButton } from "./IconButton";
import { ariaValue } from "../internal/a11y";

export interface QuantityStepperProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: "sm" | "md";
  disabled?: boolean;
  /** Ekran okuyucu etiketi (ör. "Adet"). */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function QuantityStepper({
  value,
  onValueChange,
  min = 0,
  max = 99,
  step = 1,
  size = "md",
  disabled = false,
  accessibilityLabel = "Adet",
  style,
}: QuantityStepperProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const canDec = !disabled && value - step >= min;
  const canInc = !disabled && value + step <= max;
  const set = (v: number) => onValueChange(Math.min(max, Math.max(min, v)));

  const onAction = (e: AccessibilityActionEvent) => {
    if (e.nativeEvent.actionName === "increment" && canInc) set(value + step);
    if (e.nativeEvent.actionName === "decrement" && canDec) set(value - step);
  };

  const valueA11y: ViewProps =
    Platform.OS === "web"
      ? { role: "status", "aria-live": "polite", "aria-label": accessibilityLabel }
      : {
          accessible: true,
          role: "slider",
          "aria-label": accessibilityLabel,
          ...ariaValue({ min, max, now: value }),
          accessibilityActions: [{ name: "increment" }, { name: "decrement" }],
          onAccessibilityAction: onAction,
        };

  const glyph = (ch: string) => ({ color }: { color: string }) => (
    <DsText allowFontScaling={false} style={{ color, fontSize: 20, lineHeight: 22, fontWeight: "500" }}>
      {ch}
    </DsText>
  );

  return (
    <View
      style={[
        styles.row,
        {
          borderRadius: theme.radius.pill,
          borderColor: theme.colors.input,
          backgroundColor: theme.colors.background,
          padding: 2,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <IconButton
        size={size === "sm" ? "sm" : "md"}
        bleed
        accessibilityLabel="Azalt"
        disabled={!canDec}
        onPress={() => set(value - step)}
        icon={glyph("−")}
      />
      <View
        {...valueA11y}
        // Butonların taşan dokunma alanını yutmasın: dokunuşlar alttaki butona geçer.
        style={{ minWidth: size === "sm" ? 28 : 36, alignItems: "center", pointerEvents: "none" }}
      >
        <DsText style={{ color: theme.colors.foreground, fontSize: theme.fontSize["base"] ?? 16, fontWeight: "600", fontVariant: ["tabular-nums"] }}>
          {value}
        </DsText>
      </View>
      <IconButton
        size={size === "sm" ? "sm" : "md"}
        bleed
        accessibilityLabel="Artır"
        disabled={!canInc}
        onPress={() => set(value + step)}
        icon={glyph("+")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
