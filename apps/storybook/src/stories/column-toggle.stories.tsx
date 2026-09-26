import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Badge,
  ColumnToggle,
  DataTable,
  type ColumnToggleColumn,
  type ColumnToggleVisibility,
  type DataTableColumn,
} from "@wowsyler/ds-ui";

const meta: Meta<typeof ColumnToggle> = {
  title: "Composites/ColumnToggle",
  component: ColumnToggle,
};

export default meta;
type Story = StoryObj<typeof ColumnToggle>;

const kolonlar: ColumnToggleColumn[] = [
  { key: "build", label: "Build", locked: true },
  { key: "ortam", label: "Ortam" },
  { key: "durum", label: "Durum" },
  { key: "sure", label: "Süre" },
  { key: "tetikleyen", label: "Tetikleyen" },
  { key: "tarih", label: "Tarih" },
];

/** Tekil, kontrollu secici. Gizli kolon sayisi rozette gorunur. */
export const Temel: Story = {
  render: () => {
    const [gorunurluk, setGorunurluk] =
      React.useState<ColumnToggleVisibility>({
        tetikleyen: false,
        sure: false,
      });

    return (
      <div className="flex flex-col items-start gap-3">
        <ColumnToggle
          columns={kolonlar}
          visibility={gorunurluk}
          onVisibilityChange={setGorunurluk}
        />
        <p className="text-sm text-muted-foreground">
          Görünür kolonlar:{" "}
          <span className="font-medium text-foreground">
            {kolonlar
              .filter((k) => gorunurluk[k.key] !== false)
              .map((k) => k.label)
              .join(", ")}
          </span>
        </p>
      </div>
    );
  },
};

interface BuildRow {
  id: string;
  build: string;
  ortam: string;
  durum: "basarili" | "uyari" | "hata";
  sure: string;
  tetikleyen: string;
  tarih: string;
}

const durumBadge: Record<BuildRow["durum"], React.ReactNode> = {
  basarili: <Badge variant="success">Başarılı</Badge>,
  uyari: <Badge variant="warning">Uyarı</Badge>,
  hata: <Badge variant="destructive-soft">Hata</Badge>,
};

const tumKolonlar: DataTableColumn<BuildRow>[] = [
  { key: "build", header: "Build" },
  { key: "ortam", header: "Ortam" },
  { key: "durum", header: "Durum", cell: (row) => durumBadge[row.durum] },
  { key: "sure", header: "Süre", align: "right" },
  { key: "tetikleyen", header: "Tetikleyen" },
  { key: "tarih", header: "Tarih", align: "right" },
];

const builds: BuildRow[] = [
  {
    id: "b-2481",
    build: "#2481 · feat/canary-rollout",
    ortam: "Production",
    durum: "basarili",
    sure: "2 dk 14 sn",
    tetikleyen: "Ozan K.",
    tarih: "18 Tem 2026 14:32",
  },
  {
    id: "b-2480",
    build: "#2480 · fix/env-diff-cache",
    ortam: "Staging",
    durum: "uyari",
    sure: "1 dk 47 sn",
    tetikleyen: "Selin A.",
    tarih: "18 Tem 2026 11:05",
  },
  {
    id: "b-2479",
    build: "#2479 · chore/deps-bump",
    ortam: "Staging",
    durum: "hata",
    sure: "3 dk 02 sn",
    tetikleyen: "Deniz Y.",
    tarih: "17 Tem 2026 19:48",
  },
  {
    id: "b-2478",
    build: "#2478 · feat/preview-links",
    ortam: "Preview",
    durum: "basarili",
    sure: "0 dk 58 sn",
    tetikleyen: "Ozan K.",
    tarih: "17 Tem 2026 16:21",
  },
];

/** data-table ile birlikte: secici, tablonun kolonlarini gercek zamanli filtreler. */
export const TabloIleBirlikte: Story = {
  render: () => {
    const [gorunurluk, setGorunurluk] =
      React.useState<ColumnToggleVisibility>({ tetikleyen: false });

    const columns: ColumnToggleColumn[] = tumKolonlar.map((k) => ({
      key: String(k.key),
      label: k.header as string,
      locked: k.key === "build",
    }));

    const gorunurTablo = tumKolonlar.filter(
      (k) => gorunurluk[String(k.key)] !== false
    );

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">
            DeployLens — son dağıtımlar
          </h3>
          <ColumnToggle
            columns={columns}
            visibility={gorunurluk}
            onVisibilityChange={setGorunurluk}
          />
        </div>
        <DataTable<BuildRow>
          columns={gorunurTablo}
          data={builds}
          rowKey={(row) => row.id}
          caption="Kolon görünürlüğü sağ üstteki seçiciden yönetilir"
        />
      </div>
    );
  },
};

/** Kilitli kolon (Build) her zaman gorunur; menude devre disi gorunur. Onizleme icin acik. */
export const KilitliKolonlar: Story = {
  render: () => (
    <div className="flex min-h-64 justify-end">
      <ColumnToggle
        columns={kolonlar}
        defaultVisibility={{ tarih: false }}
        defaultOpen
        align="end"
      />
    </div>
  ),
};
