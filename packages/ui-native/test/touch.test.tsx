/**
 * Dokunma hedefi davranışları: görsel boyutu 44pt'den küçük denetimlerde gerçek
 * dokunulabilir kutunun ≥ MIN_TOUCH_TARGET olması ve anahtar satırlarının
 * tamamının (tek erişilebilir denetimle) değeri çevirmesi.
 */
import * as React from "react";
import { fireEvent, screen } from "@testing-library/react";

import { MIN_TOUCH_TARGET } from "@wowsyler/ds-tokens/native";

import { Button } from "../src/components/Button";
import { Checkbox } from "../src/components/Checkbox";
import { IconButton } from "../src/components/IconButton";
import { Input } from "../src/components/Input";
import { ListRow } from "../src/components/ListRow";
import { Text } from "../src/components/Text";
import { TextButton } from "../src/components/TextButton";
import { ToggleSwitch } from "../src/components/ToggleSwitch";
import { renderWithTheme } from "./utils";

const px = (n: number) => `${n}px`;

/**
 * RNW stili: satır içi değer ya da StyleSheet'in ürettiği atomik sınıfın
 * (`r-<prop>-<hash>`) CSS kuralındaki değer. (jsdom sınıf kurallarını
 * getComputedStyle'a yansıtmaz.)
 */
function rnStyle(el: Element, prop: string): string {
  const kebab = prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  const inline = (el as HTMLElement).style.getPropertyValue(kebab);
  if (inline !== "") return inline;
  const cls = Array.from(el.classList).find((c) => c.startsWith(`r-${prop}-`));
  if (cls === undefined) return "";
  for (const sheet of Array.from(document.styleSheets)) {
    for (const rule of Array.from(sheet.cssRules)) {
      if (rule.cssText.startsWith(`.${cls} `) || rule.cssText.startsWith(`.${cls}{`)) {
        return rule.cssText.match(new RegExp(`${kebab}:\\s*([^;}]+)`))?.[1]?.trim() ?? "";
      }
    }
  }
  return "";
}

describe("Dokunma kutusu ≥ 44pt", () => {
  it("IconButton sm: dokunma kutusu 44, görsel kutu 32", () => {
    renderWithTheme(<IconButton size="sm" accessibilityLabel="Kapat" icon={<Text>x</Text>} />);
    const btn = screen.getByRole("button", { name: "Kapat" });
    expect(btn.style.width).toBe(px(MIN_TOUCH_TARGET));
    expect(btn.style.height).toBe(px(MIN_TOUCH_TARGET));
    const face = btn.firstElementChild as HTMLElement;
    expect(face.style.width).toBe("32px");
    expect(face.style.height).toBe("32px");
  });

  it("IconButton bleed: yerleşim görsel boyutta kalır (negatif margin)", () => {
    renderWithTheme(<IconButton size="sm" bleed accessibilityLabel="Temizle" icon={<Text>x</Text>} />);
    const btn = screen.getByRole("button", { name: "Temizle" });
    expect(btn.style.marginTop).toBe("-6px");
    expect(btn.style.marginLeft).toBe("-6px");
  });

  it("Button sm: dış kutu en az 44, görsel yüzey 36", () => {
    renderWithTheme(<Button title="Küçük" size="sm" />);
    const btn = screen.getByRole("button", { name: "Küçük" });
    expect(rnStyle(btn, "minHeight")).toBe(px(MIN_TOUCH_TARGET));
    expect(rnStyle(btn.firstElementChild as HTMLElement, "height")).toBe("36px");
  });

  it("TextButton en az 44×44", () => {
    renderWithTheme(<TextButton title="Tümü" size="sm" />);
    const btn = screen.getByRole("button", { name: "Tümü" });
    expect(rnStyle(btn, "minHeight")).toBe(px(MIN_TOUCH_TARGET));
    expect(rnStyle(btn, "minWidth")).toBe(px(MIN_TOUCH_TARGET));
  });

  it("Input: içteki TextInput alan yüksekliğini doldurur", () => {
    renderWithTheme(<Input label="E-posta" />);
    const input = screen.getByRole("textbox", { name: "E-posta" });
    expect(rnStyle(input, "minHeight")).toBe(px(MIN_TOUCH_TARGET));
    expect(rnStyle(input, "alignSelf")).toBe("stretch");
  });

  it("Checkbox satırı en az 44 yükseklikte ve etikete basınca değişir", () => {
    const onChange = vi.fn();
    renderWithTheme(<Checkbox value={false} onValueChange={onChange} label="Kabul" />);
    const cb = screen.getByRole("checkbox", { name: "Kabul" });
    expect(rnStyle(cb, "minHeight")).toBe(px(MIN_TOUCH_TARGET));
    fireEvent.click(screen.getByText("Kabul"));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Anahtar satırı", () => {
  it("ToggleSwitch: satıra basınca değişir; anahtara basınca tek kez bildirir", () => {
    const onChange = vi.fn();
    const { container } = renderWithTheme(<ToggleSwitch value={false} onValueChange={onChange} label="Bildirimler" />);
    const sw = screen.getByRole("switch", { name: "Bildirimler" });
    // Satır = anahtarın 2 üst atası (satır > denetim yuvası > Switch kökü > input).
    const row = sw.parentElement!.parentElement!.parentElement as HTMLElement;
    expect(rnStyle(row, "minHeight")).toBe(px(MIN_TOUCH_TARGET));
    fireEvent.click(row);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    // Klavye (Space) ile anahtarın ürettiği click satıra kabarsa da ikinci kez çevrilmez.
    fireEvent.click(sw);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(true);
    // Tek odaklanabilir/etkileşimli denetim anahtardır.
    expect(container.querySelectorAll('[tabindex="0"], input, [role="button"]')).toHaveLength(1);
  });

  it("ToggleSwitch etiketsiz: 44×44 dokunma kutusu", () => {
    const onChange = vi.fn();
    renderWithTheme(<ToggleSwitch value onValueChange={onChange} accessibilityLabel="Karanlık mod" />);
    const sw = screen.getByRole("switch", { name: "Karanlık mod" });
    const row = sw.parentElement!.parentElement!.parentElement as HTMLElement;
    expect(rnStyle(row, "minHeight")).toBe(px(MIN_TOUCH_TARGET));
    expect(rnStyle(row, "minWidth")).toBe(px(MIN_TOUCH_TARGET));
    fireEvent.click(row);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("ToggleSwitch devre dışıyken satır değeri değiştirmez", () => {
    const onChange = vi.fn();
    renderWithTheme(<ToggleSwitch value={false} onValueChange={onChange} label="Devre dışı" disabled />);
    fireEvent.click(screen.getByText("Devre dışı"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("ListRow anahtar satırı: başlığa basınca değişir, tek denetim anahtardır", () => {
    const onSwitch = vi.fn();
    const { container } = renderWithTheme(<ListRow title="Karanlık mod" subtitle="Sistem" switchValue onSwitchChange={onSwitch} />);
    expect(screen.getByRole("switch", { name: "Karanlık mod, Sistem" })).toBeInTheDocument();
    fireEvent.click(screen.getByText("Karanlık mod"));
    expect(onSwitch).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelectorAll('[tabindex="0"], input')).toHaveLength(1);
  });
});
