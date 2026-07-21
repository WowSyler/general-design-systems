import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { UptimeBars } from "@ds/ui";

const meta: Meta<typeof UptimeBars> = {
  title: "Data/UptimeBars",
  component: UptimeBars,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UptimeBars>;

type UptimeGun = React.ComponentProps<typeof UptimeBars>["days"][number];

/** Belirli gunlere olay yerlestirerek deterministik gun serisi uretir. */
const olusturGunler = (
  sayi: number,
  olaylar: Record<number, { status: UptimeGun["status"]; detail?: string }> = {}
): UptimeGun[] => {
  const bugun = new Date(2026, 6, 19);
  return Array.from({ length: sayi }, (_, i): UptimeGun => {
    const tarih = new Date(bugun);
    tarih.setDate(bugun.getDate() - (sayi - 1 - i));
    const olay = olaylar[i];
    return {
      date: tarih.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
      }),
      status: olay?.status ?? "operational",
      detail: olay?.detail,
    };
  });
};

/** DeployLens: dağıtım API'sinin son 90 günlük çalışma süresi. */
export const ApiCalismaSuresi: Story = {
  args: {
    label: "DeployLens Dağıtım API",
    days: olusturGunler(90, {
      31: { status: "partial", detail: "yükseltilmiş gecikme" },
      58: { status: "outage", detail: "42 dk kesinti" },
      59: { status: "partial", detail: "kademeli toparlanma" },
      77: { status: "partial", detail: "kısmi 5xx artışı" },
    }),
  },
};

/** GlowScan: cilt analizi tarama motorunun son 30 günü, tam sağlıklı. */
export const TaramaMotoruSaglikli: Story = {
  args: {
    label: "GlowScan Tarama Motoru",
    days: olusturGunler(30),
  },
};

/** Fisly: ödeme servisinde bakım kaynaklı bir kesinti, SLA yüzdesi elle verilir. */
export const OdemeServisiKesinti: Story = {
  args: {
    label: "Fisly Ödeme Servisi",
    uptime: 99.9,
    days: olusturGunler(60, {
      40: { status: "outage", detail: "planlı bakım — 18 dk" },
      41: { status: "partial", detail: "webhook gecikmesi" },
      52: { status: "partial", detail: "kart sağlayıcı yavaşlığı" },
    }),
  },
};
