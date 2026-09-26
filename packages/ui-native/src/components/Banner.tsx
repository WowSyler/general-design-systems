/**
 * Banner — sayfa içi uyarı/bilgi şeridi (web Alert karşılığı). Tonlar: info,
 * success, warning, destructive, neutral. Her tonun kendi glifi vardır (renk tek
 * başına sinyal değildir). Opsiyonel başlık, aksiyon ve kapatma butonu.
 * `OfflineBanner` çevrimdışı durum için hazır ön ayardır (Dolap/Fisly).
 * (RN'in `Alert` API'siyle çakışmaması için adı Banner'dır.)
 */
import * as React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import type { NativeTheme } from "@wowsyler/ds-tokens/native";

import { withAlpha } from "../internal/color";
import { DsText } from "../internal/DsText";
import { CloseGlyph } from "../internal/Glyphs";
import { useNativeTheme } from "../theme/ThemeProvider";
import { IconButton } from "./IconButton";

export type BannerTone = "info" | "success" | "warning" | "destructive" | "neutral";

export interface BannerProps {
  tone?: BannerTone;
  title?: string;
  message: string;
  /** Glif yerine gösterilecek özel ikon. */
  icon?: React.ReactNode;
  /** Mesajın altında gösterilecek aksiyon (TextButton vb.). */
  action?: React.ReactNode;
  /** Verilirse kapatma (✕) butonu gösterilir. */
  onDismiss?: () => void;
  /** Tam genişlik, köşesiz şerit (ekran üstü uyarılar için). */
  variant?: "card" | "strip";
  style?: StyleProp<ViewStyle>;
}

const GLYPH: Record<BannerTone, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  destructive: "!",
  neutral: "•",
};

function toneColor(theme: NativeTheme, tone: BannerTone): string {
  switch (tone) {
    case "success":
      return theme.colors.success;
    case "warning":
      return theme.colors.warning;
    case "destructive":
      return theme.colors.destructive;
    case "neutral":
      return theme.colors.mutedForeground;
    case "info":
    default:
      return theme.colors.info;
  }
}

export function Banner({
  tone = "info",
  title,
  message,
  icon,
  action,
  onDismiss,
  variant = "card",
  style,
}: BannerProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const accent = toneColor(theme, tone);
  const urgent = tone === "destructive" || tone === "warning";

  return (
    <View
      role={urgent ? "alert" : "summary"}
      aria-live={urgent ? "assertive" : "polite"}
      style={[
        styles.base,
        {
          backgroundColor: withAlpha(accent, 0.1),
          borderColor: withAlpha(accent, 0.35),
          padding: theme.space.md,
          columnGap: theme.space.md,
        },
        variant === "card"
          ? { borderRadius: theme.radius.lg, borderWidth: StyleSheet.hairlineWidth }
          : { borderBottomWidth: StyleSheet.hairlineWidth },
        style,
      ]}
    >
      {icon ?? (
        <View
          aria-hidden
          importantForAccessibility="no"
          style={[styles.chip, { backgroundColor: accent, borderRadius: theme.radius.pill }]}
        >
          <DsText
            allowFontScaling={false}
            style={{ color: theme.colors.background, fontSize: 13, lineHeight: 16, fontWeight: "800" }}
          >
            {GLYPH[tone]}
          </DsText>
        </View>
      )}
      <View style={{ flex: 1, rowGap: 2 }}>
        {title !== undefined ? (
          <DsText style={{ color: theme.colors.foreground, fontSize: theme.fontSize["sm"] ?? 14, fontWeight: "600", lineHeight: 20 }}>
            {title}
          </DsText>
        ) : null}
        <DsText style={{ color: title !== undefined ? theme.colors.mutedForeground : theme.colors.foreground, fontSize: theme.fontSize["sm"] ?? 14, lineHeight: 20 }}>
          {message}
        </DsText>
        {action !== undefined ? <View style={{ marginTop: theme.space.xs }}>{action}</View> : null}
      </View>
      {onDismiss !== undefined ? (
        <IconButton
          size="sm"
          bleed
          accessibilityLabel="Kapat"
          onPress={onDismiss}
          icon={<CloseGlyph color={theme.colors.mutedForeground} size={14} />}
        />
      ) : null}
    </View>
  );
}

export interface OfflineBannerProps extends Omit<BannerProps, "tone" | "message"> {
  /** Görünürlük (ör. NetInfo'dan `!isConnected`). false iken hiçbir şey render etmez. */
  visible?: boolean;
  message?: string;
}

/** Çevrimdışı uyarısı — uyarı tonunda şerit; bağlantı gelince gizlenir. */
export function OfflineBanner({
  visible = true,
  title = "Çevrimdışısınız",
  message = "Değişiklikleriniz bağlantı geri geldiğinde eşitlenecek.",
  variant = "strip",
  ...rest
}: OfflineBannerProps): React.JSX.Element | null {
  if (!visible) return null;
  return <Banner tone="warning" title={title} message={message} variant={variant} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  chip: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
});
