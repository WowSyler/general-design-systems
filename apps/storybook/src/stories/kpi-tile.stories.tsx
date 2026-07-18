import type { Meta, StoryObj } from "@storybook/react";
import { CreditCard, TrendingUp, Users, Wallet } from "lucide-react";

import { KpiTile, Sparkline } from "@ds/ui";

const meta: Meta<typeof KpiTile> = {
  title: "Iconic/KpiTile",
  component: KpiTile,
};

export default meta;
type Story = StoryObj<typeof KpiTile>;

/** Tekli kart — pozitif trend + sparkline. */
export const IslemHacmi: Story = {
  render: () => (
    <div className="w-80">
      <KpiTile
        label="İşlem hacmi"
        value="₺1,28M"
        delta={{ value: "%12,4", trend: "up" }}
        icon={<Wallet />}
        sparkline={<Sparkline data={[8, 12, 9, 14, 13, 18, 22]} tone="success" />}
      />
    </div>
  ),
};

/** Fisly panosu — 3'lü grid, biri accent + sparkline. */
export const FislyPanosu: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KpiTile
        accent
        label="Bu ay tahsilat"
        value="₺842.960"
        delta={{ value: "%18,2", trend: "up" }}
        icon={<TrendingUp />}
        sparkline={
          <Sparkline data={[12, 18, 15, 22, 26, 24, 31]} tone="primary" />
        }
      />
      <KpiTile
        label="Aktif abone"
        value="3.204"
        delta={{ value: "%4,1", trend: "up" }}
        icon={<Users />}
      />
      <KpiTile
        label="Vadesi geçen"
        value="₺56.300"
        delta={{ value: "%2,7", trend: "down" }}
        icon={<CreditCard />}
      />
    </div>
  ),
};

/** Nötr trend örneği. */
export const NotrTrend: Story = {
  args: {
    label: "Ortalama sepet",
    value: "₺318",
    delta: { value: "%0,0", trend: "neutral" },
    icon: <Wallet />,
  },
};
