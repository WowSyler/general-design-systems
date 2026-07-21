/**
 * SafeArea — mobil cihaz guvenli alan (centik/kavisli kose/home-bar) sarmalayici.
 * `env(safe-area-inset-*)` degerlerini inline padding olarak uygular; her kenarda
 * `max(base, env(...))` ile taban dolgu garanti edilir (env desteklenmese veya 0
 * olsa bile en az `base` kadar dolgu kalir). `sides` prop'u ile hangi kenarlara
 * uygulanacagi secilir: "top" | "bottom" | "left" | "right" | "x" | "y" | "all"
 * (tekil deger ya da dizi).
 *
 * Mobil AppShell ust cubugu, BottomNav, tam ekran modaller ve alt sayfa (sheet)
 * gibi ekran kenarina yaslanan yerlesimler icin.
 *
 * Not: `env(safe-area-inset-*)` degerlerinin dolmasi icin sayfanin viewport
 * meta etiketinde `viewport-fit=cover` bulunmalidir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

type SafeAreaSide = "top" | "bottom" | "left" | "right" | "x" | "y" | "all";

type SafeAreaEdge = "top" | "bottom" | "left" | "right";

/** Kisayol kenarlari (x/y/all) tekil kenarlara cozer. */
function resolveSafeAreaEdges(
  sides: SafeAreaSide | SafeAreaSide[]
): Set<SafeAreaEdge> {
  const edges = new Set<SafeAreaEdge>();
  const list = Array.isArray(sides) ? sides : [sides];
  for (const side of list) {
    switch (side) {
      case "all":
        edges.add("top");
        edges.add("bottom");
        edges.add("left");
        edges.add("right");
        break;
      case "x":
        edges.add("left");
        edges.add("right");
        break;
      case "y":
        edges.add("top");
        edges.add("bottom");
        break;
      default:
        edges.add(side);
    }
  }
  return edges;
}

interface SafeAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Guvenli alan dolgusunun uygulanacagi kenar(lar).
   * Tekil ("bottom") ya da dizi (["top", "x"]). Varsayilan: "all".
   */
  sides?: SafeAreaSide | SafeAreaSide[];
  /**
   * Her kenar icin taban (minimum) dolgu; `env()` bundan kucukse taban kullanilir.
   * Herhangi bir CSS uzunlugu ("0px", "1rem", "12px"). Varsayilan: "0px".
   */
  base?: string;
}

const SafeArea = React.forwardRef<HTMLDivElement, SafeAreaProps>(
  ({ className, sides = "all", base = "0px", style, ...props }, ref) => {
    const edges = resolveSafeAreaEdges(sides);
    const inset = (edge: SafeAreaEdge) =>
      `max(${base}, env(safe-area-inset-${edge}))`;

    const safeStyle: React.CSSProperties = {
      ...(edges.has("top") ? { paddingTop: inset("top") } : null),
      ...(edges.has("bottom") ? { paddingBottom: inset("bottom") } : null),
      ...(edges.has("left") ? { paddingLeft: inset("left") } : null),
      ...(edges.has("right") ? { paddingRight: inset("right") } : null),
    };

    return (
      <div
        ref={ref}
        className={cn("min-w-0", className)}
        style={{ ...safeStyle, ...style }}
        {...props}
      />
    );
  }
);
SafeArea.displayName = "SafeArea";

export { SafeArea };
export type { SafeAreaProps, SafeAreaSide };
