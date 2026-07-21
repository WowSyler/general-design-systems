import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PackageSearch } from "lucide-react";

import {
  Badge,
  DataTable,
  EmptyState,
  type DataTableColumn,
} from "@ds/ui";

interface BuildRow {
  id: string;
  build: string;
  ortam: string;
  durum: "basarili" | "uyari" | "hata";
  tarih: string;
}

const durumBadge: Record<BuildRow["durum"], React.ReactNode> = {
  basarili: <Badge variant="success">Başarılı</Badge>,
  uyari: <Badge variant="warning">Uyarı</Badge>,
  hata: <Badge variant="destructive-soft">Hata</Badge>,
};

const columns: DataTableColumn<BuildRow>[] = [
  { key: "build", header: "Build" },
  { key: "ortam", header: "Ortam" },
  {
    key: "durum",
    header: "Durum",
    cell: (row) => durumBadge[row.durum],
  },
  { key: "tarih", header: "Tarih", align: "right" },
];

const builds: BuildRow[] = [
  {
    id: "b-2481",
    build: "#2481 · feat/canary-rollout",
    ortam: "Production",
    durum: "basarili",
    tarih: "18 Tem 2026 14:32",
  },
  {
    id: "b-2480",
    build: "#2480 · fix/env-diff-cache",
    ortam: "Staging",
    durum: "uyari",
    tarih: "18 Tem 2026 11:05",
  },
  {
    id: "b-2479",
    build: "#2479 · chore/deps-bump",
    ortam: "Staging",
    durum: "hata",
    tarih: "17 Tem 2026 19:48",
  },
  {
    id: "b-2478",
    build: "#2478 · feat/preview-links",
    ortam: "Preview",
    durum: "basarili",
    tarih: "17 Tem 2026 16:21",
  },
  {
    id: "b-2477",
    build: "#2477 · fix/webhook-retry",
    ortam: "Production",
    durum: "basarili",
    tarih: "16 Tem 2026 09:54",
  },
];

const meta: Meta = {
  title: "Composites/DataTable",
};

export default meta;
type Story = StoryObj;

export const BuildListesi: Story = {
  render: () => (
    <DataTable<BuildRow>
      columns={columns}
      data={builds}
      rowKey={(row) => row.id}
      caption="DeployLens — son build'ler"
    />
  ),
};

export const TiklanabilirSatirlar: Story = {
  render: () => (
    <DataTable<BuildRow>
      columns={columns}
      data={builds}
      rowKey={(row) => row.id}
      onRowClick={(row) => {
        console.log("Build detayına git:", row.id);
      }}
    />
  ),
};

export const BosDurum: Story = {
  render: () => (
    <DataTable<BuildRow>
      columns={columns}
      data={[]}
      rowKey={(row) => row.id}
      emptyState={
        <EmptyState
          icon={<PackageSearch className="size-6" />}
          title="Henüz build yok"
          description="Bu ortamda henüz bir dağıtım gerçekleşmedi."
          className="border-none py-4"
        />
      }
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <DataTable<BuildRow>
      columns={columns}
      data={[]}
      rowKey={(row) => row.id}
      loading
    />
  ),
};
