import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Badge,
  ResponsiveTable,
  type ResponsiveTableColumn,
} from "@ds/ui";

const meta: Meta<typeof ResponsiveTable> = {
  title: "Composites/ResponsiveTable",
  component: ResponsiveTable,
};

export default meta;
type Story = StoryObj<typeof ResponsiveTable>;

/* ----------------------------- DeployLens ----------------------------- */

interface Deploy {
  id: string;
  build: string;
  ortam: string;
  durum: "basarili" | "uyari" | "hata";
  sure: string;
  tarih: string;
}

const deployDurumu: Record<Deploy["durum"], React.ReactNode> = {
  basarili: <Badge variant="success-soft">Başarılı</Badge>,
  uyari: <Badge variant="warning-soft">Uyarı</Badge>,
  hata: <Badge variant="destructive-soft">Hata</Badge>,
};

const deployColumns: ResponsiveTableColumn<Deploy>[] = [
  { key: "build", header: "Build" },
  { key: "ortam", header: "Ortam" },
  { key: "durum", header: "Durum", cell: (row) => deployDurumu[row.durum] },
  { key: "sure", header: "Süre", align: "right" },
  { key: "tarih", header: "Tarih", align: "right", hideOnMobile: true },
];

const deploys: Deploy[] = [
  {
    id: "d-2481",
    build: "#2481 · feat/canary-rollout",
    ortam: "Production",
    durum: "basarili",
    sure: "3d 12s",
    tarih: "14 Tem 2026 14:32",
  },
  {
    id: "d-2480",
    build: "#2480 · fix/env-diff-cache",
    ortam: "Staging",
    durum: "uyari",
    sure: "2d 48s",
    tarih: "14 Tem 2026 11:05",
  },
  {
    id: "d-2479",
    build: "#2479 · chore/deps-bump",
    ortam: "Staging",
    durum: "hata",
    sure: "1d 05s",
    tarih: "13 Tem 2026 19:48",
  },
  {
    id: "d-2478",
    build: "#2478 · feat/preview-links",
    ortam: "Preview",
    durum: "basarili",
    sure: "4d 20s",
    tarih: "13 Tem 2026 16:21",
  },
];

export const DeployListesi: Story = {
  render: () => (
    <div className="mx-auto max-w-4xl">
      <ResponsiveTable<Deploy>
        columns={deployColumns}
        data={deploys}
        rowKey={(row) => row.id}
        primaryColumn="build"
        caption="DeployLens — geniş ekranda tablo, mobilde kart olarak görünür."
      />
    </div>
  ),
};

/* -------------------------------- Fisly -------------------------------- */

interface Islem {
  id: string;
  aciklama: string;
  kategori: string;
  tutar: string;
  tarih: string;
}

const islemColumns: ResponsiveTableColumn<Islem>[] = [
  { key: "aciklama", header: "Açıklama" },
  { key: "kategori", header: "Kategori" },
  {
    key: "tutar",
    header: "Tutar",
    align: "right",
    cell: (row) => (
      <span className="font-semibold tabular-nums text-foreground">
        {row.tutar}
      </span>
    ),
  },
  { key: "tarih", header: "Tarih", align: "right" },
];

const islemler: Islem[] = [
  {
    id: "i-1",
    aciklama: "Migros market alışverişi",
    kategori: "Market",
    tutar: "-₺842,50",
    tarih: "14 Tem",
  },
  {
    id: "i-2",
    aciklama: "Temmuz maaşı",
    kategori: "Gelir",
    tutar: "+₺48.500,00",
    tarih: "12 Tem",
  },
  {
    id: "i-3",
    aciklama: "Spotify Premium",
    kategori: "Abonelik",
    tutar: "-₺59,99",
    tarih: "10 Tem",
  },
];

export const TiklanabilirSatirlar: Story = {
  render: () => (
    <div className="mx-auto max-w-3xl">
      <ResponsiveTable<Islem>
        columns={islemColumns}
        data={islemler}
        rowKey={(row) => row.id}
        primaryColumn="aciklama"
        onRowClick={(row) => console.log("İşlem detayı:", row.id)}
        caption="Fisly — satıra/karta tıklayarak detaya gidin."
      />
    </div>
  ),
};

/* --------------------------- Yükleme & Boş --------------------------- */

export const YuklemeVeBosDurum: Story = {
  render: () => (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Yükleniyor
        </p>
        <ResponsiveTable<Islem>
          columns={islemColumns}
          data={[]}
          rowKey={(row) => row.id}
          primaryColumn="aciklama"
          loading
        />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Boş durum
        </p>
        <ResponsiveTable<Islem>
          columns={islemColumns}
          data={[]}
          rowKey={(row) => row.id}
          primaryColumn="aciklama"
          emptyState={
            <span className="text-sm text-muted-foreground">
              Bu dönemde henüz işlem yok.
            </span>
          }
        />
      </div>
    </div>
  ),
};
