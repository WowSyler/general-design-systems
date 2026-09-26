/**
 * Text — tipografik varyantlı metin bileşeni.
 * Varyantlar (h1/h2/h3/body/bodyMedium/caption/overline) boyut, satır yüksekliği
 * ve ağırlığı temadan alır; `color` prop'u varyantın varsayılan rengini ezer.
 * RN Text prop'ları olduğu gibi geçer. h1-h3 otomatik olarak header rolü ve
 * temanın başlık fontunu alır.
 */
import * as React from "react";
import type { TextProps as RNTextProps, TextStyle } from "react-native";

import type { NativeTheme } from "@wowsyler/ds-tokens/native";

import { DsText, type FontRole } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";

export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "bodyMedium"
  | "caption"
  | "overline";

export type TextColor =
  | "default"
  | "muted"
  | "primary"
  | "destructive"
  | "success"
  | "warning"
  | "info";

export interface TextProps extends RNTextProps {
  /** Tipografik varyant; varsayılan "body". */
  variant?: TextVariant;
  /** Varyantın varsayılan rengini ezer. */
  color?: TextColor;
  /** Font rolü; varsayılan h1-h3 için "heading", diğerleri "body". */
  fontRole?: FontRole;
}

const HEADING_VARIANTS: ReadonlySet<TextVariant> = new Set(["h1", "h2", "h3"]);

function variantStyle(theme: NativeTheme, variant: TextVariant): TextStyle {
  const { colors, fontSize } = theme;
  switch (variant) {
    case "h1":
      return {
        fontSize: fontSize["2xl"] ?? 24,
        lineHeight: 30,
        fontWeight: "700",
        color: colors.foreground,
      };
    case "h2":
      return {
        fontSize: fontSize["xl"] ?? 20,
        lineHeight: 26,
        fontWeight: "600",
        color: colors.foreground,
      };
    case "h3":
      return {
        fontSize: fontSize["lg"] ?? 18,
        lineHeight: 24,
        fontWeight: "600",
        color: colors.foreground,
      };
    case "bodyMedium":
      return {
        fontSize: fontSize["base"] ?? 16,
        lineHeight: 22,
        fontWeight: "500",
        color: colors.foreground,
      };
    case "caption":
      return {
        fontSize: fontSize["xs"] ?? 12,
        lineHeight: 16,
        fontWeight: "400",
        color: colors.mutedForeground,
      };
    case "overline":
      return {
        fontSize: fontSize["xs"] ?? 12,
        fontWeight: "500",
        letterSpacing: 1.5,
        textTransform: "uppercase",
        color: colors.mutedForeground,
      };
    case "body":
    default:
      return {
        fontSize: fontSize["base"] ?? 16,
        lineHeight: 22,
        fontWeight: "400",
        color: colors.foreground,
      };
  }
}

function colorOverride(
  theme: NativeTheme,
  color: TextColor,
): string | undefined {
  switch (color) {
    case "muted":
      return theme.colors.mutedForeground;
    case "primary":
      return theme.colors.primary;
    case "destructive":
      return theme.colors.destructive;
    case "success":
      return theme.colors.success;
    case "warning":
      return theme.colors.warning;
    case "info":
      return theme.colors.info;
    case "default":
    default:
      return undefined;
  }
}

export function Text({
  variant = "body",
  color = "default",
  fontRole,
  style,
  children,
  role,
  ...rest
}: TextProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const base = variantStyle(theme, variant);
  const override = colorOverride(theme, color);
  const isHeading = HEADING_VARIANTS.has(variant);

  return (
    <DsText
      // Başlık varyantları ekran okuyucuya "başlık" olarak bildirilir.
      role={role ?? (isHeading ? "heading" : undefined)}
      fontRole={fontRole ?? (isHeading ? "heading" : "body")}
      {...rest}
      style={[base, override !== undefined ? { color: override } : null, style]}
    >
      {children}
    </DsText>
  );
}
