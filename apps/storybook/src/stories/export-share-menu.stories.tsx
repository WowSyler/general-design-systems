import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileJson, FileText, Image as ImageIcon, Presentation } from "lucide-react";

import { ExportShareMenu } from "@ds/ui";

type FormatOption = React.ComponentProps<typeof ExportShareMenu>["formats"];

const meta: Meta<typeof ExportShareMenu> = {
  title: "Composites/ExportShareMenu",
  component: ExportShareMenu,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ExportShareMenu>;

/** DeployLens dagitim raporu ekranindan varsayilan bicimler + paylas + takvim. */
export const DeployLensRaporu: Story = {
  name: "DeployLens — dağıtım raporu",
  args: {
    triggerLabel: "Raporu dışa aktar",
    shareUrl: "https://deploylens.app/r/haftalik-ozet-2026-29",
    defaultOpen: true,
    onExport: (key: string) => console.log("export", key),
    onEmailShare: () => console.log("e-posta"),
    onAddToCalendar: () => console.log("takvim"),
  },
};

/** Fisly gider listesi PDF olarak hazirlanirken indirme ilerlemesi gorunur. */
export const IndirmeIlerlemesi: Story = {
  name: "Fisly — indirme ilerlemesi",
  args: {
    triggerLabel: "Gider dökümünü dışa aktar",
    shareUrl: "https://fisly.app/paylas/temmuz-giderleri",
    exportingKey: "pdf",
    progress: 62,
    progressLabel: "Temmuz PDF raporu hazırlanıyor…",
    defaultOpen: true,
  },
};

/** GlowScan cilt analizi: ozel bicimler ve yalnizca paylas (takvim gizli). */
export const OzelBicimler: Story = {
  name: "GlowScan — özel biçimler",
  args: {
    triggerLabel: "Analizi paylaş",
    triggerVariant: "default",
    shareUrl: "https://glowscan.app/rapor/cilt-analizi-14-tem",
    showCalendar: false,
    formatsLabel: "Rapor biçimi",
    formats: [
      {
        key: "pdf",
        label: "Klinik PDF raporu",
        icon: <FileText aria-hidden="true" />,
        hint: ".pdf",
      },
      {
        key: "slides",
        label: "Sunum destesi",
        icon: <Presentation aria-hidden="true" />,
        hint: ".pptx",
      },
      {
        key: "png",
        label: "Öncesi/sonrası görseli",
        icon: <ImageIcon aria-hidden="true" />,
        hint: ".png",
      },
      {
        key: "json",
        label: "Ham analiz verisi",
        icon: <FileJson aria-hidden="true" />,
        hint: ".json",
      },
    ] satisfies FormatOption,
    defaultOpen: true,
  },
};
