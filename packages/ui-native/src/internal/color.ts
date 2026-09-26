/**
 * Renk yardımcıları — yalnızca tema tokenlarından türetilen tonlar için.
 * Ham renk üretmez; "#rrggbb" / "#rgb" token değerine alfa ekler.
 */

/** Hex değerini rgba() dizgesine çevirir; çözülemezse değeri aynen döndürür. */
export function withAlpha(hex: string, alpha: number): string {
  let value = hex.replace("#", "");
  if (value.length === 3) {
    value = value
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return hex;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Scrim (arka plan karartması) — tasarım kuralındaki tek rgba istisnası. */
export const SCRIM = "rgba(0, 0, 0, 0.4)";
