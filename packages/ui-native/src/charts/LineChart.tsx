/**
 * LineChart / Sparkline — çizgi grafik (react-native-svg).
 * LineChart: kap genişliğine uyar; alan dolgusu (tema renginden şeffaf
 * gradyan), noktalar, altta ilk/orta/son etiketler. Sparkline: eksensiz küçük
 * trend çizgisi (StatCard/KPI yanında). Renk varsayılan primary.
 */
import * as React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";

export interface LinePoint {
  label?: string;
  value: number;
}

type Input = number[] | LinePoint[];

function normalize(data: Input): LinePoint[] {
  return (data as (number | LinePoint)[]).map((d) => (typeof d === "number" ? { value: d } : d));
}

function buildPath(points: LinePoint[], w: number, h: number, pad: number): { line: string; area: string; coords: [number, number][] } {
  if (points.length === 0 || w <= 0) return { line: "", area: "", coords: [] };
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = points.length > 1 ? (w - pad * 2) / (points.length - 1) : 0;
  const coords = points.map((p, i): [number, number] => [pad + i * stepX, pad + (1 - (p.value - min) / span) * (h - pad * 2)]);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const first = coords[0]!;
  const last = coords[coords.length - 1]!;
  const area = `${line} L${last[0].toFixed(2)},${h} L${first[0].toFixed(2)},${h} Z`;
  return { line, area, coords };
}

export interface LineChartProps {
  data: Input;
  height?: number;
  color?: string;
  showArea?: boolean;
  showDots?: boolean;
  /** Alt etiketler (LinePoint.label'lardan). */
  showLabels?: boolean;
  accessibilityLabel?: string;
  formatValue?: (value: number) => string;
  style?: StyleProp<ViewStyle>;
}

let gradientSeq = 0;

export function LineChart({
  data,
  height = 160,
  color,
  showArea = true,
  showDots = true,
  showLabels = true,
  accessibilityLabel = "Çizgi grafik",
  formatValue = (v) => String(v),
  style,
}: LineChartProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const [width, setWidth] = React.useState(0);
  const gid = React.useRef(`ds-line-${++gradientSeq}`).current;
  const points = normalize(data);
  const stroke = color ?? theme.colors.primary;
  const labelsH = showLabels && points.some((p) => p.label) ? 20 : 0;
  const plotH = height - labelsH;
  const { line, area, coords } = buildPath(points, width, plotH, 6);
  const labelIdx = points.length > 2 ? [0, Math.floor((points.length - 1) / 2), points.length - 1] : points.map((_, i) => i);
  const firstV = points[0]?.value;
  const lastV = points[points.length - 1]?.value;

  return (
    <View
      accessible
      role="img"
      aria-label={`${accessibilityLabel}: ${points.length} nokta${firstV !== undefined && lastV !== undefined ? `, ${formatValue(firstV)} değerinden ${formatValue(lastV)} değerine` : ""}`}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[{ height }, style]}
    >
      {width > 0 ? (
        <Svg width={width} height={plotH}>
          <Defs>
            <LinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={stroke} stopOpacity={0.28} />
              <Stop offset="1" stopColor={stroke} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          {showArea ? <Path d={area} fill={`url(#${gid})`} /> : null}
          <Path d={line} stroke={stroke} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          {showDots
            ? coords.map(([x, y], i) => (
                <Circle key={i} cx={x} cy={y} r={i === coords.length - 1 ? 4.5 : 3} fill={i === coords.length - 1 ? stroke : theme.colors.background} stroke={stroke} strokeWidth={2} />
              ))
            : null}
        </Svg>
      ) : null}
      {labelsH > 0 ? (
        <View style={{ flexDirection: "row", justifyContent: "space-between", height: labelsH, alignItems: "flex-end" }}>
          {labelIdx.map((i) => (
            <DsText key={i} style={{ color: theme.colors.mutedForeground, fontSize: 11 }}>
              {points[i]?.label ?? ""}
            </DsText>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  /** Trend yönüne göre renk (artış success, düşüş destructive). */
  trendColor?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function Sparkline({
  data,
  width = 96,
  height = 32,
  color,
  trendColor = false,
  accessibilityLabel = "Trend",
  style,
}: SparklineProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const points = normalize(data);
  const { line } = buildPath(points, width, height, 3);
  const first = data[0] ?? 0;
  const last = data[data.length - 1] ?? 0;
  const stroke =
    color ?? (trendColor ? (last > first ? theme.colors.success : last < first ? theme.colors.destructive : theme.colors.mutedForeground) : theme.colors.primary);
  const trend = last > first ? "artış" : last < first ? "düşüş" : "yatay";
  return (
    <View accessible role="img" aria-label={`${accessibilityLabel}: ${trend}`} style={[{ width, height }, style]}>
      <Svg width={width} height={height}>
        <Path d={line} stroke={stroke} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      </Svg>
    </View>
  );
}
