import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Copy,
  Download,
  Eye,
  GitCompareArrows,
  Heart,
  Pencil,
  Rocket,
  RotateCcw,
  Share2,
  Shirt,
  Tag,
  Trash2,
} from "lucide-react";

import { ContextMenu } from "@ds/ui";

type ContextMenuItems = React.ComponentProps<typeof ContextMenu>["items"];

const meta: Meta<typeof ContextMenu> = {
  title: "Primitives/ContextMenu",
  component: ContextMenu,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

/** Sag-tiklanabilir tetik alani — story'lerde tekrar kullanilir. */
function TriggerZone({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-[360px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center text-card-foreground shadow-sm">
      {children}
    </div>
  );
}

/** DeployLens: dagitim satirina sag-tik. Alt-menu ile ortam secimi ve yikici geri alma. */
export const DeployLensDagitimSatiri: Story = {
  render: () => {
    const items: ContextMenuItems = [
      { type: "label", label: "Dagitim #4821" },
      {
        icon: <Eye />,
        label: "Ayrintilari goruntule",
        shortcut: "Enter",
        onSelect: () => {},
      },
      {
        icon: <GitCompareArrows />,
        label: "Onceki surumle karsilastir",
        shortcut: "Ctrl D",
        onSelect: () => {},
      },
      {
        icon: <Rocket />,
        label: "Ortama yeniden dagit",
        submenu: [
          { icon: <Rocket />, label: "Staging ortamina", onSelect: () => {} },
          { icon: <Rocket />, label: "Prodüksiyon ortamina", onSelect: () => {} },
          { type: "separator" },
          { icon: <Rocket />, label: "Onizleme (preview)", onSelect: () => {} },
        ],
      },
      { type: "separator" },
      { icon: <Copy />, label: "Commit SHA'yi kopyala", onSelect: () => {} },
      {
        icon: <RotateCcw />,
        label: "Bu surume geri al",
        destructive: true,
        onSelect: () => {},
      },
    ];

    return (
      <ContextMenu items={items}>
        <TriggerZone>
          <span className="text-sm font-semibold">
            feat: kart bileseni tonlu golge
          </span>
          <span className="text-xs text-muted-foreground">
            Bu satira sag-tiklayin
          </span>
        </TriggerZone>
      </ContextMenu>
    );
  },
};

/** Fisly: fatura satirina sag-tik. Kisayollar, ayrac ve yikici silme. Menu acik onizlenir. */
export const FislyFaturaSatiri: Story = {
  render: () => {
    const items: ContextMenuItems = [
      { type: "label", label: "FAT-2026-0347" },
      { icon: <Eye />, label: "Faturayi ac", shortcut: "Ctrl O", onSelect: () => {} },
      { icon: <Pencil />, label: "Duzenle", shortcut: "Ctrl E", onSelect: () => {} },
      {
        icon: <Download />,
        label: "PDF olarak indir",
        shortcut: "Ctrl S",
        onSelect: () => {},
      },
      { icon: <Share2 />, label: "Musteriye gonder", onSelect: () => {} },
      { type: "separator" },
      { icon: <Copy />, label: "Kopyasini olustur", onSelect: () => {} },
      {
        icon: <Trash2 />,
        label: "Faturayi sil",
        shortcut: "Del",
        destructive: true,
        onSelect: () => {},
      },
    ];

    return (
      <ContextMenu items={items} defaultOpen>
        <TriggerZone>
          <span className="text-sm font-semibold tabular-nums">
            Atlas Yazilim A.S. — 24.500,00 TL
          </span>
          <span className="text-xs text-muted-foreground">Vadesi: 14 Tem 2026</span>
        </TriggerZone>
      </ContextMenu>
    );
  },
};

/** Dolap: gardirop kiyafetine sag-tik. Devre disi oge, etiketleme alt-menusu ve favori. */
export const DolapKiyafetKarti: Story = {
  render: () => {
    const items: ContextMenuItems = [
      { icon: <Eye />, label: "Kombinlerde goster", onSelect: () => {} },
      { icon: <Heart />, label: "Favorilere ekle", onSelect: () => {} },
      {
        icon: <Tag />,
        label: "Sezon etiketle",
        submenu: [
          { icon: <Tag />, label: "Ilkbahar", onSelect: () => {} },
          { icon: <Tag />, label: "Yaz", onSelect: () => {} },
          { icon: <Tag />, label: "Sonbahar", onSelect: () => {} },
          { icon: <Tag />, label: "Kis", onSelect: () => {} },
        ],
      },
      { icon: <Share2 />, label: "Paylas", disabled: true },
      { type: "separator" },
      {
        icon: <Trash2 />,
        label: "Dolaptan kaldir",
        destructive: true,
        onSelect: () => {},
      },
    ];

    return (
      <ContextMenu items={items}>
        <TriggerZone>
          <Shirt className="size-8 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-semibold">Keten Beyaz Gomlek</span>
          <span className="text-xs text-muted-foreground">
            Karti sag-tiklayin
          </span>
        </TriggerZone>
      </ContextMenu>
    );
  },
};
