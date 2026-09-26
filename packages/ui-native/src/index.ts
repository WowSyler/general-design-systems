/**
 * @wowsyler/ds-ui-native — React Native bileşen kütüphanesi giriş noktası.
 * Tema sağlayıcı, temel bileşenler ve @wowsyler/ds-tokens/native yeniden dışa aktarımları.
 */

// Tema
export {
  NativeThemeProvider,
  useNativeTheme,
  useIsRTL,
  makeStyles,
  type NativeThemeContextValue,
  type NativeThemeProviderProps,
  type ThemeModeSetting,
  type TextDirection,
  type NativeFonts,
  type FontFamilySource,
  type FontWeightMap,
} from "./theme/ThemeProvider";

// Hook'lar ve responsive araçlar
export * from "./hooks/useBreakpoint";
export { useReducedMotion } from "./internal/useReducedMotion";
export { useSafeInsets } from "./internal/useSafeInsets";
export type { ModalPresentation } from "./internal/AdaptiveModal";
export {
  formatMoney,
  formatNumber,
  parseAmount,
  currencySymbol,
} from "./internal/format";

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
  elevationStyle,
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
export { Sheet, type SheetProps, type SheetPresentation } from "./components/Sheet";
export { Screen, SCREEN_MAX_CONTENT_WIDTH, type ScreenProps } from "./components/Screen";

// Token yeniden dışa aktarımları
export {
  themes,
  getTheme,
  resolveNativeTheme,
  MIN_TOUCH_TARGET,
  space,
  scales,
} from "@wowsyler/ds-tokens/native";
export type {
  NativeTheme,
  ColorTokens,
  ThemeDefinition,
  ColorMode,
} from "@wowsyler/ds-tokens/native";

// === A-Z parite genisletme (yeni RN bilesenleri) ===
export * from "./components/Avatar";
export * from "./components/BottomNav";
export * from "./components/Checkbox";
export * from "./components/ListRow";
export * from "./components/ModalDialog";
export * from "./components/ProgressBar";
export * from "./components/SegmentedControl";
export * from "./components/Select";
export * from "./components/SkeletonBlock";
export * from "./components/Tabs";
export * from "./components/Toast";
export * from "./components/ToggleSwitch";

// === v0.2 — tam kapsam: form, geri bildirim, yapı, domain, tablet ===
// Yapı / yerleşim
export * from "./components/Stack";
export * from "./components/Container";
export * from "./components/Grid";
export * from "./components/Header";
export * from "./components/SectionHeader";
export * from "./components/KeyboardAwareScreen";
export * from "./components/Accordion";
export * from "./components/Settings";
export * from "./components/IconButton";
export * from "./components/TextButton";
export * from "./components/AvatarGroup";
export * from "./components/SwipeableRow";
export * from "./components/Navigation";
// Form
export * from "./components/FormField";
export * from "./components/TextArea";
export * from "./components/PasswordInput";
export * from "./components/SearchBar";
export * from "./components/OTPInput";
export * from "./components/RadioGroup";
export * from "./components/Slider";
export * from "./components/QuantityStepper";
export * from "./components/DatePicker";
export * from "./components/TimeSlotPicker";
export * from "./components/NumericKeypad";
export * from "./components/CategoryPicker";
export * from "./components/Money";
// Geri bildirim
export * from "./components/Banner";
export * from "./components/Spinner";
export * from "./components/StatusStates";
export * from "./components/ConfirmDialog";
export * from "./components/StatusChip";
// Domain
export * from "./components/TransactionRow";
export * from "./components/PeriodSwitcher";
export * from "./components/BudgetBar";
export * from "./components/PriceTag";
export * from "./components/Rating";
export * from "./components/ProductCard";
export * from "./components/SkinMetricCard";
