import type { Meta, StoryObj } from "@storybook/react";

import { Label, Textarea } from "@ds/ui";

const meta: Meta<typeof Textarea> = {
  title: "Primitives/Textarea",
  component: Textarea,
  args: { placeholder: "Randevu notunuzu yazın..." },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-md gap-1.5">
      <Label htmlFor="not">Müşteri notu</Label>
      <Textarea
        id="not"
        placeholder="Örn. saç boyası alerjisi var, randevudan önce test yapılmalı."
        rows={4}
      />
      <p className="text-xs text-muted-foreground">
        Bu not yalnızca işletme personeli tarafından görülür.
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="grid w-full max-w-md gap-1.5">
      <Label htmlFor="aciklama">Fiş açıklaması</Label>
      <Textarea
        id="aciklama"
        disabled
        value="Migros market alışverişi — ofis mutfağı için ikramlıklar."
        readOnly
      />
    </div>
  ),
};
