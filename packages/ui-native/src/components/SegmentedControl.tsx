/**
 * SegmentedControl — iOS tarzı segmentli kontrol. Eşit genişlikte segmentler tek
 * satırda dizilir; kapsayıcı colors.muted zeminlidir, aktif segmenti colors.background
 * ile boyanmış kayan bir vurgu (thumb) belirtir. Vurgu, seçim değiştikçe translateX
 * ile animasyonla yeni segmentin üzerine kayar (Animated + native driver).
 *
 * Kontrollü bileşen: `value` + `onValueChange` ile yönetilir. Kapsayıcı
 * accessibilityRole="tablist", her segment accessibilityRole="tab" ve
 * accessibilityState={{ selected, disabled }} bildirir; kısa segment yüksekliği
 * dikey hitSlop ile MIN_TOUCH_TARGET (44pt) dokunma hedefine tamamlanır.
 * Randevu/Fisly dönem/görünüm (ör. Gün/Hafta/Ay) seçimi için uygundur.
 */
import * as React from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text as RNText,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET } from "@ds/tokens/native";

import { useNativeTheme } from "../theme/ThemeProvider";

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
    const target = selectedIndex * segmentWidth;
    if (!initializedRef.current) {
      translateX.setValue(target);
      initializedRef.current = true;
      return;
    }
    Animated.timing(translateX, {
      toValue: target,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [selectedIndex, segmentWidth, translateX]);

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  const verticalSlop =
    height < MIN_TOUCH_TARGET ? (MIN_TOUCH_TARGET - height) / 2 : 0;

  const fontSize =
    size === "sm"
      ? (theme.fontSize["sm"] ?? 14)
      : (theme.fontSize["base"] ?? 16);

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      onLayout={onLayout}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.muted,
          borderRadius: theme.radius.lg,
          padding: pad,
        },
        style,
      ]}
    >
      {segmentWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.thumb,
            {
              width: segmentWidth,
              borderRadius: Math.max(2, theme.radius.md - 2),
              backgroundColor: theme.colors.background,
              transform: [{ translateX }],
            },
          ]}
        />
      ) : null}

      {items.map((item) => {
        const selected = item.value === value;
        const isDisabled = item.disabled === true;

        return (
          <Pressable
            key={item.value}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected, disabled: isDisabled }}
            disabled={isDisabled}
            hitSlop={
              verticalSlop > 0
                ? { top: verticalSlop, bottom: verticalSlop }
                : undefined
            }
            onPress={() => onValueChange(item.value)}
            style={({ pressed }) => [
              styles.segment,
              {
                minHeight: height,
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
  thumb: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
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
