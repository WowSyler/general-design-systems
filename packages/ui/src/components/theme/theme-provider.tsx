/**
 * DsThemeProvider — çoklu tema (theme-<ad> sınıfı) + light/dark/system modu +
 * yazı yönü (ltr/rtl) yönetir.
 * applyTo="root": sınıflar ve `dir` <html> üzerine yazılır (gerçek uygulamalar).
 * applyTo="self": sarmalayıcı bir div'e uygulanır (Storybook, önizlemeler, iç içe temalar).
 * Yön, Radix DirectionProvider ile tüm Radix primitiflerine (menü, slider, tabs…) iletilir.
 */
import * as React from "react";
import { DirectionProvider } from "@radix-ui/react-direction";

import { cn } from "@/lib/utils";

export type ThemeMode = "light" | "dark" | "system";
export type Direction = "ltr" | "rtl";

export interface DsThemeContextValue {
  theme: string;
  setTheme: (name: string) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** system çözümlendikten sonraki gerçek mod */
  resolvedMode: "light" | "dark";
  /** Yazı yönü — rtl'de mantıksal (start/end) utility'ler otomatik aynalanır */
  dir: Direction;
  setDir: (dir: Direction) => void;
}

const DsThemeContext = React.createContext<DsThemeContextValue | null>(null);

export function useDsTheme(): DsThemeContextValue {
  const ctx = React.useContext(DsThemeContext);
  if (!ctx) {
    throw new Error("useDsTheme, DsThemeProvider içinde kullanılmalıdır");
  }
  return ctx;
}

/**
 * Sağlayıcı dışında da güvenle çağrılabilen sürüm — sağlayıcı yoksa null döner.
 * (Toaster gibi hem DsThemeProvider'lı hem sağlayıcısız kullanılabilen bileşenler için)
 */
export function useOptionalDsTheme(): DsThemeContextValue | null {
  return React.useContext(DsThemeContext);
}

function getSystemMode(): "light" | "dark" {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export interface DsThemeProviderProps {
  /** Tema adı (ör. "glowscan") — theme-<ad> sınıfına çevrilir */
  defaultTheme?: string;
  defaultMode?: ThemeMode;
  /** Varsayılan yazı yönü (kontrolsüz kullanım) */
  defaultDir?: Direction;
  /** "root": <html>'e sınıf yazar; "self": sarmalayıcı div'e uygular */
  applyTo?: "root" | "self";
  /** Kontrollü kullanım için (Storybook toolbar'ı gibi) */
  theme?: string;
  mode?: ThemeMode;
  /** Kontrollü yazı yönü (Arapça/İbranice arayüzler için "rtl") */
  dir?: Direction;
  className?: string;
  children: React.ReactNode;
}

export function DsThemeProvider({
  defaultTheme = "deploylens",
  defaultMode = "system",
  defaultDir = "ltr",
  applyTo = "root",
  theme: themeProp,
  mode: modeProp,
  dir: dirProp,
  className,
  children,
}: DsThemeProviderProps) {
  const [themeState, setThemeState] = React.useState(defaultTheme);
  const [modeState, setModeState] = React.useState<ThemeMode>(defaultMode);
  const [dirState, setDirState] = React.useState<Direction>(defaultDir);
  const [systemMode, setSystemMode] = React.useState<"light" | "dark">(
    getSystemMode,
  );

  const theme = themeProp ?? themeState;
  const mode = modeProp ?? modeState;
  const resolvedMode = mode === "system" ? systemMode : mode;
  const dir = dirProp ?? dirState;

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemMode(mql.matches ? "dark" : "light");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    if (applyTo !== "root" || typeof document === "undefined") return;
    const root = document.documentElement;
    for (const cls of Array.from(root.classList)) {
      if (cls.startsWith("theme-")) root.classList.remove(cls);
    }
    root.classList.add(`theme-${theme}`);
    root.classList.toggle("dark", resolvedMode === "dark");
  }, [applyTo, theme, resolvedMode]);

  React.useEffect(() => {
    if (applyTo !== "root" || typeof document === "undefined") return;
    document.documentElement.setAttribute("dir", dir);
  }, [applyTo, dir]);

  const value = React.useMemo<DsThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeState,
      mode,
      setMode: setModeState,
      resolvedMode,
      dir,
      setDir: setDirState,
    }),
    [theme, mode, resolvedMode, dir],
  );

  if (applyTo === "self") {
    return (
      <DsThemeContext.Provider value={value}>
        <DirectionProvider dir={dir}>
          <div
            dir={dir}
            className={cn(
              `theme-${theme}`,
              resolvedMode === "dark" && "dark",
              "bg-background font-sans text-foreground",
              className,
            )}
          >
            {children}
          </div>
        </DirectionProvider>
      </DsThemeContext.Provider>
    );
  }

  return (
    <DsThemeContext.Provider value={value}>
      <DirectionProvider dir={dir}>{children}</DirectionProvider>
    </DsThemeContext.Provider>
  );
}
