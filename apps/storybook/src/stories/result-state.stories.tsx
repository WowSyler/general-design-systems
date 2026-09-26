import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, ResultState } from "@wowsyler/ds-ui";

const meta: Meta<typeof ResultState> = {
  title: "Composites/ResultState",
  component: ResultState,
};

export default meta;
type Story = StoryObj<typeof ResultState>;

export const OdemeBasarili: Story = {
  args: {
    tone: "success",
    title: "Ödemeniz alındı",
    description:
      "Fisly Pro aboneliğiniz başlatıldı. Fatura e-posta adresinize gönderildi; fişlerinizi artık sınırsız tarayabilirsiniz.",
    actions: (
      <>
        <Button>Panele Git</Button>
        <Button variant="outline">Faturayı İndir</Button>
      </>
    ),
  },
};

export const OdemeBasarisiz: Story = {
  args: {
    tone: "error",
    title: "Ödeme tamamlanamadı",
    description:
      "Kartınız bankanız tarafından reddedildi. Kart bilgilerinizi kontrol edip tekrar deneyin veya farklı bir kart kullanın.",
    actions: (
      <>
        <Button>Tekrar Dene</Button>
        <Button variant="ghost">Destek ile İletişime Geç</Button>
      </>
    ),
  },
};

export const AbonelikUyarisi: Story = {
  args: {
    tone: "warning",
    title: "Aboneliğinizin süresi dolmak üzere",
    description:
      "GlowScan Premium üyeliğiniz 3 gün içinde sona erecek. Cilt analizi geçmişinize erişiminizi kaybetmemek için yenileyin.",
    actions: <Button>Aboneliği Yenile</Button>,
  },
};

export const BilgiEkrani: Story = {
  args: {
    tone: "info",
    title: "Randevunuz onay bekliyor",
    description:
      "Salon sahibi randevu talebinizi inceliyor. Onaylandığında size bildirim göndereceğiz.",
  },
};
