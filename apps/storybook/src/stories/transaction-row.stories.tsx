import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowDownLeft,
  Car,
  Coffee,
  CreditCard,
  ShoppingCart,
  Zap,
} from "lucide-react";

import { TransactionRow, TransactionRowGroup } from "@ds/ui";

const meta: Meta<typeof TransactionRow> = {
  title: "Composites/TransactionRow",
  component: TransactionRow,
};

export default meta;
type Story = StoryObj<typeof TransactionRow>;

export const TekIslem: Story = {
  args: {
    icon: <ShoppingCart />,
    tone: "info",
    title: "Migros Sanal Market",
    category: "Market",
    date: "14 Tem",
    amount: 342.8,
    type: "expense",
    onClick: () => {},
  },
};

export const IslemListesi: Story = {
  render: () => (
    <TransactionRowGroup className="max-w-md">
      <TransactionRow
        icon={<ArrowDownLeft />}
        tone="success"
        title="Freelance ödemesi"
        category="Gelir"
        date="15 Tem"
        amount={8500}
        type="income"
        onClick={() => {}}
      />
      <TransactionRow
        icon={<Car />}
        tone="warning"
        title="Shell Akaryakıt"
        category="Ulaşım"
        date="13 Tem"
        amount={1250}
        type="expense"
        onClick={() => {}}
      />
      <TransactionRow
        icon={<Coffee />}
        tone="primary"
        title="Kahve Dünyası"
        category="Yeme-içme"
        date="12 Tem"
        amount={186.5}
        type="expense"
        onClick={() => {}}
      />
      <TransactionRow
        icon={<Zap />}
        tone="info"
        title="Enerjisa Elektrik"
        category="Fatura"
        date="10 Tem"
        amount={734.9}
        type="expense"
        onClick={() => {}}
      />
    </TransactionRowGroup>
  ),
};

export const DurumluIslemler: Story = {
  render: () => (
    <TransactionRowGroup className="max-w-md">
      <TransactionRow
        icon={<CreditCard />}
        tone="destructive"
        title="Fisly Pro aboneliği"
        category="Abonelik"
        date="09 Tem"
        amount={149}
        type="expense"
        status="Beklemede"
        onClick={() => {}}
      />
      <TransactionRow
        icon={<ArrowDownLeft />}
        tone="success"
        title="İade — Trendyol"
        category="Gelir"
        date="08 Tem"
        amount={219.9}
        type="income"
        status="Tamamlandı"
        onClick={() => {}}
      />
    </TransactionRowGroup>
  ),
};
