/**
 * SettingsGroup / SettingsRow — ayarlar ekranı düzeni (GlowScan SettingsRow,
 * Fisly SelectRow karşılığı). Grup: küçük büyük-harf başlık + kart içinde
 * ayraçlı satırlar + dipnot. Satır: ikon rozeti, başlık/açıklama, sonda değer,
 * chevron ya da anahtar (switch). `destructive` satır kırmızı metinlidir.
 */
import * as React from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { withAlpha } from "../internal/color";
import { DsText } from "../internal/DsText";
import { Chevron } from "../internal/Glyphs";
import { SwitchRow } from "../internal/SwitchRow";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

export interface SettingsGroupProps {
  title?: string;
  /** Grubun altındaki açıklama/dipnot. */
  footer?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function SettingsGroup({ title, footer, style, children }: SettingsGroupProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const rows = React.Children.toArray(children);
  return (
    <View style={[{ rowGap: theme.space.sm }, style]}>
      {title !== undefined ? (
        <DsText
          role="heading"
          style={{
            color: theme.colors.mutedForeground,
            fontSize: theme.fontSize["xs"] ?? 12,
            fontWeight: "600",
            letterSpacing: 1.1,
            textTransform: "uppercase",
            paddingHorizontal: theme.space.lg,
          }}
        >
          {title}
        </DsText>
      ) : null}
      <View
        style={{
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.border,
          overflow: "hidden",
        }}
      >
        {rows.map((row, i) => (
          <View
            key={i}
            style={
              i > 0
                ? { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border, marginStart: theme.space.lg }
                : null
            }
          >
            {row}
          </View>
        ))}
      </View>
      {footer !== undefined ? (
        <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["xs"] ?? 12, lineHeight: 16, paddingHorizontal: theme.space.lg }}>
          {footer}
        </DsText>
      ) : null}
    </View>
  );
}

export interface SettingsRowProps {
  title: string;
  description?: string;
  /** Başta ikon (rozet içinde gösterilir). */
  icon?: React.ReactNode;
  /** İkon rozeti rengi; varsayılan primary. */
  iconColor?: string;
  /** Sonda gösterilecek değer metni (ör. "Türkçe"). */
  value?: string;
  /** Anahtar (switch) satırı: verilirse sonda Switch gösterilir. */
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  /** Sonda chevron; varsayılan onPress varsa true. */
  showChevron?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  /** Sonda özel düğüm. */
  trailing?: React.ReactNode;
}

export function SettingsRow({
  title,
  description,
  icon,
  iconColor,
  value,
  switchValue,
  onSwitchChange,
  onPress,
  showChevron,
  destructive = false,
  disabled = false,
  trailing,
}: SettingsRowProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const isSwitch = switchValue !== undefined;
  const tone = iconColor ?? (destructive ? theme.colors.destructive : theme.colors.primary);
  const chevron = showChevron ?? (onPress !== undefined && !isSwitch);

  const lead = (
    <>
      {icon !== undefined ? (
        <View style={[styles.iconBadge, { backgroundColor: withAlpha(tone, 0.14), borderRadius: theme.radius.md }]}>{icon}</View>
      ) : null}
      <View style={{ flex: 1, rowGap: 2 }}>
        <DsText style={{ color: destructive ? theme.colors.destructive : theme.colors.foreground, fontSize: theme.fontSize["base"] ?? 16, fontWeight: "500" }}>
          {title}
        </DsText>
        {description !== undefined ? (
          <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14, lineHeight: 18 }}>{description}</DsText>
        ) : null}
      </View>
    </>
  );

  const rowStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    minHeight: MIN_TOUCH_TARGET + 8,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.sm,
    columnGap: theme.space.md,
    opacity: disabled ? 0.5 : 1,
  };

  if (isSwitch) {
    // Satırın tamamı anahtarı çevirir; tek erişilebilir denetim anahtarın
    // kendisidir (platform switch rolü) — iç içe interaktif denetim oluşmaz.
    return (
      <SwitchRow
        value={switchValue}
        onValueChange={(next) => onSwitchChange?.(next)}
        disabled={disabled}
        accessibilityLabel={description ? `${title}, ${description}` : title}
        trailing={trailing}
        style={rowStyle}
      >
        {lead}
      </SwitchRow>
    );
  }

  const body = (
    <>
      {lead}
      {value !== undefined ? (
        <DsText numberOfLines={1} style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14, maxWidth: "40%" }}>
          {value}
        </DsText>
      ) : null}
      {trailing}
      {chevron ? <Chevron color={theme.colors.mutedForeground} size={20} /> : null}
    </>
  );

  if (onPress !== undefined) {
    return (
      <Pressable
        role="button"
        aria-label={[title, description, value].filter(Boolean).join(", ")}
        {...ariaState({ disabled })}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [rowStyle, pressed ? { backgroundColor: theme.colors.muted } : null]}
      >
        {body}
      </Pressable>
    );
  }

  return <View style={rowStyle}>{body}</View>;
}

const styles = StyleSheet.create({
  iconBadge: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
});
