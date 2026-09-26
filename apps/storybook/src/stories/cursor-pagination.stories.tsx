import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { CursorPagination } from "@wowsyler/ds-ui";

const meta: Meta<typeof CursorPagination> = {
  title: "Composites/CursorPagination",
  component: CursorPagination,
};

export default meta;
type Story = StoryObj<typeof CursorPagination>;

// DeployLens dagitim gunlugu: API imlecle (cursor) sayfalanir, toplam sayfa
// bilinmez. Bu yuzden yalnizca komsu sayfalara gidilir.
const dagitimlar = [
  "web-frontend #4821 basarili",
  "api-gateway #4820 geri alindi",
  "worker-queue #4819 basarili",
  "web-frontend #4818 basarili",
  "cron-runner #4817 basarisiz",
  "api-gateway #4816 basarili",
  "web-frontend #4815 basarili",
  "worker-queue #4814 basarili",
  "cron-runner #4813 basarili",
  "api-gateway #4812 geri alindi",
  "web-frontend #4811 basarili",
  "worker-queue #4810 basarili",
];

function DeployLensOrnek() {
  const [sayfa, setSayfa] = React.useState(0);
  const [boyut, setBoyut] = React.useState(4);

  const toplamSayfa = Math.ceil(dagitimlar.length / boyut);
  const baslangic = sayfa * boyut;
  const gorunen = dagitimlar.slice(baslangic, baslangic + boyut);

  return (
    <div className="w-[32rem] max-w-full space-y-3">
      <ul className="divide-y divide-border rounded-lg border border-border bg-card">
        {gorunen.map((satir) => (
          <li
            key={satir}
            className="px-4 py-2.5 text-sm text-card-foreground tabular-nums"
          >
            {satir}
          </li>
        ))}
      </ul>
      <CursorPagination
        onPrevious={() => setSayfa((s) => Math.max(0, s - 1))}
        onNext={() => setSayfa((s) => Math.min(toplamSayfa - 1, s + 1))}
        hasPrevious={sayfa > 0}
        hasNext={sayfa < toplamSayfa - 1}
        pageLabel={`Sayfa ${sayfa + 1}`}
        pageSize={boyut}
        pageSizeOptions={[4, 8, 12]}
        onPageSizeChange={(yeni) => {
          setBoyut(yeni);
          setSayfa(0);
        }}
      />
    </div>
  );
}

export const DeployLensGunluk: Story = {
  render: () => <DeployLensOrnek />,
};

// Dolap urun listesi: sade Onceki/Sonraki, ilk sayfada Onceki pasif.
export const IlkSayfa: Story = {
  render: () => (
    <div className="w-96 max-w-full">
      <CursorPagination
        hasPrevious={false}
        hasNext
        pageLabel="Sayfa 1"
        onPrevious={() => {}}
        onNext={() => {}}
      />
    </div>
  ),
};

// Dolap ilan akisi: son sayfa, imlec bitti; yalnizca ikon gosterimi.
export const SonSayfaIkonlu: Story = {
  render: () => (
    <div className="w-72 max-w-full">
      <CursorPagination
        iconOnly
        hasPrevious
        hasNext={false}
        pageLabel="Sayfa 9"
        onPrevious={() => {}}
        onNext={() => {}}
      />
    </div>
  ),
};

// Yeni sayfa yuklenirken tum kontroller pasif.
export const Yukleniyor: Story = {
  render: () => (
    <div className="w-96 max-w-full">
      <CursorPagination
        loading
        pageLabel="Sayfa 3"
        pageSize={25}
        onPrevious={() => {}}
        onNext={() => {}}
        onPageSizeChange={() => {}}
      />
    </div>
  ),
};
