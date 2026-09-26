/**
 * Her story'yi jsdom'da render eder (preview.tsx decorator'ları dahil) ve
 * axe-core ile WCAG 2.x A/AA denetler. Layout gerektiren kurallar (renk
 * kontrastı vb.) jsdom'da ölçülemediği için kapalıdır — onları tarayıcı
 * tabanlı responsive denetim / tokens kontrast testi kapsar.
 * Yalnızca "serious" ve "critical" etkili ihlaller testi başarısız yapar.
 */
import { composeStories } from "@storybook/react";
import type { ComponentType } from "react";
import { act, render } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

type StoryModule = Parameters<typeof composeStories>[0];

const LAYOUT_RULES = [
  "color-contrast",
  "color-contrast-enhanced",
  "link-in-text-block",
  "target-size",
  "scrollable-region-focusable",
  "frame-tested",
];

/**
 * Açık modal (Dialog/Drawer/Menu) arka planı `aria-hidden` ile gizlenir (Radix
 * hideOthers) ve Radix odak korumaları (focus-guard) kasıtlı olarak odaklanabilir
 * + aria-hidden'dır. Bunlar tasarım gereğidir; aria-hidden-focus yanlış pozitifi
 * üretmemeleri için denetim dışı bırakılır. Modal içeriğinin kendisi denetlenir.
 */
const EXCLUDE = [["[data-radix-focus-guard]"], ['[data-aria-hidden="true"]']];

export async function axeViolations(root: Element) {
  const result = await axe.run({ include: [root], exclude: EXCLUDE } as unknown as axe.ElementContext, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    rules: Object.fromEntries(LAYOUT_RULES.map((r) => [r, { enabled: false }])),
    resultTypes: ["violations"],
  });
  return result.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id} (${v.impact}): ${v.help} → ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
}

export function runStories(modules: Record<string, unknown>) {
  const entries = Object.entries(modules).sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) {
    it.skip("story dosyası yok", () => {});
    return;
  }
  for (const [path, mod] of entries) {
    const file = path.split("/").pop()!.replace(/\.stories\.tsx$/, "");
    const stories = composeStories(mod as StoryModule);
    describe(file, () => {
      for (const [name, composed] of Object.entries(stories)) {
        const Story = composed as unknown as ComponentType;
        it(name, async () => {
          const errors: unknown[] = [];
          const spy = vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
            const msg = String(args[0] ?? "");
            // jsdom'a özgü, render hatası olmayan gürültü
            if (/not implemented|act\(|Could not parse CSS|Warning: Function components cannot be given refs/i.test(msg)) return;
            errors.push(args.map(String).join(" ").slice(0, 400));
          });
          let container!: HTMLElement;
          await act(async () => {
            ({ container } = render(<Story />));
          });
          await act(async () => {
            await new Promise((r) => setTimeout(r, 0));
          });
          spy.mockRestore();
          expect(container.innerHTML.length, "boş render").toBeGreaterThan(0);
          expect(errors, `console.error:\n${errors.join("\n")}`).toEqual([]);
          const violations = await axeViolations(document.body);
          expect(violations, `a11y:\n${violations.join("\n")}`).toEqual([]);
        });
      }
    });
  }
}
