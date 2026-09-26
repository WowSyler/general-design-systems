import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { DateRangePicker } from "@wowsyler/ds-ui";

type RangeValue = React.ComponentProps<typeof DateRangePicker>["value"];

const meta: Meta<typeof DateRangePicker> = {
  title: "Primitives/Date Range Picker",
  component: DateRangePicker,
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

/**
 * Fisly gelir raporunda dönem seçimi: seçilen aralık altta özetlenir,
 * hazır kısayollar (Bu ay, Geçen ay) muhasebe dönemlerini hızlandırır.
 */
export const FislyRaporAraligi: Story = {
  render: () => {
    const [range, setRange] = React.useState<RangeValue>();
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">
            Rapor dönemi
          </span>
          <DateRangePicker value={range} onValueChange={setRange} />
        </div>
        <p className="text-sm text-muted-foreground">
          {range?.from
            ? `Seçilen dönem için ${range.to ? "gelir tablosu" : "başlangıç tarihi"} hazırlanacak.`
            : "Fisly gelir tablosu için bir dönem seçin."}
        </p>
      </div>
    );
  },
};

/**
 * DeployLens dağıtım filtresi: son 7 gün varsayılan olarak seçili gelir,
 * kullanıcı takvimden veya kısayollardan aralığı daraltabilir.
 */
export const DeployLensDeployFiltresi: Story = {
  render: () => {
    const bugun = new Date();
    const yediGunOnce = new Date();
    yediGunOnce.setDate(bugun.getDate() - 6);
    const [range, setRange] = React.useState<RangeValue>({
      from: yediGunOnce,
      to: bugun,
    });
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <DateRangePicker
            value={range}
            onValueChange={setRange}
            placeholder="Dağıtım tarihi"
          />
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-sm text-muted-foreground">
          {range?.from && range.to
            ? `${range.from.toLocaleDateString("tr-TR", { day: "numeric", month: "long" })} – ${range.to.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} arası dağıtımlar listeleniyor.`
            : "Aralık seçilmedi — tüm dağıtımlar gösteriliyor."}
        </div>
      </div>
    );
  },
};

/**
 * Panel açık önizleme: solda hazır kısayollar, sağda tek aylık takvim.
 * Randevu yoğunluk raporu gibi dar alanlarda tek ay yeterlidir.
 */
export const AcikPanel: Story = {
  render: () => (
    <div className="flex h-[26rem] flex-col">
      <DateRangePicker defaultOpen numberOfMonths={1} />
    </div>
  ),
};
