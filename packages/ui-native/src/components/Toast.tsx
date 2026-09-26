/**
 * Toast — anlık bildirim şeridi. Varyantlar success/error/warning/info tonlu bir
 * ikon çipi + accent renkle ayrışır (renk tek başına sinyal değildir; her varyantın
 * kendi glifi vardır). Başlık opsiyonel, mesaj zorunlu. Animated ile giriş
 * (yukarı kayma + opaklık) ve çıkış animasyonu; opsiyonel `duration` ile otomatik
 * kapanma. Üst/alt konumlanır, accessibilityLiveRegion ile ekran okuyucuya duyurulur.
 */
import * as React from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET, type NativeTheme } from "@wowsyler/ds-tokens/native";

import { withAlpha } from "../internal/color";
import { touchOverhang } from "../internal/touch";
import { elevationStyle } from "./Card";
import { DsText as RNText } from "../internal/DsText";
import { USE_NATIVE_DRIVER, useReducedMotion } from "../internal/useReducedMotion";
import { useNativeTheme } from "../theme/ThemeProvider";

export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastPosition = "top" | "bottom";

export interface ToastProps {
  /** Görünürlük — true animasyonla girer, false çıkış animasyonuyla kaybolur. */
  visible: boolean;
  /** Zorunlu mesaj metni. */
  message: string;
  /** Opsiyonel başlık; mesajın üstünde vurgulu gösterilir. */
  title?: string;
  /** Renk/ikon varyantı; varsayılan "info". */
  variant?: ToastVariant;
  /** Konum; varsayılan "bottom". */
  position?: ToastPosition;
  /** Otomatik kapanma süresi (ms). Verilmez ya da <= 0 ise kapanmaz. */
  duration?: number;
  /** Kapat düğmesini ve süre dolumunu bildirir — üst bileşen visible'ı false yapar. */
  onDismiss?: () => void;
  /** Kapat (✕) düğmesini gösterir; varsayılan true. */
  showClose?: boolean;
  /** Konumlandığı kenardan uzaklık; varsayılan space.xl. */
  offset?: number;
  /** Dış (mutlak konumlu) sarmalayıcı için ek stil. */
  style?: StyleProp<ViewStyle>;
}

/** Kapat (✕) ikon alanının görsel boyutu. */
const CLOSE_VISUAL = 24;

/** Varyant → accent token rengi ve metin glifi. */
const VARIANT_GLYPH: Record<ToastVariant, string> = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "i",
};

function variantAccent(theme: NativeTheme, variant: ToastVariant): string {
  const { colors } = theme;
  switch (variant) {
    case "success":
      return colors.success;
    case "error":
      return colors.destructive;
    case "warning":
      return colors.warning;
    case "info":
    default:
      return colors.info;
  }
}


export function Toast({
  visible,
  message,
  title,
  variant = "info",
  position = "bottom",
  duration,
  onDismiss,
  showClose = true,
  offset,
  style,
}: ToastProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const reducedMotion = useReducedMotion();

  const enterOffset = position === "top" ? -16 : 16;

  const [rendered, setRendered] = React.useState(false);
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(enterOffset)).current;

  // Görünürlük değişiminde giriş/çıkış animasyonu.
  React.useEffect(() => {
    if (reducedMotion) {
      // Hareketi azalt: animasyonsuz anında göster/gizle.
      opacity.setValue(visible ? 1 : 0);
      translateY.setValue(0);
      setRendered(visible);
      return undefined;
    }
    if (visible) {
      setRendered(true);
      opacity.setValue(0);
      translateY.setValue(enterOffset);
      const anim = Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 18,
          stiffness: 180,
          mass: 0.6,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]);
      anim.start();
      return () => anim.stop();
    }

    const anim = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(translateY, {
        toValue: enterOffset,
        duration: 160,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    ]);
    anim.start(({ finished }) => {
      if (finished) {
        setRendered(false);
      }
    });
    return () => anim.stop();
  }, [visible, enterOffset, opacity, translateY, reducedMotion]);

  // Otomatik kapanma zamanlayıcısı.
  React.useEffect(() => {
    if (visible && typeof duration === "number" && duration > 0) {
      const id = setTimeout(() => {
        onDismiss?.();
      }, duration);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [visible, duration, onDismiss]);

  if (!rendered) {
    return <React.Fragment />;
  }

  const accent = variantAccent(theme, variant);
  const edge = offset ?? theme.space.xl;
  const liveRegion = variant === "error" || variant === "warning"
    ? "assertive"
    : "polite";

  return (
    <View
      style={[
        styles.wrapper,
        position === "top" ? { top: edge } : { bottom: edge },
        style,
      ]}
    >
      <Animated.View
        role="alert"
        aria-live={liveRegion}
        aria-label={
          title !== undefined ? `${title}. ${message}` : message
        }
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.popover,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.lg,
            borderStartColor: accent,
            // Yumuşak yükselti — Card "medium" önayarı, tema gölge rengiyle.
            ...elevationStyle("medium", theme.colors.shadowColor),
            paddingVertical: theme.space.md,
            paddingHorizontal: theme.space.md,
            columnGap: theme.space.md,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <View
          style={[
            styles.iconChip,
            {
              backgroundColor: withAlpha(accent, 0.15),
              borderRadius: theme.radius.pill,
            },
          ]}
        >
          <RNText
            style={{
              color: accent,
              fontSize: theme.fontSize["base"] ?? 16,
              fontWeight: "700",
              lineHeight: 20,
            }}
          >
            {VARIANT_GLYPH[variant]}
          </RNText>
        </View>

        <View style={styles.content}>
          {title !== undefined ? (
            <RNText
              style={{
                color: theme.colors.popoverForeground,
                fontSize: theme.fontSize["base"] ?? 16,
                fontWeight: "600",
                lineHeight: 22,
                marginBottom: 2,
              }}
              numberOfLines={1}
            >
              {title}
            </RNText>
          ) : null}
          <RNText
            style={{
              color: theme.colors.mutedForeground,
              fontSize: theme.fontSize["sm"] ?? 14,
              fontWeight: "400",
              lineHeight: 20,
            }}
          >
            {message}
          </RNText>
        </View>

        {showClose ? (
          <Pressable
            role="button"
            aria-label="Kapat"
            onPress={onDismiss}
            style={({ pressed }) => [
              styles.close,
              pressed ? { opacity: 0.6 } : null,
            ]}
          >
            <RNText
              style={{
                color: theme.colors.mutedForeground,
                fontSize: theme.fontSize["base"] ?? 16,
                fontWeight: "600",
                lineHeight: 20,
              }}
            >
              ✕
            </RNText>
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    pointerEvents: "box-none",
    start: 0,
    end: 0,
    alignItems: "center",
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf: "stretch",
    maxWidth: 520,
    borderWidth: StyleSheet.hairlineWidth,
    borderStartWidth: 3,
  },
  iconChip: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  content: {
    flex: 1,
  },
  // Dokunma kutusu 44pt; negatif margin ile yerleşimde 24pt'lik ikon alanı
  // kadar yer kaplar (✕ glifi aynı yerde kalır).
  close: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    margin: -touchOverhang(CLOSE_VISUAL),
    alignItems: "center",
    justifyContent: "center",
  },
});
