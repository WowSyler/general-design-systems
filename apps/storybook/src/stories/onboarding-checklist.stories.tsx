import type { Meta, StoryObj } from "@storybook/react-vite";

import { OnboardingChecklist } from "@wowsyler/ds-ui";

const meta: Meta<typeof OnboardingChecklist> = {
  title: "Composites/OnboardingChecklist",
  component: OnboardingChecklist,
};

export default meta;
type Story = StoryObj<typeof OnboardingChecklist>;

export const DeployLensIlkDeploy: Story = {
  render: () => (
    <div className="max-w-md">
      <OnboardingChecklist
        title="DeployLens'e hoş geldin"
        description="İlk dağıtımını yayına almak için birkaç adım kaldı."
        onClose={() => {}}
        steps={[
          {
            title: "GitHub deposunu bağla",
            description: "Reponu içe aktar ve izinleri onayla",
            done: true,
          },
          {
            title: "Ortam değişkenlerini gir",
            description: "DATABASE_URL ve API anahtarlarını ekle",
            done: true,
          },
          {
            title: "İlk dağıtımı başlat",
            description: "main dalını üretime gönder",
            action: { label: "Dağıt" },
          },
          {
            title: "Özel alan adı ekle",
            description: "app.deploylens.io alanını doğrula",
            action: { label: "Başla" },
          },
        ]}
      />
    </div>
  ),
};

export const FislyHesapBaglama: Story = {
  render: () => (
    <div className="max-w-md">
      <OnboardingChecklist
        title="Hesabını kurmayı tamamla"
        description="Fişlerini otomatik işlemek için hesabını hazırla."
        steps={[
          {
            title: "E-posta adresini doğrula",
            description: "Gelen kutundaki bağlantıya tıkla",
            done: true,
          },
          {
            title: "Banka hesabını bağla",
            description: "Harcamaları otomatik eşleştir",
            action: { label: "Bağla" },
          },
          {
            title: "İlk fişini yükle",
            description: "Fotoğraf çek, gerisini bize bırak",
            action: { label: "Yükle" },
          },
        ]}
      />
    </div>
  ),
};

export const DolapSaticiKurulumu: Story = {
  render: () => (
    <div className="max-w-md">
      <OnboardingChecklist
        title="Satıcı profilini tamamla"
        description="Dolabında ürün satmaya başlamak için son adımlar."
        steps={[
          {
            title: "Profil fotoğrafı ekle",
            description: "Alıcılara güven veren bir görsel seç",
            done: true,
          },
          {
            title: "Kimlik doğrulaması yap",
            description: "T.C. kimlik bilgilerini onayla",
            done: true,
          },
          {
            title: "IBAN bilgisini gir",
            description: "Satış gelirlerini bu hesaba aktaralım",
            done: true,
          },
          {
            title: "İlk ürününü listele",
            description: "Dolabındaki ilk parçayı fotoğrafla",
            action: { label: "Ürün ekle" },
          },
        ]}
      />
    </div>
  ),
};

export const TumuTamamlandi: Story = {
  render: () => (
    <div className="max-w-md">
      <OnboardingChecklist
        title="Kurulum tamamlandı"
        description="Her şey hazır, artık başlayabilirsin."
        steps={[
          { title: "GitHub deposunu bağla", done: true },
          { title: "Ortam değişkenlerini gir", done: true },
          { title: "İlk dağıtımı başlat", done: true },
        ]}
      />
    </div>
  ),
};
