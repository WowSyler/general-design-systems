import type { Meta, StoryObj } from "@storybook/react-vite";

import { AnimatedCounter } from "@ds/ui";

const meta: Meta<typeof AnimatedCounter> = {
  title: "Iconic/AnimatedCounter",
  component: AnimatedCounter,
};

export default meta;
type Story = StoryObj<typeof AnimatedCounter>;

/** Fisly aylık hacim — ₺ ön eki. */
export const FislyAylikHacim: Story = {
  args: {
    value: 1284500,
    prefix: "₺",
  },
};

/** DeployLens toplam dağıtım sayısı. */
export const DeployLensDagitimlar: Story = {
  args: {
    value: 48213,
    suffix: " dağıtım",
  },
};

/** Ondalık oran — % son eki. */
export const DonusumOrani: Story = {
  args: {
    value: 4.8,
    suffix: "%",
    format: (n: number) =>
      n.toLocaleString("tr-TR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
  },
};

/** Bir KPI şeridi içinde üç sayaç. */
export const KpiSeridi: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
      <div className="flex flex-col gap-1">
        <AnimatedCounter value={1284500} prefix="₺" />
        <span className="text-sm text-muted-foreground">Aylık işlem hacmi</span>
      </div>
      <div className="flex flex-col gap-1">
        <AnimatedCounter value={9842} />
        <span className="text-sm text-muted-foreground">Aktif işletme</span>
      </div>
      <div className="flex flex-col gap-1">
        <AnimatedCounter
          value={99.95}
          suffix="%"
          format={(n: number) =>
            n.toLocaleString("tr-TR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }
        />
        <span className="text-sm text-muted-foreground">Çalışma süresi</span>
      </div>
    </div>
  ),
};
