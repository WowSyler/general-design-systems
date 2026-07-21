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
  Text as RNText,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET, type NativeTheme } from "@ds/tokens/native";

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

/** "#rrggbb" / "#rgb" hex değerini rgba() dizgesine çevirir (tonlu zemin için). */
function hexToRgba(hex: string, alpha: number): string {
  let value = hex.replace("#", "");
  if (value.length === 3) {
    value = value
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return hex;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

  const enterOffset = position === "top" ? -16 : 16;

  const [rendered, setRendered] = React.useState(false);
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(enterOffset)).current;

  // Görünürlük değişiminde giriş/çıkış animasyonu.
  React.useEffect(() => {
    if (visible) {
      setRendered(true);
      opacity.setValue(0);
      translateY.setValue(enterOffset);
      const anim = Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 18,
          stiffness: 180,
          mass: 0.6,
          useNativeDriver: true,
        }),
      ]);
      anim.start();
      return () => anim.stop();
    }

    const anim = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: enterOffset,
        duration: 160,
        useNativeDriver: true,
      }),
    ]);
    anim.start(({ finished }) => {
      if (finished) {
        setRendered(false);
      }
    });
    return () => anim.stop();
  }, [visible, enterOffset, opacity, translateY]);

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
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        position === "top" ? { top: edge } : { bottom: edge },
        style,
      ]}
    >
      <Animated.View
        accessibilityRole="alert"
        accessibilityLiveRegion={liveRegion}
        accessibilityLabel={
          title !== undefined ? `${title}. ${message}` : message
        }
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.popover,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.lg,
            borderLeftColor: accent,
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
              backgroundColor: hexToRgba(accent, 0.15),
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
            accessibilityRole="button"
            accessibilityLabel="Kapat"
            hitSlop={(MIN_TOUCH_TARGET - 24) / 2}
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
    left: 0,
    right: 0,
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
    borderLeftWidth: 3,
    // Yumuşak yükselti — Card konvansiyonuyla aynı gölge önayarı.
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
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
  close: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
