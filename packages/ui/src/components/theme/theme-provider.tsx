/**
 * DsThemeProvider — çoklu tema (theme-<ad> sınıfı) + light/dark/system modu yönetir.
 * applyTo="root": sınıflar <html> üzerine yazılır (gerçek uygulamalar).
 * applyTo="self": sarmalayıcı bir div'e uygulanır (Storybook, önizlemeler, iç içe temalar).
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export type ThemeMode = "light" | "dark" | "system";

export interface DsThemeContextValue {
  theme: string;
  setTheme: (name: string) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** system çözümlendikten sonraki gerçek mod */
  resolvedMode: "light" | "dark";
}

const DsThemeContext = React.createContext<DsThemeContextValue | null>(null);

export function useDsTheme(): DsThemeContextValue {
  const ctx = React.useContext(DsThemeContext);
  if (!ctx) {
    throw new Error("useDsTheme, DsThemeProvider içinde kullanılmalıdır");
  }
  return ctx;
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
  /** "root": <html>'e sınıf yazar; "self": sarmalayıcı div'e uygular */
  applyTo?: "root" | "self";
  /** Kontrollü kullanım için (Storybook toolbar'ı gibi) */
  theme?: string;
  mode?: ThemeMode;
  className?: string;
  children: React.ReactNode;
}

export function DsThemeProvider({
  defaultTheme = "deploylens",
  defaultMode = "system",
  applyTo = "root",
  theme: themeProp,
  mode: modeProp,
  className,
  children,
}: DsThemeProviderProps) {
  const [themeState, setThemeState] = React.useState(defaultTheme);
  const [modeState, setModeState] = React.useState<ThemeMode>(defaultMode);
  const [systemMode, setSystemMode] = React.useState<"light" | "dark">(
    getSystemMode,
  );

  const theme = themeProp ?? themeState;
  const mode = modeProp ?? modeState;
  const resolvedMode = mode === "system" ? systemMode : mode;

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

  const value = React.useMemo<DsThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeState,
      mode,
      setMode: setModeState,
      resolvedMode,
    }),
    [theme, mode, resolvedMode],
  );

  if (applyTo === "self") {
    return (
      <DsThemeContext.Provider value={value}>
        <div
          className={cn(
            `theme-${theme}`,
            resolvedMode === "dark" && "dark",
            "bg-background font-sans text-foreground",
            className,
          )}
        >
          {children}
        </div>
      </DsThemeContext.Provider>
    );
  }

  return (
    <DsThemeContext.Provider value={value}>{children}</DsThemeContext.Provider>
  );
}
