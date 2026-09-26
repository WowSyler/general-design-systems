/**
 * SwitchRow — etiketli anahtar satırı; ToggleSwitch, SettingsRow ve ListRow'un
 * ortak altyapısı.
 *
 * Dokunma: satırın tamamı (en az MIN_TOUCH_TARGET yükseklik) dokunma hedefidir;
 * satıra basmak değeri tersine çevirir. İşaretçi dokunuşları anahtarın kendisine
 * değil satıra gider (anahtar `pointerEvents: "none"`), böylece ≈40×20'lik
 * anahtar ayrı ve küçük bir dokunma hedefi oluşturmaz.
 *
 * Erişilebilirlik: tek denetim platform anahtarıdır (RNW'de
 * `<input role="switch">`, native'de UISwitch/SwitchCompat) — klavye (Space) ve
 * ekran okuyucular onu doğrudan çalıştırır. Satır rol almaz, sekme durağı
 * değildir ve metin içeriği ekran okuyuculardan gizlenir (etiket anahtarın
 * `accessibilityLabel`'ındadır): iç içe interaktif denetim oluşmaz.
 */
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  Switch,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { useNativeTheme } from "../theme/ThemeProvider";

export interface SwitchRowProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** Anahtarın ekran okuyucu etiketi (satır metni gizlendiğinden zorunlu tutun). */
  accessibilityLabel?: string;
  disabled?: boolean;
  /** Anahtar satırın başında mı; varsayılan false (sonda). */
  switchAtStart?: boolean;
  /** Metin/ikon içeriği — satıra basınca anahtar değişir; ekran okuyuculardan gizlenir. */
  children?: React.ReactNode;
  /** İçerik ile anahtar arasında gösterilen, gizlenmeyen ek düğüm. */
  trailing?: React.ReactNode;
  /** Satır stili (iç boşluk, kenarlık, opaklık). */
  style?: StyleProp<ViewStyle>;
}

export function SwitchRow({
  value,
  onValueChange,
  accessibilityLabel,
  disabled = false,
  switchAtStart = false,
  children,
  trailing,
  style,
}: SwitchRowProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const switchRef = React.useRef<React.ElementRef<typeof Switch>>(null);
  const hasContent = children !== undefined && children !== null && children !== false;

  const handlePress = (event: GestureResponderEvent): void => {
    // Web: klavyeyle (Space) anahtarın ürettiği click satıra kabarır; anahtar
    // değişikliği zaten kendi onValueChange'iyle bildirdi — ikinci kez çevirme.
    if ((event as unknown as { target?: unknown }).target === switchRef.current) return;
    onValueChange(!value);
  };

  const content = hasContent ? (
    <View
      aria-hidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.content, { columnGap: theme.space.md }]}
    >
      {children}
    </View>
  ) : null;

  const control = (
    <View style={styles.control}>
      <Switch
        ref={switchRef}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        // Switch rolü ve durumu platform bileşeninden gelir (RNW: <input role="switch">);
        // dıştan rol vermek web'de iç içe interaktif denetim üretir.
        accessibilityLabel={accessibilityLabel}
        trackColor={{ false: theme.colors.muted, true: theme.colors.primary }}
        thumbColor={value ? theme.colors.primaryForeground : theme.colors.background}
        ios_backgroundColor={theme.colors.muted}
      />
    </View>
  );

  return (
    <Pressable
      // Satır yalnızca işaretçi hedefidir: erişilebilirlik ağacında ve sekme
      // sırasında yer almaz (odak ve rol anahtardadır).
      accessible={false}
      tabIndex={-1}
      disabled={disabled}
      onPress={handlePress}
      style={[
        styles.row,
        { columnGap: theme.space.md },
        hasContent ? null : styles.bare,
        style,
      ]}
    >
      {switchAtStart ? control : null}
      {content}
      {trailing}
      {switchAtStart ? null : control}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: MIN_TOUCH_TARGET,
  },
  // Etiketsiz anahtar: yine de 44×44'lük dokunma kutusu.
  bare: {
    alignSelf: "flex-start",
    justifyContent: "center",
    minWidth: MIN_TOUCH_TARGET,
  },
  content: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  control: {
    pointerEvents: "none",
  },
});
