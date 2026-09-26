/**
 * NativeThemeProvider — React Native tarafında tema + light/dark/system modu yönetimi.
 * Tema `ThemeDefinition` ya da kayıtlı tema adı (string → getTheme) olarak verilir;
 * "system" modunda RN useColorScheme() takip edilir. `useNativeTheme()` çözümlenmiş
 * NativeTheme'i, `makeStyles()` ise temaya bağlı StyleSheet üreten bir hook döndürür.
 *
 * Ek olarak:
 * - `fonts`: uygulamanın yüklediği yazı aileleri (gövde/başlık/mono). Aile adı tek
 *   string ya da ağırlık haritası (regular/medium/semibold/bold → "Inter_600SemiBold"
 *   gibi expo-google-fonts adları) olabilir. Web'de (react-native-web) verilmezse
 *   temanın CSS font yığını kullanılır; native'de verilmezse sistem fontu kalır.
 * - `direction`: "ltr" | "rtl" zorlaması. Verilmezse I18nManager.isRTL okunur.
 *   Yerleşim start/end stilleriyle kendiliğinden aynalanır; bu değer yalnızca
 *   yön ikonları ve animasyon hesapları (translateX) için kullanılır.
 */
import * as React from "react";
import {
  I18nManager,
  Platform,
  StyleSheet,
  useColorScheme,
} from "react-native";

import {
  getTheme,
  resolveNativeTheme,
  type ColorMode,
  type NativeTheme,
  type ThemeDefinition,
} from "@wowsyler/ds-tokens/native";

/** Kullanıcının seçebileceği mod: açık, koyu ya da sistemi takip et. */
export type ThemeModeSetting = "light" | "dark" | "system";

/** Yazı yönü. */
export type TextDirection = "ltr" | "rtl";

/** Ağırlığa göre ayrı yüklenmiş font aileleri (ör. expo-google-fonts). */
export interface FontWeightMap {
  regular: string;
  medium?: string;
  semibold?: string;
  bold?: string;
}

/** Tek aile adı ya da ağırlık haritası. */
export type FontFamilySource = string | FontWeightMap;

export interface NativeFonts {
  /** Gövde metni ailesi. */
  body?: FontFamilySource;
  /** Başlık/display ailesi (Text h1-h3, header rolündeki metinler). */
  heading?: FontFamilySource;
  /** Eş aralıklı aile (tutarlar, kodlar). */
  mono?: FontFamilySource;
}

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
  /** Çözümlenmiş font aileleri. */
  fonts: NativeFonts;
  /** Aktif yazı yönü. */
  direction: TextDirection;
}

const NativeThemeContext = React.createContext<NativeThemeContextValue | null>(
  null,
);

export interface NativeThemeProviderProps {
  /** Tema tanımı ya da kayıtlı tema adı (ör. "glowscan"). */
  theme: ThemeDefinition | string;
  /** Başlangıç mod tercihi; varsayılan "system". */
  mode?: ThemeModeSetting;
  /** Uygulamanın yüklediği font aileleri. */
  fonts?: NativeFonts;
  /** Yazı yönü zorlaması; verilmezse I18nManager.isRTL. */
  direction?: TextDirection;
  children: React.ReactNode;
}

/** CSS font yığınından web için aile listesi (react-native-web doğrudan CSS'e geçirir). */
function webFontsFor(definition: ThemeDefinition): NativeFonts {
  return {
    body: definition.typography.fontSans,
    heading: definition.typography.fontDisplay,
    mono: definition.typography.fontMono,
  };
}

function systemDirection(): TextDirection {
  return I18nManager.isRTL ? "rtl" : "ltr";
}

export function NativeThemeProvider({
  theme,
  mode = "system",
  fonts,
  direction,
  children,
}: NativeThemeProviderProps): React.JSX.Element {
  const systemScheme = useColorScheme();
  const [modeSetting, setModeSetting] = React.useState<ThemeModeSetting>(mode);

  // Prop değişirse (ör. Storybook toolbar) iç durumu eşitle.
  React.useEffect(() => {
    setModeSetting(mode);
  }, [mode]);

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

  const resolvedFonts = React.useMemo<NativeFonts>(() => {
    const base = Platform.OS === "web" ? webFontsFor(definition) : {};
    return { ...base, ...fonts };
  }, [definition, fonts]);

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

  const resolvedDirection = direction ?? systemDirection();

  const value = React.useMemo<NativeThemeContextValue>(
    () => ({
      theme: resolved,
      definition,
      mode: modeSetting,
      setMode: setModeSetting,
      toggle,
      fonts: resolvedFonts,
      direction: resolvedDirection,
    }),
    [resolved, definition, modeSetting, toggle, resolvedFonts, resolvedDirection],
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
 * Aktif yazı yönü sağdan sola mı. Provider'da `direction` verilmişse onu,
 * yoksa I18nManager.isRTL'i döndürür (provider dışında da çalışır).
 */
export function useIsRTL(): boolean {
  const ctx = React.useContext(NativeThemeContext);
  if (ctx !== null) {
    return ctx.direction === "rtl";
  }
  return I18nManager.isRTL;
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
