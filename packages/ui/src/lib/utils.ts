import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * bg-sheen ve bg-brand-gradient background-IMAGE utility'leridir;
 * varsayılan tailwind-merge bunları renk sanıp bg-primary gibi
 * renk sınıflarını siler (bembeyaz buton regresyonu). Burada doğru
 * gruba kaydediyoruz ki renk + görüntü yan yana yaşayabilsin.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "bg-image": [{ bg: ["sheen", "brand-gradient"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Öğe (veya belge) sağdan-sola yönde mi? `dir` kalıtımını hesaba katar. */
export function isRtl(el?: Element | null): boolean {
  if (typeof window === "undefined") return false;
  const target = el ?? document.documentElement;
  return getComputedStyle(target).direction === "rtl";
}

/**
 * Yatay ok tuşlarını mantıksal yöne çevirir: RTL'de ArrowLeft ↔ ArrowRight.
 * Klavye işleyicilerinde `switch (logicalArrowKey(event.key, event.currentTarget))`
 * ile "ArrowRight = ileri" mantığı her iki yönde de doğru çalışır.
 */
export function logicalArrowKey(key: string, el?: Element | EventTarget | null): string {
  if (key !== "ArrowLeft" && key !== "ArrowRight") return key;
  const node = el instanceof Element ? el : null;
  if (!isRtl(node)) return key;
  return key === "ArrowLeft" ? "ArrowRight" : "ArrowLeft";
}
