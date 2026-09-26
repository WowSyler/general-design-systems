/**
 * KeyboardAwareScreen — form ekranları için Screen + KeyboardAvoidingView.
 * iOS'ta "padding", Android'de "height" davranışı; içerik kaydırılabilir ve
 * dokunulan alanlar klavyeyi kapatmadan çalışır (keyboardShouldPersistTaps).
 * `footer` klavyenin hemen üstünde sabit kalır (ör. "Devam" butonu).
 * Başlık/Header yüksekliği varsa `keyboardVerticalOffset` ile telafi edilir.
 */
import * as React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

import { useNativeTheme } from "../theme/ThemeProvider";
import { Screen, type ScreenProps } from "./Screen";

export interface KeyboardAwareScreenProps extends Omit<ScreenProps, "scroll"> {
  /** Klavye üstünde sabit alt alan. */
  footer?: React.ReactNode;
  /** Üst çubuk yüksekliği kadar ofset; varsayılan 0. */
  keyboardVerticalOffset?: number;
}

export function KeyboardAwareScreen({
  footer,
  keyboardVerticalOffset = 0,
  children,
  ...screenProps
}: KeyboardAwareScreenProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : Platform.OS === "android" ? "height" : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <Screen
        scroll
        {...screenProps}
        scrollViewProps={{ keyboardDismissMode: "interactive", ...screenProps.scrollViewProps }}
      >
        {children}
      </Screen>
      {footer !== undefined ? (
        <View
          style={{
            paddingHorizontal: theme.space.xl,
            paddingVertical: theme.space.md,
            backgroundColor: theme.colors.background,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: theme.colors.border,
          }}
        >
          {footer}
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
