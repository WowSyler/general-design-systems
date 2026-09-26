import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Activity,
  Bell,
  Gauge,
  GitBranch,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import { BentoCard, BentoGrid, Button } from "@wowsyler/ds-ui";

const meta: Meta<typeof BentoGrid> = {
  title: "Iconic/BentoGrid",
  component: BentoGrid,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof BentoGrid>;

export const DeployLensPanosu: Story = {
  render: () => (
    <BentoGrid className="max-w-5xl">
      <BentoCard
        colSpan={2}
        rowSpan={2}
        eyebrow="DeployLens"
        icon={<Rocket className="size-5" aria-hidden="true" />}
        title="Üretim dağıtımı sağlıklı"
        description="Son 24 saatte 18 dağıtım tamamlandı, tümü yeşil. Ortalama dağıtım süresi 3 dk 12 sn; başarısızlık oranı %0."
        background={
          <div className="h-full w-full bg-aurora opacity-70" />
        }
        action={
          <Button variant="secondary" size="sm">
            Dağıtım geçmişi
          </Button>
        }
      />
      <BentoCard
        icon={<Activity className="size-5" aria-hidden="true" />}
        title="Canlı izleme"
        description="p95 yanıt süresi 214 ms, hata bütçesi %92 dolu."
      />
      <BentoCard
        icon={<ShieldCheck className="size-5" aria-hidden="true" />}
        title="Güvenlik taraması"
        description="Bağımlılıklarda kritik açık yok; son tarama 2 saat önce."
      />
      <BentoCard
        icon={<GitBranch className="size-5" aria-hidden="true" />}
        title="Dağıtım hattı"
        description="main → staging → prod hattı temiz, bekleyen onay yok."
      />
      <BentoCard
        icon={<Gauge className="size-5" aria-hidden="true" />}
        title="Performans"
        description="Lighthouse 98; ilk boya 0.9 sn."
      />
      <BentoCard
        icon={<Bell className="size-5" aria-hidden="true" />}
        eyebrow="3 aktif"
        title="Uyarılar"
        description="2 bilgilendirme, 1 düşük öncelikli; kritik uyarı yok."
      />
    </BentoGrid>
  ),
};
