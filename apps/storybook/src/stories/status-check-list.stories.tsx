import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatusCheckList } from "@wowsyler/ds-ui";

const meta: Meta<typeof StatusCheckList> = {
  title: "Composites/StatusCheckList",
  component: StatusCheckList,
};

export default meta;
type Story = StoryObj<typeof StatusCheckList>;

export const DeployLensPRKontrolleri: Story = {
  render: () => (
    <div className="max-w-xl">
      <StatusCheckList
        title="#482 — Ödeme akışı yenileme"
        checks={[
          {
            name: "Birim testleri",
            description: "412 test geçti, 0 başarısız",
            status: "success",
            duration: "1dk 12sn",
            detailHref: "#",
          },
          {
            name: "Tip kontrolü (tsc)",
            description: "Tüm paketler tipsel olarak temiz",
            status: "success",
            duration: "48sn",
            detailHref: "#",
          },
          {
            name: "Uçtan uca testler (Playwright)",
            description: "checkout.spec.ts — ödeme adımında zaman aşımı",
            status: "failed",
            duration: "3dk 05sn",
            detailHref: "#",
          },
          {
            name: "Lint & format",
            description: "ESLint + Prettier",
            status: "success",
            duration: "22sn",
            detailHref: "#",
          },
          {
            name: "Görsel regresyon",
            description: "Ana dal ile karşılaştırma bekleniyor",
            status: "pending",
            detailHref: "#",
          },
        ]}
      />
    </div>
  ),
};

export const DerlemeSuruyor: Story = {
  render: () => (
    <div className="max-w-xl">
      <StatusCheckList
        title="Üretim dağıtımı — v2.14.0"
        description="main dalı üretime gönderiliyor"
        checks={[
          {
            name: "Bağımlılıklar kuruluyor",
            description: "pnpm install --frozen-lockfile",
            status: "success",
            duration: "34sn",
          },
          {
            name: "Uygulama derleniyor",
            description: "Next.js üretim derlemesi",
            status: "running",
            detailHref: "#",
          },
          {
            name: "Docker imajı yayınlanıyor",
            description: "Derleme adımı bekleniyor",
            status: "pending",
          },
          {
            name: "Güvenlik taraması",
            description: "Bu dağıtım için atlandı",
            status: "skipped",
          },
        ]}
      />
    </div>
  ),
};

export const TumKontrollerBasarili: Story = {
  render: () => (
    <div className="max-w-xl">
      <StatusCheckList
        title="#511 — Panel performans iyileştirmesi"
        checks={[
          {
            name: "Birim testleri",
            description: "388 test geçti",
            status: "success",
            duration: "58sn",
            detailHref: "#",
          },
          {
            name: "Tip kontrolü (tsc)",
            status: "success",
            duration: "41sn",
            detailHref: "#",
          },
          {
            name: "Önizleme dağıtımı",
            description: "pr-511.deploylens.app yayında",
            status: "success",
            duration: "1dk 47sn",
            detailHref: "#",
          },
        ]}
      />
    </div>
  ),
};

export const Yukleniyor: Story = {
  render: () => (
    <div className="max-w-xl">
      <StatusCheckList title="Kontroller yükleniyor" checks={[]} loading />
    </div>
  ),
};
