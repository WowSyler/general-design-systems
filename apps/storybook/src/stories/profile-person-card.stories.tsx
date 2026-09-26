import type { Meta, StoryObj } from "@storybook/react-vite";
import { Github, Globe, Linkedin, Twitter } from "lucide-react";

import { ProfilePersonCard } from "@wowsyler/ds-ui";

const meta: Meta<typeof ProfilePersonCard> = {
  title: "Composites/ProfilePersonCard",
  component: ProfilePersonCard,
};

export default meta;
type Story = StoryObj<typeof ProfilePersonCard>;

/** DeployLens ekip üyesi: ortalanmış dizilim, istatistik şeridi ve sosyal bağlantılar. */
export const EkipUyesi: Story = {
  render: () => (
    <div className="w-[24rem] max-w-full">
      <ProfilePersonCard
        align="center"
        name="Deniz Yılmaz"
        role="Kıdemli Platform Mühendisi"
        fallback="DY"
        verified
        status="online"
        bio="Dağıtım hattı gözlemlenebilirliği ve mavi-yeşil sürüm stratejileri üzerine çalışıyor. DeployLens çekirdek ekibinde."
        location="İstanbul, Türkiye"
        joinedLabel="2022'den beri ekipte"
        tags={["Kubernetes", "Go", "Gözlemlenebilirlik"]}
        stats={[
          { key: "deploys", value: "1.284", label: "Dağıtım" },
          { key: "reviews", value: "342", label: "İnceleme" },
          { key: "uptime", value: "%99,9", label: "Çalışma" },
        ]}
        following={false}
        onFollow={() => {}}
        onMessage={() => {}}
        socials={[
          {
            key: "gh",
            label: "GitHub profili",
            href: "#",
            icon: <Github />,
          },
          {
            key: "li",
            label: "LinkedIn profili",
            href: "#",
            icon: <Linkedin />,
          },
          {
            key: "x",
            label: "X profili",
            href: "#",
            icon: <Twitter />,
          },
        ]}
      />
    </div>
  ),
};

/** Dolap satıcısı: yatay dizin satırı, takip ediliyor durumu ve mesaj butonu. */
export const SaticiDizinKarti: Story = {
  render: () => (
    <div className="w-[26rem] max-w-full">
      <ProfilePersonCard
        name="Selin Aksoy"
        role="Vintage & Tasarımcı Parçaları"
        fallback="SA"
        verified
        bio="1.200+ satış, ortalama 1 saat içinde yanıt. Özenle seçilmiş ikinci el moda."
        location="İzmir, Türkiye"
        joinedLabel="2021'den beri üye"
        stats={[
          { key: "followers", value: "12,4B", label: "Takipçi" },
          { key: "rating", value: "4,9", label: "Puan", srValue: "4.9 yıldız" },
          { key: "sold", value: "5.860", label: "Satılan" },
        ]}
        following
        onFollow={() => {}}
        onMessage={() => {}}
      />
    </div>
  ),
};

/** Randevu danışmanı: müsaitlik durumu, uzmanlık etiketleri ve "Bağlan" aksiyonu. */
export const DanismanKarti: Story = {
  render: () => (
    <div className="w-[24rem] max-w-full">
      <ProfilePersonCard
        align="center"
        name="Dr. Kerem Doğan"
        role="Cilt Sağlığı Danışmanı"
        fallback="KD"
        verified
        status="busy"
        statusLabel="Şu an görüşmede"
        bio="12 yıllık deneyim. GlowScan cilt analizi sonuçlarınıza göre kişiye özel bakım planı çıkarır."
        location="Ankara, Türkiye"
        joinedLabel="480+ danışan"
        tags={["Dermatoloji", "Akne", "Anti-aging"]}
        connected={false}
        onConnect={() => {}}
        onMessage={() => {}}
        socials={[
          {
            key: "web",
            label: "Web sitesi",
            href: "#",
            icon: <Globe />,
          },
          {
            key: "li",
            label: "LinkedIn profili",
            href: "#",
            icon: <Linkedin />,
          },
        ]}
      />
    </div>
  ),
};

/** Yükleme durumu: içerik gelene kadar iskelet yer tutucular gösterilir. */
export const YuklemeDurumu: Story = {
  render: () => (
    <div className="w-[24rem] max-w-full">
      <ProfilePersonCard align="center" name="" loading />
    </div>
  ),
};
