import { describe, expect, it } from "vitest";
import { cn } from "../src/lib/utils";

describe("cn()", () => {
  it("clsx koşullu birleştirme", () => {
    expect(cn("a", false && "b", undefined, ["c", { d: true, e: false }])).toBe("a c d");
  });

  it("çakışan Tailwind sınıflarında sonuncu kazanır", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
    expect(cn("bg-primary", "bg-destructive")).toBe("bg-destructive");
  });

  it("bg-sheen / bg-brand-gradient bg-image grubunda: renk sınıfını SİLMEZ", () => {
    // Regresyon: varsayılan tailwind-merge bunları renk sanıp bg-primary'yi silerdi (beyaz buton)
    expect(cn("bg-primary", "bg-sheen")).toBe("bg-primary bg-sheen");
    expect(cn("bg-primary text-primary-foreground", "bg-brand-gradient")).toBe(
      "bg-primary text-primary-foreground bg-brand-gradient",
    );
    expect(cn("bg-sheen", "bg-brand-gradient")).toBe("bg-brand-gradient");
  });

  it("mantıksal (RTL) utility'leri tanır", () => {
    expect(cn("ms-2", "ms-4")).toBe("ms-4");
    expect(cn("ps-2 pe-2", "ps-4")).toBe("pe-2 ps-4");
  });
});
