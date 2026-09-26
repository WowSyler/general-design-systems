/**
 * SkinMetricCard — cilt metriği kartı (GlowScan). Metrik adı, 0-100 skor,
 * seviye etiketi (skora göre İyi/Orta/Dikkat — tonlu), önceki analize göre
 * değişim ve ilerleme çubuğu. Opsiyonel ikon ve kısa öneri metni.
 */
import * as React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { withAlpha } from "../internal/color";
import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { Card } from "./Card";

export interface SkinMetricCardProps {
  label: string;
  /** 0-100 skor (yüksek = iyi). */
  score: number;
  /** Önceki analize göre puan farkı (ör. +4). */
  delta?: number;
  /** Seviye etiketini ezer. */
  levelLabel?: string;
  icon?: React.ReactNode;
  /** Kısa öneri/açıklama. */
  hint?: string;
  style?: StyleProp<ViewStyle>;
}

function level(score: number): { label: string; tone: "success" | "warning" | "destructive" } {
  if (score >= 70) return { label: "İyi", tone: "success" };
  if (score >= 45) return { label: "Orta", tone: "warning" };
  return { label: "Dikkat", tone: "destructive" };
}

export function SkinMetricCard({ label, score, delta, levelLabel, icon, hint, style }: SkinMetricCardProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const lv = level(clamped);
  const toneColor = theme.colors[lv.tone];
  const deltaText =
    delta === undefined ? null : delta > 0 ? `▲ ${delta}` : delta < 0 ? `▼ ${Math.abs(delta)}` : "– 0";

  return (
    <Card
      accessible
      role="summary"
      aria-label={`${label}: 100 üzerinden ${clamped}, ${levelLabel ?? lv.label}${delta !== undefined ? `, önceki analize göre ${delta > 0 ? "artı" : delta < 0 ? "eksi" : ""} ${Math.abs(delta)}` : ""}`}
      style={[{ rowGap: theme.space.sm }, style]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", columnGap: theme.space.sm }}>
        {icon !== undefined ? (
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: theme.colors.secondary, alignItems: "center", justifyContent: "center" }}>{icon}</View>
        ) : null}
        <DsText numberOfLines={1} style={{ flex: 1, color: theme.colors.foreground, fontSize: theme.fontSize["sm"] ?? 14, fontWeight: "600" }}>
          {label}
        </DsText>
        <View style={{ backgroundColor: withAlpha(toneColor, 0.14), borderRadius: theme.radius.pill, paddingHorizontal: 8, paddingVertical: 2 }}>
          <DsText style={{ color: toneColor, fontSize: 11, fontWeight: "700" }}>{levelLabel ?? lv.label}</DsText>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: theme.space.sm }}>
        <DsText fontRole="heading" style={{ color: theme.colors.foreground, fontSize: 32, lineHeight: 38, fontWeight: "700", fontVariant: ["tabular-nums"] }}>
          {clamped}
        </DsText>
        <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14 }}>/100</DsText>
        <View style={{ flex: 1 }} />
        {deltaText !== null ? (
          <DsText style={{ color: delta! > 0 ? theme.colors.success : delta! < 0 ? theme.colors.destructive : theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14, fontWeight: "600", fontVariant: ["tabular-nums"] }}>
            {deltaText}
          </DsText>
        ) : null}
      </View>
      <View style={{ height: 6, borderRadius: theme.radius.pill, backgroundColor: theme.colors.muted, overflow: "hidden" }}>
        <View style={{ width: `${clamped}%`, height: "100%", borderRadius: theme.radius.pill, backgroundColor: theme.colors.primary }} />
      </View>
      {hint !== undefined ? (
        <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["xs"] ?? 12, lineHeight: 17 }}>{hint}</DsText>
      ) : null}
    </Card>
  );
}
