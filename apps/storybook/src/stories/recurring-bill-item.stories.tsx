import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dumbbell, Music, Sparkles, Tv, Wifi, Zap } from "lucide-react";

import { RecurringBillItem, RecurringBillItemGroup } from "@ds/ui";

const meta: Meta<typeof RecurringBillItem> = {
  title: "Composites/RecurringBillItem",
  component: RecurringBillItem,
};

export default meta;
type Story = StoryObj<typeof RecurringBillItem>;

export const AylikAbonelik: Story = {
  args: {
    icon: <Tv />,
    tone: "destructive",
    name: "Netflix Premium",
    amount: 229.99,
    period: "monthly",
    nextPaymentDate: "24 Tem",
    daysLeft: 5,
  },
};

export const YaklasanOdeme: Story = {
  args: {
    icon: <Music />,
    tone: "success",
    name: "Spotify Aile",
    amount: 109.99,
    period: "monthly",
    nextPaymentDate: "21 Tem",
    daysLeft: 2,
  },
};

export const YillikPlan: Story = {
  args: {
    icon: <Sparkles />,
    tone: "primary",
    name: "GlowScan Pro",
    amount: 1499,
    period: "yearly",
    nextPaymentDate: "3 Şub 2027",
    daysLeft: 198,
  },
};

export const DuraklatildiVeGeciken: Story = {
  render: () => (
    <div className="max-w-md space-y-3">
      <RecurringBillItem
        icon={<Dumbbell />}
        tone="warning"
        name="MacFit Üyelik"
        amount={649}
        period="monthly"
        nextPaymentDate="1 Ağu"
        status="paused"
      />
      <RecurringBillItem
        icon={<Wifi />}
        tone="info"
        name="Turkcell Superonline"
        amount={499.9}
        period="monthly"
        nextPaymentDate="16 Tem"
        daysLeft={-3}
      />
    </div>
  ),
};

export const DuzenliOdemelerListesi: Story = {
  render: () => (
    <RecurringBillItemGroup className="max-w-md">
      <RecurringBillItem
        icon={<Tv />}
        tone="destructive"
        name="Netflix Premium"
        amount={229.99}
        period="monthly"
        nextPaymentDate="24 Tem"
        daysLeft={5}
      />
      <RecurringBillItem
        icon={<Music />}
        tone="success"
        name="Spotify Aile"
        amount={109.99}
        period="monthly"
        nextPaymentDate="21 Tem"
        daysLeft={2}
      />
      <RecurringBillItem
        icon={<Zap />}
        tone="warning"
        name="Enerjisa Elektrik"
        amount={842.5}
        period="monthly"
        nextPaymentDate="19 Tem"
        daysLeft={0}
      />
      <RecurringBillItem
        icon="☁️"
        tone="info"
        name="iCloud+ 200 GB"
        amount={49.99}
        period="monthly"
        nextPaymentDate="28 Tem"
        daysLeft={9}
      />
      <RecurringBillItem
        icon={<Sparkles />}
        tone="primary"
        name="GlowScan Pro"
        amount={1499}
        period="yearly"
        nextPaymentDate="3 Şub 2027"
        status="paused"
      />
    </RecurringBillItemGroup>
  ),
};
