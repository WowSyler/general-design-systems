/**
 * Chip — seçilebilir hap (pill) filtre/etiket bileşeni.
 * Seçili değilken colors.muted zemin + colors.foreground metin; seçiliyken
 * colors.primary zemin + colors.primaryForeground metin. accessibilityState
 * ile seçim durumu bildirilir; hitSlop ile dokunma hedefi 44pt'ye tamamlanır.
 */
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Text as RNText,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET } from "@ds/tokens/native";

import { useNativeTheme } from "../theme/ThemeProvider";

const CHIP_MIN_HEIGHT = 32;

export interface ChipProps extends Omit<PressableProps, "children" | "style"> {
  /** Chip metni. */
  label: string;
  /** Seçili durum. */
  selected?: boolean;
  /** Metnin solunda gösterilecek ikon. */
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Chip({
  label,
  selected = false,
  icon,
  onPress,
  style,
  accessibilityLabel,
  ...rest
}: ChipProps): React.JSX.Element {
  const { theme } = useNativeTheme();

  const backgroundColor = selected ? theme.colors.primary : theme.colors.muted;
  const textColor = selected
    ? theme.colors.primaryForeground
    : theme.colors.foreground;

  // 32pt yükseklik → 44pt dokunma hedefi için 6pt hitSlop.
  const slop = (MIN_TOUCH_TARGET - CHIP_MIN_HEIGHT) / 2;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      disabled={onPress === undefined || onPress === null}
      hitSlop={slop}
      {...rest}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderRadius: theme.radius.pill,
          paddingHorizontal: theme.space.md,
          columnGap: theme.space.xs,
        },
        pressed ? styles.pressed : null,
        style,
      ]}
    >
      {icon !== undefined && icon !== null ? <View>{icon}</View> : null}
      <RNText
        style={{
          color: textColor,
          fontSize: theme.fontSize["sm"] ?? 14,
          fontWeight: "500",
        }}
        numberOfLines={1}
      >
        {label}
      </RNText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    minHeight: CHIP_MIN_HEIGHT,
  },
  pressed: {
    opacity: 0.85,
  },
});
