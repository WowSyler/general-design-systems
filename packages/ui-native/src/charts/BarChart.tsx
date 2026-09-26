/**
 * BarChart — dikey çubuk grafik (Fisly aylık harcama, Randevu doluluk).
 * View tabanlıdır (SVG gerekmez); 3 yatay kılavuz çizgisi, çubuk üstünde
 * opsiyonel değer, altta etiketler. `highlightIndex` çubuğu primary, diğerleri
 * soluk primary (ya da tek renk). Dar ekranda çubuklar esner; çok veri varsa
 * `minBarWidth` ile yatay kaydırma. Sıra yazı yönünü izler.
 */
import * as React from "react";
import { ScrollView, View, type StyleProp, type ViewStyle } from "react-native";

import { withAlpha } from "../internal/color";
import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";

export interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarDatum[];
  height?: number;
  /** Vurgulanacak çubuk (ör. içinde bulunulan ay). */
  highlightIndex?: number;
  showValues?: boolean;
  formatValue?: (value: number) => string;
  /** Çubuk başına asgari genişlik; toplam sığmazsa yatay kaydırılır. */
  minBarWidth?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function BarChart({
  data,
  height = 180,
  highlightIndex,
  showValues = false,
  formatValue = (v) => String(v),
  minBarWidth = 28,
  accessibilityLabel = "Çubuk grafik",
  style,
}: BarChartProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const [width, setWidth] = React.useState(0);
  const max = Math.max(1, ...data.map((d) => d.value));
  const gap = theme.space.sm;
  const needed = data.length * (minBarWidth + gap);
  const scroll = width > 0 && needed > width;
  const plotH = height - 24 - (showValues ? 18 : 0);

  const bars = (
    <View style={{ flexDirection: "row", alignItems: "flex-end", height, columnGap: gap, width: scroll ? needed : "100%" }}>
      {data.map((d, i) => {
        const h = Math.max(2, (d.value / max) * plotH);
        const active = highlightIndex === undefined || highlightIndex === i;
        const color = d.color ?? theme.colors.primary;
        return (
          <View key={`${d.label}-${i}`} style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", height }}>
            {showValues ? (
              <DsText numberOfLines={1} style={{ color: active ? theme.colors.foreground : theme.colors.mutedForeground, fontSize: 10, fontWeight: "600", fontVariant: ["tabular-nums"], marginBottom: 4 }}>
                {formatValue(d.value)}
              </DsText>
            ) : null}
            <View
              style={{
                width: "70%",
                maxWidth: 40,
                height: h,
                borderTopStartRadius: theme.radius.sm,
                borderTopEndRadius: theme.radius.sm,
                backgroundColor: active ? color : withAlpha(color, 0.3),
              }}
            />
            <DsText numberOfLines={1} style={{ color: highlightIndex === i ? theme.colors.foreground : theme.colors.mutedForeground, fontSize: 11, marginTop: 6, fontWeight: highlightIndex === i ? "700" : "400", height: 18 }}>
              {d.label}
            </DsText>
          </View>
        );
      })}
    </View>
  );

  return (
    <View
      accessible
      role="img"
      aria-label={`${accessibilityLabel}: ${data.map((d) => `${d.label} ${formatValue(d.value)}`).join(", ")}`}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[{ height }, style]}
    >
      <View style={{ pointerEvents: "none", position: "absolute", top: showValues ? 18 : 0, start: 0, end: 0, height: plotH, justifyContent: "space-between" }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ height: 1, backgroundColor: theme.colors.border, opacity: 0.6 }} />
        ))}
      </View>
      {scroll ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {bars}
        </ScrollView>
      ) : (
        bars
      )}
    </View>
  );
}
