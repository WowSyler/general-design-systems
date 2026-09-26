/**
 * Checkbox — onay kutusu. Pressable kare kutu; işaretli durumda zemin primary
 * olur ve içinde tik glifi (✓) primaryForeground rengiyle gösterilir. Kontrollü
 * bileşen: value + onValueChange. Opsiyonel etiket kutunun sağında yer alır.
 * Kutu + etiket tek Pressable'dır (tek denetim); satır en az MIN_TOUCH_TARGET
 * (44pt) yükseklik ve genişliktedir — etikete basmak da değeri değiştirir, küçük
 * kutu ayrı bir dokunma hedefi oluşturmaz. Erişilebilirlik: role="checkbox" +
 * checked durumu.
 */
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET, type NativeTheme } from "@wowsyler/ds-tokens/native";

import { DsText as RNText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps {
  /** İşaretli mi (kontrollü değer). */
  value: boolean;
  /** Değer değiştiğinde yeni değeri döndürür. */
  onValueChange: (value: boolean) => void;
  /** Kutunun sağında gösterilecek etiket metni. */
  label?: string;
  /** Boyut; varsayılan "md" (20pt kutu). */
  size?: CheckboxSize;
  /** Devre dışı — dokunulamaz, opaklık düşer. */
  disabled?: boolean;
  /** Erişilebilirlik etiketi; verilmezse label kullanılır. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const SIZE_BOX: Record<CheckboxSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

const SIZE_GLYPH: Record<CheckboxSize, number> = {
  sm: 11,
  md: 14,
  lg: 17,
};

function labelFontSize(theme: NativeTheme, size: CheckboxSize): number {
  switch (size) {
    case "sm":
      return theme.fontSize["sm"] ?? 14;
    case "lg":
      return theme.fontSize["lg"] ?? 18;
    case "md":
    default:
      return theme.fontSize["base"] ?? 16;
  }
}

export function Checkbox({
  value,
  onValueChange,
  label,
  size = "md",
  disabled = false,
  accessibilityLabel,
  style,
}: CheckboxProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const box = SIZE_BOX[size];

  const handlePress = React.useCallback(() => {
    onValueChange(!value);
  }, [onValueChange, value]);

  return (
    <Pressable
      role="checkbox"
      aria-label={accessibilityLabel ?? label}
      {...ariaState({ checked: value, disabled })}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        { columnGap: theme.space.sm },
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
        style,
      ]}
    >
      <View
        style={[
          styles.box,
          {
            width: box,
            height: box,
            borderRadius: theme.radius.sm,
            borderWidth: value ? 0 : StyleSheet.hairlineWidth * 2,
            borderColor: theme.colors.input,
            backgroundColor: value ? theme.colors.primary : "transparent",
          },
        ]}
      >
        {value ? (
          <RNText
            style={{
              color: theme.colors.primaryForeground,
              fontSize: SIZE_GLYPH[size],
              fontWeight: "700",
              lineHeight: box,
            }}
          >
            {"✓"}
          </RNText>
        ) : null}
      </View>

      {label !== undefined && label !== "" ? (
        <RNText
          style={{
            color: theme.colors.foreground,
            fontSize: labelFontSize(theme, size),
            fontWeight: "400",
          }}
        >
          {label}
        </RNText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    minHeight: MIN_TOUCH_TARGET,
    minWidth: MIN_TOUCH_TARGET,
  },
  box: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
});
