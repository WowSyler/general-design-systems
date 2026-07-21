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
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Text as RNText,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MIN_TOUCH_TARGET } from "@ds/tokens/native";

import { useNativeTheme } from "../theme/ThemeProvider";

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
  style,
}: SelectProps<T>): React.JSX.Element {
  const { theme } = useNativeTheme();
  const insets = useSafeAreaInsets();
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
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
        accessibilityState={{ disabled, expanded: open }}
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
          accessibilityLiveRegion="polite"
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

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kapat"
            style={styles.backdrop}
            onPress={() => setOpen(false)}
          />
          <View
            accessibilityViewIsModal
            style={{
              backgroundColor: theme.colors.card,
              borderTopLeftRadius: theme.radius.xl,
              borderTopRightRadius: theme.radius.xl,
              paddingTop: theme.space.md,
              paddingBottom: theme.space.sm + insets.bottom,
            }}
          >
            <View
              style={[
                styles.handle,
                {
                  backgroundColor: theme.colors.border,
                  borderRadius: theme.radius.pill,
                  marginBottom: theme.space.md,
                },
              ]}
            />
            <RNText
              accessibilityRole="header"
              numberOfLines={1}
              style={{
                fontSize: theme.fontSize["lg"] ?? 18,
                lineHeight: 24,
                fontWeight: "600",
                color: theme.colors.cardForeground,
                paddingHorizontal: theme.space.lg,
                marginBottom: theme.space.sm,
              }}
            >
              {title}
            </RNText>
            <ScrollView
              accessibilityRole="menu"
              style={{ maxHeight: listMaxHeight }}
              bounces={false}
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                const isDisabled = opt.disabled === true;
                return (
                  <Pressable
                    key={opt.value}
                    accessibilityRole="menuitem"
                    accessibilityLabel={opt.label}
                    accessibilityState={{
                      selected: isSelected,
                      disabled: isDisabled,
                    }}
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
                        accessibilityElementsHidden
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
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    // Scrim — Sheet ile aynı tasarım istisnası: rgba arka plan karartması.
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  handle: {
    width: 36,
    height: 4,
    alignSelf: "center",
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
