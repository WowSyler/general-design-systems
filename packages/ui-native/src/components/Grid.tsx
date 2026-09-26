/**
 * Grid — kırılım bazlı sütunlu ızgara. `columns` sabit sayı ya da kırılım
 * haritası alır (ör. { base: 1, md: 2, lg: 3 }); tablette otomatik çok sütun.
 * Alternatif olarak `minItemWidth` verilirse sütun sayısı kap genişliğinden
 * hesaplanır (auto-fit). Hücreler eşit genişliktedir; boşluk tema ölçeğinden.
 */
import * as React from "react";
import {
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  useBreakpoint,
  resolveResponsiveValue,
  type ResponsiveValue,
} from "../hooks/useBreakpoint";
import { useNativeTheme } from "../theme/ThemeProvider";
import { resolveSpace, type SpaceToken } from "./Stack";

export interface GridProps {
  /** Sütun sayısı ya da kırılım haritası; varsayılan { base: 1, md: 2, lg: 3 }. */
  columns?: number | ResponsiveValue<number>;
  /** Verilirse sütun sayısı kap genişliğinden hesaplanır (columns yok sayılır). */
  minItemWidth?: number;
  /** Hücreler arası boşluk; varsayılan "md". */
  gap?: SpaceToken | number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const DEFAULT_COLUMNS: ResponsiveValue<number> = { base: 1, md: 2, lg: 3 };

export function Grid({
  columns = DEFAULT_COLUMNS,
  minItemWidth,
  gap = "md",
  style,
  children,
}: GridProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const { breakpoint } = useBreakpoint();
  const [width, setWidth] = React.useState(0);
  const g = resolveSpace(theme, gap) ?? 0;

  const onLayout = React.useCallback((e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  }, []);

  let count: number;
  if (minItemWidth !== undefined && width > 0) {
    count = Math.max(1, Math.floor((width + g) / (minItemWidth + g)));
  } else if (typeof columns === "number") {
    count = columns;
  } else {
    count = resolveResponsiveValue(columns, breakpoint) ?? 1;
  }
  count = Math.max(1, Math.floor(count));

  // toArray null/undefined/boolean çocukları zaten eler.
  const items = React.Children.toArray(children);
  const basis = `${100 / count}%` as const;

  return (
    <View
      onLayout={onLayout}
      style={[
        { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -g / 2, rowGap: g },
        style,
      ]}
    >
      {items.map((child, i) => (
        <View
          key={(child as { key?: React.Key }).key ?? i}
          style={{ width: basis, paddingHorizontal: g / 2 }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}
