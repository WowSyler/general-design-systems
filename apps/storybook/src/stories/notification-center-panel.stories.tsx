import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  MessageSquare,
  Rocket,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

import { NotificationCenterPanel } from "@ds/ui";

type PanelItem = React.ComponentProps<typeof NotificationCenterPanel>["items"][number];

const meta: Meta<typeof NotificationCenterPanel> = {
  title: "Composites/NotificationCenterPanel",
  component: NotificationCenterPanel,
};

export default meta;
type Story = StoryObj<typeof NotificationCenterPanel>;

const deployLensItems: PanelItem[] = [
  {
    id: "1",
    icon: <CheckCircle2 />,
    tone: "success",
    title: "Üretim dağıtımı başarılı",
    description: "web-frontend v2.14.0 üç bölgeye 42 saniyede yayıldı.",
    time: "3 dk",
    unread: true,
    group: "today",
    action: { label: "Dağıtımı görüntüle" },
  },
  {
    id: "2",
    icon: <AlertTriangle />,
    tone: "warning",
    title: "Hata oranı eşiği aşıldı",
    description: "api-gateway son 5 dakikada %2,3 hata oranına ulaştı.",
    time: "18 dk",
    unread: true,
    group: "today",
    action: { label: "Uyarıyı incele" },
  },
  {
    id: "3",
    icon: <Rocket />,
    tone: "primary",
    title: "Önizleme ortamı hazır",
    description: "#482 numaralı PR için önizleme bağlantısı oluşturuldu.",
    time: "1 sa",
    unread: true,
    group: "today",
  },
  {
    id: "4",
    icon: <MessageSquare />,
    tone: "info",
    title: "Yeni yorum: dağıtım kuralları",
    description: "Elif Demir bir kural değişikliği önerdi.",
    time: "2 g",
    group: "week",
  },
  {
    id: "5",
    icon: <CalendarClock />,
    tone: "default",
    title: "Haftalık kullanım raporu",
    description: "Geçen haftaya göre derleme süresi %12 kısaldı.",
    time: "9 g",
    group: "older",
  },
];

export const DeployLensBildirimleri: Story = {
  render: () => (
    <NotificationCenterPanel
      items={deployLensItems}
      onMarkAllRead={() => {}}
      onItemClick={() => {}}
    />
  ),
};

const fislyItems: PanelItem[] = [
  {
    id: "1",
    icon: <AlertTriangle />,
    tone: "destructive",
    title: "Bütçe aşımı: Yeme-İçme",
    description: "Temmuz ayında 3.500 ₺ bütçenin %108'ine ulaştınız.",
    time: "12 dk",
    unread: true,
    group: "today",
    action: { label: "Bütçeyi düzenle" },
  },
  {
    id: "2",
    icon: <ShoppingBag />,
    tone: "info",
    title: "Yeni işlem eklendi",
    description: "Migros — 428,90 ₺ market harcaması kaydedildi.",
    time: "40 dk",
    unread: true,
    group: "today",
  },
  {
    id: "3",
    icon: <Star />,
    tone: "warning",
    title: "Abonelik yenileniyor",
    description: "Spotify Premium yarın 59,99 ₺ olarak yenilenecek.",
    time: "3 g",
    unread: true,
    group: "week",
  },
];

export const FislyOkunmamis: Story = {
  render: () => (
    <NotificationCenterPanel
      items={fislyItems}
      title="Fisly bildirimleri"
      defaultTab="unread"
      onMarkAllRead={() => {}}
      onItemClick={() => {}}
    />
  ),
};

const glowScanItems: PanelItem[] = [
  {
    id: "1",
    icon: <Sparkles />,
    tone: "primary",
    title: "Cilt analiziniz hazır",
    description: "Nem seviyesi geçen aya göre %15 iyileşti.",
    time: "5 g",
    group: "week",
    action: { label: "Sonuçları gör" },
  },
  {
    id: "2",
    icon: <CheckCircle2 />,
    tone: "success",
    title: "Rutin tamamlandı",
    description: "Akşam bakım rutininizi 21 gün üst üste sürdürdünüz.",
    time: "6 g",
    group: "week",
  },
  {
    id: "3",
    icon: <CalendarClock />,
    tone: "default",
    title: "Ürün son kullanım hatırlatması",
    description: "C vitamini serumunuzun kullanım süresi yakında doluyor.",
    time: "3 hf",
    group: "older",
  },
];

export const GlowScanTumuOkundu: Story = {
  render: () => (
    <NotificationCenterPanel
      items={glowScanItems}
      title="GlowScan"
      onItemClick={() => {}}
    />
  ),
};
