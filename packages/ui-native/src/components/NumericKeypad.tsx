/**
 * NumericKeypad — ekran üstü sayısal tuş takımı (Fisly tutar girişi, PIN).
 * 3×4 ızgara: 1-9, ondalık ayırıcı (opsiyonel), 0 ve geri silme. İki kullanım:
 *  - Denetimli: `value` + `onChange` (maxLength, maxDecimals uygulanır)
 *  - Ham: `onKeyPress(key)` ile her tuş olayı
 * Tuşlar ≥ 56pt; ekran okuyucu için etiketlidir.
 */
import * as React from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";

export type KeypadKey = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "decimal" | "backspace";

export interface NumericKeypadProps {
  value?: string;
  onChange?: (value: string) => void;
  onKeyPress?: (key: KeypadKey) => void;
  /** Ondalık tuşu göster; varsayılan true. */
  allowDecimal?: boolean;
  /** Ondalık ayırıcı karakteri; varsayılan ",". */
  decimalSeparator?: string;
  maxLength?: number;
  /** Ondalık basamak sınırı; varsayılan 2. */
  maxDecimals?: number;
  /** Tuş yüksekliği; varsayılan 60. */
  keyHeight?: number;
  style?: StyleProp<ViewStyle>;
}

const ROWS: KeypadKey[][] = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["decimal", "0", "backspace"],
];

/** Tuşu metne uygular (denetimli kullanım için dışa açık). */
export function applyKeypadKey(
  current: string,
  key: KeypadKey,
  opts: { decimalSeparator?: string; maxLength?: number; maxDecimals?: number } = {},
): string {
  const sep = opts.decimalSeparator ?? ",";
  const maxDecimals = opts.maxDecimals ?? 2;
  if (key === "backspace") return current.slice(0, -1);
  if (opts.maxLength !== undefined && current.length >= opts.maxLength) return current;
  if (key === "decimal") {
    if (current.includes(sep) || maxDecimals === 0) return current;
    return (current.length === 0 ? "0" : current) + sep;
  }
  const [, frac] = current.split(sep);
  if (frac !== undefined && frac.length >= maxDecimals) return current;
  if (current === "0") return key;
  return current + key;
}

export function NumericKeypad({
  value,
  onChange,
  onKeyPress,
  allowDecimal = true,
  decimalSeparator = ",",
  maxLength,
  maxDecimals = 2,
  keyHeight = 60,
  style,
}: NumericKeypadProps): React.JSX.Element {
  const { theme } = useNativeTheme();

  const press = (key: KeypadKey) => {
    onKeyPress?.(key);
    if (onChange !== undefined) {
      onChange(applyKeypadKey(value ?? "", key, { decimalSeparator, maxLength, maxDecimals }));
    }
  };

  return (
    <View style={[{ rowGap: theme.space.sm }, style]}>
      {ROWS.map((row, r) => (
        <View key={r} style={{ flexDirection: "row", columnGap: theme.space.sm }}>
          {row.map((key) => {
            if (key === "decimal" && !allowDecimal) {
              return <View key={key} style={styles.key} />;
            }
            const label = key === "decimal" ? decimalSeparator : key === "backspace" ? "⌫" : key;
            const a11y = key === "decimal" ? "Ondalık ayırıcı" : key === "backspace" ? "Sil" : key;
            return (
              <Pressable
                key={key}
                role="button"
                aria-label={a11y}
                onPress={() => press(key)}
                style={({ pressed }) => [
                  styles.key,
                  {
                    height: keyHeight,
                    borderRadius: theme.radius.lg,
                    backgroundColor: pressed ? theme.colors.accent : key === "backspace" || key === "decimal" ? "transparent" : theme.colors.muted,
                  },
                ]}
              >
                <DsText
                  allowFontScaling={false}
                  style={{ color: theme.colors.foreground, fontSize: key === "backspace" ? 22 : 26, fontWeight: "500", fontVariant: ["tabular-nums"] }}
                >
                  {label}
                </DsText>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  key: { flex: 1, alignItems: "center", justifyContent: "center" },
});
