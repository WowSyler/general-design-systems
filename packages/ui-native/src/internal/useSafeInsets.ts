/**
 * Güvenli alan (safe area) boşlukları — SafeAreaProvider yoksa hata fırlatmak
 * yerine sıfır döner. Böylece bileşenler provider'sız ortamlarda (testler,
 * web önizleme, provider'ı olmayan uygulamalar) da güvenle render olur.
 */
import * as React from "react";
import {
  SafeAreaInsetsContext,
  type EdgeInsets,
} from "react-native-safe-area-context";

const ZERO: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };

export function useSafeInsets(): EdgeInsets {
  return React.useContext(SafeAreaInsetsContext) ?? ZERO;
}

/** Provider mevcut mu (Screen gibi bileşenler yerel SafeAreaView'a düşmek için okur). */
export function useHasSafeAreaProvider(): boolean {
  return React.useContext(SafeAreaInsetsContext) !== null;
}
