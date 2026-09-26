import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Shirt, Sparkles } from "lucide-react";

import { Tag } from "@wowsyler/ds-ui";

const meta: Meta<typeof Tag> = {
  title: "Primitives/Tag",
  component: Tag,
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Varsayilan: Story = {
  args: {
    label: "Vintage",
  },
};

export const Varyantlar: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Tag label="Yazlık" />
      <Tag label="Öne Çıkan" variant="primary" />
      <Tag label="Keten" variant="outline" />
    </div>
  ),
};

export const Ikonlu: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Tag label="Gömlek" icon={<Shirt />} />
      <Tag label="Yeni Sezon" variant="primary" icon={<Sparkles />} />
    </div>
  ),
};

export const DolapEtiketleri: Story = {
  render: function DolapEtiketleriStory() {
    const [etiketler, setEtiketler] = React.useState([
      "Vintage",
      "Oversize",
      "Denim",
      "Sonbahar",
      "İkinci El",
    ]);

    return (
      <div className="w-80 max-w-full space-y-3">
        <p className="text-sm font-medium">Ürün etiketleri</p>
        <div className="flex flex-wrap gap-2">
          {etiketler.map((etiket) => (
            <Tag
              key={etiket}
              label={etiket}
              variant="primary"
              onRemove={() =>
                setEtiketler((mevcut) => mevcut.filter((e) => e !== etiket))
              }
            />
          ))}
          {etiketler.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Tüm etiketler kaldırıldı.
            </p>
          ) : null}
        </div>
      </div>
    );
  },
};
