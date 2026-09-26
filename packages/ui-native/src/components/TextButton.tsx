/**
 * TextButton — zeminsiz metin butonu / bağlantı. Ton: primary (varsayılan),
 * muted, destructive. Dokunma kutusu minHeight/minWidth ile her iki boyutta da
 * ≥ MIN_TOUCH_TARGET (44pt); zeminsiz olduğundan görünüm değişmez.
 * `Link` aynı bileşenin `role="link"` ve alt çizgili takma adıdır.
 */
import * as React from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { ariaState } from "../internal/a11y";

export type TextButtonTone = "primary" | "muted" | "destructive" | "foreground";

export interface TextButtonProps extends Omit<PressableProps, "children" | "style"> {
  title: string;
  tone?: TextButtonTone;
  size?: "sm" | "md";
  /** Metnin altını çiz (bağlantı görünümü). */
  underline?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function TextButton({
  title,
  tone = "primary",
  size = "md",
  underline = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  accessibilityLabel,
  role = "button",
  ...rest
}: TextButtonProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const color =
    tone === "muted"
      ? theme.colors.mutedForeground
      : tone === "destructive"
        ? theme.colors.destructive
        : tone === "foreground"
          ? theme.colors.foreground
          : theme.colors.primary;
  const isDisabled = disabled === true;

  return (
    <Pressable
      role={role}
      aria-label={accessibilityLabel ?? title}
      {...ariaState({ disabled: isDisabled })}
      disabled={isDisabled}
      {...rest}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "flex-start",
          minHeight: MIN_TOUCH_TARGET,
          minWidth: MIN_TOUCH_TARGET,
          columnGap: theme.space.xs,
          opacity: isDisabled ? 0.45 : pressed ? 0.6 : 1,
        },
        style,
      ]}
    >
      {leftIcon}
      <DsText
        style={{
          color,
          fontSize: size === "sm" ? (theme.fontSize["sm"] ?? 14) : (theme.fontSize["base"] ?? 16),
          fontWeight: "600",
          textDecorationLine: underline ? "underline" : "none",
        }}
      >
        {title}
      </DsText>
      {rightIcon}
    </Pressable>
  );
}

export type LinkProps = Omit<TextButtonProps, "role">;

/** Bağlantı — alt çizgili, "link" rolünde TextButton. */
export function Link({ underline = true, ...props }: LinkProps): React.JSX.Element {
  return <TextButton role="link" underline={underline} {...props} />;
}
