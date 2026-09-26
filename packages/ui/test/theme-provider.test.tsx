import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { DsThemeProvider, useDsTheme, type DsThemeProviderProps } from "../src";
import { setColorScheme } from "./setup";

function wrapper(props: Omit<DsThemeProviderProps, "children">) {
  return ({ children }: { children: React.ReactNode }) => <DsThemeProvider {...props}>{children}</DsThemeProvider>;
}

describe("DsThemeProvider (applyTo=root)", () => {
  it("<html>'e tema sınıfı ve dark sınıfı yazar, tema değişince eskisini kaldırır", () => {
    const { result } = renderHook(() => useDsTheme(), { wrapper: wrapper({ defaultTheme: "dolap", defaultMode: "light" }) });
    const root = document.documentElement;
    expect(root).toHaveClass("theme-dolap");
    expect(root).not.toHaveClass("dark");

    act(() => result.current.setTheme("fisly"));
    expect(root).toHaveClass("theme-fisly");
    expect(root).not.toHaveClass("theme-dolap");

    act(() => result.current.setMode("dark"));
    expect(root).toHaveClass("dark");
    expect(result.current.resolvedMode).toBe("dark");
  });

  it("system modu işletim sistemi tercihini izler", () => {
    setColorScheme(false);
    const { result } = renderHook(() => useDsTheme(), { wrapper: wrapper({ defaultMode: "system" }) });
    expect(result.current.resolvedMode).toBe("light");
    act(() => setColorScheme(true));
    expect(result.current.resolvedMode).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("kontrollü theme/mode prop'ları iç durumu ezer", () => {
    const { result } = renderHook(() => useDsTheme(), { wrapper: wrapper({ theme: "randevu", mode: "dark" }) });
    expect(result.current.theme).toBe("randevu");
    expect(result.current.resolvedMode).toBe("dark");
    expect(document.documentElement).toHaveClass("theme-randevu", "dark");
  });

  it("dir prop'u <html dir> yazar ve setDir ile değişir", () => {
    const { result } = renderHook(() => useDsTheme(), { wrapper: wrapper({ defaultDir: "rtl" }) });
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
    act(() => result.current.setDir("ltr"));
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
  });
});

describe("DsThemeProvider (applyTo=self)", () => {
  it("sarmalayıcı div'e uygular, <html>'e dokunmaz; iç içe temalar desteklenir", () => {
    render(
      <DsThemeProvider applyTo="self" defaultTheme="glowscan" defaultMode="dark" dir="rtl">
        <span>dış</span>
        <DsThemeProvider applyTo="self" defaultTheme="fisly" defaultMode="light">
          <span>iç</span>
        </DsThemeProvider>
      </DsThemeProvider>,
    );
    const outer = screen.getByText("dış").parentElement!;
    expect(outer).toHaveClass("theme-glowscan", "dark");
    expect(outer).toHaveAttribute("dir", "rtl");
    const inner = screen.getByText("iç").parentElement!;
    expect(inner).toHaveClass("theme-fisly");
    expect(inner).not.toHaveClass("dark");
    expect(document.documentElement.className).toBe("");
  });

  it("ThemeModeToggle ile mod değiştirilebilir", async () => {
    const { ThemeModeToggle } = await import("../src");
    function Probe() {
      const { mode } = useDsTheme();
      return <output>{mode}</output>;
    }
    render(
      <DsThemeProvider applyTo="self" defaultMode="light">
        <ThemeModeToggle />
        <Probe />
      </DsThemeProvider>,
    );
    const before = screen.getByRole("status").textContent;
    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]!);
    const after = screen.getByRole("status").textContent;
    // Toggle ya doğrudan döngüsel geçiş yapar ya da bir menü açar
    if (after === before) {
      const item = await screen.findByRole("menuitemradio", { name: /koyu|dark/i }).catch(() => null)
        ?? (await screen.findByRole("menuitem", { name: /koyu|dark/i }));
      await userEvent.click(item);
      expect(screen.getByRole("status")).toHaveTextContent("dark");
    } else {
      expect(after).not.toBe(before);
    }
  });

  it("provider dışında useDsTheme açıklayıcı hata verir", () => {
    const spy = console.error;
    console.error = () => {};
    expect(() => renderHook(() => useDsTheme())).toThrow(/DsThemeProvider/);
    console.error = spy;
  });
});
