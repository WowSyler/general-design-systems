import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import * as charts from "../src/charts";
import * as lib from "../src/index";

/** Dışa aktarılan her bileşen (Büyük harfle başlayan fonksiyon/forwardRef) en az bir testte kullanılmalı. */
function componentNames(mod: Record<string, unknown>): string[] {
  return Object.entries(mod)
    .filter(([name, value]) => {
      if (!/^[A-Z][a-z]/.test(name)) return false;
      if (typeof value === "function") return true;
      // forwardRef / memo nesneleri
      return typeof value === "object" && value !== null && "$$typeof" in value;
    })
    .map(([name]) => name);
}

describe("dışa aktarım kapsamı", () => {
  const dir = __dirname;
  const sources = readdirSync(dir)
    .filter((f) => f.endsWith(".test.tsx") || f.endsWith(".test.ts"))
    .filter((f) => f !== "exports.test.ts")
    .map((f) => readFileSync(join(dir, f), "utf8"))
    .join("\n");

  it("ana giriş noktasındaki her bileşenin testi var", () => {
    const names = componentNames(lib as Record<string, unknown>);
    expect(names.length).toBeGreaterThan(60);
    const untested = names.filter((n) => !new RegExp(`<${n}[\\s>/]`).test(sources));
    expect(untested).toEqual([]);
  });

  it("charts giriş noktasındaki her bileşenin testi var", () => {
    const names = componentNames(charts as Record<string, unknown>);
    const untested = names.filter((n) => !new RegExp(`<${n}[\\s>/]`).test(sources));
    expect(untested).toEqual([]);
  });

  it("paket kökü react-native-svg'ye bağımlı değildir", () => {
    const index = readFileSync(join(dir, "../src/index.ts"), "utf8");
    expect(index).not.toMatch(/charts|react-native-svg/);
  });
});
