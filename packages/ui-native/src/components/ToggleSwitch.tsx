/**
 * ToggleSwitch — React Native yerleşik Switch bileşeninin tema renkli sarmalayıcısı.
 * İz (track) renkleri kapalıyken colors.muted, açıkken colors.primary; başparmak
 * (thumb) açık/kapalı duruma göre okunur bir kontrast için temadan türetilir.
 * Opsiyonel etiketle birlikte kullanıldığında etiket alanı da dokunmayı tetikler ve
 * satır yüksekliği MIN_TOUCH_TARGET (44pt) altına düşmez. Erişilebilirlik durumu
 * accessibilityRole="switch" + accessibilityState.checked ile bildirilir.
 * Not: RN'in `Switch` adıyla çakışmaması için `ToggleSwitch` adıyla dışa aktarılır.
 */
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  Switch,
  View,
  Text as RNText,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET } from "@ds/tokens/native";

import { useNativeTheme } from "../theme/ThemeProvider";

/** Etiketin anahtar denetimine göre konumu. */
export type ToggleSwitchLabelPosition = "left" | "right";

export interface ToggleSwitchProps {
  /** Anahtarın açık/kapalı durumu. */
  value: boolean;
  /** Durum değiştiğinde çağrılır. */
  onValueChange: (value: boolean) => void;
  /** Anahtarın yanında gösterilecek metin etiketi. */
  label?: string;
  /** Etiketin konumu; varsayılan "left" (anahtar sağda). */
  labelPosition?: ToggleSwitchLabelPosition;
  /** Devre dışı durum — etkileşim kapanır, opaklık düşer. */
  disabled?: boolean;
  /** Ekran okuyucu etiketi; verilmezse `label` kullanılır. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function ToggleSwitch({
  value,
  onValueChange,
  label,
  labelPosition = "left",
  disabled = false,
  accessibilityLabel,
  style,
}: ToggleSwitchProps): React.JSX.Element {
  const { theme } = useNativeTheme();

  const handleToggle = React.useCallback(() => {
    if (!disabled) {
      onValueChange(!value);
    }
  }, [disabled, onValueChange, value]);

  const switchNode = (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked: value, disabled }}
      trackColor={{ false: theme.colors.muted, true: theme.colors.primary }}
      thumbColor={
        value ? theme.colors.primaryForeground : theme.colors.background
      }
      ios_backgroundColor={theme.colors.muted}
    />
  );

  // Etiket yoksa anahtarı tek başına döndür.
  if (label === undefined || label === null || label.length === 0) {
    return <View style={[disabled ? styles.disabled : null, style]}>{switchNode}</View>;
  }

  const labelNode = (
    // Etiket dokunmayı tetikler; erişilebilirlik ağacında anahtar tek denetim
    // olarak kalsın diye bu düğüm ekran okuyuculardan gizlenir.
    <Pressable
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      disabled={disabled}
      onPress={handleToggle}
      style={styles.labelPressable}
    >
      <RNText
        style={{
          color: theme.colors.foreground,
          fontSize: theme.fontSize["base"] ?? 16,
          fontWeight: "500",
        }}
        numberOfLines={2}
      >
        {label}
      </RNText>
    </Pressable>
  );

  return (
    <View
      style={[
        styles.row,
        { columnGap: theme.space.md },
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      {labelPosition === "left" ? labelNode : null}
      {switchNode}
      {labelPosition === "right" ? labelNode : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: MIN_TOUCH_TARGET,
  },
  labelPressable: {
    flex: 1,
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});
