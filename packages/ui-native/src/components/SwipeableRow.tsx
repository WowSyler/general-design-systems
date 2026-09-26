/**
 * SwipeableRow — kaydırarak eylem açılan satır (Fisly işlem silme, Dolap mesaj
 * arşivleme). PanResponder + Animated; ek bağımlılık yok. Eylemler satırın SON
 * kenarında açılır (LTR: sağ, RTL: sol) — kullanıcı sona doğru değil başa doğru
 * kaydırır. Eşik geçilince açık kalır; dışarıdan kapatmak için `close()` ref'i.
 * Ekran okuyucu için eylemler accessibilityActions olarak da sunulur (kaydırma
 * gerekmeden).
 */
import * as React from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  type AccessibilityActionEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { DsText } from "../internal/DsText";
import { USE_NATIVE_DRIVER, useReducedMotion } from "../internal/useReducedMotion";
import { useIsRTL, useNativeTheme } from "../theme/ThemeProvider";

export interface SwipeAction {
  key: string;
  label: string;
  onPress: () => void;
  tone?: "destructive" | "primary" | "neutral";
  icon?: React.ReactNode;
}

export interface SwipeableRowProps {
  actions: SwipeAction[];
  /** Her eylem düğmesinin genişliği; varsayılan 80. */
  actionWidth?: number;
  disabled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export interface SwipeableRowHandle {
  close: () => void;
  open: () => void;
}

export const SwipeableRow = React.forwardRef<SwipeableRowHandle, SwipeableRowProps>(function SwipeableRow(
  { actions, actionWidth = 80, disabled = false, onOpen, onClose, style, children },
  ref,
) {
  const { theme } = useNativeTheme();
  const isRTL = useIsRTL();
  const reducedMotion = useReducedMotion();
  const total = actions.length * actionWidth;
  // Açılış yönü: LTR'de içerik sola (negatif), RTL'de sağa (pozitif) kayar.
  const dir = isRTL ? 1 : -1;
  const x = React.useRef(new Animated.Value(0)).current;
  const offset = React.useRef(0);
  const [isOpen, setIsOpen] = React.useState(false);

  const animateTo = React.useCallback(
    (to: number) => {
      offset.current = to;
      const opened = to !== 0;
      setIsOpen(opened);
      if (opened) onOpen?.();
      else onClose?.();
      if (reducedMotion) {
        x.setValue(to);
        return;
      }
      Animated.spring(x, { toValue: to, useNativeDriver: USE_NATIVE_DRIVER, bounciness: 0, speed: 18 }).start();
    },
    [x, reducedMotion, onOpen, onClose],
  );

  React.useImperativeHandle(ref, () => ({ close: () => animateTo(0), open: () => animateTo(dir * total) }), [animateTo, dir, total]);

  const responder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_e, g) => !disabled && Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
        onPanResponderMove: (_e, g) => {
          let next = offset.current + g.dx;
          // Yalnızca açılış yönünde ve eylem genişliği kadar kaydır (hafif esneme payı).
          next = dir < 0 ? Math.min(0, Math.max(-total * 1.15, next)) : Math.max(0, Math.min(total * 1.15, next));
          x.setValue(next);
        },
        onPanResponderRelease: (_e, g) => {
          const moved = offset.current + g.dx;
          const shouldOpen = Math.abs(moved) > total * 0.4 && Math.sign(moved) === dir;
          animateTo(shouldOpen ? dir * total : 0);
        },
        onPanResponderTerminate: () => animateTo(offset.current),
      }),
    [disabled, dir, total, x, animateTo],
  );

  const onA11yAction = (e: AccessibilityActionEvent) => {
    const action = actions.find((a) => a.key === e.nativeEvent.actionName);
    action?.onPress();
  };

  const toneBg = (tone: SwipeAction["tone"]) =>
    tone === "destructive" ? theme.colors.destructive : tone === "primary" ? theme.colors.primary : theme.colors.secondary;
  const toneFg = (tone: SwipeAction["tone"]) =>
    tone === "destructive"
      ? theme.colors.destructiveForeground
      : tone === "primary"
        ? theme.colors.primaryForeground
        : theme.colors.secondaryForeground;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.actions, { width: total }]} importantForAccessibility={isOpen ? "auto" : "no-hide-descendants"} aria-hidden={!isOpen}>
        {actions.map((a) => (
          <Pressable
            key={a.key}
            role="button"
            aria-label={a.label}
            // Kapalıyken gizli eylemler sekme sırasına girmez.
            tabIndex={isOpen ? 0 : -1}
            onPress={() => {
              animateTo(0);
              a.onPress();
            }}
            style={({ pressed }) => [styles.action, { width: actionWidth, backgroundColor: toneBg(a.tone), opacity: pressed ? 0.85 : 1, rowGap: 4 }]}
          >
            {a.icon}
            <DsText style={{ color: toneFg(a.tone), fontSize: theme.fontSize["xs"] ?? 12, fontWeight: "600" }}>{a.label}</DsText>
          </Pressable>
        ))}
      </View>
      <Animated.View
        accessibilityActions={actions.map((a) => ({ name: a.key, label: a.label }))}
        onAccessibilityAction={onA11yAction}
        {...responder.panHandlers}
        style={{ backgroundColor: theme.colors.card, transform: [{ translateX: x }] }}
      >
        {children}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { overflow: "hidden", position: "relative" },
  actions: { position: "absolute", top: 0, bottom: 0, end: 0, flexDirection: "row" },
  action: { alignItems: "center", justifyContent: "center" },
});
