import type { Meta, StoryObj } from "@storybook/react-vite";

import { AnnouncementBar } from "@wowsyler/ds-ui";
import { Gift, Rocket, Sparkles } from "lucide-react";

const meta: Meta<typeof AnnouncementBar> = {
  title: "Iconic/AnnouncementBar",
  component: AnnouncementBar,
};

export default meta;
type Story = StoryObj<typeof AnnouncementBar>;

/** Randevu kampanya duyurusu — ikon, aksiyon linki ve kapatma butonu. */
export const RandevuKampanya: Story = {
  render: () => (
    <AnnouncementBar
      icon={<Gift className="size-4" aria-hidden="true" />}
      action={{ label: "Kodu kopyala: YAZSEZON", href: "#" }}
      onDismiss={() => {}}
    >
      Yaz sezonuna özel: ilk 3 ay Randevu Pro'da %50 indirim.
    </AnnouncementBar>
  ),
};

/** DeployLens sürüm duyurusu. */
export const DeployLensSurum: Story = {
  render: () => (
    <AnnouncementBar
      icon={<Rocket className="size-4" aria-hidden="true" />}
      action={{ label: "Sürüm notları", href: "#" }}
      onDismiss={() => {}}
    >
      DeployLens 3.0 yayında: canlı dağıtım izleme ve otomatik geri alma.
    </AnnouncementBar>
  ),
};

/** Sade duyuru — aksiyon ve kapatma olmadan, yalnızca parıltı. */
export const Sade: Story = {
  render: () => (
    <AnnouncementBar icon={<Sparkles className="size-4" aria-hidden="true" />}>
      Fisly artık e-arşiv faturalarını da destekliyor.
    </AnnouncementBar>
  ),
};

/** Parıltı katmanı kapalı, kapatılabilir sürüm. */
export const ParıltısızKapatılabilir: Story = {
  render: () => (
    <AnnouncementBar
      shine={false}
      action={{ label: "Detaylar", href: "#" }}
      onDismiss={() => {}}
    >
      Dolap'ta kargo ücretleri bu hafta sonu tüm ilanlarda ücretsiz.
    </AnnouncementBar>
  ),
};
