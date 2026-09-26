/**
 * ModalDialog — merkezi (ortalanmış) modal diyalog.
 * RN Modal üzerine kurulu; Sheet alt-sayfayken bu bileşen ekranın ortasında
 * bir kart gösterir. Şeffaf Modal + karartma scrim'i (rgba, tasarım istisnası)
 * arkada, ortada colors.card zeminli kart: opsiyonel başlık (header), açıklama
 * ve children içerik, altta aksiyon butonları. Onay / uyarı akışları için.
 *
 * Kapatma: scrim'e basma ya da donanım geri tuşu (`dismissable` true iken);
 * kritik onaylarda `dismissable=false` ile yalnızca aksiyonla kapanır.
 * Erişilebilirlik: kart `accessibilityViewIsModal`; başlık `role="header"`.
 */
import * as React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { modalAnimation } from "../internal/AdaptiveModal";
import { SCRIM } from "../internal/color";
import { useReducedMotion } from "../internal/useReducedMotion";
import { DsText as RNText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { Button, type ButtonVariant } from "./Button";
import { elevationStyle } from "./Card";

export interface ModalDialogAction {
  /** Buton metni. */
  label: string;
  /** Basıldığında çağrılır. */
  onPress: () => void;
  /** Buton varyantı; varsayılan "primary". */
  variant?: ButtonVariant;
  /** Yükleniyor durumu — metin yerine ActivityIndicator. */
  loading?: boolean;
  /** Devre dışı bırakır. */
  disabled?: boolean;
}

export interface ModalDialogProps {
  /** Diyalog görünür mü. */
  visible: boolean;
  /** Scrim'e basıldığında / geri tuşunda çağrılır (`dismissable` true iken). */
  onClose: () => void;
  /** Opsiyonel başlık — header olarak seslendirilir. */
  title?: string;
  /** Başlık altında gösterilen açıklama metni. */
  description?: string;
  /** Başlık/açıklamanın altında gösterilecek özel içerik. */
  children?: React.ReactNode;
  /**
   * Altta gösterilecek aksiyon butonları (soldan sağa). Tek buton tam genişlik
   * kaplar; birden fazlaysa sağa hizalı satır olur.
   */
  actions?: ModalDialogAction[];
  /**
   * Scrim'e basma ve geri tuşu diyaloğu kapatabilir mi; varsayılan true.
   * Kritik onaylarda false verilerek yalnızca aksiyonla kapanması sağlanır.
   */
  dismissable?: boolean;
}

export function ModalDialog({
  visible,
  onClose,
  title,
  description,
  children,
  actions,
  dismissable = true,
}: ModalDialogProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const reducedMotion = useReducedMotion();

  const handleDismiss = React.useCallback(() => {
    if (dismissable) {
      onClose();
    }
  }, [dismissable, onClose]);

  const hasActions = actions !== undefined && actions.length > 0;
  const singleAction = hasActions && actions.length === 1;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={modalAnimation("fade", reducedMotion)}
      onRequestClose={handleDismiss}
    >
      <View style={[styles.container, { padding: theme.space.xl }]}>
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
            styles.panel,
            {
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.lg,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: theme.colors.border,
              padding: theme.space.lg,
              rowGap: theme.space.md,
            },
            elevationStyle("medium", theme.colors.shadowColor),
          ]}
        >
          {title !== undefined ? (
            <RNText
              role="heading"
              style={{
                fontSize: theme.fontSize["lg"] ?? 18,
                lineHeight: 24,
                fontWeight: "600",
                color: theme.colors.cardForeground,
              }}
            >
              {title}
            </RNText>
          ) : null}

          {description !== undefined ? (
            <RNText
              style={{
                fontSize: theme.fontSize["sm"] ?? 14,
                lineHeight: 20,
                fontWeight: "400",
                color: theme.colors.mutedForeground,
              }}
            >
              {description}
            </RNText>
          ) : null}

          {children !== undefined && children !== null ? (
            <ScrollView
              style={styles.content}
              contentContainerStyle={{ rowGap: theme.space.sm }}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          ) : null}

          {hasActions ? (
            <View
              style={[
                styles.actions,
                {
                  columnGap: theme.space.sm,
                  marginTop: theme.space.xs,
                },
              ]}
            >
              {actions!.map((action, index) => (
                <Button
                  key={`${action.label}-${index}`}
                  title={action.label}
                  variant={action.variant ?? "primary"}
                  loading={action.loading}
                  disabled={action.disabled}
                  fullWidth={singleAction}
                  onPress={action.onPress}
                />
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    // Scrim — tasarım kuralı gereği tek istisna: rgba arka plan karartması.
    backgroundColor: SCRIM,
  },
  panel: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "85%",
  },
  content: {
    flexGrow: 0,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
