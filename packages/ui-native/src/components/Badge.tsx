/**
 * Badge — durum rozeti. Solid modda zemin = varyant rengi, metin = onColor;
 * soft modda zemin varyant renginin %15 alfa hali, metin varyant rengi.
 * Rozet her zaman metin gösterir — renk tek başına sinyal değildir.
 */
import * as React from "react";
import {
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

import type { NativeTheme } from "@wowsyler/ds-tokens/native";

import { withAlpha } from "../internal/color";
import { DsText as RNText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "info"
  | "destructive";

export interface BadgeProps extends ViewProps {
  /** Rozet metni — zorunlu; renk tek başına sinyal olamaz. */
  label: string;
  /** Renk varyantı; varsayılan "default" (primary). */
  variant?: BadgeVariant;
  /** Yumuşak stil: %15 alfa zemin + renkli metin. */
  soft?: boolean;
  /** Metnin solunda gösterilecek ikon. */
  icon?: React.ReactNode;
}


interface BadgeColors {
  color: string;
  onColor: string;
}

function variantColors(theme: NativeTheme, variant: BadgeVariant): BadgeColors {
  const { colors } = theme;
  switch (variant) {
    case "secondary":
      return { color: colors.secondary, onColor: colors.secondaryForeground };
    case "success":
      return { color: colors.success, onColor: colors.successForeground };
    case "warning":
      return { color: colors.warning, onColor: colors.warningForeground };
    case "info":
      return { color: colors.info, onColor: colors.infoForeground };
    case "destructive":
      return {
        color: colors.destructive,
        onColor: colors.destructiveForeground,
      };
    case "default":
    default:
      return { color: colors.primary, onColor: colors.primaryForeground };
  }
}

export function Badge({
  label,
  variant = "default",
  soft = false,
  icon,
  style,
  ...rest
}: BadgeProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const { color, onColor } = variantColors(theme, variant);

  const backgroundColor = soft ? withAlpha(color, 0.15) : color;
  const textColor = soft ? color : onColor;

  return (
    <View
      accessible
      
      aria-label={label}
      {...rest}
      style={[
        styles.base,
        {
          backgroundColor,
          borderRadius: theme.radius.pill,
          paddingHorizontal: theme.space.sm + 2,
          columnGap: theme.space.xs,
        },
        style,
      ]}
    >
      {icon !== undefined && icon !== null ? <View>{icon}</View> : null}
      <RNText
        style={{
          color: textColor,
          fontSize: theme.fontSize["xs"] ?? 12,
          fontWeight: "600",
          lineHeight: 16,
        }}
        numberOfLines={1}
      >
        {label}
      </RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    height: 24,
  },
});
