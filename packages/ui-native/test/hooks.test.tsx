import * as React from "react";
import { renderHook, screen, waitFor } from "@testing-library/react";

import {
  Hide,
  Show,
  breakpointForWidth,
  computeBreakpointState,
  resolveResponsiveValue,
  useBreakpoint,
  useResponsiveValue,
} from "../src/hooks/useBreakpoint";
import { useReducedMotion } from "../src/internal/useReducedMotion";
import { useSafeInsets } from "../src/internal/useSafeInsets";
import { Text } from "../src/components/Text";
import { TABLET, renderWithTheme, setWindowSize } from "./utils";

describe("kırılım yardımcıları", () => {
  it("genişliği kırılım adına çevirir", () => {
    expect(breakpointForWidth(390)).toBe("base");
    expect(breakpointForWidth(640)).toBe("sm");
    expect(breakpointForWidth(820)).toBe("md");
    expect(breakpointForWidth(1180)).toBe("lg");
    expect(breakpointForWidth(1600)).toBe("2xl");
  });

  it("cihaz sınıfını kısa kenara göre belirler", () => {
    expect(computeBreakpointState(844, 390).isTablet).toBe(false);
    expect(computeBreakpointState(844, 390).isLandscape).toBe(true);
    expect(computeBreakpointState(820, 1180).isTablet).toBe(true);
    expect(computeBreakpointState(820, 1180).up("md")).toBe(true);
    expect(computeBreakpointState(820, 1180).down("lg")).toBe(true);
  });

  it("responsive değeri mobil-öncelikli çözer", () => {
    const v = { base: 1, md: 2, xl: 4 };
    expect(resolveResponsiveValue(v, "base")).toBe(1);
    expect(resolveResponsiveValue(v, "sm")).toBe(1);
    expect(resolveResponsiveValue(v, "lg")).toBe(2);
    expect(resolveResponsiveValue(v, "2xl")).toBe(4);
    expect(resolveResponsiveValue({ md: 3 }, "base")).toBe(3);
  });
});

describe("useBreakpoint", () => {
  it("pencere boyutu değişince güncellenir", () => {
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isPhone).toBe(true);
    expect(result.current.width).toBe(390);
    setWindowSize(TABLET.width, TABLET.height);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.breakpoint).toBe("md");
  });

  it("useResponsiveValue aktif kırılıma uyar", () => {
    const { result } = renderHook(() => useResponsiveValue({ base: "tek", md: "çift" }));
    expect(result.current).toBe("tek");
    setWindowSize(TABLET.width, TABLET.height);
    expect(result.current).toBe("çift");
  });

  it("Show/Hide kırılıma göre render eder", () => {
    renderWithTheme(
      <>
        <Show device="tablet">
          <Text>tablet-içerik</Text>
        </Show>
        <Hide above="md">
          <Text>telefon-içerik</Text>
        </Hide>
      </>,
    );
    expect(screen.queryByText("tablet-içerik")).toBeNull();
    expect(screen.getByText("telefon-içerik")).toBeInTheDocument();
    setWindowSize(TABLET.width, TABLET.height);
    expect(screen.getByText("tablet-içerik")).toBeInTheDocument();
    expect(screen.queryByText("telefon-içerik")).toBeNull();
  });
});

describe("diğer hook'lar", () => {
  it("useReducedMotion varsayılan false döner", async () => {
    const { result } = renderHook(() => useReducedMotion());
    await waitFor(() => expect(result.current).toBe(false));
  });

  it("useSafeInsets provider yokken sıfır döner", () => {
    const { result } = renderHook(() => useSafeInsets());
    expect(result.current).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
  });
});
