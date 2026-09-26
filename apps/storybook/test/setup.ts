/** jsdom polyfill'leri + Storybook proje anotasyonları (preview.tsx decorator'ları) */
import "@testing-library/jest-dom/vitest";
import { setProjectAnnotations } from "@storybook/react";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll } from "vitest";
import preview from "../.storybook/preview";

const annotations = setProjectAnnotations([preview]);
beforeAll(annotations.beforeAll);

function matches(query: string): boolean {
  const width = window.innerWidth || 1024;
  return query.split(",").some((part) =>
    part.split(/\band\b/).every((cond) => {
      const c = cond.trim();
      let m: RegExpMatchArray | null;
      if ((m = c.match(/\(\s*min-width:\s*([\d.]+)px\s*\)/))) return width >= Number(m[1]);
      if ((m = c.match(/\(\s*max-width:\s*([\d.]+)px\s*\)/))) return width <= Number(m[1]);
      if (/prefers-reduced-motion:\s*reduce/.test(c)) return true;
      if (/pointer:\s*fine|hover:\s*hover/.test(c)) return true;
      return !/prefers-color-scheme:\s*dark|pointer:\s*coarse|hover:\s*none/.test(c);
    }),
  );
}

window.matchMedia = (query: string) =>
  ({
    matches: matches(query),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => true,
  }) as unknown as MediaQueryList;

class ObserverMock {
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
globalThis.ResizeObserver ??= ObserverMock as unknown as typeof ResizeObserver;
globalThis.IntersectionObserver ??= ObserverMock as unknown as typeof IntersectionObserver;
Element.prototype.scrollIntoView ??= function () {};
Element.prototype.scrollTo ??= function () {};
window.scrollTo = () => {};
document.elementFromPoint ??= () => null;
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.setPointerCapture ??= () => {};
Element.prototype.releasePointerCapture ??= () => {};
HTMLCanvasElement.prototype.getContext = (() => null) as unknown as HTMLCanvasElement["getContext"];
if (!("PointerEvent" in window)) {
  (window as unknown as { PointerEvent: unknown }).PointerEvent = class extends MouseEvent {
    pointerId = 1;
    pointerType = "mouse";
  };
}
HTMLMediaElement.prototype.play = () => Promise.resolve();
HTMLMediaElement.prototype.pause = () => {};
HTMLMediaElement.prototype.load = () => {};
if (!navigator.clipboard) {
  Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.resolve(), readText: () => Promise.resolve("") } });
}
if (!("mediaDevices" in navigator)) {
  Object.defineProperty(navigator, "mediaDevices", { value: { getUserMedia: () => Promise.reject(new Error("jsdom")) } });
}
globalThis.URL.createObjectURL ??= () => "blob:jsdom";
globalThis.URL.revokeObjectURL ??= () => {};

afterEach(() => {
  cleanup();
  document.documentElement.className = "";
  document.documentElement.removeAttribute("dir");
});
