import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@ds/ui";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  args: { children: "Rozet" },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Varsayılan</Badge>
      <Badge variant="secondary">İkincil</Badge>
      <Badge variant="outline">Çerçeveli</Badge>
      <Badge variant="destructive">Hata</Badge>
      <Badge variant="success">Başarılı</Badge>
      <Badge variant="warning">Uyarı</Badge>
      <Badge variant="info">Bilgi</Badge>
    </div>
  ),
};

export const SoftVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="success-soft">Ödendi</Badge>
      <Badge variant="warning-soft">Bekliyor</Badge>
      <Badge variant="info-soft">Taslak</Badge>
      <Badge variant="destructive-soft">İptal</Badge>
    </div>
  ),
};

export const RandevuDurumlari: Story = {
  name: "Randevu Durumları",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="success-soft">Onaylandı</Badge>
      <Badge variant="warning-soft">Bekliyor</Badge>
      <Badge variant="destructive-soft">Gelmedi</Badge>
      <Badge variant="info-soft">Yeniden Planlandı</Badge>
    </div>
  ),
};
