/**
 * useReducedMotion — işletim sisteminin "hareketi azalt" tercihini izler.
 * Animasyonlu bileşenler bu değer true iken animasyonu atlar ya da kısaltır.
 */
import * as React from "react";
import { AccessibilityInfo, Platform } from "react-native";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  const current = React.useRef(false);

  React.useEffect(() => {
    let mounted = true;
    // Yalnızca değer değişince güncelle (gereksiz yeniden render yok).
    const apply = (value: boolean) => {
      if (mounted && value !== current.current) {
        current.current = value;
        setReduced(value);
      }
    };
    const query = AccessibilityInfo.isReduceMotionEnabled?.();
    if (query !== undefined && typeof query.then === "function") {
      query
        .then((value) => apply(Boolean(value)))
        .catch(() => undefined);
    }
    const sub = AccessibilityInfo.addEventListener?.(
      "reduceMotionChanged",
      (value: boolean) => apply(Boolean(value)),
    );
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);

  return reduced;
}

/**
 * Animated `useNativeDriver` değeri: web'de (react-native-web) yerel sürücü
 * yoktur ve her animasyonda uyarı basar; native'de açık.
 */
export const USE_NATIVE_DRIVER = Platform.OS !== "web";
