import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { LanguageSelector } from "@wowsyler/ds-ui";

const meta: Meta<typeof LanguageSelector> = {
  title: "Primitives/LanguageSelector",
  component: LanguageSelector,
};

export default meta;
type Story = StoryObj<typeof LanguageSelector>;

/** Sadece Turkce ve Ingilizce sunulan i18n akislari icin daraltilmis liste. */
const trEn = [
  { value: "tr", flag: "🇹🇷", name: "Türkçe", nativeName: "Türkçe", code: "TR" },
  { value: "en", flag: "🇬🇧", name: "İngilizce", nativeName: "English", code: "EN" },
];

/**
 * DeployLens üst çubuğunda kompakt dil seçici: yalnızca Globe ikonu ve
 * kısa kod (TR) görünür, açılır menüde bayrak + ad + yerel ad listelenir.
 */
export const Kompakt: Story = {
  render: () => {
    const [dil, setDil] = React.useState("tr");
    return (
      <div className="flex items-center gap-4">
        <LanguageSelector value={dil} onValueChange={setDil} variant="compact" />
        <p className="text-sm text-muted-foreground">
          Seçili arayüz dili:{" "}
          <span className="font-medium text-foreground">
            {dil.toUpperCase()}
          </span>
        </p>
      </div>
    );
  },
};

/**
 * Dolap hesap ayarlarında tam görünüm: bayrak, yerel ad ve kısa kod bir
 * arada. Altı dilli varsayılan set kontrolsüz olarak kullanılır.
 */
export const TamGorunum: Story = {
  render: () => (
    <div className="flex justify-center py-2">
      <LanguageSelector variant="full" defaultValue="tr" align="start" />
    </div>
  ),
};

/**
 * Fisly, GlowScan, Randevu, Dolap ve DeployLens için canlı TR/EN i18n
 * önizlemesi: dil değiştikçe beş ürünün bildirim metinleri güncellenir.
 */
export const CokDilliArayuz: Story = {
  render: () => {
    const [dil, setDil] = React.useState("tr");
    const sozluk = {
      tr: {
        DeployLens: "Dağıtım başarıyla tamamlandı.",
        Dolap: "Sepetinize 2 ürün eklendi.",
        Randevu: "Randevunuz 14 Temmuz için onaylandı.",
        GlowScan: "Cilt analiziniz hazır.",
        Fisly: "Bu ay 1.240 ₺ tasarruf ettiniz.",
      },
      en: {
        DeployLens: "Deployment completed successfully.",
        Dolap: "2 items added to your cart.",
        Randevu: "Your appointment is confirmed for July 14.",
        GlowScan: "Your skin analysis is ready.",
        Fisly: "You saved 1,240 ₺ this month.",
      },
    };
    const aktif = dil === "en" ? sozluk.en : sozluk.tr;
    return (
      <div className="w-[26rem] max-w-full space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            Bildirim önizlemesi
          </span>
          <LanguageSelector
            languages={trEn}
            value={dil}
            onValueChange={setDil}
            variant="full"
          />
        </div>
        <ul className="space-y-2">
          {Object.entries(aktif).map(([urun, metin]) => (
            <li
              key={urun}
              className="flex flex-col rounded-lg bg-muted/50 px-3 py-2"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {urun}
              </span>
              <span className="text-sm text-foreground">{metin}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  },
};

/** Menü açık önizleme: bayrak, ad, yerel ad ve seçili dildeki Check işareti. */
export const AcikMenu: Story = {
  render: () => (
    <div className="flex h-96 justify-center pt-2">
      <LanguageSelector defaultOpen defaultValue="tr" variant="full" align="start" />
    </div>
  ),
};
