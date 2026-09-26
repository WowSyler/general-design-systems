import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { TimePicker } from "@wowsyler/ds-ui";

const meta: Meta<typeof TimePicker> = {
  title: "Primitives/Time Picker",
  component: TimePicker,
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

/**
 * Randevu — kuaför randevusu için 24 saat kipinde saat seçimi.
 * 15 dakikalık adımlarla çalışır ve seçilen saati canlı gösterir.
 */
export const RandevuSaati: Story = {
  render: () => {
    const [saat, setSaat] = React.useState("14:30");
    return (
      <div className="flex flex-col gap-3">
        <label
          id="randevu-saat-etiket"
          className="text-sm font-medium text-foreground"
        >
          Randevu saati
        </label>
        <TimePicker
          value={saat}
          onChange={setSaat}
          minuteStep={15}
          aria-labelledby="randevu-saat-etiket"
        />
        <p className="text-sm text-muted-foreground">
          Seçilen saat:{" "}
          <span className="font-medium tabular-nums text-foreground">
            {saat}
          </span>{" "}
          — Cesur Kuaför, Kadıköy şubesi.
        </p>
      </div>
    );
  },
};

/**
 * GlowScan — cilt bakımı hatırlatması için 12 saat (AM/PM) kipi.
 * Sabah hatırlatmaları için 5 dakikalık ince adım.
 */
export const HatirlatmaSaati: Story = {
  render: () => {
    const [saat, setSaat] = React.useState("08:05");
    return (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-foreground">
          Günlük hatırlatma
        </span>
        <TimePicker
          value={saat}
          onChange={setSaat}
          hourCycle={12}
          minuteStep={5}
          aria-label="Hatırlatma saati"
        />
        <p className="text-sm text-muted-foreground">
          GlowScan her gün{" "}
          <span className="font-medium tabular-nums text-foreground">
            {saat}
          </span>{" "}
          saatinde cilt rutinini hatırlatacak.
        </p>
      </div>
    );
  },
};

/**
 * Boş başlangıç, saatlik adım ve devre dışı durumların bir arada gösterimi.
 */
export const AdimVeDurumlar: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">
          Boş başlangıç (30 dk adım)
        </span>
        <TimePicker defaultValue="" minuteStep={30} aria-label="Açılış saati" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">
          Saatlik adım (60 dk)
        </span>
        <TimePicker
          defaultValue="09:00"
          minuteStep={60}
          aria-label="Tam saat seçimi"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">Devre dışı</span>
        <TimePicker value="18:45" disabled aria-label="Kapalı saat alanı" />
      </div>
    </div>
  ),
};
