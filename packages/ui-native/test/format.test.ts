import { applyKeypadKey } from "../src/components/NumericKeypad";
import { addMonths, formatDateLong, formatDateShort, isWithin, monthGrid } from "../src/internal/date";
import { currencySymbol, formatMoney, formatNumber, parseAmount } from "../src/internal/format";
import { withAlpha } from "../src/internal/color";

describe("para/sayı biçimleme", () => {
  it("TRY tutarını tr-TR biçiminde yazar", () => {
    const s = formatMoney(1250.5);
    expect(s).toContain("1.250,50");
    expect(s).toContain("₺");
  });

  it("sayıyı binlik ayırıcıyla biçimler", () => {
    expect(formatNumber(1234567)).toBe("1.234.567");
  });

  it("para birimi sembolünü döndürür", () => {
    expect(currencySymbol("EUR", "tr-TR")).toBe("€");
  });

  it("farklı yerel biçimlerdeki tutarları çözer", () => {
    expect(parseAmount("1.250,5")).toBe(1250.5);
    expect(parseAmount("1,250.5")).toBe(1250.5);
    expect(parseAmount("12,75")).toBe(12.75);
    expect(parseAmount("")).toBeNull();
    expect(parseAmount("abc")).toBeNull();
  });
});

describe("tarih yardımcıları", () => {
  it("Eylül 2026 ızgarası Pazartesi'den başlar", () => {
    const grid = monthGrid(new Date(2026, 8, 1));
    // 1 Eylül 2026 Salı → ilk hücre boş, ikinci hücre 1.
    expect(grid[0]![0]).toBeNull();
    expect(grid[0]![1]!.getDate()).toBe(1);
    expect(grid.every((w) => w.length === 7)).toBe(true);
  });

  it("aralık kontrolü ve biçimler", () => {
    const d = new Date(2026, 8, 22);
    expect(isWithin(d, new Date(2026, 8, 1), new Date(2026, 8, 30))).toBe(true);
    expect(isWithin(d, new Date(2026, 8, 23))).toBe(false);
    expect(formatDateLong(d)).toBe("22 Eylül 2026");
    expect(formatDateShort(d)).toBe("22.09.2026");
    expect(addMonths(d, 1).getMonth()).toBe(9);
  });
});

describe("tuş takımı ve renk", () => {
  it("applyKeypadKey ondalık ve sınırları uygular", () => {
    expect(applyKeypadKey("", "5")).toBe("5");
    expect(applyKeypadKey("0", "5")).toBe("5");
    expect(applyKeypadKey("", "decimal")).toBe("0,");
    expect(applyKeypadKey("12,5", "decimal")).toBe("12,5");
    expect(applyKeypadKey("12,50", "7")).toBe("12,50");
    expect(applyKeypadKey("123", "backspace")).toBe("12");
    expect(applyKeypadKey("99", "9", { maxLength: 2 })).toBe("99");
  });

  it("withAlpha hex'i rgba'ya çevirir", () => {
    expect(withAlpha("#ff0000", 0.5)).toBe("rgba(255, 0, 0, 0.5)");
    expect(withAlpha("#0f0", 1)).toBe("rgba(0, 255, 0, 1)");
    expect(withAlpha("not-a-color", 1)).toBe("not-a-color");
  });
});
