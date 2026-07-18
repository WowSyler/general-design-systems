/**
 * EmptyState — boş liste/sonuç durumu bileşeni. Ortalanmış sütun düzeninde
 * muted daire içinde ikon (56pt), başlık, opsiyonel açıklama ve aksiyon alanı.
 */
import * as React from "react";
import {
  StyleSheet,
  View,
  Text as RNText,
  type ViewProps,
} from "react-native";

import { useNativeTheme } from "../theme/ThemeProvider";

const ICON_CIRCLE_SIZE = 56;

export interface EmptyStateProps extends ViewProps {
  /** Daire içinde gösterilecek ikon. */
  icon?: React.ReactNode;
  /** Başlık. */
  title: string;
  /** Opsiyonel açıklama metni. */
  description?: string;
  /** Opsiyonel aksiyon (ör. <Button />). */
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  style,
  ...rest
}: EmptyStateProps): React.JSX.Element {
  const { theme } = useNativeTheme();

  return (
    <View
      {...rest}
      style={[
        styles.base,
        {
          rowGap: theme.space.md,
          paddingVertical: theme.space.xxl,
          paddingHorizontal: theme.space.lg,
        },
        style,
      ]}
    >
      {icon !== undefined && icon !== null ? (
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: theme.colors.muted },
          ]}
        >
          {icon}
        </View>
      ) : null}

      <RNText
        accessibilityRole="header"
        style={{
          fontSize: theme.fontSize["lg"] ?? 18,
          lineHeight: 24,
          fontWeight: "600",
          color: theme.colors.foreground,
          textAlign: "center",
        }}
      >
        {title}
      </RNText>

      {description !== undefined ? (
        <RNText
          style={{
            fontSize: theme.fontSize["sm"] ?? 14,
            lineHeight: 20,
            color: theme.colors.mutedForeground,
            textAlign: "center",
          }}
        >
          {description}
        </RNText>
      ) : null}

      {action !== undefined && action !== null ? (
        <View>{action}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
