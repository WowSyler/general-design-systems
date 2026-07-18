/**
 * Screen — ekran iskeleti. react-native-safe-area-context SafeAreaView ile
 * colors.background zeminli tam ekran kap. `scroll` verilirse içerik
 * ScrollView'a alınır (padding space.xl, gap space.lg, klavye dostu);
 * aksi halde padded (varsayılan true) düz View kullanılır.
 */
import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { useNativeTheme } from "../theme/ThemeProvider";

const DEFAULT_EDGES: readonly Edge[] = ["top", "bottom"];

export interface ScreenProps {
  /** İçerik ScrollView içinde mi sunulsun. */
  scroll?: boolean;
  /** İç boşluk uygulansın mı; varsayılan true. */
  padded?: boolean;
  /** SafeAreaView kenarları; varsayılan ["top", "bottom"]. */
  edges?: readonly Edge[];
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
  style,
  contentContainerStyle,
  children,
}: ScreenProps): React.JSX.Element {
  const { theme } = useNativeTheme();

  const paddedStyle: ViewStyle | null = padded
    ? { padding: theme.space.xl, rowGap: theme.space.lg }
    : null;

  return (
    <SafeAreaView
      edges={edges as Edge[]}
      style={[
        styles.flex,
        { backgroundColor: theme.colors.background },
        style,
      ]}
    >
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[paddedStyle, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, paddedStyle, contentContainerStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
