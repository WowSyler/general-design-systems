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
