/**
 * Container — içeriği azami genişlikle sınırlayıp yatayda ortalayan kap.
 * Tablette okunabilir satır uzunluğu için kullanılır. `size` önayarı:
 * sm 480 / md 640 / lg 840 / xl 1080 / full (sınırsız). Yatay iç boşluk
 * telefonda space.lg, tablette space.xl.
 */
import * as React from "react";
import { View, type ViewProps } from "react-native";

import { useBreakpoint } from "../hooks/useBreakpoint";
import { useNativeTheme } from "../theme/ThemeProvider";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

const MAX_WIDTH: Record<Exclude<ContainerSize, "full">, number> = {
  sm: 480,
  md: 640,
  lg: 840,
  xl: 1080,
};

export interface ContainerProps extends ViewProps {
  /** Azami genişlik önayarı; varsayılan "lg". */
  size?: ContainerSize;
  /** Yatay iç boşluk uygulansın mı; varsayılan true. */
  padded?: boolean;
}

export function Container({
  size = "lg",
  padded = true,
  style,
  ...rest
}: ContainerProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const { isTablet } = useBreakpoint();
  return (
    <View
      {...rest}
      style={[
        {
          width: "100%",
          alignSelf: "center",
          maxWidth: size === "full" ? undefined : MAX_WIDTH[size],
          paddingHorizontal: padded ? (isTablet ? theme.space.xl : theme.space.lg) : 0,
        },
        style,
      ]}
    />
  );
}
