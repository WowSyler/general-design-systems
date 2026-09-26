/**
 * SectionHeader — liste/ekran bölüm başlığı: başlık (header rolü), opsiyonel
 * açıklama ve sonda aksiyon (ör. "Tümü" TextButton'u). `overline` varyantı
 * ayarlar gruplarındaki küçük büyük-harf başlık stilidir.
 */
import * as React from "react";
import { View, type ViewProps } from "react-native";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";

export interface SectionHeaderProps extends ViewProps {
  title: string;
  description?: string;
  /** Sonda gösterilecek aksiyon düğümü. */
  action?: React.ReactNode;
  /** "title" (varsayılan) ya da küçük büyük-harf "overline". */
  variant?: "title" | "overline";
}

export function SectionHeader({
  title,
  description,
  action,
  variant = "title",
  style,
  ...rest
}: SectionHeaderProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const overline = variant === "overline";
  return (
    <View
      {...rest}
      style={[{ flexDirection: "row", alignItems: "center", columnGap: theme.space.md }, style]}
    >
      <View style={{ flex: 1, rowGap: 2 }}>
        <DsText
          role="heading"
          fontRole={overline ? "body" : "heading"}
          style={
            overline
              ? {
                  color: theme.colors.mutedForeground,
                  fontSize: theme.fontSize["xs"] ?? 12,
                  fontWeight: "600",
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }
              : {
                  color: theme.colors.foreground,
                  fontSize: theme.fontSize["lg"] ?? 18,
                  lineHeight: 24,
                  fontWeight: "600",
                }
          }
        >
          {title}
        </DsText>
        {description !== undefined ? (
          <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14, lineHeight: 20 }}>
            {description}
          </DsText>
        ) : null}
      </View>
      {action}
    </View>
  );
}
