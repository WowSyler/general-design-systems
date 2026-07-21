import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { StatusDot } from "@ds/ui";

type StatusDotVariant = React.ComponentProps<typeof StatusDot>["variant"];

const meta: Meta<typeof StatusDot> = {
  title: "Primitives/StatusDot",
  component: StatusDot,
};

export default meta;
type Story = StoryObj<typeof StatusDot>;

export const Varsayilan: Story = {
  args: {
    variant: "online",
    label: "Çevrimiçi",
  },
};

export const Varyantlar: Story = {
  render: () => {
    const durumlar: { variant: StatusDotVariant; etiket: string }[] = [
      { variant: "online", etiket: "Çevrimiçi" },
      { variant: "offline", etiket: "Çevrimdışı" },
      { variant: "away", etiket: "Uzakta" },
      { variant: "busy", etiket: "Meşgul" },
      { variant: "success", etiket: "Başarılı" },
      { variant: "warning", etiket: "Uyarı" },
      { variant: "error", etiket: "Hata" },
      { variant: "info", etiket: "Bilgi" },
      { variant: "running", etiket: "Çalışıyor" },
    ];
    return (
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
        {durumlar.map((d) => (
          <StatusDot key={d.variant} variant={d.variant} label={d.etiket} />
        ))}
      </div>
    );
  },
};

export const Boyutlar: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <StatusDot variant="running" size="sm" label="Küçük" />
      <StatusDot variant="running" size="md" label="Orta" />
      <StatusDot variant="running" size="lg" label="Büyük" />
    </div>
  ),
};

export const DeployLensDagitimlari: Story = {
  render: () => {
    const dagitimlar: {
      ortam: string;
      variant: StatusDotVariant;
      durum: string;
    }[] = [
      { ortam: "üretim", variant: "success", durum: "Yayında" },
      { ortam: "hazırlık", variant: "running", durum: "Dağıtılıyor" },
      { ortam: "önizleme", variant: "warning", durum: "Beklemede" },
      { ortam: "geliştirme", variant: "error", durum: "Başarısız" },
    ];
    return (
      <div className="w-80 divide-y divide-border rounded-lg border">
        {dagitimlar.map((d) => (
          <div
            key={d.ortam}
            className="flex items-center justify-between px-4 py-3"
          >
            <span className="text-sm font-medium capitalize text-foreground">
              {d.ortam}
            </span>
            <StatusDot variant={d.variant} label={d.durum} />
          </div>
        ))}
      </div>
    );
  },
};
