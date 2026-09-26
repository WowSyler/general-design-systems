/**
 * jsdom ortamı için tarayıcı API polyfill'leri + kontrol edilebilir viewport.
 * `setViewport(width)` matchMedia (min/max-width, prefers-color-scheme,
 * pointer) sorgularını yeniden değerlendirir ve "change" olaylarını yayınlar.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

type Listener = (e: MediaQueryListEvent) => void;

const state = { width: 1024, dark: false, coarse: false };
const lists = new Set<{ query: string; matches: boolean; listeners: Set<Listener> }>();

function evaluate(query: string): boolean {
  return query
    .split(",")
    .some((part) =>
      part.split(/\band\b/).every((cond) => {
        const c = cond.trim();
        let m: RegExpMatchArray | null;
        if ((m = c.match(/\(\s*min-width:\s*([\d.]+)px\s*\)/))) return state.width >= Number(m[1]);
        if ((m = c.match(/\(\s*max-width:\s*([\d.]+)px\s*\)/))) return state.width <= Number(m[1]);
        if (/prefers-color-scheme:\s*dark/.test(c)) return state.dark;
        if (/prefers-color-scheme:\s*light/.test(c)) return !state.dark;
        if (/prefers-reduced-motion:\s*reduce/.test(c)) return true;
        if (/pointer:\s*coarse/.test(c)) return state.coarse;
        if (/pointer:\s*fine/.test(c)) return !state.coarse;
        if (/hover:\s*none/.test(c)) return state.coarse;
        if (/hover:\s*hover/.test(c)) return !state.coarse;
        return c === "" || c === "screen" || c === "all";
      }),
    );
}

function notify() {
  for (const l of lists) {
    const next = evaluate(l.query);
    if (next !== l.matches) {
      l.matches = next;
      for (const fn of l.listeners) fn({ matches: next, media: l.query } as MediaQueryListEvent);
    }
  }
}

export function setViewport(width: number) {
  state.width = width;
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  notify();
  window.dispatchEvent(new Event("resize"));
}

export function setColorScheme(dark: boolean) {
  state.dark = dark;
  notify();
}

export function setCoarsePointer(coarse: boolean) {
  state.coarse = coarse;
  notify();
}

window.matchMedia = (query: string) => {
  const entry = { query, matches: evaluate(query), listeners: new Set<Listener>() };
  lists.add(entry);
  const mql = {
    get matches() {
      return entry.matches;
    },
    media: query,
    onchange: null,
    addEventListener: (_: string, fn: Listener) => entry.listeners.add(fn),
    removeEventListener: (_: string, fn: Listener) => entry.listeners.delete(fn),
    addListener: (fn: Listener) => entry.listeners.add(fn),
    removeListener: (fn: Listener) => entry.listeners.delete(fn),
    dispatchEvent: () => true,
  };
  return mql as unknown as MediaQueryList;
};

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
class IntersectionObserverMock {
  root = null;
  rootMargin = "";
  thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.ResizeObserver ??= ResizeObserverMock as unknown as typeof ResizeObserver;
globalThis.IntersectionObserver ??= IntersectionObserverMock as unknown as typeof IntersectionObserver;

Element.prototype.scrollIntoView ??= function () {};
Element.prototype.scrollTo ??= function () {};
window.scrollTo = () => {};
document.elementFromPoint ??= () => null;
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.setPointerCapture ??= () => {};
Element.prototype.releasePointerCapture ??= () => {};
if (!("PointerEvent" in window)) {
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number;
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
      this.pointerType = init.pointerType ?? "mouse";
    }
  }
  (window as unknown as { PointerEvent: unknown }).PointerEvent = PointerEventPolyfill;
}

afterEach(() => {
  cleanup();
  setViewport(1024);
  setColorScheme(false);
  setCoarsePointer(false);
  document.documentElement.className = "";
  document.documentElement.removeAttribute("dir");
});
