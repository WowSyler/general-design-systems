import type { Meta, StoryObj } from "@storybook/react-vite";

import { IncomeExpenseSummary } from "@wowsyler/ds-ui";

const meta: Meta<typeof IncomeExpenseSummary> = {
  title: "Composites/IncomeExpenseSummary",
  component: IncomeExpenseSummary,
};

export default meta;
type Story = StoryObj<typeof IncomeExpenseSummary>;

export const AylikOzet: Story = {
  args: {
    income: 48250,
    expense: 32890,
    period: "Temmuz 2026",
    className: "max-w-md",
  },
};

export const AcikVeren: Story = {
  args: {
    heading: "Haziran Dönemi",
    income: 27400,
    expense: 34120,
    period: "Haziran 2026",
    className: "max-w-md",
  },
};

export const UstUsteDizilim: Story = {
  args: {
    income: 19800,
    expense: 8650,
    orientation: "vertical",
    period: "Bu hafta",
    incomeLabel: "Gelen para",
    expenseLabel: "Giden para",
    className: "max-w-xs",
  },
};

export const Yukleniyor: Story = {
  args: {
    income: 0,
    expense: 0,
    loading: true,
    className: "max-w-md",
  },
};

export const FislyPanoOzeti: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-4 sm:grid-cols-2">
      <IncomeExpenseSummary
        heading="Kişisel Hesap"
        income={48250}
        expense={32890}
        period="Temmuz 2026"
      />
      <IncomeExpenseSummary
        heading="Ortak Kasa"
        income={15600}
        expense={21340}
        period="Temmuz 2026"
      />
    </div>
  ),
};
