/**
 * Screen — ekran iskeleti. colors.background zeminli tam ekran kap; güvenli alan
 * (safe area) kenarlarını uygular. `scroll` verilirse içerik ScrollView'a alınır
 * (klavye dostu); aksi halde düz View kullanılır.
 *
 * Tablet: içerik varsayılan olarak `maxContentWidth` (720pt) ile sınırlanıp
 * yatayda ortalanır — geniş ekranda satırlar okunmaz derecede uzamaz.
 * Güvenli alan: SafeAreaProvider varsa boşluklar ondan okunur; yoksa native'de
 * yerel SafeAreaView'a düşülür (web/testte boşluk 0).
 */
import * as React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { useBreakpoint } from "../hooks/useBreakpoint";
import { useHasSafeAreaProvider, useSafeInsets } from "../internal/useSafeInsets";
import { useNativeTheme } from "../theme/ThemeProvider";

const DEFAULT_EDGES: readonly Edge[] = ["top", "bottom"];

/** Tablette içeriğin varsayılan azami genişliği (pt). */
export const SCREEN_MAX_CONTENT_WIDTH = 720;

export interface ScreenProps {
  /** İçerik ScrollView içinde mi sunulsun. */
  scroll?: boolean;
  /** İç boşluk uygulansın mı; varsayılan true. */
  padded?: boolean;
  /** Güvenli alan kenarları; varsayılan ["top", "bottom"]. */
  edges?: readonly Edge[];
  /**
   * İçeriğin azami genişliği. Varsayılan: tablette 720, telefonda sınırsız.
   * "none" her cihazda sınırı kaldırır.
   */
  maxContentWidth?: number | "none";
  /** ScrollView'a ek prop'lar (refreshControl vb.). */
  scrollViewProps?: Omit<ScrollViewProps, "contentContainerStyle" | "style">;
  /** Dış kap stili. */
  style?: StyleProp<ViewStyle>;
  /** İçerik kabı stili (ScrollView contentContainer ya da iç View). */
  contentContainerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function Screen({
  scroll = false,
  padded = true,
  edges = DEFAULT_EDGES,
  maxContentWidth,
  scrollViewProps,
  style,
  contentContainerStyle,
  children,
}: ScreenProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const { isTablet } = useBreakpoint();
  const insets = useSafeInsets();
  const hasProvider = useHasSafeAreaProvider();

  const padding = isTablet ? theme.space.xxl : theme.space.xl;
  const paddedStyle: ViewStyle | null = padded
    ? { padding, rowGap: theme.space.lg }
    : null;

  const limit =
    maxContentWidth === "none"
      ? undefined
      : (maxContentWidth ?? (isTablet ? SCREEN_MAX_CONTENT_WIDTH : undefined));
  const widthStyle: ViewStyle | null =
    limit !== undefined
      ? { width: "100%", maxWidth: limit, alignSelf: "center" }
      : null;

  const body = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      {...scrollViewProps}
      style={styles.flex}
      contentContainerStyle={[paddedStyle, widthStyle, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, paddedStyle, widthStyle, contentContainerStyle]}>
      {children}
    </View>
  );

  const surface: StyleProp<ViewStyle> = [
    styles.flex,
    { backgroundColor: theme.colors.background },
    style,
  ];

  // Provider yoksa native'de yerel SafeAreaView kendi boşluklarını ölçer.
  if (!hasProvider && Platform.OS !== "web") {
    return (
      <SafeAreaView edges={edges as Edge[]} style={surface}>
        {body}
      </SafeAreaView>
    );
  }

  const edgeSet = new Set(edges);
  return (
    <View
      style={[
        surface,
        {
          paddingTop: edgeSet.has("top") ? insets.top : 0,
          paddingBottom: edgeSet.has("bottom") ? insets.bottom : 0,
          paddingLeft: edgeSet.has("left") ? insets.left : 0,
          paddingRight: edgeSet.has("right") ? insets.right : 0,
        },
      ]}
    >
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
