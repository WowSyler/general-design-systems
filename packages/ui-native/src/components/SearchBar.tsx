/**
 * SearchBar — hap biçimli arama alanı. Başta büyüteç, doluyken sonda temizle
 * (✕) butonu; `onCancel` verilirse odaktayken yanında "Vazgeç" butonu (iOS
 * deseni). Klavyede "ara" dönüş tuşu `onSubmit`'i tetikler.
 */
import * as React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { CloseGlyph, SearchGlyph } from "../internal/Glyphs";
import { useNativeTheme } from "../theme/ThemeProvider";
import { IconButton } from "./IconButton";
import { TextButton } from "./TextButton";

export interface SearchBarProps
  extends Omit<TextInputProps, "value" | "onChangeText" | "onSubmitEditing" | "style"> {
  value: string;
  onChangeText: (text: string) => void;
  /** Klavyedeki "ara" tuşuna basılınca. */
  onSubmit?: (text: string) => void;
  /** Verilirse odaktayken "Vazgeç" butonu gösterilir. */
  onCancel?: () => void;
  cancelLabel?: string;
  /** Sonda ek düğüm (ör. filtre IconButton'u). */
  trailing?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SearchBar = React.forwardRef<TextInput, SearchBarProps>(function SearchBar(
  {
    value,
    onChangeText,
    onSubmit,
    onCancel,
    cancelLabel = "Vazgeç",
    trailing,
    placeholder = "Ara",
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
  const inner = React.useRef<TextInput | null>(null);
  React.useImperativeHandle(ref, () => inner.current as TextInput);

  return (
    <View style={[styles.row, { columnGap: theme.space.sm }, style]}>
      <View
        style={[
          styles.field,
          {
            backgroundColor: theme.colors.muted,
            borderRadius: theme.radius.pill,
            paddingHorizontal: theme.space.md,
            columnGap: theme.space.sm,
            borderColor: focused ? theme.colors.ring : "transparent",
          },
        ]}
      >
        <SearchGlyph color={theme.colors.mutedForeground} size={16} />
        <TextInput
          ref={inner}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={() => onSubmit?.(value)}
          returnKeyType="search"
          placeholder={placeholder}
          placeholderTextColor={theme.colors.mutedForeground}
          role="searchbox"
          aria-label={accessibilityLabel ?? placeholder}
          autoCorrect={false}
          maxFontSizeMultiplier={1.6}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
          style={[styles.input, { color: theme.colors.foreground, fontSize: theme.fontSize["base"] ?? 16 }]}
        />
        {value.length > 0 ? (
          <IconButton
            size="sm"
            bleed
            accessibilityLabel="Aramayı temizle"
            onPress={() => {
              onChangeText("");
              inner.current?.focus();
            }}
            icon={<CloseGlyph color={theme.colors.mutedForeground} size={13} />}
          />
        ) : null}
      </View>
      {trailing}
      {onCancel !== undefined && focused ? (
        <TextButton
          title={cancelLabel}
          onPress={() => {
            inner.current?.blur();
            onCancel();
          }}
        />
      ) : null}
    </View>
  );
});

const FIELD_BORDER = 1;

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  field: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minHeight: MIN_TOUCH_TARGET,
    borderWidth: FIELD_BORDER,
  },
  // Giriş alanın tüm yüksekliğini doldurur: dokunulabilir kutu 44pt olsun diye
  // kenarlığın altına negatif margin ile uzanır (alan yüksekliği değişmez).
  input: {
    flex: 1,
    alignSelf: "stretch",
    paddingVertical: 0,
    minHeight: MIN_TOUCH_TARGET,
    marginVertical: -FIELD_BORDER,
  },
});
