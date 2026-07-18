/**
 * @ds/ui-native — React Native bileşen kütüphanesi giriş noktası.
 * Tema sağlayıcı, temel bileşenler ve @ds/tokens/native yeniden dışa aktarımları.
 */

// Tema
export {
  NativeThemeProvider,
  useNativeTheme,
  makeStyles,
  type NativeThemeContextValue,
  type NativeThemeProviderProps,
  type ThemeModeSetting,
} from "./theme/ThemeProvider";

// Bileşenler
export { Text, type TextProps, type TextVariant, type TextColor } from "./components/Text";
export {
  Button,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from "./components/Button";
export {
  Card,
  ELEVATION_PRESETS,
  type CardProps,
  type CardElevation,
} from "./components/Card";
export { Input, type InputProps } from "./components/Input";
export { Badge, type BadgeProps, type BadgeVariant } from "./components/Badge";
export { Chip, type ChipProps } from "./components/Chip";
export {
  MetricBar,
  type MetricBarProps,
  type MetricTone,
} from "./components/MetricBar";
export { ScoreBadge, type ScoreBadgeProps } from "./components/ScoreBadge";
export {
  StatCard,
  type StatCardProps,
  type StatDelta,
  type StatTrend,
} from "./components/StatCard";
export { EmptyState, type EmptyStateProps } from "./components/EmptyState";
export {
  Divider,
  type DividerProps,
  type DividerOrientation,
} from "./components/Divider";
export { Sheet, type SheetProps } from "./components/Sheet";
export { Screen, type ScreenProps } from "./components/Screen";

// Token yeniden dışa aktarımları
export {
  themes,
  getTheme,
  resolveNativeTheme,
  MIN_TOUCH_TARGET,
  space,
} from "@ds/tokens/native";
export type {
  NativeTheme,
  ColorTokens,
  ThemeDefinition,
  ColorMode,
} from "@ds/tokens/native";
