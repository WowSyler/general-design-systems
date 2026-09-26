import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Camera, ImageIcon, Package } from "lucide-react";

import { UploadFileList } from "@wowsyler/ds-ui";

const meta: Meta<typeof UploadFileList> = {
  title: "Composites/UploadFileList",
  component: UploadFileList,
  decorators: [
    (Story) => (
      <div className="w-[420px] max-w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UploadFileList>;

type UploadFn = React.ComponentProps<typeof UploadFileList>["uploader"];

// Ağ hatasını taklit eden özel yükleyici: ~%68'de reddeder.
const failingUploader: UploadFn = async (_file, onProgress) => {
  let percent = 0;
  await new Promise<void>((resolve, reject) => {
    const timer = window.setInterval(() => {
      percent += 12;
      if (percent >= 68) {
        window.clearInterval(timer);
        reject(new Error("Ağ zaman aşımına uğradı (504)"));
      } else {
        onProgress(percent);
      }
    }, 260);
  });
};

/** Dolap: ikinci el ilan görselleri — çoklu seçim, otomatik ilerleme. */
export const DolapIlanGorselleri: Story = {
  args: {
    accept: "image/*",
    multiple: true,
    maxSize: 8 * 1024 * 1024,
    label: "İlan fotoğraflarını yükle",
    hint: "PNG veya JPG · en fazla 8 MB · ilk fotoğraf kapak olur",
    triggerIcon: <ImageIcon className="size-5" />,
    onFilesChange: (files) => console.log("Dolap ilan görselleri:", files),
  },
};

/** GlowScan: analiz için tek bir cilt fotoğrafı — küçük boyut sınırı. */
export const GlowScanCiltFotografi: Story = {
  args: {
    accept: "image/*",
    multiple: false,
    maxSize: 3 * 1024 * 1024,
    label: "Cilt fotoğrafını yükle",
    hint: "İyi aydınlatılmış, net bir yüz fotoğrafı · en fazla 3 MB",
    triggerIcon: <Camera className="size-5" />,
  },
};

/**
 * DeployLens: derleme artefaktı yüklemesi — ağ hatasını taklit eden özel
 * uploader ile hata + tekrar-dene akışı gösterilir.
 */
export const DeployLensArtefaktHatasi: Story = {
  args: {
    accept: ".zip,.tar,.tgz,.json,.log",
    multiple: true,
    label: "Derleme artefaktını yükle",
    hint: "ZIP, TAR veya log · özel yükleyici ağ hatası taklit eder",
    triggerIcon: <Package className="size-5" />,
    uploader: failingUploader,
  },
};
