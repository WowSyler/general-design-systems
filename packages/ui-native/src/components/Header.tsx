/**
 * Header (AppBar) — ekran üst çubuğu. Başta geri/menü butonu (onBack verilirse
 * yön duyarlı ‹ oku), ortada ya da başta hizalı başlık + altbaşlık, sonda
 * aksiyonlar. `safeTop` ile üst güvenli alan boşluğu eklenir. Varyant:
 * "surface" (card zemin + alt çizgi), "transparent" ya da "primary".
 */
import * as React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { DsText } from "../internal/DsText";
import { Chevron } from "../internal/Glyphs";
import { useSafeInsets } from "../internal/useSafeInsets";
import { useNativeTheme } from "../theme/ThemeProvider";
import { IconButton } from "./IconButton";

export type HeaderVariant = "surface" | "transparent" | "primary";

export interface HeaderProps {
  title: string;
  subtitle?: string;
  /** Verilirse başta geri butonu gösterilir. */
  onBack?: () => void;
  /** Geri butonunun ekran okuyucu etiketi; varsayılan "Geri". */
  backLabel?: string;
  /** Başta geri butonu yerine gösterilecek özel düğüm. */
  leading?: React.ReactNode;
  /** Sondaki aksiyonlar (IconButton'lar). */
  actions?: React.ReactNode;
  /** Başlığı ortala (iOS tarzı); varsayılan false. */
  centerTitle?: boolean;
  variant?: HeaderVariant;
  /** Üst güvenli alan boşluğunu uygula; varsayılan false. */
  safeTop?: boolean;
  /** Büyük başlık (ekran başı, h1 boyutunda). */
  large?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Header({
  title,
  subtitle,
  onBack,
  backLabel = "Geri",
  leading,
  actions,
  centerTitle = false,
  variant = "surface",
  safeTop = false,
  large = false,
  style,
}: HeaderProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const insets = useSafeInsets();
  const fg =
    variant === "primary" ? theme.colors.primaryForeground : theme.colors.foreground;
  const muted =
    variant === "primary" ? theme.colors.primaryForeground : theme.colors.mutedForeground;

  const lead =
    leading ??
    (onBack !== undefined ? (
      <IconButton
        accessibilityLabel={backLabel}
        onPress={onBack}
        icon={({ color }) => (
          <Chevron direction="back" color={variant === "primary" ? fg : color} size={24} />
        )}
      />
    ) : null);

  return (
    <View
      style={[
        {
          backgroundColor:
            variant === "primary"
              ? theme.colors.primary
              : variant === "surface"
                ? theme.colors.card
                : "transparent",
          paddingTop: (safeTop ? insets.top : 0) + theme.space.sm,
          paddingBottom: theme.space.sm,
          paddingHorizontal: theme.space.sm,
        },
        variant === "surface"
          ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border }
          : null,
        style,
      ]}
    >
      <View style={[styles.row, { minHeight: 44, columnGap: theme.space.xs }]}>
        <View style={[styles.side, centerTitle ? styles.sideFixed : null]}>{lead}</View>
        <View
          style={[
            styles.titleBlock,
            {
              alignItems: centerTitle ? "center" : "flex-start",
              paddingHorizontal: lead === null && !centerTitle ? theme.space.sm : 0,
            },
          ]}
        >
          <DsText
            role="heading"
            numberOfLines={1}
            style={{
              color: fg,
              fontSize: large ? (theme.fontSize["2xl"] ?? 24) : (theme.fontSize["lg"] ?? 18),
              lineHeight: large ? 30 : 24,
              fontWeight: large ? "700" : "600",
            }}
          >
            {title}
          </DsText>
          {subtitle !== undefined ? (
            <DsText numberOfLines={1} style={{ color: muted, fontSize: theme.fontSize["xs"] ?? 12, opacity: variant === "primary" ? 0.85 : 1 }}>
              {subtitle}
            </DsText>
          ) : null}
        </View>
        <View style={[styles.side, styles.actions, centerTitle ? styles.sideFixed : null, { columnGap: theme.space.xs }]}>
          {actions}
        </View>
      </View>
    </View>
  );
}

/** AppBar — Header'ın takma adı. */
export const AppBar = Header;
export type AppBarProps = HeaderProps;

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  side: { flexDirection: "row", alignItems: "center" },
  sideFixed: { minWidth: 88 },
  actions: { justifyContent: "flex-end" },
  titleBlock: { flex: 1, minWidth: 0 },
});
