import type { Meta, StoryObj } from "@storybook/react-vite";

import { SetupProgress } from "@ds/ui";

const meta: Meta<typeof SetupProgress> = {
  title: "Composites/SetupProgress",
  component: SetupProgress,
};

export default meta;
type Story = StoryObj<typeof SetupProgress>;

export const DeployLensKurulumu: Story = {
  render: () => (
    <div className="max-w-2xl">
      <SetupProgress
        title="Proje kurulumu"
        currentStep={2}
        steps={[
          { label: "Depo bağla", description: "GitHub / GitLab" },
          { label: "Ortam değişkenleri", description: "Gizli anahtarlar" },
          { label: "İlk dağıtım", description: "Önizleme derlemesi" },
          { label: "Alan adı", description: "Özel etki alanı" },
        ]}
      />
    </div>
  ),
};

export const GlowScanBaslangic: Story = {
  render: () => (
    <div className="max-w-md">
      <SetupProgress
        title="Cilt profilini oluştur"
        variant="bar"
        currentStep={1}
        steps={[
          "Yaş aralığı",
          "Cilt tipi",
          "Hedefler",
          "İlk tarama",
        ]}
      />
    </div>
  ),
};

export const FislyTamamlandi: Story = {
  render: () => (
    <div className="max-w-2xl">
      <SetupProgress
        title="Hesap kurulumu"
        currentStep={4}
        steps={[
          { label: "E-posta doğrula" },
          { label: "İşletme bilgileri" },
          { label: "Banka hesabı" },
          { label: "İlk fişi yükle" },
        ]}
      />
    </div>
  ),
};

export const OzelYuzde: Story = {
  args: {
    title: "Depolama taşıması",
    variant: "bar",
    currentStep: 1,
    percent: 65,
    steps: ["Yedekle", "Aktar", "Doğrula"],
  },
};
