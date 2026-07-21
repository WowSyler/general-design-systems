/**
 * Checkbox — onay kutusu. Pressable kare kutu; işaretli durumda zemin primary
 * olur ve içinde tik glifi (✓) primaryForeground rengiyle gösterilir. Kontrollü
 * bileşen: value + onValueChange. Opsiyonel etiket kutunun sağında yer alır.
 * Dokunma hedefi kutu 44pt'dan küçük olduğundan hitSlop ile MIN_TOUCH_TARGET'a
 * telafi edilir. Erişilebilirlik: accessibilityRole="checkbox" + checked durumu.
 */
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  Text as RNText,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET, type NativeTheme } from "@ds/tokens/native";

import { useNativeTheme } from "../theme/ThemeProvider";

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

  // Kutu 44pt altında; hitSlop ile dokunma hedefini MIN_TOUCH_TARGET'a taşı.
  const slop = box < MIN_TOUCH_TARGET ? (MIN_TOUCH_TARGET - box) / 2 : 0;

  const handlePress = React.useCallback(() => {
    onValueChange(!value);
  }, [onValueChange, value]);

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={slop > 0 ? slop : undefined}
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
    alignSelf: "flex-start",
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
