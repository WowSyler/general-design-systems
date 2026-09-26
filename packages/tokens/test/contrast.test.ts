import { describe, expect, it } from "vitest";
import { themes, type ColorTokens } from "../src/index.js";
import { contrastRatio } from "./contrast.js";

type Pair = readonly [fg: keyof ColorTokens, bg: keyof ColorTokens];

/**
 * WCAG 2.1 AA — normal boyutlu metin (1.4.3): ≥ 4.5:1.
 * Bu çiftler bileşenlerde gövde/buton/rozet metni olarak kullanılır
 * (text-sm/text-xs dahil), bu yüzden büyük-metin istisnası uygulanmaz.
 */
const TEXT_PAIRS: Pair[] = [
  ["foreground", "background"],
  ["cardForeground", "card"],
  ["popoverForeground", "popover"],
  ["primaryForeground", "primary"],
  ["secondaryForeground", "secondary"],
  ["mutedForeground", "muted"],
  ["mutedForeground", "background"],
  ["mutedForeground", "card"],
  ["accentForeground", "accent"],
  ["destructiveForeground", "destructive"],
  ["successForeground", "success"],
  ["warningForeground", "warning"],
  ["infoForeground", "info"],
  ["sidebarForeground", "sidebar"],
  ["sidebarPrimaryForeground", "sidebarPrimary"],
  ["sidebarAccentForeground", "sidebarAccent"],
];

/**
 * WCAG 2.1 AA — metin dışı kontrast (1.4.11) ve büyük metin: ≥ 3:1.
 * Odak halkası, dolu buton/rozet yüzeyi, durum ikonları ve büyük rakamlar
 * zemin üzerinde ayırt edilebilir olmalı.
 */
const NON_TEXT_PAIRS: Pair[] = [
  ["ring", "background"],
  ["primary", "background"],
  ["destructive", "background"],
  ["success", "background"],
  ["warning", "background"],
  ["info", "background"],
  ["sidebarRing", "sidebar"],
];

const MODES = ["light", "dark"] as const;

function cases(pairs: Pair[]) {
  return themes.flatMap((t) =>
    MODES.flatMap((mode) =>
      pairs.map(([fg, bg]) => [
        `${t.name}/${mode}: ${fg} / ${bg}`,
        contrastRatio(t.colors[mode][fg], t.colors[mode][bg]),
      ] as const),
    ),
  );
}

describe("WCAG AA kontrastı", () => {
  it.each(cases(TEXT_PAIRS))("metin ≥ 4.5 — %s", (_id, ratio) => {
    expect(Number(ratio.toFixed(2))).toBeGreaterThanOrEqual(4.5);
  });

  it.each(cases(NON_TEXT_PAIRS))("metin dışı ≥ 3 — %s", (_id, ratio) => {
    expect(Number(ratio.toFixed(2))).toBeGreaterThanOrEqual(3);
  });
});
