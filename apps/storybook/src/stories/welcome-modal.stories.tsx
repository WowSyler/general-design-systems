import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  Camera,
  GaugeCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";

import { Button, WelcomeModal } from "@wowsyler/ds-ui";

const meta: Meta<typeof WelcomeModal> = {
  title: "Composites/WelcomeModal",
  component: WelcomeModal,
};

export default meta;
type Story = StoryObj<typeof WelcomeModal>;

/**
 * DeployLens'e yeni katilan bir kullaniciyi karsilayan tam kapsamli modal:
 * ikon rozeti, ozellik listesi ve cift CTA. Storybook'ta acik gorunmesi icin
 * defaultOpen kullanilir.
 */
export const YeniKullaniciKarsilama: Story = {
  args: {
    defaultOpen: true,
    icon: <Rocket aria-hidden="true" />,
    tone: "brand",
    eyebrow: "DeployLens'e hoş geldin",
    title: "İlk projeni dakikalar içinde yayına al",
    description:
      "Depoyu bağla, ortam değişkenlerini gir; DeployLens gerisini halletsin. Başlamadan önce en çok kullanılan üç özelliğe göz at.",
    features: [
      {
        icon: <GaugeCircle aria-hidden="true" />,
        title: "Canlı dağıtım metrikleri",
        description: "Her push'ta build süresi ve başarı oranını anlık izle.",
      },
      {
        icon: <ShieldCheck aria-hidden="true" />,
        title: "Otomatik geri alma",
        description: "Hata oranı eşiği aşılınca son kararlı sürüme dön.",
      },
      {
        icon: <BellRing aria-hidden="true" />,
        title: "Akıllı bildirimler",
        description: "Sadece senin ekibini ilgilendiren olaylardan haberdar ol.",
      },
    ],
    primaryAction: {
      label: "Projeyi bağla",
      icon: <ArrowRight aria-hidden="true" />,
      onClick: () => console.log("Proje bağlama akışı açıldı"),
    },
    secondaryAction: {
      label: "Turu atla",
      onClick: () => console.log("Onboarding turu atlandı"),
    },
  },
};

/**
 * Tetikleyici buton ile acilan, ust kisminda gradyan gorsel banner bulunan
 * karsilama modali (Dolap pazaryeri). trigger prop'u bir Button ile beslenir.
 */
export const TetikleyiciVeGorsel: Story = {
  render: (args) => (
    <WelcomeModal
      {...args}
      trigger={<Button>Karşılama modalını aç</Button>}
      media={
        <div className="flex size-full items-center justify-center bg-brand-gradient bg-sheen text-primary-foreground">
          <Store className="size-14" aria-hidden="true" />
        </div>
      }
      eyebrow="Dolap"
      title="Dolabını aç, ilk ilanını ver"
      description="İkinci el ürünlerini birkaç fotoğrafla saniyeler içinde satışa çıkar. Alıcılarla güvenli mesajlaş, kargoyu tek tıkla oluştur."
      features={[
        {
          icon: <Camera aria-hidden="true" />,
          title: "Akıllı ilan asistanı",
          description: "Fotoğraftan başlık ve fiyat önerisi al.",
        },
        {
          icon: <ShieldCheck aria-hidden="true" />,
          title: "Güvenli ödeme koruması",
          description: "Ürün elediğine ulaşana kadar ödeme askıda kalır.",
        },
      ]}
      primaryAction={{
        label: "İlk ilanı oluştur",
        icon: <Sparkles aria-hidden="true" />,
        onClick: () => console.log("İlan oluşturma açıldı"),
      }}
      secondaryAction={{ label: "Daha sonra" }}
    />
  ),
};

/**
 * "Bir daha gosterme" onay kutulu, tek CTA'li sade karsilama (Randevu).
 * Ikincil aksiyon olmadan, minimal onboarding icin.
 */
export const BirDahaGosterme: Story = {
  args: {
    defaultOpen: true,
    icon: <CalendarCheck aria-hidden="true" />,
    tone: "success",
    title: "Randevu takvimin hazır",
    description:
      "Çalışma saatlerini tanımla, müşterilerin uygun slotlardan kendileri randevu alsın. İstersen bu karşılamayı bir daha gösterme.",
    showDontShowAgain: true,
    dontShowAgainLabel: "Bu karşılamayı bir daha gösterme",
    onDontShowAgainChange: (checked) =>
      console.log("Bir daha gösterme:", checked),
    primaryAction: {
      label: "Takvimi ayarla",
      onClick: () => console.log("Takvim ayarları açıldı"),
    },
  },
};
