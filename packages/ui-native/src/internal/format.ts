/**
 * Biçimlendirme yardımcıları — Intl varsa onu, yoksa (eski Hermes) basit bir
 * geri dönüşü kullanır. Varsayılan yerel ayar tr-TR, para birimi TRY.
 */

export const DEFAULT_LOCALE = "tr-TR";
export const DEFAULT_CURRENCY = "TRY";

const CURRENCY_SYMBOL: Record<string, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
  SAR: "﷼",
  AED: "د.إ",
};

function groupDigits(int: string, sep: string): string {
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

/** Sayıyı yerel ayara göre biçimler (ondalık basamak sayısı sabit). */
export function formatNumber(
  value: number,
  fractionDigits = 0,
  locale = DEFAULT_LOCALE,
): string {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
  } catch {
    const fixed = Math.abs(value).toFixed(fractionDigits);
    const [int = "0", frac] = fixed.split(".");
    const out = groupDigits(int, ".") + (frac !== undefined ? `,${frac}` : "");
    return value < 0 ? `-${out}` : out;
  }
}

/** Tutarı para birimiyle biçimler (ör. 1.250,00 ₺). */
export function formatMoney(
  amount: number,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE,
  fractionDigits = 2,
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  } catch {
    const symbol = CURRENCY_SYMBOL[currency] ?? currency;
    return `${formatNumber(amount, fractionDigits, locale)} ${symbol}`;
  }
}

/** Para biriminin sembolü (₺, $, €…); bilinmiyorsa kodun kendisi. */
export function currencySymbol(currency = DEFAULT_CURRENCY, locale = DEFAULT_LOCALE): string {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).formatToParts(0);
    const sym = parts.find((p) => p.type === "currency")?.value;
    if (sym) return sym;
  } catch {
    // geri dönüşe düş
  }
  return CURRENCY_SYMBOL[currency] ?? currency;
}

/**
 * Kullanıcı girdisini sayıya çevirir: "1.250,5" (tr) ve "1,250.5" (en) biçimlerini
 * anlar. Çözülemezse null.
 */
export function parseAmount(input: string): number | null {
  const cleaned = input.replace(/[^\d.,-]/g, "");
  if (cleaned.length === 0) return null;
  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  let normalized: string;
  if (lastComma > lastDot) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (lastDot > lastComma && lastComma !== -1) {
    normalized = cleaned.replace(/,/g, "");
  } else {
    normalized = cleaned.replace(/,/g, ".");
    // Birden çok nokta varsa (binlik ayırıcı) sonuncusu hariç kaldır.
    const parts = normalized.split(".");
    if (parts.length > 2) {
      const frac = parts.pop();
      normalized = parts.join("") + "." + frac;
    }
  }
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}
