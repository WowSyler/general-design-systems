import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Archive, PackageSearch, RotateCcw, Trash2 } from "lucide-react";

import {
  Badge,
  DataTableAdvanced,
  EmptyState,
  type DataTableAdvancedColumn,
} from "@ds/ui";

/* ------------------------------- DeployLens ------------------------------- */

interface DeployRow {
  id: string;
  dagitim: string;
  ortam: "Production" | "Staging" | "Preview";
  durum: "basarili" | "uyari" | "hata";
  sureSn: number;
  tarihISO: string;
}

const durumRozet: Record<DeployRow["durum"], React.ReactNode> = {
  basarili: <Badge variant="success">Başarılı</Badge>,
  uyari: <Badge variant="warning">Uyarı</Badge>,
  hata: <Badge variant="destructive-soft">Hata</Badge>,
};

function sureBicimle(sn: number): string {
  const dakika = Math.floor(sn / 60);
  const saniye = sn % 60;
  return dakika > 0 ? `${dakika}dk ${saniye}sn` : `${saniye}sn`;
}

function tarihBicimle(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const deployKolonlari: DataTableAdvancedColumn<DeployRow>[] = [
  {
    key: "dagitim",
    header: "Dağıtım",
    accessor: (row) => (
      <span className="font-medium tabular-nums text-foreground">
        {row.dagitim}
      </span>
    ),
    sortable: true,
    sortAccessor: (row) => row.dagitim,
  },
  {
    key: "ortam",
    header: "Ortam",
    accessor: (row) => row.ortam,
    sortable: true,
    sortAccessor: (row) => row.ortam,
  },
  {
    key: "durum",
    header: "Durum",
    cell: (row) => durumRozet[row.durum],
  },
  {
    key: "sure",
    header: "Süre",
    align: "right",
    accessor: (row) => (
      <span className="tabular-nums text-muted-foreground">
        {sureBicimle(row.sureSn)}
      </span>
    ),
    sortable: true,
    sortAccessor: (row) => row.sureSn,
  },
  {
    key: "tarih",
    header: "Tarih",
    align: "right",
    accessor: (row) => (
      <span className="tabular-nums text-muted-foreground">
        {tarihBicimle(row.tarihISO)}
      </span>
    ),
    sortable: true,
    sortAccessor: (row) => row.tarihISO,
  },
];

const deployVerisi: DeployRow[] = [
  {
    id: "b-2481",
    dagitim: "#2481 feat/canary-rollout",
    ortam: "Production",
    durum: "basarili",
    sureSn: 102,
    tarihISO: "2026-07-18T14:32:00",
  },
  {
    id: "b-2480",
    dagitim: "#2480 fix/env-diff-cache",
    ortam: "Staging",
    durum: "uyari",
    sureSn: 148,
    tarihISO: "2026-07-18T11:05:00",
  },
  {
    id: "b-2479",
    dagitim: "#2479 chore/deps-bump",
    ortam: "Staging",
    durum: "hata",
    sureSn: 47,
    tarihISO: "2026-07-17T19:48:00",
  },
  {
    id: "b-2478",
    dagitim: "#2478 feat/preview-links",
    ortam: "Preview",
    durum: "basarili",
    sureSn: 211,
    tarihISO: "2026-07-17T16:21:00",
  },
  {
    id: "b-2477",
    dagitim: "#2477 fix/webhook-retry",
    ortam: "Production",
    durum: "basarili",
    sureSn: 89,
    tarihISO: "2026-07-16T09:54:00",
  },
];

/* --------------------------------- Fisly ---------------------------------- */

interface IslemRow {
  id: string;
  aciklama: string;
  kategori: string;
  tutar: number;
  tarihISO: string;
}

const islemKolonlari: DataTableAdvancedColumn<IslemRow>[] = [
  {
    key: "aciklama",
    header: "İşlem",
    accessor: (row) => (
      <span className="font-medium text-foreground">{row.aciklama}</span>
    ),
    sortable: true,
    sortAccessor: (row) => row.aciklama,
  },
  {
    key: "kategori",
    header: "Kategori",
    accessor: (row) => (
      <Badge variant="secondary" className="font-normal">
        {row.kategori}
      </Badge>
    ),
  },
  {
    key: "tutar",
    header: "Tutar",
    align: "right",
    cell: (row) => (
      <span
        className={
          row.tutar < 0
            ? "font-semibold tabular-nums text-destructive"
            : "font-semibold tabular-nums text-success"
        }
      >
        {row.tutar.toLocaleString("tr-TR", {
          style: "currency",
          currency: "TRY",
          signDisplay: "always",
        })}
      </span>
    ),
    sortable: true,
    sortAccessor: (row) => row.tutar,
  },
  {
    key: "tarih",
    header: "Tarih",
    align: "right",
    accessor: (row) => (
      <span className="tabular-nums text-muted-foreground">
        {new Date(row.tarihISO).toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "short",
        })}
      </span>
    ),
    sortable: true,
    sortAccessor: (row) => row.tarihISO,
  },
];

const islemVerisi: IslemRow[] = [
  { id: "i-01", aciklama: "Migros market alışverişi", kategori: "Market", tutar: -842.5, tarihISO: "2026-07-19" },
  { id: "i-02", aciklama: "Freelance ödeme — Dolap", kategori: "Gelir", tutar: 12500, tarihISO: "2026-07-18" },
  { id: "i-03", aciklama: "Spotify Premium", kategori: "Abonelik", tutar: -59.99, tarihISO: "2026-07-17" },
  { id: "i-04", aciklama: "Shell akaryakıt", kategori: "Ulaşım", tutar: -1350, tarihISO: "2026-07-16" },
  { id: "i-05", aciklama: "Kira iadesi", kategori: "Gelir", tutar: 2000, tarihISO: "2026-07-15" },
  { id: "i-06", aciklama: "Trendyol sipariş", kategori: "Alışveriş", tutar: -487.9, tarihISO: "2026-07-14" },
  { id: "i-07", aciklama: "Elektrik faturası", kategori: "Fatura", tutar: -623.4, tarihISO: "2026-07-13" },
  { id: "i-08", aciklama: "Kahve — Kronotrop", kategori: "Yeme-İçme", tutar: -145, tarihISO: "2026-07-12" },
  { id: "i-09", aciklama: "Danışmanlık faturası", kategori: "Gelir", tutar: 8750, tarihISO: "2026-07-11" },
  { id: "i-10", aciklama: "Netflix", kategori: "Abonelik", tutar: -149.99, tarihISO: "2026-07-10" },
];

/* --------------------------------- meta ----------------------------------- */

const meta: Meta<typeof DataTableAdvanced> = {
  title: "Composites/DataTableAdvanced",
  component: DataTableAdvanced,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof DataTableAdvanced>;

/**
 * DeployLens dağıtımları: sıralanabilir başlıklar, satır seçimi ve seçili
 * satırlar için toplu işlem çubuğu. Süre kolonuna göre sayısal sıralamayı
 * ve tümünü-seç kutusunu deneyin.
 */
export const DeployDagitimlari: Story = {
  render: () => {
    const [secili, setSecili] = React.useState<string[]>(["b-2480"]);
    return (
      <DataTableAdvanced<DeployRow>
        columns={deployKolonlari}
        data={deployVerisi}
        rowKey={(row) => row.id}
        selectable
        selectedKeys={secili}
        onSelectionChange={setSecili}
        defaultSort={{ key: "tarih", direction: "desc" }}
        zebra
        onRowClick={(row) => console.log("Dağıtım detayı:", row.id)}
        caption="DeployLens — son dağıtımlar"
        bulkActions={[
          {
            id: "rollback",
            label: "Geri al",
            icon: <RotateCcw className="size-4" />,
            onClick: () => console.log("Rollback:", secili),
          },
          {
            id: "arsivle",
            label: "Arşivle",
            icon: <Archive className="size-4" />,
            onClick: () => console.log("Arşivle:", secili),
          },
          {
            id: "sil",
            label: "Sil",
            icon: <Trash2 className="size-4" />,
            variant: "destructive",
            onClick: () => setSecili([]),
          },
        ]}
      />
    );
  },
};

/**
 * Fisly işlem geçmişi: yoğun (compact) yerleşim, yapışkan başlık + kaydırma,
 * sağa hizalı tutarlar ve gelir/gider için tonlu renkler. Tutar başlığına
 * tıklayarak en büyük/küçük işlemleri sıralayın.
 */
export const FislyIslemleri: Story = {
  render: () => (
    <DataTableAdvanced<IslemRow>
      columns={islemKolonlari}
      data={islemVerisi}
      rowKey={(row) => row.id}
      density="compact"
      stickyHeader
      maxHeight={320}
      defaultSort={{ key: "tarih", direction: "desc" }}
      caption="Fisly — Temmuz işlemleri"
    />
  ),
};

/**
 * Boş durum: kayıt bulunmadığında EmptyState ile anlamlı bir mesaj gösterilir.
 */
export const BosDurum: Story = {
  render: () => (
    <DataTableAdvanced<DeployRow>
      columns={deployKolonlari}
      data={[]}
      rowKey={(row) => row.id}
      selectable
      emptyState={
        <EmptyState
          icon={<PackageSearch className="size-6" />}
          title="Henüz dağıtım yok"
          description="Bu ortamda henüz bir dağıtım gerçekleşmedi."
          className="border-none py-4"
        />
      }
    />
  ),
};

/**
 * Yükleniyor durumu: veri gelene kadar iskelet (skeleton) satırları gösterilir.
 */
export const Yukleniyor: Story = {
  render: () => (
    <DataTableAdvanced<IslemRow>
      columns={islemKolonlari}
      data={[]}
      rowKey={(row) => row.id}
      selectable
      loading
      loadingRows={5}
      density="compact"
    />
  ),
};
