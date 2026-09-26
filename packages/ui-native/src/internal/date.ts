/**
 * Takvim yardımcıları — saf JS, yerel saat. DatePicker ve TimeSlotPicker kullanır.
 */

export const TR_MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
] as const;

/** Pazartesi'den başlayan kısa gün adları. */
export const TR_WEEKDAYS_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"] as const;

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

/** Tarih [min, max] aralığında mı (gün hassasiyetinde). */
export function isWithin(d: Date, min?: Date, max?: Date): boolean {
  const t = startOfDay(d).getTime();
  if (min && t < startOfDay(min).getTime()) return false;
  if (max && t > startOfDay(max).getTime()) return false;
  return true;
}

/**
 * Ay ızgarası: haftalar × 7 hücre. Ay dışındaki hücreler null.
 * weekStartsOn: 0 = Pazar, 1 = Pazartesi (varsayılan).
 */
export function monthGrid(month: Date, weekStartsOn: 0 | 1 = 1): (Date | null)[][] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(year, m, 1);
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const cells: (Date | null)[] = [];
  for (let i = 0; i < offset; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, m, day));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/** "22 Eylül 2026" */
export function formatDateLong(d: Date, months: readonly string[] = TR_MONTHS): string {
  return `${d.getDate()} ${months[d.getMonth()] ?? ""} ${d.getFullYear()}`;
}

/** "22.09.2026" */
export function formatDateShort(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}
