import type { Meta, StoryObj } from "@storybook/react";

import { Button, Grid, PlanCard } from "@ds/ui";

const meta: Meta<typeof PlanCard> = {
  title: "Composites/PlanCard",
  component: PlanCard,
};

export default meta;
type Story = StoryObj<typeof PlanCard>;

export const Baslangic: Story = {
  args: {
    name: "Başlangıç",
    price: "₺0",
    period: "/ay",
    description: "Cilt analizine ilk adım. Bireysel kullanım için ücretsiz.",
    features: [
      "Ayda 3 cilt analizi",
      "Temel nem ve elastikiyet skoru",
      "7 günlük geçmiş",
    ],
    action: (
      <Button variant="outline" className="w-full">
        Ücretsiz Başla
      </Button>
    ),
  },
};

export const ProOneCikan: Story = {
  args: {
    name: "Pro",
    price: "₺149",
    period: "/ay",
    description: "Düzenli takip için sınırsız analiz ve kişisel öneriler.",
    features: [
      "Sınırsız cilt analizi",
      "10 metrikte detaylı skor",
      "Kişiselleştirilmiş bakım rutini",
      "Sınırsız geçmiş ve karşılaştırma",
    ],
    highlighted: true,
    highlightLabel: "En Popüler",
    action: <Button className="w-full">Pro'ya Geç</Button>,
  },
};

export const UcluGrid: Story = {
  render: () => (
    <Grid cols={{ base: 1, md: 3 }} gap="lg" className="max-w-4xl items-stretch">
      <PlanCard
        name="Başlangıç"
        price="₺0"
        period="/ay"
        description="Cilt analizine ilk adım. Bireysel kullanım için ücretsiz."
        features={[
          "Ayda 3 cilt analizi",
          "Temel nem ve elastikiyet skoru",
          "7 günlük geçmiş",
        ]}
        current
        action={
          <Button variant="outline" className="w-full">
            Mevcut Plan
          </Button>
        }
      />
      <PlanCard
        name="Pro"
        price="₺149"
        period="/ay"
        description="Düzenli takip için sınırsız analiz ve kişisel öneriler."
        features={[
          "Sınırsız cilt analizi",
          "10 metrikte detaylı skor",
          "Kişiselleştirilmiş bakım rutini",
          "Sınırsız geçmiş ve karşılaştırma",
        ]}
        highlighted
        highlightLabel="En Popüler"
        action={<Button className="w-full">Pro'ya Geç</Button>}
      />
      <PlanCard
        name="Salon"
        price="₺499"
        period="/ay"
        description="Güzellik salonları için çoklu müşteri yönetimi."
        features={[
          "Pro'daki her şey",
          "50 müşteri profili",
          "Müşteri raporu dışa aktarma",
          "Öncelikli destek",
        ]}
        action={
          <Button variant="outline" className="w-full">
            Satışla Görüş
          </Button>
        }
      />
    </Grid>
  ),
};
