import type { Meta, StoryObj } from "@storybook/react-vite";

import { AlertCallout, Button } from "@wowsyler/ds-ui";
import { ExternalLink, RefreshCw, RotateCcw } from "lucide-react";

const meta: Meta<typeof AlertCallout> = {
  title: "Composites/AlertCallout",
  component: AlertCallout,
};

export default meta;
type Story = StoryObj<typeof AlertCallout>;

export const TumTonlar: Story = {
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <AlertCallout
        tone="info"
        title="Yeni sürüm hazır"
        description="DeployLens 2.4 yayında. Değişiklik günlüğünü inceleyerek yeni izleme panellerini keşfedin."
      />
      <AlertCallout
        tone="success"
        title="Dağıtım tamamlandı"
        description="production ortamına yapılan dağıtım 42 saniyede başarıyla sonuçlandı."
      />
      <AlertCallout
        tone="warning"
        title="Kota sınırına yaklaşıyorsunuz"
        description="Bu ay kullanılabilir derleme dakikalarınızın %85’ini tükettiniz."
      />
      <AlertCallout
        tone="error"
        title="Bağlantı kurulamadı"
        description="Veritabanı sunucusuna erişilemiyor. Bağlantı ayarlarınızı kontrol edip tekrar deneyin."
      />
      <AlertCallout
        tone="neutral"
        title="İpucu"
        description="Klavye kısayolları için ⌘K tuşlarına basarak komut paletini açabilirsiniz."
      />
    </div>
  ),
};

export const FormDogrulama: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <AlertCallout
        tone="error"
        title="Formu gönderemedik"
        description="Girdiğiniz e-posta adresi geçersiz görünüyor ve şifre alanı boş bırakılamaz. Lütfen bilgileri kontrol edin."
        actions={
          <Button size="sm" variant="outline">
            <RotateCcw className="size-3.5" />
            Alanları düzenle
          </Button>
        }
      />
    </div>
  ),
};

export const KapatilabilirBildirim: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <AlertCallout
        tone="success"
        dismissible
        title="Fişiniz kaydedildi"
        description="Fisly, harcamayı ‘Market’ kategorisine otomatik olarak sınıflandırdı. Dilerseniz düzenleyebilirsiniz."
        onDismiss={() => {}}
      />
    </div>
  ),
};

export const SistemBanner: Story = {
  render: () => (
    <div className="w-full overflow-hidden rounded-lg border">
      <AlertCallout
        appearance="banner"
        tone="warning"
        dismissible
        title="Planlı bakım çalışması"
        description="Randevu servisleri 20 Temmuz 03:00–04:00 arasında geçici olarak kullanılamayacak."
        actions={
          <Button size="sm" variant="ghost">
            Ayrıntılar
            <ExternalLink className="size-3.5" />
          </Button>
        }
        onDismiss={() => {}}
      />
      <div className="bg-background px-5 py-8 text-sm text-muted-foreground">
        Sayfa içeriği bannerın hemen altında akmaya devam eder.
      </div>
    </div>
  ),
};

export const AksiyonluUyari: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <AlertCallout
        tone="info"
        title="Cilt analiziniz güncellendi"
        description="GlowScan, son fotoğrafınıza göre bakım rutininizi yeniledi. Yeni önerileri görüntüleyebilirsiniz."
        actions={
          <>
            <Button size="sm">Önerileri gör</Button>
            <Button size="sm" variant="ghost">
              <RefreshCw className="size-3.5" />
              Yeniden tara
            </Button>
          </>
        }
      />
    </div>
  ),
};
