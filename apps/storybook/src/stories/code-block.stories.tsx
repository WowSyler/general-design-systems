import type { Meta, StoryObj } from "@storybook/react";

import { CodeBlock } from "@ds/ui";

const meta: Meta<typeof CodeBlock> = {
  title: "Primitives/CodeBlock",
  component: CodeBlock,
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

const deployCiktisi = `$ deploylens deploy --prod
✔ Kaynaklar derlendi (14.2s)
✔ 128 statik dosya yüklendi
✔ Görsel diff hazırlandı: 3 değişiklik bulundu
  → anasayfa: kahraman bölümü güncellendi
  → fiyatlandirma: yeni plan kartı
  → sss: 2 soru eklendi
✔ Üretim ortamına yayınlandı
  https://app.deploylens.dev/d/8f3a21`;

export const DeployCiktisi: Story = {
  args: {
    code: deployCiktisi,
    title: "deploylens deploy --prod",
    language: "bash",
  },
};

export const SatirNumarali: Story = {
  args: {
    code: `export default defineConfig({
  project: "deploylens-web",
  regions: ["fra1", "ist1"],
  visualDiff: {
    enabled: true,
    threshold: 0.02,
  },
});`,
    title: "deploylens.config.ts",
    language: "ts",
    showLineNumbers: true,
  },
};

export const SadeCikti: Story = {
  args: {
    code: `PING api.deploylens.dev (76.24.11.8): 56 data bytes
64 bytes from 76.24.11.8: icmp_seq=0 ttl=54 time=23.481 ms
64 bytes from 76.24.11.8: icmp_seq=1 ttl=54 time=22.907 ms`,
  },
};
