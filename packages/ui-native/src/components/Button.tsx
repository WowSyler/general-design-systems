/**
 * Button — Pressable tabanlı buton bileşeni.
 * Varyantlar: primary/secondary/outline/ghost/destructive; boyutlar sm(36)/md(44)/lg(52).
 * Yükleme durumunda metin rengiyle eşleşen ActivityIndicator gösterir. Dış
 * Pressable dokunma kutusudur ve en az MIN_TOUCH_TARGET (44pt) yüksekliktedir;
 * görsel yüzey (zemin, kenarlık) içte boyut yüksekliğinde çizilir — sm (36)
 * görünümü değişmeden 44pt hedef sağlar. `style` dış kutuya uygulanır.
 */
import * as React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET, type NativeTheme } from "@wowsyler/ds-tokens/native";

import { DsText as RNText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<PressableProps, "children" | "style"> {
  /** Buton üzerinde gösterilecek metin. */
  title: string;
  /** Görsel varyant; varsayılan "primary". */
  variant?: ButtonVariant;
  /** Boyut; varsayılan "md" (44pt). */
  size?: ButtonSize;
  /** Yükleniyor durumu — metin yerine ActivityIndicator gösterilir. */
  loading?: boolean;
  /** Metnin solunda gösterilecek ikon. */
  leftIcon?: React.ReactNode;
  /** Metnin sağında gösterilecek ikon. */
  rightIcon?: React.ReactNode;
  /** Kapsayıcının tüm genişliğini kaplar. */
  fullWidth?: boolean;
  /** Hap (pill) köşe yarıçapı kullanır; aksi halde radius.md. */
  pill?: boolean;
  style?: StyleProp<ViewStyle>;
}

const SIZE_HEIGHT: Record<ButtonSize, number> = {
  sm: 36,
  md: 44,
  lg: 52,
};

interface VariantColors {
  background: string;
  text: string;
  borderColor?: string;
}

function variantColors(
  theme: NativeTheme,
  variant: ButtonVariant,
): VariantColors {
  const { colors } = theme;
  switch (variant) {
    case "secondary":
      return { background: colors.secondary, text: colors.secondaryForeground };
    case "outline":
      return {
        background: "transparent",
        text: colors.foreground,
        borderColor: colors.input,
      };
    case "ghost":
      return { background: "transparent", text: colors.foreground };
    case "destructive":
      return {
        background: colors.destructive,
        text: colors.destructiveForeground,
      };
    case "primary":
    default:
      return { background: colors.primary, text: colors.primaryForeground };
  }
}

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  pill = false,
  style,
  accessibilityLabel,
  ...rest
}: ButtonProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const palette = variantColors(theme, variant);
  const height = SIZE_HEIGHT[size];
  const isDisabled = disabled === true || loading;

  const fontSize =
    size === "sm"
      ? (theme.fontSize["sm"] ?? 14)
      : (theme.fontSize["base"] ?? 16);

  return (
    <Pressable
      role="button"
      aria-label={accessibilityLabel ?? title}
      {...ariaState({ disabled: isDisabled, busy: loading })}
      disabled={isDisabled}
      {...rest}
      style={[styles.target, fullWidth ? styles.fullWidth : null, style]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.face,
            {
              height,
              paddingHorizontal: size === "sm" ? theme.space.md : theme.space.lg,
              borderRadius: pill ? theme.radius.pill : theme.radius.md,
              backgroundColor: palette.background,
              columnGap: theme.space.sm,
            },
            palette.borderColor !== undefined
              ? {
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: palette.borderColor,
                }
              : null,
            isDisabled ? styles.disabled : null,
            pressed && !isDisabled ? styles.pressed : null,
          ]}
        >
          {loading ? (
            // Durum butonun aria-busy'sinden okunur; gösterge dekoratiftir.
            <View aria-hidden importantForAccessibility="no-hide-descendants">
              <ActivityIndicator size="small" color={palette.text} />
            </View>
          ) : (
            <>
              {leftIcon !== undefined && leftIcon !== null ? (
                <View>{leftIcon}</View>
              ) : null}
              <RNText
                style={{ color: palette.text, fontSize, fontWeight: "600" }}
                numberOfLines={1}
              >
                {title}
              </RNText>
              {rightIcon !== undefined && rightIcon !== null ? (
                <View>{rightIcon}</View>
              ) : null}
            </>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Dokunma kutusu: görsel yüzeyi dikeyde ortalar, en az 44pt yükseklik.
  target: {
    alignSelf: "flex-start",
    justifyContent: "center",
    minHeight: MIN_TOUCH_TARGET,
  },
  face: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    alignSelf: "stretch",
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
});
