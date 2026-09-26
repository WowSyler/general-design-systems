/**
 * LoadingState / ErrorState — ekran ya da bölüm düzeyinde yükleniyor ve hata
 * durumları. LoadingState: ortalanmış Spinner + mesaj (ya da `skeleton` ile
 * iskelet satırları). ErrorState: hata glifi, başlık, açıklama ve "Tekrar dene"
 * aksiyonu. `fill` ile bulunduğu alanı kaplar.
 */
import * as React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { withAlpha } from "../internal/color";
import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { Button } from "./Button";
import { SkeletonText } from "./SkeletonBlock";
import { Spinner } from "./Spinner";

export interface LoadingStateProps {
  message?: string;
  /** Spinner yerine iskelet satırları göster. */
  skeleton?: boolean;
  /** İskelet satır sayısı; varsayılan 4. */
  lines?: number;
  /** Bulunduğu alanı kapla (flex: 1). */
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function LoadingState({
  message = "Yükleniyor…",
  skeleton = false,
  lines = 4,
  fill = false,
  style,
}: LoadingStateProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  if (skeleton) {
    return (
      <View style={[{ padding: theme.space.lg }, fill ? styles.fill : null, style]}>
        <SkeletonText lines={lines} accessibilityLabel={message} />
      </View>
    );
  }
  return (
    <View
      style={[
        styles.center,
        { padding: theme.space.xl, rowGap: theme.space.md },
        fill ? styles.fill : null,
        style,
      ]}
    >
      <Spinner size="large" accessibilityLabel={message} />
      <DsText
        aria-hidden
        importantForAccessibility="no"
        style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14, textAlign: "center" }}
      >
        {message}
      </DsText>
    </View>
  );
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  /** Verilirse "Tekrar dene" butonu gösterilir. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Yeniden deneme sürüyor mu (buton yükleniyor gösterir). */
  retrying?: boolean;
  /** Glif yerine özel ikon. */
  icon?: React.ReactNode;
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ErrorState({
  title = "Bir şeyler ters gitti",
  description = "Lütfen bağlantınızı kontrol edip tekrar deneyin.",
  onRetry,
  retryLabel = "Tekrar dene",
  retrying = false,
  icon,
  fill = false,
  style,
}: ErrorStateProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  return (
    <View
      role="alert"
      style={[
        styles.center,
        { padding: theme.space.xl, rowGap: theme.space.md },
        fill ? styles.fill : null,
        style,
      ]}
    >
      {icon ?? (
        <View
          aria-hidden
          importantForAccessibility="no"
          style={[styles.circle, { backgroundColor: withAlpha(theme.colors.destructive, 0.12) }]}
        >
          <DsText allowFontScaling={false} style={{ color: theme.colors.destructive, fontSize: 26, fontWeight: "800", lineHeight: 30 }}>
            !
          </DsText>
        </View>
      )}
      <DsText
        role="heading"
        style={{ color: theme.colors.foreground, fontSize: theme.fontSize["lg"] ?? 18, lineHeight: 24, fontWeight: "600", textAlign: "center" }}
      >
        {title}
      </DsText>
      <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14, lineHeight: 20, textAlign: "center", maxWidth: 360 }}>
        {description}
      </DsText>
      {onRetry !== undefined ? (
        <Button title={retryLabel} variant="outline" loading={retrying} onPress={onRetry} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  fill: { flex: 1 },
  circle: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
});
