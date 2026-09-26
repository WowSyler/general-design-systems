import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CalendarCheck,
  CreditCard,
  GitBranch,
  PackageCheck,
  Rocket,
  Scissors,
} from "lucide-react";

import { Timeline } from "@wowsyler/ds-ui";

const meta: Meta<typeof Timeline> = {
  title: "Iconic/Timeline",
  component: Timeline,
};

export default meta;
type Story = StoryObj<typeof Timeline>;

/** Randevu rezervasyon akışı. */
export const RandevuAkisi: Story = {
  render: () => (
    <div className="max-w-md">
      <Timeline
        items={[
          {
            title: "Randevu oluşturuldu",
            description: "Saç kesimi · Berber Cem",
            time: "09:12",
            status: "done",
            icon: <CalendarCheck />,
          },
          {
            title: "Ödeme alındı",
            description: "₺350 · Kredi kartı",
            time: "09:13",
            status: "done",
            icon: <CreditCard />,
          },
          {
            title: "Hizmet veriliyor",
            description: "Tahmini bitiş 14:45",
            time: "14:20",
            status: "current",
            icon: <Scissors />,
          },
          {
            title: "Değerlendirme",
            description: "Randevu sonrası puanlama",
            status: "upcoming",
          },
        ]}
      />
    </div>
  ),
};

/** DeployLens deploy geçmişi. */
export const DeployGecmisi: Story = {
  render: () => (
    <div className="max-w-md">
      <Timeline
        items={[
          {
            title: "main dalına merge",
            description: "feat: yeni ödeme sağlayıcısı",
            time: "12:04",
            status: "done",
            icon: <GitBranch />,
          },
          {
            title: "Derleme tamamlandı",
            description: "2 dk 18 sn · 0 uyarı",
            time: "12:06",
            status: "done",
            icon: <PackageCheck />,
          },
          {
            title: "Üretime dağıtılıyor",
            description: "eu-central-1 · %60 tamamlandı",
            time: "12:07",
            status: "current",
            icon: <Rocket />,
          },
          {
            title: "Duman testleri",
            description: "Dağıtım sonrası otomatik kontrol",
            status: "upcoming",
          },
        ]}
      />
    </div>
  ),
};
