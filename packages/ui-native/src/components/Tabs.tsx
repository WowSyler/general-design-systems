/**
 * Tabs — yatay sekme çubuğu (segment kontrolü). Etiket listesini gösterir,
 * aktif sekmeyi alt-çizgi (underline) ya da dolu (solid) vurguyla belirtir.
 * Kontrollü bileşen: `value` + `onValueChange` ile yönetilir; alt içerik çağıran
 * tarafın sorumluluğundadır. Kapsayıcı accessibilityRole="tablist", her sekme
 * accessibilityRole="tab" ve accessibilityState={{ selected }} bildirir; dokunma
 * hedefi MIN_TOUCH_TARGET (44pt) yüksekliğiyle karşılanır. GlowScan/Randevu.
 */
import * as React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Text as RNText,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET } from "@ds/tokens/native";

import { useNativeTheme } from "../theme/ThemeProvider";

/** Aktif sekme vurgu biçimi. */
export type TabsVariant = "underline" | "solid";

/** Tek bir sekme tanımı. */
export interface TabItem {
  /** Sekmenin benzersiz değeri (value/onValueChange bu değerle çalışır). */
  value: string;
  /** Sekme etiketi. */
  label: string;
  /** Sekmeyi devre dışı bırakır. */
  disabled?: boolean;
  /** Etiketin solunda gösterilecek ikon. */
  icon?: React.ReactNode;
}

export interface TabsProps {
  /** Görüntülenecek sekmeler. */
  items: TabItem[];
  /** Seçili sekmenin değeri (kontrollü). */
  value: string;
  /** Seçim değiştiğinde çağrılır; yeni sekme değerini verir. */
  onValueChange: (value: string) => void;
  /** Aktif vurgu biçimi; varsayılan "underline". */
  variant?: TabsVariant;
  /** Sekmeleri yatay kaydırılabilir yapar (çok sayıda sekme için). */
  scrollable?: boolean;
  /** Sekmeleri kapsayıcı genişliğinde eşit paylaştırır (scrollable ile yok sayılır). */
  fullWidth?: boolean;
  /** Erişilebilirlik için sekme grubunu tanımlayan etiket. */
  accessibilityLabel?: string;
  /** Dış kapsayıcı stili. */
  style?: StyleProp<ViewStyle>;
}

interface TabButtonPalette {
  background: string;
  text: string;
  indicator: string;
}

export function Tabs({
  items,
  value,
  onValueChange,
  variant = "underline",
  scrollable = false,
  fullWidth = false,
  accessibilityLabel,
  style,
}: TabsProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const isSolid = variant === "solid";

  function palette(selected: boolean): TabButtonPalette {
    if (isSolid) {
      return {
        background: selected ? theme.colors.primary : "transparent",
        text: selected
          ? theme.colors.primaryForeground
          : theme.colors.mutedForeground,
        indicator: "transparent",
      };
    }
    return {
      background: "transparent",
      text: selected ? theme.colors.foreground : theme.colors.mutedForeground,
      indicator: selected ? theme.colors.primary : "transparent",
    };
  }

  const tabs = items.map((item) => {
    const selected = item.value === value;
    const isDisabled = item.disabled === true;
    const colors = palette(selected);

    return (
      <Pressable
        key={item.value}
        accessibilityRole="tab"
        accessibilityLabel={item.label}
        accessibilityState={{ selected, disabled: isDisabled }}
        disabled={isDisabled}
        onPress={() => onValueChange(item.value)}
        style={({ pressed }) => [
          styles.tab,
          {
            minHeight: MIN_TOUCH_TARGET,
            paddingHorizontal: theme.space.md,
            columnGap: theme.space.xs,
            backgroundColor: colors.background,
          },
          isSolid
            ? { borderRadius: theme.radius.md, marginVertical: theme.space.xs }
            : {
                borderBottomWidth: 2,
                borderBottomColor: colors.indicator,
              },
          !scrollable && fullWidth ? styles.tabFlex : null,
          isDisabled ? styles.disabled : null,
          pressed && !isDisabled ? styles.pressed : null,
        ]}
      >
        {item.icon !== undefined && item.icon !== null ? (
          <View>{item.icon}</View>
        ) : null}
        <RNText
          numberOfLines={1}
          style={{
            color: colors.text,
            fontSize: theme.fontSize["sm"] ?? 14,
            fontWeight: selected ? "600" : "500",
          }}
        >
          {item.label}
        </RNText>
      </Pressable>
    );
  });

  const listStyle: StyleProp<ViewStyle> = [
    styles.list,
    isSolid
      ? {
          backgroundColor: theme.colors.muted,
          borderRadius: theme.radius.lg,
          paddingHorizontal: theme.space.xs,
          columnGap: theme.space.xs,
        }
      : {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.border,
        },
  ];

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityRole="tablist"
        accessibilityLabel={accessibilityLabel}
        style={style}
        contentContainerStyle={listStyle}
      >
        {tabs}
      </ScrollView>
    );
  }

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={[listStyle, style]}
    >
      {tabs}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabFlex: {
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
});
