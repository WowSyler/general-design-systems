/**
 * BottomNav — alt navigasyon çubuğu (tab bar). Eşit genişlikte öğeler (ikon +
 * etiket) barındırır; aktif öğe primary, pasif öğeler mutedForeground rengiyle
 * çizilir. İkonlar bir render fonksiyonuyla verilir; böylece aktif/pasif rengi
 * ve boyutu temadan alarak eşleşir. Her öğe opsiyonel bir sayaç rozeti gösterir.
 * value + onValueChange ile denetlenir. `bottomInset` ile güvenli alan (safe
 * area) alt boşluğu dışarıdan verilir — yeni bağımlılık eklenmez. Dokunma hedefi
 * her öğe için MIN_TOUCH_TARGET (44pt) yüksekliğinde tutulur.
 * Mobil: GlowScan / Randevu / Dolap / Fisly.
 */
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { DsText as RNText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

/** İkon render fonksiyonuna geçilen durum. */
export interface BottomNavIconState {
  /** Öğe seçili mi. */
  active: boolean;
  /** Temaya göre çözümlenmiş renk (aktif → primary, pasif → mutedForeground). */
  color: string;
  /** Önerilen ikon boyutu (pt). */
  size: number;
}

/** Tek bir alt navigasyon öğesi. */
export interface BottomNavItem {
  /** Benzersiz değer; seçili öğe bununla eşleşir. */
  value: string;
  /** Öğe etiketi. */
  label: string;
  /** İkon üreticisi; aktif/pasif rengi ve boyutu durumdan alır. */
  icon?: (state: BottomNavIconState) => React.ReactNode;
  /** Sayaç rozeti; sayı 99'u aşarsa "99+" gösterilir. Boş/0 ise gizlenir. */
  badge?: number | string;
  /** Öğeyi devre dışı bırakır. */
  disabled?: boolean;
  /** Erişilebilirlik etiketi; verilmezse `label` kullanılır. */
  accessibilityLabel?: string;
}

export interface BottomNavProps {
  /** Gösterilecek öğeler (eşit genişlikte dağıtılır). */
  items: BottomNavItem[];
  /** Seçili öğenin değeri. */
  value: string;
  /** Öğeye dokunulduğunda çağrılır. */
  onValueChange: (value: string) => void;
  /** Güvenli alan alt boşluğu (pt); alt paddinge eklenir. Varsayılan 0. */
  bottomInset?: number;
  style?: StyleProp<ViewStyle>;
}

const ICON_SIZE = 24;

/** Rozet içeriğini biçimlendirir; gösterilmeyecekse null döner. */
function formatBadge(badge: number | string | undefined): string | null {
  if (badge === undefined || badge === null) {
    return null;
  }
  if (typeof badge === "number") {
    if (badge <= 0) {
      return null;
    }
    return badge > 99 ? "99+" : String(badge);
  }
  const trimmed = badge.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function BottomNav({
  items,
  value,
  onValueChange,
  bottomInset = 0,
  style,
}: BottomNavProps): React.JSX.Element {
  const { theme } = useNativeTheme();

  const labelSize = theme.fontSize["xs"] ?? 12;

  return (
    <View
      role="tablist"
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          paddingTop: theme.space.sm,
          paddingBottom: theme.space.sm + bottomInset,
        },
        style,
      ]}
    >
      {items.map((item) => {
        const active = item.value === value;
        const isDisabled = item.disabled === true;
        const color = active
          ? theme.colors.primary
          : theme.colors.mutedForeground;
        const badgeText = formatBadge(item.badge);

        const a11yLabel =
          (item.accessibilityLabel ?? item.label) +
          (badgeText !== null ? `, ${badgeText} bildirim` : "");

        return (
          <Pressable
            key={item.value}
            role="tab"
            aria-label={a11yLabel}
            {...ariaState({ selected: active, disabled: isDisabled })}
            disabled={isDisabled}
            onPress={() => onValueChange(item.value)}
            style={({ pressed }) => [
              styles.tab,
              { rowGap: theme.space.xs },
              isDisabled ? styles.disabled : null,
              pressed && !isDisabled ? styles.pressed : null,
            ]}
          >
            <View style={styles.iconWrap}>
              {item.icon !== undefined
                ? item.icon({ active, color, size: ICON_SIZE })
                : null}

              {badgeText !== null ? (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: theme.colors.destructive,
                      borderRadius: theme.radius.pill,
                      paddingHorizontal: theme.space.xs,
                    },
                  ]}
                >
                  <RNText
                    numberOfLines={1}
                    style={{
                      color: theme.colors.destructiveForeground,
                      fontSize: labelSize,
                      lineHeight: labelSize + 2,
                      fontWeight: "600",
                      fontVariant: ["tabular-nums"],
                    }}
                  >
                    {badgeText}
                  </RNText>
                </View>
              ) : null}
            </View>

            <RNText
              numberOfLines={1}
              style={{
                color,
                fontSize: labelSize,
                fontWeight: active ? "600" : "500",
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
  bar: {
    flexDirection: "row",
    alignItems: "stretch",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -6,
    start: ICON_SIZE - 6,
    minWidth: 18,
    height: 18,
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
