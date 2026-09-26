import * as React from "react";
import { act, render, screen } from "@testing-library/react";
import { Text as RNText } from "react-native";

import {
  NativeThemeProvider,
  makeStyles,
  useIsRTL,
  useNativeTheme,
  type NativeThemeContextValue,
} from "../src/theme/ThemeProvider";
import { Text } from "../src/components/Text";
import { renderWithTheme } from "./utils";

function Probe({ onValue }: { onValue: (v: NativeThemeContextValue) => void }) {
  onValue(useNativeTheme());
  return null;
}

describe("NativeThemeProvider", () => {
  it("tema adını çözer ve modu uygular", () => {
    let ctx!: NativeThemeContextValue;
    render(
      <NativeThemeProvider theme="glowscan" mode="dark">
        <Probe onValue={(v) => (ctx = v)} />
      </NativeThemeProvider>,
    );
    expect(ctx.theme.name).toBe("glowscan");
    expect(ctx.theme.mode).toBe("dark");
    expect(ctx.definition.label).toBe("GlowScan");
  });

  it("toggle ve setMode modu değiştirir; mode prop'u değişince eşitlenir", () => {
    let ctx!: NativeThemeContextValue;
    const { rerender } = render(
      <NativeThemeProvider theme="fisly" mode="light">
        <Probe onValue={(v) => (ctx = v)} />
      </NativeThemeProvider>,
    );
    act(() => ctx.toggle());
    expect(ctx.theme.mode).toBe("dark");
    act(() => ctx.setMode("light"));
    expect(ctx.theme.mode).toBe("light");
    rerender(
      <NativeThemeProvider theme="fisly" mode="dark">
        <Probe onValue={(v) => (ctx = v)} />
      </NativeThemeProvider>,
    );
    expect(ctx.theme.mode).toBe("dark");
  });

  it("web'de tema font yığınını, verilirse özel fontları kullanır", () => {
    let ctx!: NativeThemeContextValue;
    render(
      <NativeThemeProvider theme="dolap" mode="light" fonts={{ body: "Inter" }}>
        <Probe onValue={(v) => (ctx = v)} />
      </NativeThemeProvider>,
    );
    expect(ctx.fonts.body).toBe("Inter");
    expect(String(ctx.fonts.heading)).toContain("Fraunces");
  });

  it("provider dışında useNativeTheme hata fırlatır", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<Probe onValue={() => undefined} />)).toThrow(/NativeThemeProvider/);
    spy.mockRestore();
  });

  it("useIsRTL provider yönünü okur", () => {
    let rtl: boolean | null = null;
    function R() {
      rtl = useIsRTL();
      return null;
    }
    renderWithTheme(<R />, { direction: "rtl" });
    expect(rtl).toBe(true);
    renderWithTheme(<R />, { direction: "ltr" });
    expect(rtl).toBe(false);
  });

  it("makeStyles temaya bağlı stil üretir", () => {
    const useStyles = makeStyles((t) => ({ box: { padding: t.space.lg } }));
    let styles: ReturnType<typeof useStyles> | null = null;
    function S() {
      styles = useStyles();
      return null;
    }
    renderWithTheme(<S />);
    expect(styles).not.toBeNull();
  });
});

describe("Text", () => {
  it("başlık varyantları heading rolü ve başlık fontunu alır", () => {
    renderWithTheme(<Text variant="h1">Merhaba</Text>);
    const h = screen.getByRole("heading", { name: "Merhaba" });
    expect(h.style.fontFamily).toContain("Fraunces");
  });

  it("gövde metni body fontu ve renk ezmesi alır", () => {
    renderWithTheme(
      <Text color="destructive" testID="t">
        Hata
      </Text>,
    );
    const el = screen.getByTestId("t");
    expect(el.style.fontFamily).toContain("Manrope");
    expect(el.style.color).not.toBe("");
  });

  it("kullanıcı fontFamily verirse ezilmez", () => {
    renderWithTheme(
      <RNText testID="raw">x</RNText>,
    );
    renderWithTheme(
      <Text testID="custom" style={{ fontFamily: "Mono" }}>
        y
      </Text>,
    );
    expect(screen.getByTestId("custom").style.fontFamily).toBe("Mono");
  });
});
