/**
 * NavigationRail / AdaptiveNavigation — tablet-uyumlu gezinme.
 * NavigationRail: dikey kenar çubuğu (tablet/yatay). Başta opsiyonel logo/FAB,
 * ikon + etiket öğeleri, aktif öğe tonlu hap vurgulu. BottomNav ile aynı öğe
 * modelini (BottomNavItem) kullanır.
 * AdaptiveNavigation: telefonda içerik + alt BottomNav, tablette (kısa kenar
 * ≥ 600) başta NavigationRail + içerik düzeni kurar. `mode` ile zorlanabilir.
 */
import * as React from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { useBreakpoint } from "../hooks/useBreakpoint";
import { withAlpha } from "../internal/color";
import { DsText } from "../internal/DsText";
import { useSafeInsets } from "../internal/useSafeInsets";
import { useNativeTheme } from "../theme/ThemeProvider";
import { BottomNav, type BottomNavItem } from "./BottomNav";
import { ariaState } from "../internal/a11y";

export interface NavigationRailProps {
  items: BottomNavItem[];
  value: string;
  onValueChange: (value: string) => void;
  /** Üstte gösterilecek düğüm (logo, FAB). */
  header?: React.ReactNode;
  /** Altta gösterilecek düğüm (profil, ayarlar). */
  footer?: React.ReactNode;
  /** Etiketleri göster; varsayılan true. */
  showLabels?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function NavigationRail({
  items,
  value,
  onValueChange,
  header,
  footer,
  showLabels = true,
  style,
}: NavigationRailProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const insets = useSafeInsets();
  return (
    <View
      style={[
        styles.rail,
        {
          backgroundColor: theme.colors.card,
          borderEndColor: theme.colors.border,
          paddingTop: insets.top + theme.space.md,
          paddingBottom: insets.bottom + theme.space.md,
          rowGap: theme.space.sm,
        },
        style,
      ]}
    >
      {header !== undefined ? <View style={{ alignItems: "center", marginBottom: theme.space.md }}>{header}</View> : null}
      <View role="tablist" aria-orientation="vertical" style={{ rowGap: theme.space.sm }}>
        {items.map((item) => {
          const active = item.value === value;
          const disabled = item.disabled === true;
          const color = active ? theme.colors.primary : theme.colors.mutedForeground;
          return (
            <Pressable
              key={item.value}
              role="tab"
              aria-label={item.accessibilityLabel ?? item.label}
              {...ariaState({ selected: active, disabled })}
              disabled={disabled}
              onPress={() => onValueChange(item.value)}
              style={({ pressed }) => [styles.item, { rowGap: 4, opacity: disabled ? 0.4 : pressed ? 0.7 : 1 }]}
            >
              <View
                style={{
                  minWidth: 56,
                  height: 32,
                  borderRadius: theme.radius.pill,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active ? withAlpha(theme.colors.primary, 0.14) : "transparent",
                }}
              >
                {item.icon !== undefined ? item.icon({ active, color, size: 22 }) : null}
              </View>
              {showLabels ? (
                <DsText numberOfLines={1} style={{ color, fontSize: theme.fontSize["xs"] ?? 12, fontWeight: active ? "600" : "500" }}>
                  {item.label}
                </DsText>
              ) : null}
            </Pressable>
          );
        })}
      </View>
      <View style={{ flex: 1 }} />
      {footer !== undefined ? <View style={{ alignItems: "center" }}>{footer}</View> : null}
    </View>
  );
}

export interface AdaptiveNavigationProps {
  items: BottomNavItem[];
  value: string;
  onValueChange: (value: string) => void;
  /** "auto" (varsayılan), "bottom" ya da "rail". */
  mode?: "auto" | "bottom" | "rail";
  railHeader?: React.ReactNode;
  railFooter?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function AdaptiveNavigation({
  items,
  value,
  onValueChange,
  mode = "auto",
  railHeader,
  railFooter,
  style,
  children,
}: AdaptiveNavigationProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const { isTablet } = useBreakpoint();
  const insets = useSafeInsets();
  const useRail = mode === "rail" || (mode === "auto" && isTablet);

  if (useRail) {
    return (
      <View style={[styles.flex, styles.row, { backgroundColor: theme.colors.background }, style]}>
        <NavigationRail items={items} value={value} onValueChange={onValueChange} header={railHeader} footer={railFooter} />
        <View style={styles.flex}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }, style]}>
      <View style={styles.flex}>{children}</View>
      <BottomNav items={items} value={value} onValueChange={onValueChange} bottomInset={insets.bottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: "row" },
  rail: { width: 88, alignItems: "stretch", borderEndWidth: StyleSheet.hairlineWidth },
  item: { alignItems: "center", justifyContent: "center", minHeight: MIN_TOUCH_TARGET + 12 },
});
