import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarCheck, ScanFace, Receipt } from "lucide-react";

import { Button, FeatureCard } from "@wowsyler/ds-ui";

const meta: Meta<typeof FeatureCard> = {
  title: "Marketing/FeatureCard",
  component: FeatureCard,
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

export const Tekil: Story = {
  args: {
    icon: <ScanFace className="size-6" aria-hidden="true" />,
    title: "Yapay Zekâ Cilt Analizi",
    description:
      "GlowScan tek bir selfie ile nem, elastikiyet ve gözenek dahil 10 metriği saniyeler içinde raporlar.",
    action: (
      <Button variant="link" className="h-auto p-0">
        Nasıl çalışır?
      </Button>
    ),
    className: "max-w-sm",
  },
};

export const OzellikIzgarasi: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-6 sm:grid-cols-3">
      <FeatureCard
        icon={<CalendarCheck className="size-6" aria-hidden="true" />}
        title="Akıllı Randevu Takvimi"
        description="Randevu ile salonunuzun doluluk oranını görün, çakışmaları otomatik engelleyin."
      />
      <FeatureCard
        icon={<ScanFace className="size-6" aria-hidden="true" />}
        title="Cilt Analiz Raporu"
        description="GlowScan raporlarını müşteri kartına ekleyin, gelişimi seansa göre takip edin."
      />
      <FeatureCard
        icon={<Receipt className="size-6" aria-hidden="true" />}
        title="Fiş ve Gider Takibi"
        description="Fisly ile fişleri fotoğraflayın; KDV dökümü ve aylık gider özeti otomatik çıkarılır."
      />
    </div>
  ),
};
