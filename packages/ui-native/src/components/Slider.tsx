/**
 * Slider — PanResponder tabanlı kaydırıcı (ek bağımlılık yok). min/max/step,
 * `onValueChange` sürükleme sırasında, `onSlidingComplete` bırakınca çağrılır.
 * Erişilebilirlik: role="slider" + increment/decrement
 * eylemleri ve sayısal değer. RTL'de yön aynalanır (min sağda).
 */
import * as React from "react";
import {
  PanResponder,
  StyleSheet,
  View,
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { DsText } from "../internal/DsText";
import { shadowStyle } from "../internal/shadow";
import { useIsRTL, useNativeTheme } from "../theme/ThemeProvider";
import { ariaState, ariaValue } from "../internal/a11y";

export interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  /** Değeri etiket satırında göster; biçimlendirici verilebilir. */
  showValue?: boolean;
  formatValue?: (value: number) => string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const THUMB = 24;
const TRACK = 6;

function clampStep(v: number, min: number, max: number, step: number): number {
  const stepped = Math.round((v - min) / step) * step + min;
  const fixed = Number(stepped.toFixed(6));
  return Math.min(max, Math.max(min, fixed));
}

export function Slider({
  value,
  onValueChange,
  onSlidingComplete,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  showValue = false,
  formatValue = (v) => String(v),
  accessibilityLabel,
  style,
}: SliderProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const isRTL = useIsRTL();
  const [width, setWidth] = React.useState(0);
  const startX = React.useRef(0);
  const latest = React.useRef({ value, width, isRTL, min, max, step, disabled, onValueChange, onSlidingComplete });
  latest.current = { value, width, isRTL, min, max, step, disabled, onValueChange, onSlidingComplete };

  const range = max - min || 1;
  const fraction = (Math.min(max, Math.max(min, value)) - min) / range;
  const usable = Math.max(0, width - THUMB);

  const valueAt = React.useCallback((x: number): number => {
    const s = latest.current;
    const usableW = Math.max(1, s.width - THUMB);
    let f = (x - THUMB / 2) / usableW;
    f = Math.min(1, Math.max(0, f));
    if (s.isRTL) f = 1 - f;
    return clampStep(s.min + f * (s.max - s.min), s.min, s.max, s.step);
  }, []);

  const responder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !latest.current.disabled,
        onMoveShouldSetPanResponder: () => !latest.current.disabled,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e: GestureResponderEvent) => {
          startX.current = e.nativeEvent.locationX;
          const v = valueAt(startX.current);
          if (v !== latest.current.value) latest.current.onValueChange(v);
        },
        onPanResponderMove: (_e, g) => {
          const v = valueAt(startX.current + g.dx);
          if (v !== latest.current.value) latest.current.onValueChange(v);
        },
        onPanResponderRelease: (_e, g) => {
          latest.current.onSlidingComplete?.(valueAt(startX.current + g.dx));
        },
      }),
    [valueAt],
  );

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const onAction = (e: AccessibilityActionEvent) => {
    const delta = e.nativeEvent.actionName === "increment" ? step : e.nativeEvent.actionName === "decrement" ? -step : 0;
    if (delta === 0) return;
    const next = clampStep(value + delta, min, max, step);
    onValueChange(next);
    onSlidingComplete?.(next);
  };

  const thumbOffset = fraction * usable;

  return (
    <View style={[{ rowGap: theme.space.xs, opacity: disabled ? 0.5 : 1 }, style]}>
      {label !== undefined || showValue ? (
        <View style={styles.header}>
          <DsText style={{ color: theme.colors.foreground, fontSize: theme.fontSize["sm"] ?? 14, fontWeight: "500" }}>
            {label ?? ""}
          </DsText>
          {showValue ? (
            <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14, fontWeight: "600", fontVariant: ["tabular-nums"] }}>
              {formatValue(value)}
            </DsText>
          ) : null}
        </View>
      ) : null}
      <View
        accessible
        role="slider"
        aria-label={accessibilityLabel ?? label ?? "Kaydırıcı"}
        {...ariaValue({ min, max, now: value, text: formatValue(value) })}
        {...ariaState({ disabled })}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={onAction}
        onLayout={onLayout}
        {...responder.panHandlers}
        style={styles.hit}
      >
        <View
          style={[styles.track, styles.noPointer, { backgroundColor: theme.colors.muted, borderRadius: TRACK / 2, marginHorizontal: THUMB / 2 }]}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              start: 0,
              width: `${fraction * 100}%`,
              backgroundColor: theme.colors.primary,
              borderRadius: TRACK / 2,
            }}
          />
        </View>
        <View
          style={[
            styles.thumb,
            styles.noPointer,
            {
              start: thumbOffset,
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.primary,
            },
            shadowStyle({ color: theme.colors.shadowColor, opacity: 0.2, radius: 3, offsetY: 1, elevation: 2 }),
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  hit: { height: MIN_TOUCH_TARGET, justifyContent: "center" },
  noPointer: { pointerEvents: "none" },
  track: { height: TRACK, overflow: "hidden" },
  thumb: {
    position: "absolute",
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    borderWidth: 2,
    top: (MIN_TOUCH_TARGET - THUMB) / 2,
  },
});
