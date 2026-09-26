/**
 * Dokunma hedefi yardımcıları. Görsel boyutu MIN_TOUCH_TARGET'tan (44pt) küçük
 * denetimlerde gerçek dokunulabilir kutu 44pt yapılır, görsel yüzey içte küçük
 * kalır. (`hitSlop` web'de DOM kutusuna yansımadığından ölçülebilir değildir;
 * bu yüzden dokunma kutusunun kendisi büyütülür.)
 */
import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

/** Dokunma kutusu kenarı: görsel boyut ile MIN_TOUCH_TARGET'ın büyüğü. */
export function touchSize(visual: number): number {
  return Math.max(visual, MIN_TOUCH_TARGET);
}

/**
 * 44pt dokunma kutusunun görsel kutuyu her bir yanda ne kadar aştığı. Negatif
 * margin olarak verildiğinde yerleşim görsel boyutta kalır (taşma yalnızca
 * dokunma alanıdır).
 */
export function touchOverhang(visual: number): number {
  return visual < MIN_TOUCH_TARGET ? (MIN_TOUCH_TARGET - visual) / 2 : 0;
}
