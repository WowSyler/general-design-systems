/**
 * SkeletonBlock — yükleme iskeleti bloğu. colors.muted zeminli bir dikdörtgen,
 * Animated.loop ile 0.4↔1 opaklık nabzı atarak içerik yüklenirken beklemeyi
 * görselleştirir. Genişlik/yükseklik serbest (DimensionValue), köşe yarıçapı
 * tema önayarı (sm/md/lg/xl/pill) ya da sayısal değer olarak verilir.
 *
 * SkeletonText, birden çok SkeletonBlock satırını ortak bir nabız değeriyle
 * (senkron) üst üste dizerek metin bloğu taklidi üretir; son satır daha kısadır.
 * İskelet dekoratiftir: varsayılan olarak ekran okuyucudan gizlenir, yalnızca
 * accessibilityLabel verildiğinde "meşgul" durumuyla seslendirilir.
 */
import * as React from "react";
import {
  Animated,
  View,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import type { NativeTheme } from "@ds/tokens/native";

import { useNativeTheme } from "../theme/ThemeProvider";

/** Köşe yarıçapı: tema önayarı adı ya da sayısal (pt) değer. */
export type SkeletonRadius = keyof NativeTheme["radius"] | number;

export interface SkeletonBlockProps {
  /** Blok genişliği; varsayılan "100%". */
  width?: DimensionValue;
  /** Blok yüksekliği; varsayılan 16pt. */
  height?: DimensionValue;
  /** Köşe yarıçapı — tema anahtarı ya da sayı; varsayılan "md". */
  radius?: SkeletonRadius;
  /** Nabız animasyonunu aç/kapa; varsayılan true. */
  animated?: boolean;
  /** Verilirse blok "meşgul" durumuyla seslendirilir; aksi halde dekoratiftir. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export interface SkeletonTextProps {
  /** Satır sayısı; varsayılan 3. */
  lines?: number;
  /** Her satırın yüksekliği; varsayılan 12pt. */
  lineHeight?: number;
  /** Satırlar arası boşluk; varsayılan theme.space.sm. */
  gap?: number;
  /** Son satırın genişliği (daha kısa görünüm); varsayılan "60%". */
  lastLineWidth?: DimensionValue;
  /** Satır köşe yarıçapı; varsayılan "sm". */
  radius?: SkeletonRadius;
  /** Nabız animasyonunu aç/kapa; varsayılan true. */
  animated?: boolean;
  /** Bloğun tamamı için seslendirme; varsayılan "İçerik yükleniyor". */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const PULSE_MIN = 0.4;
const PULSE_MAX = 1;
const PULSE_DURATION = 700;

/** Köşe yarıçapını temadan ya da sayıdan çözer. */
function resolveRadius(theme: NativeTheme, radius: SkeletonRadius): number {
  return typeof radius === "number" ? radius : theme.radius[radius];
}

/**
 * Paylaşılan opaklık nabzı — animated=false ise sabit PULSE_MAX döner.
 * Aynı Animated.Value'yu döndürerek çok satırlı iskeletlerin senkron atmasını sağlar.
 */
function usePulseOpacity(animated: boolean): Animated.Value {
  const opacity = React.useRef(new Animated.Value(PULSE_MAX)).current;

  React.useEffect(() => {
    if (!animated) {
      opacity.setValue(PULSE_MAX);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: PULSE_MIN,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: PULSE_MAX,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animated, opacity]);

  return opacity;
}

export function SkeletonBlock({
  width = "100%",
  height = 16,
  radius = "md",
  animated = true,
  accessibilityLabel,
  style,
}: SkeletonBlockProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const opacity = usePulseOpacity(animated);
  const decorative = accessibilityLabel === undefined;

  return (
    <Animated.View
      accessible={!decorative}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? "no-hide-descendants" : "yes"}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={decorative ? undefined : { busy: true }}
      style={[
        {
          width,
          height,
          borderRadius: resolveRadius(theme, radius),
          backgroundColor: theme.colors.muted,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonText({
  lines = 3,
  lineHeight = 12,
  gap,
  lastLineWidth = "60%",
  radius = "sm",
  animated = true,
  accessibilityLabel = "İçerik yükleniyor",
  style,
}: SkeletonTextProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const opacity = usePulseOpacity(animated);
  const rowGap = gap ?? theme.space.sm;
  const count = Math.max(1, Math.floor(lines));
  const rowRadius = resolveRadius(theme, radius);

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: true }}
      style={[{ rowGap }, style]}
    >
      {Array.from({ length: count }, (_, index) => {
        const isLast = index === count - 1 && count > 1;
        return (
          <Animated.View
            key={index}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={{
              width: isLast ? lastLineWidth : "100%",
              height: lineHeight,
              borderRadius: rowRadius,
              backgroundColor: theme.colors.muted,
              opacity,
            }}
          />
        );
      })}
    </View>
  );
}
