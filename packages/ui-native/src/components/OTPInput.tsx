/**
 * OTPInput — tek kullanımlık kod girişi (SMS/e-posta doğrulama). Görünür kutular
 * dekoratiftir; girdi, kutuların üstünde görünmez tek bir TextInput'tan gelir
 * (otomatik doldurma: textContentType="oneTimeCode", autoComplete sms-otp/one-time-code).
 * Tüm haneler dolunca `onComplete` çağrılır. `secure` haneleri • ile maskeler.
 */
import * as React from "react";
import { Platform, Pressable, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from "react-native";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";

export interface OTPInputProps {
  value: string;
  onChange: (code: string) => void;
  /** Tüm haneler dolunca. */
  onComplete?: (code: string) => void;
  /** Hane sayısı; varsayılan 6. */
  length?: number;
  /** Hata durumu (kutular destructive çerçeve) ve mesajı. */
  error?: string;
  secure?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function OTPInput({
  value,
  onChange,
  onComplete,
  length = 6,
  error,
  secure = false,
  autoFocus = false,
  disabled = false,
  accessibilityLabel,
  style,
}: OTPInputProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const inputRef = React.useRef<TextInput>(null);
  const [focused, setFocused] = React.useState(false);
  const hasError = error !== undefined && error.length > 0;
  const digits = value.slice(0, length).split("");
  const activeIndex = Math.min(digits.length, length - 1);

  const handleChange = (text: string) => {
    const next = text.replace(/\D/g, "").slice(0, length);
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  return (
    <View style={[{ rowGap: theme.space.sm }, style]}>
      <Pressable
        accessible={false}
        disabled={disabled}
        onPress={() => inputRef.current?.focus()}
        style={[styles.row, { columnGap: theme.space.sm }]}
      >
        {Array.from({ length }, (_, i) => {
          const char = digits[i];
          const isActive = focused && i === activeIndex;
          return (
            <View
              key={i}
              aria-hidden
              importantForAccessibility="no-hide-descendants"
              style={[
                styles.box,
                {
                  borderRadius: theme.radius.md,
                  backgroundColor: theme.colors.background,
                  borderColor: hasError
                    ? theme.colors.destructive
                    : isActive
                      ? theme.colors.ring
                      : theme.colors.input,
                  borderWidth: isActive || hasError ? 2 : StyleSheet.hairlineWidth * 2,
                  opacity: disabled ? 0.5 : 1,
                },
              ]}
            >
              <DsText
                allowFontScaling={false}
                fontRole="mono"
                style={{ color: theme.colors.foreground, fontSize: theme.fontSize["xl"] ?? 20, fontWeight: "600" }}
              >
                {char === undefined ? "" : secure ? "•" : char}
              </DsText>
            </View>
          );
        })}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleChange}
          maxLength={length}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          // Android: SMS kodu; iOS/web: tek kullanımlık kod (HTML "one-time-code").
          autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
          autoFocus={autoFocus}
          editable={!disabled}
          caretHidden
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label={accessibilityLabel ?? `Doğrulama kodu, ${length} hane`}
          accessibilityHint={hasError ? error : undefined}
          style={styles.hiddenInput}
        />
      </Pressable>
      {hasError ? (
        <DsText aria-live="polite" style={{ color: theme.colors.destructive, fontSize: theme.fontSize["xs"] ?? 12 }}>
          {error}
        </DsText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center" },
  box: {
    flex: 1,
    maxWidth: 52,
    aspectRatio: 0.85,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.01,
    color: "transparent",
  },
});
