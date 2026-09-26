/**
 * Calendar / DatePicker — saf RN takvim (ek bağımlılık yok).
 * Calendar: ay ızgarası; önceki/sonraki ay okları (RTL'de aynalanır), bugün
 * çerçeveli, seçili gün primary dolgulu; min/max dışı günler devre dışı.
 * Varsayılanlar Türkçe (ay/gün adları, haftanın ilk günü Pazartesi).
 * DatePicker: Select benzeri tetik alanı; dokununca Calendar'ı telefonda alt
 * sayfada, tablette ortada açar; gün seçilince kapanır.
 */
import * as React from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { AdaptiveModal, type ModalPresentation } from "../internal/AdaptiveModal";
import {
  TR_MONTHS,
  TR_WEEKDAYS_SHORT,
  addMonths,
  formatDateLong,
  isSameDay,
  isWithin,
  monthGrid,
  startOfDay,
} from "../internal/date";
import { DsText } from "../internal/DsText";
import { Chevron } from "../internal/Glyphs";
import { useNativeTheme } from "../theme/ThemeProvider";
import { IconButton } from "./IconButton";
import { ariaState, pressedState } from "../internal/a11y";

export interface CalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Belirli günleri devre dışı bırak (ör. kapalı günler). */
  isDateDisabled?: (date: Date) => boolean;
  /** Başlangıçta gösterilecek ay; varsayılan value ya da bugün. */
  initialMonth?: Date;
  /** 1 = Pazartesi (varsayılan), 0 = Pazar. */
  weekStartsOn?: 0 | 1;
  monthNames?: readonly string[];
  /** Haftanın ilk gününden başlayan kısa gün adları. */
  weekdayNames?: readonly string[];
  /** Bugünün tarihi (test/önizleme için sabitlenebilir). */
  today?: Date;
  style?: StyleProp<ViewStyle>;
}

export function Calendar({
  value,
  onChange,
  minDate,
  maxDate,
  isDateDisabled,
  initialMonth,
  weekStartsOn = 1,
  monthNames = TR_MONTHS,
  weekdayNames,
  today = new Date(),
  style,
}: CalendarProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const [month, setMonth] = React.useState(() => {
    const base = initialMonth ?? value ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const weeks = monthGrid(month, weekStartsOn);
  const names =
    weekdayNames ??
    (weekStartsOn === 1 ? TR_WEEKDAYS_SHORT : [TR_WEEKDAYS_SHORT[6], ...TR_WEEKDAYS_SHORT.slice(0, 6)]);

  const prevMonth = addMonths(month, -1);
  const nextMonth = addMonths(month, 1);
  const canPrev = !minDate || new Date(month.getFullYear(), month.getMonth(), 0) >= startOfDay(minDate);
  const canNext = !maxDate || nextMonth <= startOfDay(maxDate);

  return (
    <View style={[{ rowGap: theme.space.sm }, style]}>
      <View style={styles.header}>
        <IconButton
          accessibilityLabel="Önceki ay"
          disabled={!canPrev}
          onPress={() => setMonth(prevMonth)}
          icon={({ color }) => <Chevron direction="back" color={color} size={22} />}
        />
        <DsText
          role="heading"
          aria-live="polite"
          style={{ flex: 1, textAlign: "center", color: theme.colors.foreground, fontSize: theme.fontSize["base"] ?? 16, fontWeight: "600" }}
        >
          {`${monthNames[month.getMonth()] ?? ""} ${month.getFullYear()}`}
        </DsText>
        <IconButton
          accessibilityLabel="Sonraki ay"
          disabled={!canNext}
          onPress={() => setMonth(nextMonth)}
          icon={({ color }) => <Chevron direction="forward" color={color} size={22} />}
        />
      </View>
      <View style={styles.week} aria-hidden importantForAccessibility="no-hide-descendants">
        {names.map((n) => (
          <DsText key={n} style={[styles.cell, { color: theme.colors.mutedForeground, fontSize: theme.fontSize["xs"] ?? 12, fontWeight: "600", textAlign: "center" }]}>
            {n}
          </DsText>
        ))}
      </View>
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.week}>
          {week.map((day, di) => {
            if (day === null) return <View key={di} style={styles.cell} />;
            const selected = isSameDay(day, value);
            const isToday = isSameDay(day, today);
            const disabled = !isWithin(day, minDate, maxDate) || isDateDisabled?.(day) === true;
            // Hücrenin tamamı dokunma hedefidir (esnek genişlik × en az 44pt);
            // 40pt'lik daire yalnızca görsel vurgudur.
            return (
              <Pressable
                key={di}
                role="button"
                aria-label={formatDateLong(day, monthNames) + (isToday ? ", bugün" : "")}
                {...ariaState({ disabled })}
                {...pressedState(selected)}
                disabled={disabled}
                onPress={() => onChange(day)}
                // Yoğun ızgara: 320pt ekranda 7 sütun 44pt'e sığmaz; hücre 44pt yüksek,
                // genişlik ≥24pt (WCAG 2.5.8 AA). Denetim bu işareti tanır.
                testID="ds-touch-dense:calendar-day"
                style={[styles.cell, styles.dayCell]}
              >
                {({ pressed }) => (
                  <View
                    style={[
                      styles.day,
                      {
                        borderRadius: theme.radius.pill,
                        backgroundColor: selected ? theme.colors.primary : pressed ? theme.colors.muted : "transparent",
                        borderWidth: isToday && !selected ? 1 : 0,
                        borderColor: theme.colors.primary,
                      },
                    ]}
                  >
                    <DsText
                      style={{
                        color: selected
                          ? theme.colors.primaryForeground
                          : disabled
                            ? theme.colors.mutedForeground
                            : theme.colors.foreground,
                        opacity: disabled ? 0.45 : 1,
                        fontSize: theme.fontSize["sm"] ?? 14,
                        fontWeight: selected || isToday ? "700" : "400",
                        fontVariant: ["tabular-nums"],
                      }}
                    >
                      {day.getDate()}
                    </DsText>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export interface DatePickerProps extends Omit<CalendarProps, "value" | "onChange" | "style"> {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  /** Tetik alanında gösterilecek biçim; varsayılan "22 Eylül 2026". */
  formatDate?: (date: Date) => string;
  presentation?: ModalPresentation;
  style?: StyleProp<ViewStyle>;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Tarih seçin",
  error,
  disabled = false,
  formatDate,
  presentation = "auto",
  style,
  ...calendarProps
}: DatePickerProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const [open, setOpen] = React.useState(false);
  const hasError = error !== undefined && error.length > 0;
  const text = value ? (formatDate ?? ((d: Date) => formatDateLong(d, calendarProps.monthNames)))(value) : placeholder;

  return (
    <View style={[{ rowGap: theme.space.xs }, style]}>
      {label !== undefined ? (
        <DsText style={{ color: theme.colors.foreground, fontSize: theme.fontSize["sm"] ?? 14, fontWeight: "500" }}>{label}</DsText>
      ) : null}
      <Pressable
        role="button"
        aria-label={`${label ?? "Tarih"}: ${value ? text : "seçilmedi"}`}
        accessibilityHint="Takvimi açar"
        {...ariaState({ disabled, expanded: open })}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            minHeight: MIN_TOUCH_TARGET,
            borderRadius: theme.radius.md,
            paddingHorizontal: theme.space.md,
            backgroundColor: theme.colors.background,
            borderColor: hasError ? theme.colors.destructive : theme.colors.input,
            opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          },
        ]}
      >
        <DsText style={{ flex: 1, color: value ? theme.colors.foreground : theme.colors.mutedForeground, fontSize: theme.fontSize["base"] ?? 16 }}>
          {text}
        </DsText>
        <CalendarGlyph color={theme.colors.mutedForeground} />
      </Pressable>
      {hasError ? (
        <DsText aria-live="polite" style={{ color: theme.colors.destructive, fontSize: theme.fontSize["xs"] ?? 12 }}>
          {error}
        </DsText>
      ) : null}
      <AdaptiveModal visible={open} onClose={() => setOpen(false)} title={label ?? "Tarih seçin"} presentation={presentation} maxWidth={400}>
        <Calendar
          {...calendarProps}
          value={value}
          onChange={(d) => {
            onChange(d);
            setOpen(false);
          }}
        />
      </AdaptiveModal>
    </View>
  );
}

function CalendarGlyph({ color }: { color: string }): React.JSX.Element {
  return (
    <View aria-hidden importantForAccessibility="no" style={[styles.calGlyph, { borderColor: color }]}>
      <View style={{ height: 3, backgroundColor: color }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center" },
  week: { flexDirection: "row" },
  cell: { flex: 1, minWidth: 0, minHeight: MIN_TOUCH_TARGET, justifyContent: "center" },
  dayCell: { alignItems: "center" },
  // Dar ekranda hücre 40pt'den darsa daire hücreye sığacak kadar küçülür.
  day: { width: 40, maxWidth: "100%", aspectRatio: 1, alignItems: "center", justifyContent: "center" },
  trigger: { flexDirection: "row", alignItems: "center", borderWidth: StyleSheet.hairlineWidth },
  calGlyph: { width: 16, height: 15, borderWidth: 1.5, borderRadius: 3, overflow: "hidden" },
});
