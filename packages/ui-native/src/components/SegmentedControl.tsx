/**
 * SegmentedControl — iOS tarzı segmentli kontrol. Eşit genişlikte segmentler tek
 * satırda dizilir; kapsayıcı colors.muted zeminlidir, aktif segmenti colors.background
 * ile boyanmış kayan bir vurgu (thumb) belirtir. Vurgu, seçim değiştikçe translateX
 * ile animasyonla yeni segmentin üzerine kayar (Animated + native driver).
 *
 * Kontrollü bileşen: `value` + `onValueChange` ile yönetilir. Kapsayıcı
 * role="tablist", her segment role="tab" ve
 * {...ariaState({ selected, disabled })} bildirir. Segment Pressable'ı en az
 * MIN_TOUCH_TARGET (44pt) yüksekliktedir; görsel yükseklikten fazlası negatif
 * dikey margin ile kapsayıcının iç boşluğuna taşar (kapsayıcı görünümü aynı kalır).
 * Randevu/Fisly dönem/görünüm (ör. Gün/Hafta/Ay) seçimi için uygundur.
 */
import * as React from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { DsText as RNText } from "../internal/DsText";
import { shadowStyle } from "../internal/shadow";
import { touchOverhang } from "../internal/touch";
import { USE_NATIVE_DRIVER, useReducedMotion } from "../internal/useReducedMotion";
import { useIsRTL, useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

/** Segment yüksekliği önayarı. */
export type SegmentedControlSize = "sm" | "md";

/** Tek bir segment tanımı. */
export interface SegmentedControlItem {
  /** Segmentin benzersiz değeri (value/onValueChange bu değerle çalışır). */
  value: string;
  /** Segment etiketi. */
  label: string;
  /** Segmenti devre dışı bırakır. */
  disabled?: boolean;
  /** Etiketin solunda gösterilecek ikon. */
  icon?: React.ReactNode;
}

export interface SegmentedControlProps {
  /** Görüntülenecek segmentler (en az iki önerilir). */
  items: SegmentedControlItem[];
  /** Seçili segmentin değeri (kontrollü). */
  value: string;
  /** Seçim değiştiğinde çağrılır; yeni segment değerini verir. */
  onValueChange: (value: string) => void;
  /** Yükseklik önayarı; varsayılan "md". */
  size?: SegmentedControlSize;
  /** Erişilebilirlik için segment grubunu tanımlayan etiket. */
  accessibilityLabel?: string;
  /** Dış kapsayıcı stili. */
  style?: StyleProp<ViewStyle>;
}

const SIZE_HEIGHT: Record<SegmentedControlSize, number> = {
  sm: 32,
  md: 40,
};

export function SegmentedControl({
  items,
  value,
  onValueChange,
  size = "md",
  accessibilityLabel,
  style,
}: SegmentedControlProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const isRTL = useIsRTL();
  const reducedMotion = useReducedMotion();

  const pad = theme.space.xs;
  const height = SIZE_HEIGHT[size];
  const count = items.length;

  // Seçili indeksi çöz; bulunamazsa ilk segment kabul edilir.
  const selectedIndex = React.useMemo(() => {
    const idx = items.findIndex((item) => item.value === value);
    return idx < 0 ? 0 : idx;
  }, [items, value]);

  // Kapsayıcı genişliği ölçülür; segment genişliği buradan türetilir.
  const [containerWidth, setContainerWidth] = React.useState(0);
  const innerWidth = Math.max(0, containerWidth - pad * 2);
  const segmentWidth = count > 0 && innerWidth > 0 ? innerWidth / count : 0;

  const translateX = React.useRef(new Animated.Value(0)).current;
  const initializedRef = React.useRef(false);

  // Kayan vurgunun konumu: ilk ölçümde anında yerleşir, sonrasında animasyonla kayar.
  React.useEffect(() => {
    if (segmentWidth <= 0) {
      return;
    }
    // RTL'de satır aynalanır: vurgu start kenarından sola doğru kayar.
    const target = selectedIndex * segmentWidth * (isRTL ? -1 : 1);
    if (!initializedRef.current || reducedMotion) {
      translateX.setValue(target);
      initializedRef.current = true;
      return;
    }
    Animated.timing(translateX, {
      toValue: target,
      duration: 180,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [selectedIndex, segmentWidth, translateX, isRTL, reducedMotion]);

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  // Dokunma kutusu 44pt; fazlası yerleşime girmesin diye negatif margin.
  const overhang = touchOverhang(height);

  const fontSize =
    size === "sm"
      ? (theme.fontSize["sm"] ?? 14)
      : (theme.fontSize["base"] ?? 16);

  return (
    <View
      role="tablist"
      aria-label={accessibilityLabel}
      onLayout={onLayout}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.muted,
          borderRadius: theme.radius.lg,
          padding: pad,
          // Yerleşim yönünü `useIsRTL` ile eşitle: provider `direction` zorlarken
          // I18nManager aynalanmamış olabilir; aksi hâlde `start` ile negatif
          // translateX farklı yönlere çözülür ve vurgu kaptan taşar.
          direction: isRTL ? "rtl" : "ltr",
        },
        style,
      ]}
    >
      {segmentWidth > 0 ? (
        // Vurgu yolu dört kenardan simetrik yerleşir (start/left çözümüne bağlı
        // değildir); vurgu yolun başlangıç kenarına kapsayıcının gerçek yazı
        // yönüyle yaslanır — ilk segmentle aynı kenar. Böylece react-native-web
        // `start`'ı yerel bağlamda `left`'e çözse bile RTL'de kaptan taşmaz.
        <View style={[styles.thumbTrack, { top: pad, bottom: pad, left: pad, right: pad }]}>
          <Animated.View
            style={[
              styles.thumb,
              {
                width: segmentWidth,
                borderRadius: Math.max(2, theme.radius.md - 2),
                backgroundColor: theme.colors.background,
                transform: [{ translateX }],
              },
              shadowStyle({ color: theme.colors.shadowColor, opacity: 0.12, radius: 4, offsetY: 1, elevation: 2 }),
            ]}
          />
        </View>
      ) : null}

      {items.map((item) => {
        const selected = item.value === value;
        const isDisabled = item.disabled === true;

        return (
          <Pressable
            key={item.value}
            role="tab"
            aria-label={item.label}
            {...ariaState({ selected, disabled: isDisabled })}
            disabled={isDisabled}
            onPress={() => onValueChange(item.value)}
            style={({ pressed }) => [
              styles.segment,
              {
                minHeight: height + overhang * 2,
                marginVertical: -overhang,
                paddingHorizontal: theme.space.sm,
                columnGap: theme.space.xs,
              },
              isDisabled ? styles.disabled : null,
              pressed && !isDisabled && !selected ? styles.pressed : null,
            ]}
          >
            {item.icon !== undefined && item.icon !== null ? (
              <View>{item.icon}</View>
            ) : null}
            <RNText
              numberOfLines={1}
              style={{
                color: selected
                  ? theme.colors.foreground
                  : theme.colors.mutedForeground,
                fontSize,
                fontWeight: selected ? "600" : "500",
              }}
            >
              {item.label}
            </RNText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    alignSelf: "stretch",
    position: "relative",
  },
  thumbTrack: {
    position: "absolute",
    pointerEvents: "none",
  },
  thumb: {
    flex: 1,
    alignSelf: "flex-start",
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.6,
  },
});
