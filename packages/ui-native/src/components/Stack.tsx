/**
 * Stack / HStack / VStack — tema aralık ölçeğiyle (space) boşluklu esnek kutu.
 * `gap` tema anahtarı (xs/sm/md/lg/xl/xxl) ya da sayı alır. HStack yazı yönüne
 * göre kendiliğinden aynalanır (RN flex "row" RTL'de ters döner). `wrap` ile
 * satır sonu, `divider` ile öğeler arasına ayraç eklenir.
 */
import * as React from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";

import type { NativeTheme } from "@wowsyler/ds-tokens/native";

import { useNativeTheme } from "../theme/ThemeProvider";

export type SpaceToken = keyof NativeTheme["space"];

export interface StackProps extends ViewProps {
  /** Yön; varsayılan "column". */
  direction?: "row" | "column";
  /** Öğeler arası boşluk: tema anahtarı ya da pt; varsayılan "md". */
  gap?: SpaceToken | number;
  /** Çapraz eksen hizası. */
  align?: ViewStyle["alignItems"];
  /** Ana eksen dağılımı. */
  justify?: ViewStyle["justifyContent"];
  /** Satır sonuna kaydırma (yalnızca row). */
  wrap?: boolean;
  /** İç boşluk: tema anahtarı ya da pt. */
  padding?: SpaceToken | number;
  /** Öğeler arasına yerleştirilecek ayraç düğümü. */
  divider?: React.ReactNode;
  /** Kalan alanı doldur (flex: 1). */
  fill?: boolean;
}

export function resolveSpace(theme: NativeTheme, value: SpaceToken | number | undefined): number | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? value : theme.space[value];
}

export function Stack({
  direction = "column",
  gap = "md",
  align,
  justify,
  wrap = false,
  padding,
  divider,
  fill = false,
  style,
  children,
  ...rest
}: StackProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const g = resolveSpace(theme, gap) ?? 0;
  const items =
    divider !== undefined && divider !== null
      ? React.Children.toArray(children).flatMap((child, i) =>
            i === 0
              ? [child]
              : [<React.Fragment key={`divider-${i}`}>{divider}</React.Fragment>, child],
          )
      : children;

  return (
    <View
      {...rest}
      style={[
        {
          flexDirection: direction,
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? "wrap" : "nowrap",
          rowGap: g,
          columnGap: g,
          padding: resolveSpace(theme, padding),
        },
        fill ? { flex: 1 } : null,
        style,
      ]}
    >
      {items}
    </View>
  );
}

export type HStackProps = Omit<StackProps, "direction">;
export type VStackProps = Omit<StackProps, "direction">;

/** Yatay yığın; varsayılan dikey hizası "center". */
export function HStack({ align = "center", ...props }: HStackProps): React.JSX.Element {
  return <Stack direction="row" align={align} {...props} />;
}

/** Dikey yığın. */
export function VStack(props: VStackProps): React.JSX.Element {
  return <Stack direction="column" {...props} />;
}
