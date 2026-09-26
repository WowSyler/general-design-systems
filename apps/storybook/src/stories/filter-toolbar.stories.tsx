import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { FilterToolbar, type FilterToolbarView } from "@wowsyler/ds-ui";

const meta: Meta<typeof FilterToolbar> = {
  title: "Composites/FilterToolbar",
  component: FilterToolbar,
};

export default meta;
type Story = StoryObj<typeof FilterToolbar>;

const siralaSecenekleri = [
  { value: "yeni", label: "En yeni" },
  { value: "populer", label: "En popüler" },
  { value: "fiyat-artan", label: "Fiyat: Artan" },
  { value: "fiyat-azalan", label: "Fiyat: Azalan" },
];

function DolapVitriniOrnek() {
  const [arama, setArama] = React.useState("");
  const [sirala, setSirala] = React.useState("yeni");
  const [gorunum, setGorunum] = React.useState<FilterToolbarView>("grid");

  return (
    <div className="w-full max-w-3xl space-y-4">
      <FilterToolbar
        searchValue={arama}
        onSearchChange={setArama}
        searchPlaceholder="Ürün, marka veya kategori ara..."
        onFilterClick={() => alert("Filtre paneli açılıyor")}
        activeFilterCount={3}
        sortOptions={siralaSecenekleri}
        sortValue={sirala}
        onSortChange={setSirala}
        view={gorunum}
        onViewChange={setGorunum}
      />
      <p className="text-sm text-muted-foreground">
        Arama: <span className="font-medium text-foreground">{arama || "—"}</span>{" "}
        · Sıralama:{" "}
        <span className="font-medium text-foreground">{sirala}</span> · Görünüm:{" "}
        <span className="font-medium text-foreground">{gorunum}</span>
      </p>
    </div>
  );
}

/** Dolap ikinci el vitrini: arama, 3 aktif filtre rozeti, sıralama ve grid/liste. */
export const DolapVitrini: Story = {
  render: () => <DolapVitriniOrnek />,
};

function DeployLensDagitimlarOrnek() {
  const [arama, setArama] = React.useState("");
  const [sirala, setSirala] = React.useState("tarih");
  const [gorunum, setGorunum] = React.useState<FilterToolbarView>("list");

  return (
    <div className="w-full max-w-2xl">
      <FilterToolbar
        searchValue={arama}
        onSearchChange={setArama}
        searchPlaceholder="Dağıtım ara..."
        onFilterClick={() => alert("Ortam ve durum filtreleri")}
        sortOptions={[
          { value: "tarih", label: "Son dağıtım" },
          { value: "sure", label: "Süre" },
          { value: "durum", label: "Durum" },
        ]}
        sortValue={sirala}
        onSortChange={setSirala}
        view={gorunum}
        onViewChange={setGorunum}
      />
    </div>
  );
}

/** DeployLens dağıtım listesi: aktif filtre yok, liste görünümü seçili. */
export const DeployLensDagitimlar: Story = {
  render: () => <DeployLensDagitimlarOrnek />,
};

function SadeceAramaVeSiralaOrnek() {
  const [arama, setArama] = React.useState("Randevu");
  const [sirala, setSirala] = React.useState("");

  return (
    <div className="w-full max-w-xl">
      <FilterToolbar
        searchValue={arama}
        onSearchChange={setArama}
        searchPlaceholder="Hizmet veya uzman ara..."
        sortOptions={[
          { value: "yakin", label: "En yakın tarih" },
          { value: "puan", label: "En yüksek puan" },
        ]}
        sortValue={sirala}
        onSortChange={setSirala}
      />
    </div>
  );
}

/** Randevu keşfet: yalnızca arama + sıralama (filtre ve görünüm kapalı). */
export const SadeceAramaVeSirala: Story = {
  render: () => <SadeceAramaVeSiralaOrnek />,
};
