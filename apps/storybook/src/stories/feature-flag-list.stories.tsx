import type { Meta, StoryObj } from "@storybook/react-vite";

import { FeatureFlagList } from "@ds/ui";

const meta: Meta<typeof FeatureFlagList> = {
  title: "Composites/FeatureFlagList",
  component: FeatureFlagList,
};

export default meta;
type Story = StoryObj<typeof FeatureFlagList>;

export const DeployLensBayraklari: Story = {
  render: () => (
    <div className="max-w-2xl">
      <FeatureFlagList
        title="DeployLens — Özellik bayrakları"
        description="Üretim ortamı için yönetilen bayraklar"
        flags={[
          {
            id: "checkout-v2",
            name: "Yeni ödeme akışı",
            flagKey: "checkout.new_flow",
            description:
              "Tek sayfalık ödeme deneyimi. Kademeli olarak açılıyor, geri alınabilir.",
            enabled: true,
            status: "beta",
            rollout: 35,
            environments: [
              { label: "Üretim", tone: "production" },
              { label: "Hazırlık", tone: "staging" },
            ],
          },
          {
            id: "dark-mode",
            name: "Karanlık tema",
            flagKey: "ui.dark_mode",
            description: "Sistem temasına duyarlı arayüz. Tüm ortamlarda kararlı.",
            enabled: true,
            status: "stable",
            environments: [
              { label: "Üretim", tone: "production" },
              { label: "Hazırlık", tone: "staging" },
              { label: "Geliştirme", tone: "development" },
            ],
          },
          {
            id: "ai-summary",
            name: "Yapay zekâ dağıtım özeti",
            flagKey: "deploy.ai_summary",
            description:
              "Her dağıtım için otomatik değişiklik özeti. Sadece dahili ekipte açık.",
            enabled: false,
            status: "experimental",
            rollout: 10,
            environments: [{ label: "Önizleme", tone: "preview" }],
          },
          {
            id: "legacy-webhooks",
            name: "Eski webhook biçimi",
            flagKey: "webhooks.v1_payload",
            description:
              "Kaldırılması planlanan eski yük biçimi. Yeni entegrasyonlarda kullanmayın.",
            enabled: true,
            status: "deprecated",
            environments: [{ label: "Üretim", tone: "production" }],
          },
        ]}
        onFlagToggle={(id, enabled) =>
          console.log("bayrak değişti:", id, enabled)
        }
      />
    </div>
  ),
};

export const KademeliDagitim: Story = {
  render: () => (
    <div className="max-w-2xl">
      <FeatureFlagList
        title="Kademeli dağıtım"
        description="Üretimde yüzdesel olarak açılan bayraklar"
        flags={[
          {
            id: "rec-engine",
            name: "Yeni öneri motoru",
            flagKey: "search.reco_v3",
            description: "Kişiselleştirilmiş öneriler, kullanıcıların bir kısmına açık.",
            enabled: true,
            status: "beta",
            rollout: 25,
            environments: [{ label: "Üretim", tone: "production" }],
          },
          {
            id: "instant-checkout",
            name: "Tek tıkla satın alma",
            flagKey: "commerce.instant_buy",
            description: "Sepeti atlayan hızlı satın alma. Yarısına kadar açıldı.",
            enabled: true,
            status: "beta",
            rollout: 50,
            environments: [
              { label: "Üretim", tone: "production" },
              { label: "Hazırlık", tone: "staging" },
            ],
          },
          {
            id: "video-story",
            name: "Video hikâye kartları",
            flagKey: "feed.video_stories",
            description: "Akışta otomatik oynayan kısa videolar. Bekletmede, kapalı.",
            enabled: false,
            status: "scheduled",
            rollout: 0,
            environments: [{ label: "Önizleme", tone: "preview" }],
          },
        ]}
      />
    </div>
  ),
};

export const Yukleniyor: Story = {
  render: () => (
    <div className="max-w-2xl">
      <FeatureFlagList
        title="Bayraklar yükleniyor"
        flags={[]}
        loading
        skeletonRows={4}
      />
    </div>
  ),
};
