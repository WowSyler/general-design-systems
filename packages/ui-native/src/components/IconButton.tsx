/**
 * IconButton — yalnızca ikon içeren buton. Görsel boyut sm(32)/md(40)/lg(48);
 * gerçek dokunma kutusu (Pressable) her zaman ≥ MIN_TOUCH_TARGET (44pt), görsel
 * daire/kare içte ortalanır. `bleed` ile dokunma kutusu görselin dışına taşar
 * ama yerleşimde yalnızca görsel boyut kadar yer kaplar (sıkı yerleşimler için).
 * `accessibilityLabel` ZORUNLUDUR (ikon tek başına anlam taşımaz). Varyantlar:
 * ghost (varsayılan), soft, solid, outline.
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

import type { NativeTheme } from "@wowsyler/ds-tokens/native";

import { withAlpha } from "../internal/color";
import { touchOverhang, touchSize } from "../internal/touch";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState, pressedState } from "../internal/a11y";

export type IconButtonVariant = "ghost" | "soft" | "solid" | "outline";
export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonIconState {
  color: string;
  size: number;
}

export interface IconButtonProps
  extends Omit<PressableProps, "children" | "style" | "accessibilityLabel"> {
  /** İkon düğümü ya da renk/boyut alan render fonksiyonu. */
  icon: React.ReactNode | ((state: IconButtonIconState) => React.ReactNode);
  /** Ekran okuyucu etiketi — zorunlu. */
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Tehlikeli eylem tonu (sil vb.). */
  destructive?: boolean;
  /** Seçili/aktif durum (toggle kullanımında). */
  selected?: boolean;
  /**
   * Dokunma kutusu görsel kutunun dışına taşsın ama yerleşimde görsel boyut
   * kadar yer kaplasın (negatif margin). Alan içi temizle, kart köşesi gibi
   * sıkı yerleşimlerde görünümü değiştirmeden 44pt hedef sağlar.
   */
  bleed?: boolean;
  /** Dış dokunma kutusunun stili (yerleşim: margin, konum). */
  style?: StyleProp<ViewStyle>;
  /** Görsel kutunun (zemin, kenarlık, köşe) ek stili. */
  contentStyle?: StyleProp<ViewStyle>;
}

const BOX: Record<IconButtonSize, number> = { sm: 32, md: 40, lg: 48 };
const ICON: Record<IconButtonSize, number> = { sm: 16, md: 20, lg: 24 };

function palette(
  theme: NativeTheme,
  variant: IconButtonVariant,
  destructive: boolean,
  selected: boolean,
): { bg: string; fg: string; border?: string } {
  const { colors } = theme;
  const tone = destructive ? colors.destructive : colors.primary;
  const onTone = destructive ? colors.destructiveForeground : colors.primaryForeground;
  if (selected) return { bg: withAlpha(tone, 0.15), fg: tone };
  switch (variant) {
    case "solid":
      return { bg: tone, fg: onTone };
    case "soft":
      return { bg: withAlpha(tone, 0.12), fg: tone };
    case "outline":
      return { bg: "transparent", fg: destructive ? tone : colors.foreground, border: colors.input };
    case "ghost":
    default:
      return { bg: "transparent", fg: destructive ? tone : colors.foreground };
  }
}

export function IconButton({
  icon,
  accessibilityLabel,
  variant = "ghost",
  size = "md",
  destructive = false,
  selected,
  bleed = false,
  disabled,
  style,
  contentStyle,
  ...rest
}: IconButtonProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const box = BOX[size];
  const target = touchSize(box);
  const overhang = touchOverhang(box);
  const colors = palette(theme, variant, destructive, selected === true);
  const isDisabled = disabled === true;

  return (
    <Pressable
      role="button"
      aria-label={accessibilityLabel}
      {...ariaState({ disabled: isDisabled })}
      {...pressedState(selected)}
      disabled={isDisabled}
      {...rest}
      style={[
        styles.target,
        { width: target, height: target },
        bleed && overhang > 0 ? { margin: -overhang } : null,
        style,
      ]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.base,
            {
              width: box,
              height: box,
              borderRadius: variant === "solid" || variant === "soft" ? box / 2 : theme.radius.md,
              backgroundColor: pressed && colors.bg === "transparent" ? theme.colors.muted : colors.bg,
            },
            colors.border !== undefined
              ? { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border }
              : null,
            isDisabled ? styles.disabled : null,
            pressed && !isDisabled ? styles.pressed : null,
            contentStyle,
          ]}
        >
          {typeof icon === "function"
            ? icon({ color: colors.fg, size: ICON[size] })
            : icon}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    alignItems: "center",
    justifyContent: "center",
  },
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.8 },
});
