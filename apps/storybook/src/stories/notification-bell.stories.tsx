import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CalendarCheck,
  CreditCard,
  Rocket,
  ShieldAlert,
  Star,
  Truck,
} from "lucide-react";

import { NotificationBell } from "@ds/ui";

type NotificationBellItem = React.ComponentProps<
  typeof NotificationBell
>["items"];

const meta: Meta<typeof NotificationBell> = {
  title: "Composites/NotificationBell",
  component: NotificationBell,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof NotificationBell>;

const deployLensItems: NotificationBellItem = [
  {
    id: "1",
    icon: <Rocket className="size-4" />,
    title: "Üretim dağıtımı tamamlandı",
    description: "api-gateway v2.8.0 canlıya alındı — 0 hata, 1.2 sn ortalama.",
    time: "3 dk",
    unread: true,
  },
  {
    id: "2",
    icon: <ShieldAlert className="size-4" />,
    title: "Güvenlik uyarısı",
    description: "staging ortamında 2 kritik bağımlılık açığı bulundu.",
    time: "27 dk",
    unread: true,
  },
  {
    id: "3",
    icon: <CalendarCheck className="size-4" />,
    title: "Haftalık rapor hazır",
    description: "Bu hafta 42 dağıtımın %98'i sorunsuz tamamlandı.",
    time: "2 sa",
  },
];

export const DeployLensBildirimleri: Story = {
  args: {
    unreadCount: 2,
    items: deployLensItems,
    heading: "Bildirimler",
    actionLabel: "Tümünü okundu işaretle",
  },
};

export const FislyNokta: Story = {
  name: "Fisly — nokta rozet",
  args: {
    unreadCount: 1,
    badgeVariant: "dot",
    items: [
      {
        id: "1",
        icon: <CreditCard className="size-4" />,
        title: "Yeni harcama eklendi",
        description: "Migros — ₺348,90 market alışverişi kategorilendirildi.",
        time: "Şimdi",
        unread: true,
      },
      {
        id: "2",
        icon: <Star className="size-4" />,
        title: "Aylık bütçe hedefi",
        description: "Temmuz gıda bütçenizin %80'ine ulaştınız.",
        time: "1 g",
      },
    ],
  },
};

export const CokSayida: Story = {
  name: "99+ sayaç",
  args: {
    unreadCount: 128,
    heading: "Bildirimler",
    actionLabel: "Tümünü okundu işaretle",
    items: [
      {
        id: "1",
        icon: <Truck className="size-4" />,
        title: "Kargon yola çıktı",
        description: "Dolap siparişin #48213 kargoya teslim edildi.",
        time: "8 dk",
        unread: true,
      },
      {
        id: "2",
        icon: <Star className="size-4" />,
        title: "Ürününe yorum geldi",
        description: "Vintage deri ceket ilanına 5 yıldız verildi.",
        time: "45 dk",
        unread: true,
      },
    ],
  },
};

export const BosDurum: Story = {
  name: "Boş durum",
  args: {
    unreadCount: 0,
    items: [],
    emptyLabel: "Yeni bildirim yok",
  },
};
