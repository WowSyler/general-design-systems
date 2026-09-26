/**
 * Input — etiket, hata ve yardım metni destekli TextInput sarmalayıcısı.
 * Kenarlık: normalde colors.input, odakta colors.ring, hata durumunda
 * colors.destructive. Sol/sağ süsleme (adornment) alanları ReactNode kabul eder.
 * Ref, içteki TextInput'a iletilir; alan minHeight 44 (MIN_TOUCH_TARGET) ve içteki
 * TextInput alanın tüm yüksekliğini doldurur — dokunulabilir kutu (yalnızca metin
 * satırı değil) 44pt'dir; görünüm değişmez.
 */
import * as React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type StyleProp,
  type TextInputFocusEventData,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { DsText as RNText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

export interface InputProps extends TextInputProps {
  /** Girişin üzerinde gösterilen etiket. */
  label?: string;
  /** Hata mesajı — kenarlığı destructive yapar ve altta gösterilir. */
  error?: string;
  /** Hata yokken altta gösterilen yardım metni. */
  helperText?: string;
  /** Girişin solunda gösterilecek süsleme (ikon vb.). */
  left?: React.ReactNode;
  /** Girişin sağında gösterilecek süsleme (ikon vb.). */
  right?: React.ReactNode;
  /** Dış kapsayıcının stili. */
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input = React.forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    error,
    helperText,
    left,
    right,
    containerStyle,
    style,
    onFocus,
    onBlur,
    accessibilityLabel,
    ...rest
  },
  ref,
): React.JSX.Element {
  const { theme } = useNativeTheme();
  const [focused, setFocused] = React.useState(false);

  const hasError = error !== undefined && error.length > 0;

  const borderColor = hasError
    ? theme.colors.destructive
    : focused
      ? theme.colors.ring
      : theme.colors.input;

  const handleFocus = (
    e: NativeSyntheticEvent<TextInputFocusEventData>,
  ): void => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (
    e: NativeSyntheticEvent<TextInputFocusEventData>,
  ): void => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={containerStyle}>
      {label !== undefined ? (
        <RNText
          style={{
            fontSize: theme.fontSize["sm"] ?? 14,
            fontWeight: "500",
            color: theme.colors.foreground,
            marginBottom: theme.space.xs,
          }}
        >
          {label}
        </RNText>
      ) : null}

      <View
        style={[
          styles.field,
          {
            backgroundColor: theme.colors.background,
            borderColor,
            borderRadius: theme.radius.md,
            minHeight: MIN_TOUCH_TARGET,
            paddingHorizontal: theme.space.md,
            columnGap: theme.space.sm,
          },
        ]}
      >
        {left !== undefined && left !== null ? <View style={styles.adornment}>{left}</View> : null}
        <TextInput
          ref={ref}
          aria-label={accessibilityLabel ?? label}
          accessibilityHint={hasError ? error : helperText}
          {...ariaState({ disabled: rest.editable === false })}
          placeholderTextColor={theme.colors.mutedForeground}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
          style={[
            styles.input,
            {
              fontSize: theme.fontSize["base"] ?? 16,
              color: theme.colors.foreground,
            },
            style,
          ]}
        />
        {right !== undefined && right !== null ? <View style={styles.adornment}>{right}</View> : null}
      </View>

      {hasError ? (
        <RNText
          aria-live="polite"
          style={{
            fontSize: theme.fontSize["xs"] ?? 12,
            lineHeight: 16,
            color: theme.colors.destructive,
            marginTop: theme.space.xs,
          }}
        >
          {error}
        </RNText>
      ) : helperText !== undefined ? (
        <RNText
          style={{
            fontSize: theme.fontSize["xs"] ?? 12,
            lineHeight: 16,
            color: theme.colors.mutedForeground,
            marginTop: theme.space.xs,
          }}
        >
          {helperText}
        </RNText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  // Giriş alanın tüm yüksekliğini doldurur; kenarlık kalınlığı kadar negatif
  // margin ile 44pt'lik dokunma kutusu alan yüksekliğini büyütmez.
  input: {
    flex: 1,
    alignSelf: "stretch",
    paddingVertical: 0,
    minHeight: MIN_TOUCH_TARGET,
    marginVertical: -StyleSheet.hairlineWidth,
  },
  // Süslemeler (ör. 44pt "Göster" butonu) da kenarlığın altına uzanabilir.
  adornment: {
    justifyContent: "center",
    marginVertical: -StyleSheet.hairlineWidth,
  },
});
