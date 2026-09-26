import type { Meta, StoryObj } from "@storybook/react-vite";
import { Receipt, Wallet } from "lucide-react";

import { Grid, StatCard } from "@wowsyler/ds-ui";

const meta: Meta<typeof StatCard> = {
  title: "Composites/StatCard",
  component: StatCard,
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const ToplamGider: Story = {
  args: {
    label: "Toplam Gider",
    value: "₺12.480",
    delta: { value: "%8,2", trend: "down" },
    icon: <Wallet className="size-4" />,
    footer: "Geçen aya göre",
  },
};

export const FisSayisi: Story = {
  args: {
    label: "Fiş Sayısı",
    value: "47",
    delta: { value: "+12", trend: "up" },
    icon: <Receipt className="size-4" />,
    footer: "Bu ay eklenen fişler",
  },
};

export const FislyPanosu: Story = {
  render: () => (
    <Grid cols={{ base: 1, sm: 2 }} gap="md" className="max-w-2xl">
      <StatCard
        label="Toplam Gider"
        value="₺12.480"
        delta={{ value: "%8,2", trend: "down" }}
        icon={<Wallet className="size-4" />}
        footer="Geçen aya göre"
      />
      <StatCard
        label="Fiş Sayısı"
        value="47"
        delta={{ value: "+12", trend: "up" }}
        icon={<Receipt className="size-4" />}
        footer="Bu ay eklenen fişler"
      />
    </Grid>
  ),
};

export const Loading: Story = {
  args: {
    label: "Toplam Gider",
    value: "₺12.480",
    loading: true,
  },
};
