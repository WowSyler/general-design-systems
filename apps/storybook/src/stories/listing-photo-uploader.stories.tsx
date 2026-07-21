import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { ListingPhotoUploader } from "@ds/ui";

const meta: Meta<typeof ListingPhotoUploader> = {
  title: "Composites/ListingPhotoUploader",
  component: ListingPhotoUploader,
  decorators: [
    (Story) => (
      <div className="w-[460px] max-w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ListingPhotoUploader>;

/**
 * Dolap: ikinci el ilan olusturma — bos durumda buyuk birak-alani.
 * Fotograf secildikce grid olusur; ilk fotograf otomatik "Kapak" olur,
 * kartlar surukleyerek veya oklarla yeniden siralanabilir.
 */
export const DolapIlanOlusturma: Story = {
  args: {
    maxFiles: 8,
    label: "İlan fotoğraflarını buraya bırakın",
    hint: "En fazla 8 fotoğraf · ilk fotoğraf kapak olur · sürükleyerek sırala",
    onFilesChange: (files) => console.log("Dolap ilan fotoğrafları:", files),
  },
};

/**
 * GlowScan: cilt analizi icin en fazla 3 fotograf — dusuk sinir,
 * "Kapak" yerine ozel rozet metni ve daralan slot davranisi.
 */
export const GlowScanAnalizFotograflari: Story = {
  args: {
    maxFiles: 3,
    coverLabel: "Ana kare",
    label: "Cilt fotoğraflarını yükle",
    hint: "İyi aydınlatılmış 1-3 kare · ilk kare analiz için referanstır",
    onFilesChange: (files) =>
      console.log("GlowScan analiz kareleri:", files.length),
  },
};

/**
 * Devre disi durum: mevcut fotograflar salt-okunur gosterilir;
 * ekleme, silme ve siralama etkilesimleri kapanir.
 */
export const DevreDisi: Story = {
  args: {
    disabled: true,
    maxFiles: 6,
    label: "Fotoğraf ekleme kapalı",
    hint: "İlan yayında olduğu için düzenleme devre dışı",
  },
};
