/**
 * TextArea — çok satırlı metin girişi. Etiket, yardım/hata metni ve `maxLength`
 * verildiğinde "12/200" karakter sayacı. Yükseklik `minRows`'tan başlar,
 * `autoGrow` ile içerikle büyür (maxRows'a kadar).
 */
import * as React from "react";
import {
  TextInput,
  View,
  StyleSheet,
  type NativeSyntheticEvent,
  type StyleProp,
  type TextInputContentSizeChangeEventData,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

export interface TextAreaProps extends Omit<TextInputProps, "multiline"> {
  label?: string;
  error?: string;
  helperText?: string;
  /** Başlangıç satır sayısı; varsayılan 3. */
  minRows?: number;
  /** autoGrow açıkken azami satır; varsayılan 8. */
  maxRows?: number;
  /** İçerikle büyü; varsayılan true. */
  autoGrow?: boolean;
  /** Sayaç gösterilsin mi (maxLength varsa); varsayılan true. */
  showCount?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const LINE_HEIGHT = 22;

export const TextArea = React.forwardRef<TextInput, TextAreaProps>(function TextArea(
  {
    label,
    error,
    helperText,
    minRows = 3,
    maxRows = 8,
    autoGrow = true,
    showCount = true,
    maxLength,
    value,
    defaultValue,
    onChangeText,
    onContentSizeChange,
    containerStyle,
    style,
    onFocus,
    onBlur,
    editable,
    accessibilityLabel,
    ...rest
  },
  ref,
): React.JSX.Element {
  const { theme } = useNativeTheme();
  const [focused, setFocused] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const [contentHeight, setContentHeight] = React.useState(0);
  const text = value ?? internal;
  const hasError = error !== undefined && error.length > 0;
  const pad = theme.space.md;
  const minH = minRows * LINE_HEIGHT + pad * 2;
  const maxH = maxRows * LINE_HEIGHT + pad * 2;
  const height = autoGrow ? Math.min(maxH, Math.max(minH, contentHeight + pad * 2)) : minH;

  const handleSize = (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    setContentHeight(e.nativeEvent.contentSize.height);
    onContentSizeChange?.(e);
  };

  return (
    <View style={[{ rowGap: theme.space.xs }, containerStyle]}>
      {label !== undefined ? (
        <DsText style={{ color: theme.colors.foreground, fontSize: theme.fontSize["sm"] ?? 14, fontWeight: "500" }}>
          {label}
        </DsText>
      ) : null}
      <TextInput
        ref={ref}
        multiline
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        editable={editable}
        onChangeText={(t) => {
          setInternal(t);
          onChangeText?.(t);
        }}
        onContentSizeChange={handleSize}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        aria-label={accessibilityLabel ?? label}
        accessibilityHint={hasError ? error : helperText}
        {...ariaState({ disabled: editable === false })}
        placeholderTextColor={theme.colors.mutedForeground}
        textAlignVertical="top"
        maxFontSizeMultiplier={1.6}
        {...rest}
        style={[
          {
            height,
            padding: pad,
            fontSize: theme.fontSize["base"] ?? 16,
            lineHeight: LINE_HEIGHT,
            color: theme.colors.foreground,
            backgroundColor: theme.colors.background,
            borderRadius: theme.radius.md,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: hasError ? theme.colors.destructive : focused ? theme.colors.ring : theme.colors.input,
            opacity: editable === false ? 0.6 : 1,
          },
          style,
        ]}
      />
      {hasError || helperText !== undefined || (showCount && maxLength !== undefined) ? (
        <View style={{ flexDirection: "row", columnGap: theme.space.sm }}>
          <DsText
            aria-live={hasError ? "polite" : undefined}
            style={{ flex: 1, fontSize: theme.fontSize["xs"] ?? 12, lineHeight: 16, color: hasError ? theme.colors.destructive : theme.colors.mutedForeground }}
          >
            {hasError ? error : (helperText ?? "")}
          </DsText>
          {showCount && maxLength !== undefined ? (
            <DsText
              aria-label={`${text.length} / ${maxLength} karakter`}
              style={{ fontSize: theme.fontSize["xs"] ?? 12, lineHeight: 16, color: text.length >= maxLength ? theme.colors.destructive : theme.colors.mutedForeground, fontVariant: ["tabular-nums"] }}
            >
              {`${text.length}/${maxLength}`}
            </DsText>
          ) : null}
        </View>
      ) : null}
    </View>
  );
});
