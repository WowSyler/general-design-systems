/**
 * Sheet — Modal tabanlı alt sayfa (bottom sheet).
 * Şeffaf Modal + slide animasyonu; arka plan rgba(0,0,0,0.4) scrim'e basınca
 * kapanır. Panel colors.card zeminli, üst köşeleri radius.xl; ortada 36×4
 * tutma çubuğu (colors.border). Alt iç boşluğa güvenli alan (safe area) eklenir.
 */
import * as React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text as RNText,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useNativeTheme } from "../theme/ThemeProvider";

export interface SheetProps {
  /** Sayfa görünür mü. */
  visible: boolean;
  /** Scrim'e basıldığında / geri tuşunda çağrılır. */
  onClose: () => void;
  /** Opsiyonel başlık. */
  title?: string;
  children?: React.ReactNode;
}

export function Sheet({
  visible,
  onClose,
  title,
  children,
}: SheetProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kapat"
          style={styles.backdrop}
          onPress={onClose}
        />
        <View
          accessibilityViewIsModal
          style={{
            backgroundColor: theme.colors.card,
            borderTopLeftRadius: theme.radius.xl,
            borderTopRightRadius: theme.radius.xl,
            padding: theme.space.lg,
            paddingBottom: theme.space.lg + insets.bottom,
          }}
        >
          <View
            style={[
              styles.handle,
              {
                backgroundColor: theme.colors.border,
                borderRadius: theme.radius.pill,
                marginBottom: theme.space.md,
              },
            ]}
          />
          {title !== undefined ? (
            <RNText
              accessibilityRole="header"
              style={{
                fontSize: theme.fontSize["lg"] ?? 18,
                lineHeight: 24,
                fontWeight: "600",
                color: theme.colors.cardForeground,
                marginBottom: theme.space.md,
              }}
            >
              {title}
            </RNText>
          ) : null}
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    // Scrim — tasarım kuralı gereği tek istisna: rgba arka plan karartması.
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  handle: {
    width: 36,
    height: 4,
    alignSelf: "center",
  },
});
