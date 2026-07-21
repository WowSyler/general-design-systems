import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { CurrencySelector } from "@ds/ui";

const meta: Meta<typeof CurrencySelector> = {
  title: "Primitives/CurrencySelector",
  component: CurrencySelector,
};

export default meta;
type Story = StoryObj<typeof CurrencySelector>;

// Fisly cuzdaninda gosterilecgi tutarin taban degeri (TRY).
const tabanTutar = 12480.5;

/** Guncel kur tablosu; TRY tabanli, 1 birimin lira karsiligi. */
const kurlar: Record<string, number> = {
  TRY: 1,
  USD: 34.25,
  EUR: 37.1,
  GBP: 43.6,
};

/**
 * Fisly hesap ozetinde para birimi secici: secili birim degistikce
 * bakiye anlik olarak o birime cevrilip yeniden bicimlenir.
 */
export const Varsayilan: Story = {
  render: () => {
    const [birim, setBirim] = React.useState("TRY");
    const cevrilen = tabanTutar / (kurlar[birim] ?? 1);
    const bicimli = new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cevrilen);
    return (
      <div className="w-80 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Goruntuleme para birimi
          </label>
          <CurrencySelector
            currencies={[
              { value: "TRY", symbol: "₺", name: "Turk Lirasi", rate: 1 },
              { value: "USD", symbol: "$", name: "Amerikan Dolari", rate: 34.25 },
              { value: "EUR", symbol: "€", name: "Euro", rate: 37.1 },
              { value: "GBP", symbol: "£", name: "Ingiliz Sterlini", rate: 43.6 },
            ]}
            value={birim}
            onValueChange={setBirim}
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Toplam bakiye
          </span>
          <p className="text-2xl font-bold tabular-nums text-foreground">
            {bicimli} {birim}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Acik liste onizlemesi: sembol, kod, ad ve guncel kur bir arada; arama
 * kutusuna kod, sembol veya adla filtreleme yapilir.
 */
export const AcikListe: Story = {
  render: () => (
    <div className="flex h-[28rem] w-80 flex-col">
      <CurrencySelector
        defaultOpen
        defaultValue="TRY"
        searchPlaceholder="Ornek: USD, €, Sterlin..."
      />
    </div>
  ),
};

/**
 * Fisly transfer ekrani: gonderen ve alan hesap para birimlerini ayri ayri
 * secmek icin iki bagimsiz secici. Kur satirlari kapatilmistir.
 */
export const TransferBirimleri: Story = {
  render: () => {
    const [gonderen, setGonderen] = React.useState("TRY");
    const [alan, setAlan] = React.useState("EUR");
    return (
      <div className="w-80 space-y-5">
        <p className="text-sm text-muted-foreground">
          Yurt disi transferde gonderen ve alan hesaplarin para birimlerini
          secin; donusum kuru bir sonraki adimda onaylanir.
        </p>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Gonderen hesap
          </label>
          <CurrencySelector
            value={gonderen}
            onValueChange={setGonderen}
            showRate={false}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Alan hesap
          </label>
          <CurrencySelector
            value={alan}
            onValueChange={setAlan}
            showRate={false}
          />
        </div>
      </div>
    );
  },
};

/** Devre disi durum: onceden secili birim, etkilesime kapali. */
export const DevreDisi: Story = {
  render: () => (
    <div className="w-80">
      <CurrencySelector disabled defaultValue="USD" />
    </div>
  ),
};
