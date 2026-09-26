import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { TimezoneSelect } from "@wowsyler/ds-ui";

const meta: Meta<typeof TimezoneSelect> = {
  title: "Primitives/TimezoneSelect",
  component: TimezoneSelect,
};

export default meta;
type Story = StoryObj<typeof TimezoneSelect>;

// Deterministik onizleme icin sabit bir referans an (Randevu demo verisi).
const sabitAn = new Date("2026-07-19T09:00:00Z");

export const Varsayilan: Story = {
  render: () => {
    const [tz, setTz] = React.useState("Europe/Istanbul");
    return (
      <div className="w-80 max-w-full space-y-2">
        <label className="text-sm font-medium text-foreground">
          Randevu saat dilimi
        </label>
        <TimezoneSelect
          value={tz}
          onValueChange={setTz}
          referenceDate={sabitAn}
        />
        <p className="text-xs text-muted-foreground">
          Secili bolge: <span className="font-medium">{tz}</span>
        </p>
      </div>
    );
  },
};

export const AcikListe: Story = {
  render: () => (
    <div className="flex h-96 w-80 max-w-full flex-col">
      <TimezoneSelect
        defaultOpen
        defaultValue="Europe/Istanbul"
        referenceDate={sabitAn}
        searchPlaceholder="Ornek: Tokyo, New York, UTC..."
      />
    </div>
  ),
};

export const KureselRandevuHizalama: Story = {
  render: () => {
    const [danisan, setDanisan] = React.useState("America/New_York");
    const [uzman, setUzman] = React.useState("Europe/Istanbul");
    return (
      <div className="w-80 max-w-full space-y-5">
        <p className="text-sm text-muted-foreground">
          Randevu icin danisan ve uzmanin saat dilimlerini hizalayin; onizleme
          her satirda o bolgenin guncel yerel saatini gosterir.
        </p>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Danisan</label>
          <TimezoneSelect
            value={danisan}
            onValueChange={setDanisan}
            referenceDate={sabitAn}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Uzman</label>
          <TimezoneSelect
            value={uzman}
            onValueChange={setUzman}
            referenceDate={sabitAn}
          />
        </div>
      </div>
    );
  },
};

export const DevreDisi: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <TimezoneSelect
        disabled
        defaultValue="Europe/Istanbul"
        referenceDate={sabitAn}
      />
    </div>
  ),
};
