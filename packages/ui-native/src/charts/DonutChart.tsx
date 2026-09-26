/**
 * DonutChart — halka grafik (Fisly kategori dağılımı, GlowScan metrik payları).
 * Dilim renkleri temanın chart1..chart5 paletinden (ya da veri `color`'ından).
 * Ortada toplam/başlık; altta (telefon) ya da yanda (`legendPosition="side"`)
 * yüzdelerle lejant. Ekran okuyucu tüm dağılımı tek cümlede okur.
 */
import * as React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { colorAt } from "./palette";

export interface DonutDatum {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutDatum[];
  size?: number;
  /** Halka kalınlığı; varsayılan size * 0.14. */
  thickness?: number;
  centerValue?: string;
  centerLabel?: string;
  showLegend?: boolean;
  legendPosition?: "bottom" | "side";
  /** Lejantta değer biçimlendirici (varsayılan: yüzde). */
  formatValue?: (value: number, percent: number) => string;
  /** Erişilebilirlik başlığı (ör. "Harcama dağılımı"). */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function DonutChart({
  data,
  size = 180,
  thickness,
  centerValue,
  centerLabel,
  showLegend = true,
  legendPosition = "bottom",
  formatValue = (_v, p) => `%${Math.round(p)}`,
  accessibilityLabel = "Dağılım grafiği",
  style,
}: DonutChartProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const stroke = thickness ?? Math.round(size * 0.14);
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0);
  const gap = data.length > 1 ? Math.min(4, circumference * 0.01) : 0;

  let offset = 0;
  const arcs = data.map((d, i) => {
    const pct = total > 0 ? Math.max(0, d.value) / total : 0;
    const len = Math.max(0, pct * circumference - gap);
    const arc = { color: colorAt(theme, i, d.color), len, offset, pct: pct * 100, datum: d };
    offset += pct * circumference;
    return arc;
  });

  const summary = `${accessibilityLabel}: ${arcs.map((a) => `${a.datum.label} ${formatValue(a.datum.value, a.pct)}`).join(", ")}`;
  const side = legendPosition === "side";

  return (
    <View
      accessible
      role="img"
      aria-label={summary}
      style={[{ flexDirection: side ? "row" : "column", alignItems: "center", columnGap: theme.space.xl, rowGap: theme.space.lg }, style]}
    >
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <Circle cx={size / 2} cy={size / 2} r={r} stroke={theme.colors.muted} strokeWidth={stroke} fill="none" />
            {arcs.map((a, i) =>
              a.len > 0 ? (
                <Circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  stroke={a.color}
                  strokeWidth={stroke}
                  fill="none"
                  strokeDasharray={`${a.len} ${circumference}`}
                  strokeDashoffset={-a.offset}
                  strokeLinecap={data.length === 1 ? "round" : "butt"}
                />
              ) : null,
            )}
          </G>
        </Svg>
        {centerValue !== undefined || centerLabel !== undefined ? (
          <View style={{ position: "absolute", top: 0, bottom: 0, start: 0, end: 0, alignItems: "center", justifyContent: "center", paddingHorizontal: stroke + 4 }}>
            {centerValue !== undefined ? (
              <DsText fontRole="heading" numberOfLines={1} adjustsFontSizeToFit style={{ color: theme.colors.foreground, fontSize: Math.round(size * 0.14), fontWeight: "700", fontVariant: ["tabular-nums"] }}>
                {centerValue}
              </DsText>
            ) : null}
            {centerLabel !== undefined ? (
              <DsText numberOfLines={1} style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["xs"] ?? 12 }}>{centerLabel}</DsText>
            ) : null}
          </View>
        ) : null}
      </View>
      {showLegend ? (
        <View style={{ rowGap: theme.space.sm, alignSelf: side ? "center" : "stretch", flexShrink: 1 }}>
          {arcs.map((a, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", columnGap: theme.space.sm }}>
              <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: a.color }} />
              <DsText numberOfLines={1} style={{ flexShrink: 1, flexGrow: side ? 0 : 1, color: theme.colors.foreground, fontSize: theme.fontSize["sm"] ?? 14 }}>
                {a.datum.label}
              </DsText>
              <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14, fontWeight: "600", fontVariant: ["tabular-nums"], marginStart: side ? theme.space.md : 0 }}>
                {formatValue(a.datum.value, a.pct)}
              </DsText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
