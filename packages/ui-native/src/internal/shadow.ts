/**
 * Platforma uygun gölge: native'de shadow* + elevation, web'de (react-native-web)
 * CSS boxShadow — RNW shadow* prop'larını kullanımdan kaldırdı.
 * Renk tema `shadowColor` tokenından gelir; tonlu derinlik (gri değil).
 */
import { Platform, type ViewStyle } from "react-native";

export interface ShadowSpec {
  color: string;
  opacity: number;
  radius: number;
  offsetY: number;
  elevation: number;
}

function hexToRgb(hex: string): [number, number, number] | null {
  let v = hex.replace("#", "");
  if (v.length === 3) v = v.split("").map((c) => c + c).join("");
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) ? null : [r, g, b];
}

export function shadowStyle({ color, opacity, radius, offsetY, elevation }: ShadowSpec): ViewStyle {
  if (Platform.OS === "web") {
    const rgb = hexToRgb(color) ?? [0, 0, 0];
    return { boxShadow: `0px ${offsetY}px ${radius}px rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})` } as ViewStyle;
  }
  return {
    shadowColor: color,
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowOffset: { width: 0, height: offsetY },
    elevation,
  };
}
