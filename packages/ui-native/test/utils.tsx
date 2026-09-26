import * as React from "react";
import { act, fireEvent, render, type RenderOptions, type RenderResult } from "@testing-library/react";

import {
  NativeThemeProvider,
  type NativeThemeProviderProps,
} from "../src/theme/ThemeProvider";

type Wrapped = Omit<NativeThemeProviderProps, "children">;

/** Bileşeni tema sağlayıcısı içinde render eder (varsayılan: dolap/light). */
export function renderWithTheme(
  ui: React.ReactElement,
  providerProps: Partial<Wrapped> = {},
  options?: Omit<RenderOptions, "wrapper">,
): RenderResult {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <NativeThemeProvider theme="dolap" mode="light" {...providerProps}>
        {children}
      </NativeThemeProvider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Pencere boyutunu değiştirir: react-native-web Dimensions, jsdom'da
 * documentElement.clientWidth/clientHeight okur ve "resize" olayını dinler.
 */
export function setWindowSize(width: number, height: number): void {
  Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: width });
  Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: height });
  act(() => {
    window.dispatchEvent(new Event("resize"));
  });
}

export const PHONE = { width: 390, height: 844 } as const;
export const TABLET = { width: 820, height: 1180 } as const;

type TouchPoint = { x: number; y?: number };

function touchInit(el: Element, p: TouchPoint | null, changed: TouchPoint) {
  const mk = (t: TouchPoint) => ({ pageX: t.x, pageY: t.y ?? 10, clientX: t.x, clientY: t.y ?? 10, identifier: 0, target: el });
  return { touches: p ? [mk(p)] : [], changedTouches: [mk(changed)] };
}

const tick = () => new Promise((r) => setTimeout(r, 4));

/**
 * Responder sistemi (PanResponder) için dokunma dizisi: başla → (hareket) → bırak.
 * Olaylar arasında kısa bekleme vardır: PanResponder dx'i "önceki zaman
 * damgasından sonra değişen" dokunuşlardan hesaplar; aynı milisaniyedeki
 * olaylar hareketi sıfır gösterir.
 */
export async function touchGesture(el: Element, fromX: number, toX?: number): Promise<void> {
  fireEvent.touchStart(el, touchInit(el, { x: fromX }, { x: fromX }));
  await tick();
  if (toX !== undefined) {
    const steps = 4;
    for (let i = 1; i <= steps; i += 1) {
      const x = fromX + ((toX - fromX) * i) / steps;
      fireEvent.touchMove(el, touchInit(el, { x }, { x }));
      await tick();
    }
  }
  const end = toX ?? fromX;
  fireEvent.touchEnd(el, touchInit(el, null, { x: end }));
}
