/**
 * PasswordInput — göster/gizle düğmeli parola girişi (Input üzerine). Parola
 * yöneticisi/otomatik doldurma için textContentType/autoComplete ayarlıdır.
 * `strength` verilirse altında 4 bölmeli güç göstergesi çizilir.
 */
import * as React from "react";
import { TextInput, View } from "react-native";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";
import { Input, type InputProps } from "./Input";
import { TextButton } from "./TextButton";

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export interface PasswordInputProps extends Omit<InputProps, "secureTextEntry" | "right"> {
  /** Yeni parola alanı mı (autoComplete "new-password"). */
  isNew?: boolean;
  /** 0-4 güç puanı; verilirse gösterge çizilir. */
  strength?: PasswordStrength;
  showLabel?: string;
  hideLabel?: string;
}

const STRENGTH_LABEL = ["Çok zayıf", "Zayıf", "Orta", "İyi", "Güçlü"] as const;

export const PasswordInput = React.forwardRef<TextInput, PasswordInputProps>(function PasswordInput(
  { isNew = false, strength, showLabel = "Göster", hideLabel = "Gizle", ...rest },
  ref,
): React.JSX.Element {
  const { theme } = useNativeTheme();
  const [visible, setVisible] = React.useState(false);
  const strengthColor =
    strength === undefined
      ? theme.colors.muted
      : strength <= 1
        ? theme.colors.destructive
        : strength === 2
          ? theme.colors.warning
          : theme.colors.success;

  return (
    <View style={{ rowGap: theme.space.sm }}>
      <Input
        ref={ref}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType={isNew ? "newPassword" : "password"}
        autoComplete={isNew ? "new-password" : "current-password"}
        right={
          <TextButton
            size="sm"
            tone="muted"
            title={visible ? hideLabel : showLabel}
            accessibilityLabel={visible ? "Parolayı gizle" : "Parolayı göster"}
            onPress={() => setVisible((v) => !v)}
          />
        }
        {...rest}
      />
      {strength !== undefined ? (
        <View
          accessible
          
          aria-label={`Parola gücü: ${STRENGTH_LABEL[strength]}`}
          style={{ rowGap: theme.space.xs }}
        >
          <View style={{ flexDirection: "row", columnGap: theme.space.xs }}>
            {[1, 2, 3, 4].map((i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: theme.radius.pill,
                  backgroundColor: i <= strength ? strengthColor : theme.colors.muted,
                }}
              />
            ))}
          </View>
          <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["xs"] ?? 12 }}>
            {STRENGTH_LABEL[strength]}
          </DsText>
        </View>
      ) : null}
    </View>
  );
});
