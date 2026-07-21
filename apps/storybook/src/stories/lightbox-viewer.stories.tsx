import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Images } from "lucide-react";

import { Button, LightboxViewer } from "@ds/ui";

type LightboxViewerImage = React.ComponentProps<
  typeof LightboxViewer
>["images"][number];

const meta: Meta<typeof LightboxViewer> = {
  title: "Composites/LightboxViewer",
  component: LightboxViewer,
};

export default meta;
type Story = StoryObj<typeof LightboxViewer>;

/** Ornek gorselleri Storybook icinde uretir (self-contained SVG data URI). */
function foto(etiket: string, c1: string, c2: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="900" height="1100" fill="url(#g)"/><text x="450" y="560" font-family="sans-serif" font-size="52" font-weight="600" fill="white" text-anchor="middle" opacity="0.92">${etiket}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const urunGalerisi: LightboxViewerImage[] = [
  {
    src: foto("Onden gorunum", "#6366f1", "#8b5cf6"),
    alt: "Lacivert kruvaze blazer, onden gorunum",
    caption: "Lacivert Kruvaze Blazer - onden gorunum",
  },
  {
    src: foto("Arkadan", "#0ea5e9", "#6366f1"),
    alt: "Blazerin arkadan gorunumu",
    caption: "Sirt kesimi ve dikis detayi",
  },
  {
    src: foto("Yaka detay", "#8b5cf6", "#ec4899"),
    alt: "Yaka ve dugme detayi yakin cekim",
    caption: "Sedef dugme ve yaka detayi",
  },
  {
    src: foto("Kumas", "#14b8a6", "#0ea5e9"),
    alt: "Kumas dokusu yakin cekim",
    caption: "%100 yun, italyan kumas dokusu",
  },
  {
    src: foto("Astar", "#f59e0b", "#ec4899"),
    alt: "Ic astar ve etiket",
    caption: "Ipek astar ve orijinallik etiketi",
  },
  {
    src: foto("Giyimde", "#ec4899", "#8b5cf6"),
    alt: "Blazer manken uzerinde",
    caption: "42 beden, 1.78 boyunda manken uzerinde",
  },
];

export const UrunGalerisi: Story = {
  render: () => (
    <div className="max-w-lg">
      <p className="mb-3 text-sm text-muted-foreground">
        Dolap ilanindaki fotograflara tiklayarak buyutun. Ok tuslari veya alt
        seritle gezinin, Escape ile kapatin.
      </p>
      <LightboxViewer images={urunGalerisi} label="Urun fotograflari" />
    </div>
  ),
};

const taramaGorselleri: LightboxViewerImage[] = [
  {
    src: foto("T-Bolge", "#f43f5e", "#f59e0b"),
    alt: "Yuz T-bolgesi yakin tarama",
    caption: "T-bolge - gozenek yogunlugu yuksek",
  },
  {
    src: foto("Yanak", "#10b981", "#14b8a6"),
    alt: "Sol yanak nem analizi",
    caption: "Sol yanak - nem seviyesi dengeli",
  },
  {
    src: foto("Alin", "#6366f1", "#0ea5e9"),
    alt: "Alin bolgesi cizgi analizi",
    caption: "Alin - ince cizgi tespiti",
  },
  {
    src: foto("Cene", "#8b5cf6", "#6366f1"),
    alt: "Cene hatti tarama",
    caption: "Cene hatti - lekelenme dusuk",
  },
];

export const TaramaDetay: Story = {
  render: () => (
    <div className="max-w-md">
      <p className="mb-3 text-sm text-muted-foreground">
        GlowScan tarama raporundaki bolge gorsellerini yakinlastirarak
        inceleyin.
      </p>
      <LightboxViewer
        images={taramaGorselleri}
        label="Cilt tarama gorselleri"
        gridClassName="grid-cols-4 sm:grid-cols-4"
      />
    </div>
  ),
};

export const ButonlaAcilan: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="max-w-sm text-sm text-muted-foreground">
          Tetikleyici grid gizlenip galeri harici bir butonla acilir
          (kontrollu kullanim).
        </p>
        <Button onClick={() => setOpen(true)}>
          <Images className="size-4" />
          Galeriyi ac ({urunGalerisi.length} fotograf)
        </Button>
        <LightboxViewer
          images={urunGalerisi}
          showTriggerGrid={false}
          open={open}
          onOpenChange={setOpen}
          label="Urun fotograflari"
        />
      </div>
    );
  },
};
