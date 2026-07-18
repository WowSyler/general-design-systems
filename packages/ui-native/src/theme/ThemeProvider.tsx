/**
 * NativeThemeProvider — React Native tarafında tema + light/dark/system modu yönetimi.
 * Tema `ThemeDefinition` ya da kayıtlı tema adı (string → getTheme) olarak verilir;
 * "system" modunda RN useColorScheme() takip edilir. `useNativeTheme()` çözümlenmiş
 * NativeTheme'i, `makeStyles()` ise temaya bağlı StyleSheet üreten bir hook döndürür.
 */
import * as React from "react";
import { StyleSheet, useColorScheme } from "react-native";

import {
  getTheme,
  resolveNativeTheme,
  type ColorMode,
  type NativeTheme,
  type ThemeDefinition,
} from "@ds/tokens/native";

/** Kullanıcının seçebileceği mod: açık, koyu ya da sistemi takip et. */
export type ThemeModeSetting = "light" | "dark" | "system";

export interface NativeThemeContextValue {
  /** Aktif moda göre çözümlenmiş tema (renkler hex, ölçekler sayı). */
  theme: NativeTheme;
  /** Ham tema tanımı (light + dark birlikte). */
  definition: ThemeDefinition;
  /** Kullanıcının mod tercihi ("system" dahil). */
  mode: ThemeModeSetting;
  setMode: (mode: ThemeModeSetting) => void;
  /** Aktif görünür modu tersine çevirir (system → çözümlenmiş modun tersi). */
  toggle: () => void;
}

const NativeThemeContext = React.createContext<NativeThemeContextValue | null>(
  null,
);

export interface NativeThemeProviderProps {
  /** Tema tanımı ya da kayıtlı tema adı (ör. "glowscan"). */
  theme: ThemeDefinition | string;
  /** Başlangıç mod tercihi; varsayılan "system". */
  mode?: ThemeModeSetting;
  children: React.ReactNode;
}

export function NativeThemeProvider({
  theme,
  mode = "system",
  children,
}: NativeThemeProviderProps): React.JSX.Element {
  const systemScheme = useColorScheme();
  const [modeSetting, setModeSetting] = React.useState<ThemeModeSetting>(mode);

  const definition = React.useMemo<ThemeDefinition>(
    () => (typeof theme === "string" ? getTheme(theme) : theme),
    [theme],
  );

  const resolvedMode: ColorMode =
    modeSetting === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : modeSetting;

  const resolved = React.useMemo(
    () => resolveNativeTheme(definition, resolvedMode),
    [definition, resolvedMode],
  );

  const toggle = React.useCallback(() => {
    setModeSetting((prev) => {
      const current: ColorMode =
        prev === "system"
          ? systemScheme === "dark"
            ? "dark"
            : "light"
          : prev;
      return current === "dark" ? "light" : "dark";
    });
  }, [systemScheme]);

  const value = React.useMemo<NativeThemeContextValue>(
    () => ({
      theme: resolved,
      definition,
      mode: modeSetting,
      setMode: setModeSetting,
      toggle,
    }),
    [resolved, definition, modeSetting, toggle],
  );

  return (
    <NativeThemeContext.Provider value={value}>
      {children}
    </NativeThemeContext.Provider>
  );
}

/** Tema bağlamını okur; NativeThemeProvider dışında çağrılırsa hata fırlatır. */
export function useNativeTheme(): NativeThemeContextValue {
  const ctx = React.useContext(NativeThemeContext);
  if (ctx === null) {
    throw new Error(
      "useNativeTheme yalnızca <NativeThemeProvider> içinde kullanılabilir.",
    );
  }
  return ctx;
}

/**
 * Temaya bağlı StyleSheet fabrikası. Dönen hook, tema değiştiğinde stilleri
 * yeniden üretir; aynı tema için memoize edilir.
 *
 * const useStyles = makeStyles((t) => ({ box: { padding: t.space.lg } }));
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: NativeTheme) => T,
): () => T {
  return function useStyles(): T {
    const { theme } = useNativeTheme();
    // factory modül düzeyinde sabittir; anahtar yalnızca tema.
    return React.useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
