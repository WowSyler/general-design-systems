import type { Meta, StoryObj } from "@storybook/react-vite";
import { LifeBuoy } from "lucide-react";

import { Button, ErrorPageState } from "@wowsyler/ds-ui";

const meta: Meta<typeof ErrorPageState> = {
  title: "Composites/ErrorPageState",
  component: ErrorPageState,
};

export default meta;
type Story = StoryObj<typeof ErrorPageState>;

export const SayfaBulunamadi: Story = {
  args: {
    variant: "404",
    homeHref: "/panel",
    footer: (
      <span>
        Yanlış bir bağlantıya mı geldiniz? DeployLens durum panosunu kontrol
        edin.
      </span>
    ),
  },
};

export const SunucuHatasi: Story = {
  args: {
    variant: "500",
    title: "Dağıtım tamamlanamadı",
    description:
      "DeployLens derleme sunucusunda beklenmeyen bir hata oluştu. Ekibimiz otomatik olarak bilgilendirildi; birkaç dakika sonra dağıtımı yeniden başlatabilirsiniz.",
    footer: (
      <span>Sorun devam ederse olay kimliği: DPL-2026-07-19-8842</span>
    ),
  },
};

export const CevrimdisiKalindi: Story = {
  args: {
    variant: "offline",
    title: "Bağlantınız koptu",
    description:
      "Dolap gardırobunuzu senkronize edemiyoruz. İnternet bağlantınızı kontrol edip yeniden deneyin; eklediğiniz kıyafetler çevrimiçi olunca yüklenecek.",
  },
};

export const BakimModu: Story = {
  args: {
    variant: "maintenance",
    title: "GlowScan kısa bir molada",
    description:
      "Cilt analizi motorumuzu daha isabetli hâle getirmek için planlı bakım yapıyoruz. Çalışmanın 20 dakika içinde tamamlanmasını bekliyoruz.",
    footer: <span>Tahmini bitiş: bugün 14.30</span>,
  },
};

export const ErisimEngellendi: Story = {
  args: {
    variant: "forbidden",
    title: "Bu salona erişiminiz yok",
    description:
      "Randevu yönetim paneline yalnızca salon yöneticileri erişebilir. Yetki gerektiğini düşünüyorsanız işletme sahibinizle iletişime geçin.",
    secondaryAction: (
      <Button variant="ghost" size="lg">
        <LifeBuoy aria-hidden="true" />
        Destek ile İletişim
      </Button>
    ),
  },
};
