import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCard, Receipt, Shirt, User } from "lucide-react";

import { ListGroup, ListRow } from "@ds/ui";

const meta: Meta<typeof ListRow> = {
  title: "Composites/ListRow",
  component: ListRow,
};

export default meta;
type Story = StoryObj<typeof ListRow>;

export const TekSatir: Story = {
  args: {
    leading: <Receipt className="size-5" />,
    title: "Migros market fişi",
    subtitle: "14 Temmuz 2026 · Market",
    meta: "₺342,80",
    onClick: () => {},
  },
};

export const FisListesi: Story = {
  render: () => (
    <ListGroup className="max-w-md">
      <ListRow
        leading={<Receipt className="size-5" />}
        title="Migros market fişi"
        subtitle="Market · 14 Temmuz"
        meta="₺342,80"
        onClick={() => {}}
      />
      <ListRow
        leading={<Receipt className="size-5" />}
        title="Shell akaryakıt"
        subtitle="Ulaşım · 13 Temmuz"
        meta="₺1.250,00"
        onClick={() => {}}
      />
      <ListRow
        leading={<Receipt className="size-5" />}
        title="Kahve Dünyası"
        subtitle="Yemek · 12 Temmuz"
        meta="₺186,50"
        onClick={() => {}}
      />
    </ListGroup>
  ),
};

export const AyarlarListesi: Story = {
  render: () => (
    <ListGroup className="max-w-md">
      <ListRow
        leading={<User className="size-5" />}
        title="Profil bilgileri"
        subtitle="Ad, e-posta ve telefon"
        onClick={() => {}}
      />
      <ListRow
        leading={<CreditCard className="size-5" />}
        title="Abonelik"
        subtitle="Fisly Pro — yıllık plan"
        meta="Aktif"
        onClick={() => {}}
      />
      <ListRow
        leading={<Shirt className="size-5" />}
        title="Gardırop tercihleri"
        subtitle="Stil ve beden bilgileri"
        onClick={() => {}}
      />
    </ListGroup>
  ),
};

export const TiklanamazSatir: Story = {
  args: {
    title: "Toplam gider",
    meta: "₺12.480",
  },
};
