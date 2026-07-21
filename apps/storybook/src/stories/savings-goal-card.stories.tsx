import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plane, Smartphone } from "lucide-react";

import { Button, SavingsGoalCard } from "@ds/ui";

const meta: Meta<typeof SavingsGoalCard> = {
  title: "Composites/SavingsGoalCard",
  component: SavingsGoalCard,
};

export default meta;
type Story = StoryObj<typeof SavingsGoalCard>;

export const YazTatili: Story = {
  args: {
    name: "Yaz Tatili",
    icon: "🏖️",
    saved: 8400,
    target: 15000,
    description: "Fisly · Aylık ₺1.500 birikim",
    estimatedDate: "Eylül 2026",
  },
};

export const CubukGorunum: Story = {
  args: {
    name: "Yeni Telefon",
    icon: <Smartphone className="size-5" />,
    saved: 6200,
    target: 32000,
    variant: "bar",
    tone: "warning",
    description: "Fisly · Otomatik yuvarlama açık",
    estimatedDate: "Mart 2027",
  },
};

export const HedefeUlasildi: Story = {
  args: {
    name: "Acil Durum Fonu",
    icon: "🛟",
    saved: 25000,
    target: 25000,
    description: "Fisly · 3 aylık gider karşılığı",
    estimatedDate: "Tamamlandı",
  },
};

export const HedefListesi: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
      <SavingsGoalCard
        name="Yaz Tatili"
        icon="🏖️"
        saved={8400}
        target={15000}
        description="Fisly · Aylık ₺1.500 birikim"
        estimatedDate="Eylül 2026"
      />
      <SavingsGoalCard
        name="Uçak Bileti"
        icon={<Plane className="size-5" />}
        saved={3100}
        target={9000}
        variant="bar"
        description="Fisly · Kapadokya gezisi"
        estimatedDate="Kasım 2026"
        action={
          <Button variant="outline" size="sm" className="w-full">
            Hedefi düzenle
          </Button>
        }
      />
    </div>
  ),
};
