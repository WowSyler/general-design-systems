/**
 * PeriodSwitcher — dönem gezgini (Fisly özet: "Eylül 2026" ‹ ›). Önceki/sonraki
 * okları (RTL'de aynalanır) ve ortada dönem etiketi; opsiyonel olarak altında
 * granülerlik seçimi (Hafta/Ay/Yıl) SegmentedControl ile. Etiketi üst bileşen
 * üretir; bileşen yalnızca olayları bildirir.
 */
import * as React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { DsText } from "../internal/DsText";
import { Chevron } from "../internal/Glyphs";
import { useNativeTheme } from "../theme/ThemeProvider";
import { IconButton } from "./IconButton";
import { SegmentedControl, type SegmentedControlItem } from "./SegmentedControl";

export interface PeriodSwitcherProps {
  /** Görünen dönem etiketi (ör. "Eylül 2026"). */
  label: string;
  /** Etiketin altındaki küçük açıklama (ör. "1–30 Eyl"). */
  caption?: string;
  onPrev: () => void;
  onNext: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  /** Granülerlik seçenekleri; verilirse segment kontrol gösterilir. */
  granularities?: SegmentedControlItem[];
  granularity?: string;
  onGranularityChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function PeriodSwitcher({
  label,
  caption,
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  granularities,
  granularity,
  onGranularityChange,
  style,
}: PeriodSwitcherProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  return (
    <View style={[{ rowGap: theme.space.md }, style]}>
      {granularities !== undefined && granularity !== undefined && onGranularityChange !== undefined ? (
        <SegmentedControl items={granularities} value={granularity} onValueChange={onGranularityChange} size="sm" accessibilityLabel="Dönem türü" />
      ) : null}
      <View style={{ flexDirection: "row", alignItems: "center", columnGap: theme.space.sm }}>
        <IconButton
          variant="outline"
          accessibilityLabel="Önceki dönem"
          disabled={!canPrev}
          onPress={onPrev}
          icon={({ color }) => <Chevron direction="back" color={color} size={22} />}
        />
        <View style={{ flex: 1, alignItems: "center" }} accessible aria-live="polite" aria-label={caption ? `${label}, ${caption}` : label}>
          <DsText fontRole="heading" style={{ color: theme.colors.foreground, fontSize: theme.fontSize["lg"] ?? 18, fontWeight: "600" }}>
            {label}
          </DsText>
          {caption !== undefined ? (
            <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["xs"] ?? 12 }}>{caption}</DsText>
          ) : null}
        </View>
        <IconButton
          variant="outline"
          accessibilityLabel="Sonraki dönem"
          disabled={!canNext}
          onPress={onNext}
          icon={({ color }) => <Chevron direction="forward" color={color} size={22} />}
        />
      </View>
    </View>
  );
}
