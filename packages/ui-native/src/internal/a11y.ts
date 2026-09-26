/**
 * Erişilebilirlik durum yardımcıları — RN ≥ 0.71 ve react-native-web'in ortak
 * dili olan `aria-*` prop'larını üretir. `accessibilityState` /
 * `accessibilityValue` nesneleri web'de desteklenmediğinden kütüphane içinde
 * bunlar kullanılır: native'de ve web'de aynı sonucu verir.
 */
import { Platform } from "react-native";

export interface A11yState {
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean | "mixed";
  busy?: boolean;
  expanded?: boolean;
}

export interface AriaStateProps {
  "aria-disabled"?: boolean;
  "aria-selected"?: boolean;
  "aria-checked"?: boolean | "mixed";
  "aria-busy"?: boolean;
  "aria-expanded"?: boolean;
}

export function ariaState(state: A11yState | undefined): AriaStateProps {
  if (state === undefined) return {};
  const out: AriaStateProps = {};
  if (state.disabled !== undefined) out["aria-disabled"] = state.disabled;
  if (state.selected !== undefined) out["aria-selected"] = state.selected;
  if (state.checked !== undefined) out["aria-checked"] = state.checked;
  if (state.busy !== undefined) out["aria-busy"] = state.busy;
  if (state.expanded !== undefined) out["aria-expanded"] = state.expanded;
  return out;
}

export interface A11yValue {
  min?: number;
  max?: number;
  now?: number;
  text?: string;
}

export interface AriaValueProps {
  "aria-valuemin"?: number;
  "aria-valuemax"?: number;
  "aria-valuenow"?: number;
  "aria-valuetext"?: string;
}

export function ariaValue(value: A11yValue | undefined): AriaValueProps {
  if (value === undefined) return {};
  const out: AriaValueProps = {};
  if (value.min !== undefined) out["aria-valuemin"] = value.min;
  if (value.max !== undefined) out["aria-valuemax"] = value.max;
  if (value.now !== undefined) out["aria-valuenow"] = value.now;
  if (value.text !== undefined) out["aria-valuetext"] = value.text;
  return out;
}

/**
 * Aç/kapa (toggle) buton durumu. Web'de `aria-pressed` (button rolünde
 * aria-selected geçersizdir), native'de accessibilityState.selected.
 */
export function pressedState(selected: boolean | undefined): { accessibilityState?: { selected?: boolean } } {
  if (selected === undefined) return {};
  return Platform.OS === "web"
    ? ({ "aria-pressed": selected } as { accessibilityState?: { selected?: boolean } })
    : { accessibilityState: { selected } };
}
