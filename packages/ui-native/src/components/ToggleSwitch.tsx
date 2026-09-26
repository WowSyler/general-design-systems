/**
 * ToggleSwitch — React Native yerleşik Switch bileşeninin tema renkli sarmalayıcısı.
 * İz (track) renkleri kapalıyken colors.muted, açıkken colors.primary; başparmak
 * (thumb) açık/kapalı duruma göre okunur bir kontrast için temadan türetilir.
 * Satırın tamamı (etiket + anahtar, en az MIN_TOUCH_TARGET yükseklik; etiketsizken
 * 44×44) dokunmayı tetikler. Erişilebilirlik: tek denetim platform anahtarıdır
 * (role="switch" + checked durumu); etiket, anahtarın erişilebilir adıdır.
 * Not: RN'in `Switch` adıyla çakışmaması için `ToggleSwitch` adıyla dışa aktarılır.
 */
import * as React from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { DsText as RNText } from "../internal/DsText";
import { SwitchRow } from "../internal/SwitchRow";
import { useNativeTheme } from "../theme/ThemeProvider";

/**
 * Etiketin anahtar denetimine göre konumu. "start"/"end" yazı yönüne göre
 * aynalanır (RTL'de start sağdadır); "left"/"right" geriye dönük uyumluluk
 * için sırasıyla "start"/"end" ile eşdeğerdir.
 */
export type ToggleSwitchLabelPosition = "start" | "end" | "left" | "right";

export interface ToggleSwitchProps {
  /** Anahtarın açık/kapalı durumu. */
  value: boolean;
  /** Durum değiştiğinde çağrılır. */
  onValueChange: (value: boolean) => void;
  /** Anahtarın yanında gösterilecek metin etiketi. */
  label?: string;
  /** Etiketin konumu; varsayılan "start" (anahtar sonda). */
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
  labelPosition = "start",
  disabled = false,
  accessibilityLabel,
  style,
}: ToggleSwitchProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const labelAtStart = labelPosition === "start" || labelPosition === "left";
  const hasLabel = label !== undefined && label !== null && label.length > 0;

  return (
    <SwitchRow
      value={value}
      onValueChange={(next) => {
        if (!disabled) onValueChange(next);
      }}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? label}
      switchAtStart={hasLabel && !labelAtStart}
      style={[disabled ? styles.disabled : null, style]}
    >
      {hasLabel ? (
        <RNText
          style={{
            flex: 1,
            color: theme.colors.foreground,
            fontSize: theme.fontSize["base"] ?? 16,
            fontWeight: "500",
          }}
          numberOfLines={2}
        >
          {label}
        </RNText>
      ) : null}
    </SwitchRow>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});
