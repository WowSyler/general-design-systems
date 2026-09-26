/**
 * Select — RN Modal tabanlı seçim (picker) bileşeni.
 * Tetik satırı seçili değeri (ya da yer tutucuyu) ve bir chevron (▾/▴) gösterir;
 * dokununca alttan açılan modal listede seçenekler sıralanır ve seçili olanın
 * yanında tik (✓) belirir. Değer `value` ile denetlenir, seçim `onValueChange`
 * ile bildirilir. Renk/ölçek yalnızca temadan gelir; arka plan karartması (scrim)
 * Sheet ile aynı tasarım istisnasıdır. Web `Select` karşılığı (Fisly kategori,
 * Randevu). Dokunma hedefleri MIN_TOUCH_TARGET (44pt) altına düşmez.
 */
import * as React from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import {
  AdaptiveModal,
  type ModalPresentation,
} from "../internal/AdaptiveModal";
import { DsText as RNText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

export interface SelectOption<T extends string = string> {
  /** Kullanıcıya gösterilen etiket. */
  label: string;
  /** Seçildiğinde onValueChange'e iletilen değer. */
  value: T;
  /** Seçilemez — soluk gösterilir ve dokunuşa yanıt vermez. */
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> {
  /** Seçenek listesi. */
  options: ReadonlyArray<SelectOption<T>>;
  /** Denetimli seçili değer; yoksa yer tutucu gösterilir. */
  value?: T | null;
  /** Seçim değiştiğinde çağrılır. */
  onValueChange: (value: T) => void;
  /** Tetiğin üzerinde gösterilen etiket. */
  label?: string;
  /** Seçili değer yokken gösterilen yer tutucu; varsayılan "Seçin". */
  placeholder?: string;
  /** Modal başlığı; verilmezse label ya da yer tutucu kullanılır. */
  modalTitle?: string;
  /** Tetiği devre dışı bırakır. */
  disabled?: boolean;
  /** Hata mesajı — kenarlığı destructive yapar ve altta gösterilir. */
  error?: string;
  /** Erişilebilirlik etiketi; verilmezse label/yer tutucu kullanılır. */
  accessibilityLabel?: string;
  /** Seçenek paneli sunumu: "auto" (telefon: alt sayfa, tablet: ortada). */
  presentation?: ModalPresentation;
  /** Dış kapsayıcı stili. */
  style?: StyleProp<ViewStyle>;
}

export function Select<T extends string = string>({
  options,
  value = null,
  onValueChange,
  label,
  placeholder = "Seçin",
  modalTitle,
  disabled = false,
  error,
  accessibilityLabel,
  presentation = "auto",
  style,
}: SelectProps<T>): React.JSX.Element {
  const { theme } = useNativeTheme();
  const [open, setOpen] = React.useState(false);

  const selected = options.find((opt) => opt.value === value) ?? null;
  const hasError = error !== undefined && error.length > 0;
  const borderColor = hasError ? theme.colors.destructive : theme.colors.input;
  const displayLabel = selected !== null ? selected.label : placeholder;
  const title = modalTitle ?? label ?? placeholder;
  const listMaxHeight = Math.round(Dimensions.get("window").height * 0.5);

  const handleSelect = (opt: SelectOption<T>): void => {
    if (opt.disabled === true) {
      return;
    }
    onValueChange(opt.value);
    setOpen(false);
  };

  return (
    <View style={style}>
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

      <Pressable
        role="combobox"
        aria-label={
          (accessibilityLabel ?? label ?? placeholder) +
          (selected !== null ? `: ${selected.label}` : "")
        }
        {...ariaState({ disabled, expanded: open })}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: theme.colors.background,
            borderColor,
            borderRadius: theme.radius.md,
            minHeight: MIN_TOUCH_TARGET,
            paddingHorizontal: theme.space.md,
            columnGap: theme.space.sm,
          },
          disabled ? styles.disabled : null,
          pressed && !disabled ? styles.pressed : null,
        ]}
      >
        <RNText
          numberOfLines={1}
          style={{
            flex: 1,
            fontSize: theme.fontSize["base"] ?? 16,
            color:
              selected !== null
                ? theme.colors.foreground
                : theme.colors.mutedForeground,
          }}
        >
          {displayLabel}
        </RNText>
        <RNText
          style={{
            fontSize: theme.fontSize["xs"] ?? 12,
            color: theme.colors.mutedForeground,
          }}
        >
          {open ? "▴" : "▾"}
        </RNText>
      </Pressable>

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
      ) : null}

      <AdaptiveModal
        visible={open}
        onClose={() => setOpen(false)}
        title={title}
        presentation={presentation}
        maxWidth={440}
        flush
      >
        <ScrollView
          role="radiogroup"
          aria-label={title}
          style={{ maxHeight: listMaxHeight }}
          bounces={false}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            const isDisabled = opt.disabled === true;
            return (
              <Pressable
                key={opt.value}
                role="radio"
                aria-label={opt.label}
                {...ariaState({
                  checked: isSelected,
                  disabled: isDisabled,
                })}
                disabled={isDisabled}
                onPress={() => handleSelect(opt)}
                style={({ pressed }) => [
                  styles.option,
                  {
                    minHeight: MIN_TOUCH_TARGET,
                    paddingHorizontal: theme.space.lg,
                    columnGap: theme.space.sm,
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: theme.colors.border,
                  },
                  isDisabled ? styles.disabled : null,
                  pressed && !isDisabled
                    ? { backgroundColor: theme.colors.muted }
                    : null,
                ]}
              >
                <RNText
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    fontSize: theme.fontSize["base"] ?? 16,
                    fontWeight: isSelected ? "600" : "400",
                    color: isSelected
                      ? theme.colors.primary
                      : theme.colors.foreground,
                  }}
                >
                  {opt.label}
                </RNText>
                {isSelected ? (
                  <RNText
                    aria-hidden
                    importantForAccessibility="no"
                    style={{
                      fontSize: theme.fontSize["base"] ?? 16,
                      fontWeight: "600",
                      color: theme.colors.primary,
                    }}
                  >
                    ✓
                  </RNText>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </AdaptiveModal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
});
