import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { DatePicker } from "@ds/ui";

const meta: Meta<typeof DatePicker> = {
  title: "Primitives/DatePicker",
  component: DatePicker,
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const RandevuTarihi: Story = {
  render: () => {
    const [tarih, setTarih] = React.useState<Date | undefined>();
    return (
      <div className="w-72 space-y-2">
        <label className="text-sm font-medium text-foreground">
          Randevu tarihi
        </label>
        <DatePicker
          value={tarih}
          onChange={setTarih}
          placeholder="Tarih seçin"
        />
        <p className="text-xs text-muted-foreground tabular-nums">
          {tarih
            ? `Seçilen: ${tarih.toLocaleDateString("tr-TR")}`
            : "Henüz tarih seçilmedi."}
        </p>
      </div>
    );
  },
};

export const SinirliAralik: Story = {
  render: () => {
    const bugun = new Date(2026, 6, 19);
    const enGec = new Date(2026, 7, 2);
    const [tarih, setTarih] = React.useState<Date | undefined>(
      new Date(2026, 6, 21)
    );
    return (
      <div className="w-72 space-y-2">
        <label className="text-sm font-medium text-foreground">
          Teslim tarihi (önümüzdeki 2 hafta)
        </label>
        <DatePicker
          value={tarih}
          onChange={setTarih}
          minDate={bugun}
          maxDate={enGec}
          dateFormat="d MMMM yyyy, EEEE"
        />
        <p className="text-xs text-muted-foreground">
          Fisly fatura kesim tarihi bu aralıkla sınırlıdır.
        </p>
      </div>
    );
  },
};

export const HaftaSonuKapali: Story = {
  render: () => {
    const [tarih, setTarih] = React.useState<Date | undefined>();
    return (
      <div className="w-72 space-y-2">
        <label className="text-sm font-medium text-foreground">
          Kuaför seansı
        </label>
        <DatePicker
          value={tarih}
          onChange={setTarih}
          defaultOpen
          minDate={new Date(2026, 6, 19)}
          disabledDates={{ dayOfWeek: [0, 6] }}
          placeholder="Hafta içi bir gün seçin"
        />
        <p className="text-xs text-muted-foreground">
          Randevu ekibi hafta sonları çalışmadığı için Cumartesi ve Pazar
          seçilemez.
        </p>
      </div>
    );
  },
};
