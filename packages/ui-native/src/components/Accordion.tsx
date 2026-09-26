/**
 * Accordion — açılır-kapanır bölümler (SSS, filtre grupları). Tek (`type="single"`)
 * ya da çoklu açık. Başlık satırı ≥ 44pt, "button" rolü + expanded durumu;
 * açılış LayoutAnimation ile yumuşak (hareketi azalt açıkken animasyonsuz).
 */
import * as React from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  UIManager,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { DsText } from "../internal/DsText";
import { Chevron } from "../internal/Glyphs";
import { useReducedMotion } from "../internal/useReducedMotion";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface AccordionItem {
  value: string;
  title: string;
  /** Başlığın altında küçük açıklama. */
  subtitle?: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: "single" | "multiple";
  /** Başlangıçta açık öğeler (denetimsiz). */
  defaultValue?: string[];
  /** Denetimli açık öğeler. */
  value?: string[];
  onValueChange?: (value: string[]) => void;
  /** Kart görünümü (çerçeveli) ya da düz; varsayılan "plain". */
  variant?: "plain" | "card";
  style?: StyleProp<ViewStyle>;
}

export function Accordion({
  items,
  type = "single",
  defaultValue = [],
  value,
  onValueChange,
  variant = "plain",
  style,
}: AccordionProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const reducedMotion = useReducedMotion();
  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const open = value ?? internal;

  const toggle = (key: string) => {
    if (!reducedMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.create(200, "easeInEaseOut", "opacity"));
    }
    const isOpen = open.includes(key);
    const next = isOpen
      ? open.filter((k) => k !== key)
      : type === "single"
        ? [key]
        : [...open, key];
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const isCard = variant === "card";

  return (
    <View
      style={[
        isCard
          ? {
              borderRadius: theme.radius.lg,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.card,
              overflow: "hidden",
            }
          : null,
        style,
      ]}
    >
      {items.map((item, index) => {
        const expanded = open.includes(item.value);
        const disabled = item.disabled === true;
        return (
          <View
            key={item.value}
            style={
              index > 0
                ? { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.border }
                : null
            }
          >
            <Pressable
              role="button"
              aria-label={item.title}
              {...ariaState({ expanded, disabled })}
              disabled={disabled}
              onPress={() => toggle(item.value)}
              style={({ pressed }) => [
                styles.header,
                {
                  minHeight: MIN_TOUCH_TARGET + 8,
                  paddingHorizontal: isCard ? theme.space.lg : 0,
                  paddingVertical: theme.space.md,
                  columnGap: theme.space.md,
                  opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
                },
              ]}
            >
              <View style={{ flex: 1, rowGap: 2 }}>
                <DsText style={{ color: theme.colors.foreground, fontSize: theme.fontSize["base"] ?? 16, fontWeight: "600" }}>
                  {item.title}
                </DsText>
                {item.subtitle !== undefined ? (
                  <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14 }}>{item.subtitle}</DsText>
                ) : null}
              </View>
              <Chevron direction={expanded ? "up" : "down"} color={theme.colors.mutedForeground} size={18} />
            </Pressable>
            {expanded ? (
              <View
                style={{
                  paddingHorizontal: isCard ? theme.space.lg : 0,
                  paddingBottom: theme.space.lg,
                }}
              >
                {typeof item.content === "string" ? (
                  <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["sm"] ?? 14, lineHeight: 21 }}>
                    {item.content}
                  </DsText>
                ) : (
                  item.content
                )}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center" },
});
