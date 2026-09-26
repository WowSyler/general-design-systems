/**
 * AdaptiveModal — telefonda alttan açılan sayfa (bottom sheet), tablette ekranın
 * ortasında kart olarak sunulan ortak modal kabuğu. Sheet, Select, ConfirmDialog
 * ve DatePicker bu kabuğu paylaşır.
 *
 * presentation: "auto" (varsayılan — cihaz sınıfına göre), "sheet" ya da "center".
 */
import * as React from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useBreakpoint } from "../hooks/useBreakpoint";
import { useNativeTheme } from "../theme/ThemeProvider";
import { SCRIM } from "./color";
import { shadowStyle } from "./shadow";
import { DsText } from "./DsText";
import { useReducedMotion } from "./useReducedMotion";
import { useSafeInsets } from "./useSafeInsets";

export type ModalPresentation = "auto" | "sheet" | "center";

/**
 * Modal animasyonu: hareketi azalt açıkken yok. Web'de (react-native-web)
 * de yok — RNW, animasyon bitene kadar dialog rolünü, odak tuzağını ve Escape
 * ile kapatmayı etkinleştirmez; önizlemede erişilebilirlik anında doğru olur.
 */
export function modalAnimation(
  preferred: "slide" | "fade",
  reducedMotion: boolean,
): "slide" | "fade" | "none" {
  return reducedMotion || Platform.OS === "web" ? "none" : preferred;
}

export interface AdaptiveModalProps {
  visible: boolean;
  onClose: () => void;
  /** Scrim ve geri tuşu kapatabilir mi; varsayılan true. */
  dismissable?: boolean;
  presentation?: ModalPresentation;
  /** Panel başlığı (header olarak seslendirilir). */
  title?: string;
  /** Ortalanmış sunumda kartın azami genişliği; varsayılan 480. */
  maxWidth?: number;
  /** Sheet sunumunda tutma çubuğu gösterilsin mi; varsayılan true. */
  showHandle?: boolean;
  /** Panelin iç boşluğu uygulanmasın (liste içeren paneller kendi boşluğunu yönetir). */
  flush?: boolean;
  panelStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function useResolvedPresentation(
  presentation: ModalPresentation,
): "sheet" | "center" {
  const { isTablet } = useBreakpoint();
  if (presentation === "auto") return isTablet ? "center" : "sheet";
  return presentation;
}

export function AdaptiveModal({
  visible,
  onClose,
  dismissable = true,
  presentation = "auto",
  title,
  maxWidth = 480,
  showHandle = true,
  flush = false,
  panelStyle,
  children,
}: AdaptiveModalProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const insets = useSafeInsets();
  const mode = useResolvedPresentation(presentation);
  const reducedMotion = useReducedMotion();
  const isSheet = mode === "sheet";

  const handleDismiss = React.useCallback(() => {
    if (dismissable) onClose();
  }, [dismissable, onClose]);

  const padding = flush ? 0 : theme.space.lg;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={modalAnimation(isSheet ? "slide" : "fade", reducedMotion)}
      onRequestClose={handleDismiss}
      supportedOrientations={["portrait", "landscape"]}
    >
      <View
        style={[
          styles.container,
          isSheet
            ? styles.sheetContainer
            : [styles.centerContainer, { padding: theme.space.xl }],
        ]}
      >
        <Pressable
          role="button"
          aria-label="Kapat"
          disabled={!dismissable}
          style={styles.backdrop}
          onPress={handleDismiss}
        />
        <View
          role="dialog"
          aria-modal
          aria-label={title}
          style={[
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              borderWidth: StyleSheet.hairlineWidth,
              paddingTop: flush ? theme.space.md : padding,
              paddingHorizontal: padding,
            },
            shadowStyle({ color: theme.colors.shadowColor, opacity: 0.18, radius: 24, offsetY: 8, elevation: 8 }),
            isSheet
              ? {
                  borderTopStartRadius: theme.radius.xl,
                  borderTopEndRadius: theme.radius.xl,
                  paddingBottom: (flush ? theme.space.sm : padding) + insets.bottom,
                  maxHeight: "92%",
                }
              : {
                  borderRadius: theme.radius.xl,
                  paddingBottom: flush ? theme.space.sm : padding,
                  width: "100%",
                  maxWidth,
                  maxHeight: "85%",
                },
            panelStyle,
          ]}
        >
          {isSheet && showHandle ? (
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
          ) : null}
          {title !== undefined ? (
            <DsText
              role="heading"
              style={{
                fontSize: theme.fontSize["lg"] ?? 18,
                lineHeight: 24,
                fontWeight: "600",
                color: theme.colors.cardForeground,
                marginBottom: theme.space.md,
                paddingHorizontal: flush ? theme.space.lg : 0,
              }}
            >
              {title}
            </DsText>
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
  },
  sheetContainer: {
    justifyContent: "flex-end",
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    // Scrim — tasarım kuralı gereği tek istisna: rgba arka plan karartması.
    backgroundColor: SCRIM,
  },
  handle: {
    width: 36,
    height: 4,
    alignSelf: "center",
  },
});
