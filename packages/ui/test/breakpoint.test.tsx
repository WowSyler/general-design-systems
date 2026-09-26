import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useBreakpoint, useBreakpointValue, useMediaQuery } from "../src";
import { setViewport } from "./setup";

describe("useMediaQuery", () => {
  it("eşleşmeyi döndürür ve değişime tepki verir", () => {
    setViewport(500);
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(false);
    act(() => setViewport(900));
    expect(result.current).toBe(true);
    act(() => setViewport(767));
    expect(result.current).toBe(false);
  });
});

describe("useBreakpoint", () => {
  it.each([
    [320, "base", { isMobile: true, isTablet: false, isDesktop: false }],
    [640, "sm", { isMobile: true, isTablet: false, isDesktop: false }],
    [768, "md", { isMobile: false, isTablet: true, isDesktop: false }],
    [1023, "md", { isMobile: false, isTablet: true, isDesktop: false }],
    [1024, "lg", { isMobile: false, isTablet: false, isDesktop: true }],
    [1280, "xl", { isMobile: false, isTablet: false, isDesktop: true }],
    [1600, "2xl", { isMobile: false, isTablet: false, isDesktop: true }],
  ] as const)("%ipx → %s", (width, bp, flags) => {
    setViewport(width);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.breakpoint).toBe(bp);
    expect(result.current).toMatchObject(flags);
  });

  it("pencere yeniden boyutlanınca güncellenir (telefon → tablet → masaüstü)", () => {
    setViewport(375);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isMobile).toBe(true);
    act(() => setViewport(820));
    expect(result.current.isTablet).toBe(true);
    act(() => setViewport(1440));
    expect(result.current.isDesktop).toBe(true);
  });
});

describe("useBreakpointValue", () => {
  it("mobil-öncelikli kademeli seçim", () => {
    setViewport(375);
    const { result } = renderHook(() => useBreakpointValue({ base: 1, md: 2, lg: 3 }));
    expect(result.current).toBe(1);
    act(() => setViewport(800));
    expect(result.current).toBe(2);
    act(() => setViewport(1300));
    expect(result.current).toBe(3);
  });

  it("yalnız büyük kırılım tanımlıysa küçükte undefined", () => {
    setViewport(375);
    const { result } = renderHook(() => useBreakpointValue({ lg: "geniş" }));
    expect(result.current).toBeUndefined();
  });
});
