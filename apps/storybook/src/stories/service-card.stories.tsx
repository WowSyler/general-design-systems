import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Scissors, Sparkles } from "lucide-react";

import { Button, ServiceCard } from "@ds/ui";

const meta: Meta<typeof ServiceCard> = {
  title: "Commerce/ServiceCard",
  component: ServiceCard,
};

export default meta;
type Story = StoryObj<typeof ServiceCard>;

export const SacKesimi: Story = {
  args: {
    title: "Saç Kesimi & Şekillendirme",
    description:
      "Uzman kuaförle yıkama, kesim ve fön dahil kişiye özel şekillendirme.",
    durationMinutes: 45,
    price: 450,
    priceFrom: true,
    icon: <Scissors aria-hidden="true" />,
    badge: "Popüler",
    className: "max-w-xl",
  },
};

export const CiltBakimi: Story = {
  args: {
    title: "Derinlemesine Cilt Bakımı",
    description:
      "Cilt analizi, peeling ve nemlendirme adımlarıyla 60 dakikalık yenileyici bakım seansı.",
    durationMinutes: 60,
    price: 780,
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&q=80",
    imageAlt: "Cilt bakımı uygulanan bir müşteri",
    badge: "Kampanya",
    className: "max-w-xl",
  },
};

export const DoluSeans: Story = {
  args: {
    title: "İsveç Masajı — 90 Dakika",
    description:
      "Tam vücut rahatlama masajı. Bu seans için bugünkü kontenjan doldu.",
    durationMinutes: 90,
    price: 1200,
    icon: <Sparkles aria-hidden="true" />,
    action: (
      <Button variant="outline" size="sm" className="w-full sm:w-auto">
        <Bell aria-hidden="true" />
        Bekleme Listesi
      </Button>
    ),
    className: "max-w-xl",
  },
};
