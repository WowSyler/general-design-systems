/**
 * Divider — hairline kalınlığında ayırıcı çizgi (colors.border).
 * Yatay veya dikey yönde çalışır; `inset` ile başlangıç kenarından
 * space.lg kadar içeri alınır (liste ayırıcıları için).
 */
import * as React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import { useNativeTheme } from "../theme/ThemeProvider";

export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps extends ViewProps {
  /** Yön; varsayılan "horizontal". */
  orientation?: DividerOrientation;
  /** Başlangıç kenarından space.lg iç boşluk. */
  inset?: boolean;
}

export function Divider({
  orientation = "horizontal",
  inset = false,
  style,
  ...rest
}: DividerProps): React.JSX.Element {
  const { theme } = useNativeTheme();

  return (
    <View
      aria-hidden
      importantForAccessibility="no"
      {...rest}
      style={[
        { backgroundColor: theme.colors.border },
        orientation === "horizontal"
          ? { height: StyleSheet.hairlineWidth, alignSelf: "stretch" }
          : { width: StyleSheet.hairlineWidth, alignSelf: "stretch" },
        inset ? { marginStart: theme.space.lg } : null,
        style,
      ]}
    />
  );
}
