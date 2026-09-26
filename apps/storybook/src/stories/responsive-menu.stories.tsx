import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Archive,
  Copy,
  Download,
  Flag,
  Pencil,
  Pin,
  Share2,
  Trash2,
} from "lucide-react";

import { ResponsiveMenu } from "@wowsyler/ds-ui";

type ResponsiveMenuItems = React.ComponentProps<typeof ResponsiveMenu>["items"];

const varsayilanOgeler: ResponsiveMenuItems = [
  {
    key: "duzenle",
    label: "Düzenle",
    icon: <Pencil aria-hidden="true" />,
    description: "Başlık ve açıklamayı güncelle",
    shortcut: "⌘E",
  },
  {
    key: "kopyala",
    label: "Bağlantıyı kopyala",
    icon: <Copy aria-hidden="true" />,
    description: "Paylaşılabilir bağlantıyı panoya al",
    shortcut: "⌘C",
  },
  {
    key: "paylas",
    label: "Paylaş",
    icon: <Share2 aria-hidden="true" />,
    description: "E-posta veya ekiple paylaş",
  },
  { type: "separator" },
  {
    key: "arsivle",
    label: "Arşivle",
    icon: <Archive aria-hidden="true" />,
    description: "Listeden gizle, sonra geri getir",
  },
  {
    key: "sil",
    label: "Sil",
    icon: <Trash2 aria-hidden="true" />,
    description: "Bu öğe kalıcı olarak kaldırılır",
    destructive: true,
    shortcut: "⌘⌫",
  },
];

const meta: Meta<typeof ResponsiveMenu> = {
  title: "Composites/ResponsiveMenu",
  component: ResponsiveMenu,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ResponsiveMenu>;

/**
 * Masaustu gorunumu: Radix DropdownMenu. Kisayollar sagda, yikici eylem
 * kirmizi tonda. Tetige tiklayarak acip kapatabilirsiniz.
 */
export const MasaustuDropdown: Story = {
  name: "Masaüstü — açılır menü",
  args: {
    variant: "dropdown",
    triggerLabel: "Satır eylemleri",
    items: varsayilanOgeler,
    onSelect: (key: string) => console.log("seçildi:", key),
  },
};

/**
 * Mobil gorunumu: ayni items API, alttan acilan Sheet icinde buyuk dokunmatik
 * liste (her satir >= 52px). Aciklama satirlari ikinci satirda gorunur.
 * Dar bir kapsayici icinde onizlenir.
 */
export const MobilSheet: Story = {
  name: "Mobil — alttan sayfa",
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="mx-auto flex min-h-[60vh] max-w-sm items-start justify-end p-4">
      <ResponsiveMenu {...args} />
    </div>
  ),
  args: {
    variant: "sheet",
    defaultOpen: true,
    title: "Gönderi eylemleri",
    description: "Bu gönderi için yapabilecekleriniz",
    items: varsayilanOgeler,
    onSelect: (key: string) => console.log("seçildi:", key),
  },
};

/**
 * Gruplu ve baslikli kullanim: "label" ile bolum basliklari, "separator" ile
 * ayirici. Otomatik mod (variant "auto") — ekran genisligine gore masaustunde
 * dropdown, mobilde sheet olur.
 */
export const GrupluOtomatik: Story = {
  name: "Gruplu — otomatik (cihaza uyarlanır)",
  args: {
    triggerLabel: "Daha fazla",
    title: "Randevu #4821",
    items: [
      { type: "label", label: "Hızlı işlemler" },
      {
        key: "sabitle",
        label: "Üste sabitle",
        icon: <Pin aria-hidden="true" />,
        description: "Listenin en üstünde tut",
      },
      {
        key: "indir",
        label: "PDF olarak indir",
        icon: <Download aria-hidden="true" />,
        shortcut: "⌘S",
      },
      { type: "separator" },
      { type: "label", label: "Moderasyon" },
      {
        key: "bildir",
        label: "Şikayet et",
        icon: <Flag aria-hidden="true" />,
        description: "Uygunsuz içeriği bildir",
      },
      {
        key: "kaldir",
        label: "Kaldır",
        icon: <Trash2 aria-hidden="true" />,
        destructive: true,
      },
    ],
    onSelect: (key: string) => console.log("seçildi:", key),
  },
};
