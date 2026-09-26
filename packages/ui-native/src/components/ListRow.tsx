/**
 * ListRow — liste satırı bileşeni. Sol opsiyonel ikon/avatar slotu, ortada başlık
 * ve opsiyonel altbaşlık, sağda opsiyonel değer metni / özel aksiyon slotu / chevron.
 * `onPress` verildiğinde Pressable olarak (basılı opaklık geri bildirimi +
 * role="button") render edilir; verilmezse salt görünüm (View) olur.
 * `switchValue` + `onSwitchChange` verilirse sonda anahtar gösterilir ve satırın
 * tamamı anahtarı çevirir (tek erişilebilir denetim anahtardır).
 * `bordered` ile satır altına hairline ayraç eklenir. Satır yüksekliği daima
 * MIN_TOUCH_TARGET (44pt) taban değerinden büyüktür. Fisly işlem, Randevu liste
 * ve Dolap gibi liste akışları için tasarlanmıştır.
 */
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { DsText as RNText } from "../internal/DsText";
import { SwitchRow } from "../internal/SwitchRow";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

export interface ListRowProps {
  /** Satırın ana başlığı — zorunlu. */
  title: string;
  /** Başlığın altında gösterilen ikincil metin (ör. tarih, açıklama). */
  subtitle?: string;
  /** Solda gösterilecek ikon / avatar slotu. */
  left?: React.ReactNode;
  /** Sağda gösterilecek değer metni (ör. tutar) — tabular rakamlarla hizalanır. */
  value?: string;
  /** Sağdaki değerin altında gösterilecek ikincil metin (ör. durum). */
  valueSubtitle?: string;
  /** Sağda gösterilecek özel slot (ör. Switch, buton). value/chevron'dan önce yerleşir. */
  right?: React.ReactNode;
  /** Sağda navigasyon chevron'u (›) gösterir; onPress ile birlikte önerilir. */
  showChevron?: boolean;
  /**
   * Anahtar (switch) satırı: verilirse sonda anahtar gösterilir; satıra basmak
   * değeri çevirir. Bu durumda `onPress`/`onLongPress` yok sayılır.
   */
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  /** Basıldığında tetiklenir; verilirse satır Pressable + button rolü alır. */
  onPress?: PressableProps["onPress"];
  /** Uzun basma geri çağrısı (opsiyonel). */
  onLongPress?: PressableProps["onLongPress"];
  /** Devre dışı — soluk görünür ve basılamaz. */
  disabled?: boolean;
  /** Satır altına hairline ayraç ekler (ayrılabilir liste kullanımı). */
  bordered?: boolean;
  /** Erişilebilirlik etiketi; verilmezse başlık + altbaşlıktan türetilir. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function ListRow({
  title,
  subtitle,
  left,
  value,
  valueSubtitle,
  right,
  showChevron = false,
  switchValue,
  onSwitchChange,
  onPress,
  onLongPress,
  disabled = false,
  bordered = false,
  accessibilityLabel,
  style,
}: ListRowProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const isSwitch = switchValue !== undefined;
  const interactive = !isSwitch && (onPress !== undefined || onLongPress !== undefined);

  const derivedLabel =
    accessibilityLabel ??
    [title, subtitle, value, valueSubtitle].filter(Boolean).join(", ");

  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    {
      minHeight: MIN_TOUCH_TARGET,
      paddingVertical: theme.space.md,
      paddingHorizontal: theme.space.lg,
      columnGap: theme.space.md,
    },
    bordered
      ? {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.border,
        }
      : null,
    disabled ? styles.disabled : null,
    style,
  ];

  const content = (
    <>
      {left !== undefined && left !== null ? (
        <View style={styles.left}>{left}</View>
      ) : null}

      <View style={styles.center}>
        <RNText
          style={{
            color: theme.colors.foreground,
            fontSize: theme.fontSize["base"] ?? 16,
            fontWeight: "500",
            lineHeight: 20,
          }}
          numberOfLines={1}
        >
          {title}
        </RNText>
        {subtitle !== undefined ? (
          <RNText
            style={{
              color: theme.colors.mutedForeground,
              fontSize: theme.fontSize["sm"] ?? 14,
              fontWeight: "400",
              lineHeight: 18,
            }}
            numberOfLines={1}
          >
            {subtitle}
          </RNText>
        ) : null}
      </View>

      {value !== undefined ||
      valueSubtitle !== undefined ||
      (!isSwitch && right !== undefined && right !== null) ||
      showChevron ? (
        <View style={[styles.right, { columnGap: theme.space.xs }]}>
          {value !== undefined || valueSubtitle !== undefined ? (
            <View style={styles.valueBlock}>
              {value !== undefined ? (
                <RNText
                  style={{
                    color: theme.colors.foreground,
                    fontSize: theme.fontSize["base"] ?? 16,
                    fontWeight: "600",
                    lineHeight: 20,
                    fontVariant: ["tabular-nums"],
                  }}
                  numberOfLines={1}
                >
                  {value}
                </RNText>
              ) : null}
              {valueSubtitle !== undefined ? (
                <RNText
                  style={{
                    color: theme.colors.mutedForeground,
                    fontSize: theme.fontSize["xs"] ?? 12,
                    fontWeight: "400",
                    lineHeight: 16,
                  }}
                  numberOfLines={1}
                >
                  {valueSubtitle}
                </RNText>
              ) : null}
            </View>
          ) : null}

          {!isSwitch && right !== undefined && right !== null ? (
            <View>{right}</View>
          ) : null}

          {showChevron ? (
            <RNText
              accessible={false}
              importantForAccessibility="no"
              style={{
                color: theme.colors.mutedForeground,
                fontSize: theme.fontSize["xl"] ?? 20,
                fontWeight: "400",
                lineHeight: 22,
              }}
            >
              {"›"}
            </RNText>
          ) : null}
        </View>
      ) : null}
    </>
  );

  if (isSwitch) {
    return (
      <SwitchRow
        value={switchValue}
        onValueChange={(next) => onSwitchChange?.(next)}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel ?? [title, subtitle].filter(Boolean).join(", ")}
        trailing={right !== undefined && right !== null ? <View>{right}</View> : null}
        style={containerStyle}
      >
        {content}
      </SwitchRow>
    );
  }

  if (interactive) {
    return (
      <Pressable
        role="button"
        aria-label={derivedLabel}
        {...ariaState({ disabled })}
        disabled={disabled}
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => [
          containerStyle,
          pressed && !disabled ? styles.pressed : null,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      aria-label={
        accessibilityLabel !== undefined ? accessibilityLabel : undefined
      }
      style={containerStyle}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  left: {
    justifyContent: "center",
  },
  center: {
    flex: 1,
    minWidth: 0,
    rowGap: 2,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueBlock: {
    alignItems: "flex-end",
    rowGap: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.6,
  },
});
