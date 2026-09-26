/**
 * Chip — seçilebilir hap (pill) filtre/etiket bileşeni.
 * Seçili değilken colors.muted zemin + colors.foreground metin; seçiliyken
 * colors.primary zemin + colors.primaryForeground metin. aria-pressed (web) / selected (native)
 * ile seçim durumu bildirilir. Dış Pressable dokunma kutusu en az
 * MIN_TOUCH_TARGET (44pt) yüksekliktedir; 32pt'lik hap yüzey içte ortalanır.
 * `style` dış kutuya uygulanır.
 */
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { DsText as RNText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState, pressedState } from "../internal/a11y";

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
  const interactive = onPress !== undefined && onPress !== null;

  return (
    <Pressable
      role={interactive ? "button" : undefined}
      aria-label={accessibilityLabel ?? label}
      {...ariaState({ disabled: rest.disabled === true })}
      {...pressedState(interactive ? selected : undefined)}
      onPress={onPress}
      disabled={!interactive}
      {...rest}
      style={[styles.target, interactive ? styles.touch : null, style]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.base,
            {
              backgroundColor,
              borderRadius: theme.radius.pill,
              paddingHorizontal: theme.space.md,
              columnGap: theme.space.xs,
            },
            pressed ? styles.pressed : null,
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
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  touch: { minHeight: MIN_TOUCH_TARGET },
  base: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: CHIP_MIN_HEIGHT,
  },
  pressed: {
    opacity: 0.85,
  },
});
