/**
 * FormField — etiket + zorunluluk işareti + yardım/hata metni sarmalayıcısı.
 * Herhangi bir denetimi (Select, RadioGroup, özel giriş) form düzenine sokar.
 * İçerideki denetimler `useFormField()` ile etiket kimliğine ve hata durumuna
 * erişebilir (accessibilityLabelledBy / aria-labelledby bağlantısı için).
 */
import * as React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { DsText } from "../internal/DsText";
import { useNativeTheme } from "../theme/ThemeProvider";

export interface FormFieldContextValue {
  /** Etiket düğümünün nativeID'si. */
  labelId: string;
  label?: string;
  error?: string;
  required: boolean;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

/** FormField içindeyse bağlamı, değilse null döndürür. */
export function useFormField(): FormFieldContextValue | null {
  return React.useContext(FormFieldContext);
}

let counter = 0;
function useStableId(prefix: string): string {
  const ref = React.useRef<string | null>(null);
  if (ref.current === null) {
    counter += 1;
    ref.current = `${prefix}-${counter}`;
  }
  return ref.current;
}

export interface FormFieldProps {
  label?: string;
  /** Etiketin yanında "*" gösterir ve ekran okuyucuya "zorunlu" der. */
  required?: boolean;
  /** Hata varken altta gösterilir (helperText'i ezer). */
  error?: string;
  helperText?: string;
  /** Etiketin sonunda gösterilecek düğüm (ör. "Opsiyonel", sayaç). */
  labelAccessory?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function FormField({
  label,
  required = false,
  error,
  helperText,
  labelAccessory,
  style,
  children,
}: FormFieldProps): React.JSX.Element {
  const { theme } = useNativeTheme();
  const labelId = useStableId("ds-field-label");
  const hasError = error !== undefined && error.length > 0;
  const ctx = React.useMemo<FormFieldContextValue>(
    () => ({ labelId, label, error: hasError ? error : undefined, required }),
    [labelId, label, error, hasError, required],
  );

  return (
    <FormFieldContext.Provider value={ctx}>
      <View style={[{ rowGap: theme.space.xs }, style]}>
        {label !== undefined ? (
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: theme.space.sm }}>
            <DsText
              id={labelId}
              aria-label={required ? `${label}, zorunlu` : label}
              style={{ flex: 1, color: theme.colors.foreground, fontSize: theme.fontSize["sm"] ?? 14, fontWeight: "500" }}
            >
              {label}
              {required ? <DsText style={{ color: theme.colors.destructive }}> *</DsText> : null}
            </DsText>
            {labelAccessory}
          </View>
        ) : null}
        {children}
        {hasError ? (
          <DsText
            aria-live="polite"
            role="alert"
            style={{ color: theme.colors.destructive, fontSize: theme.fontSize["xs"] ?? 12, lineHeight: 16 }}
          >
            {error}
          </DsText>
        ) : helperText !== undefined ? (
          <DsText style={{ color: theme.colors.mutedForeground, fontSize: theme.fontSize["xs"] ?? 12, lineHeight: 16 }}>
            {helperText}
          </DsText>
        ) : null}
      </View>
    </FormFieldContext.Provider>
  );
}
