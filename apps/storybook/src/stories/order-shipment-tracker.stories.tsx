import type { Meta, StoryObj } from "@storybook/react-vite";

import { OrderShipmentTracker, type OrderShipmentTrackerStep } from "@wowsyler/ds-ui";

const meta: Meta<typeof OrderShipmentTracker> = {
  title: "Composites/OrderShipmentTracker",
  component: OrderShipmentTracker,
};

export default meta;
type Story = StoryObj<typeof OrderShipmentTracker>;

// Dolap ikinci el moda siparisi — zaman damgali asamalar
const kargoAdimlari: OrderShipmentTrackerStep[] = [
  { label: "Sipariş alındı", description: "14 Temmuz, 09:24" },
  {
    label: "Hazırlanıyor",
    description: "14 Temmuz, 15:10 · Satıcı ürünü paketledi",
  },
  {
    label: "Kargoda",
    description: "15 Temmuz, 08:30 · İstanbul Anadolu Aktarma",
  },
  { label: "Dağıtımda", description: "Kuryeye teslim edilecek" },
  { label: "Teslim edildi", description: "Alıcı adresine bırakılacak" },
];

const tahminiTeslim = new Date(2026, 6, 16).toLocaleDateString("tr-TR", {
  day: "numeric",
  month: "long",
});

export const Kargoda: Story = {
  args: {
    title: "Vintage Levi's denim ceket",
    orderNumber: "#DLP-90427",
    carrier: "Aras Kargo",
    trackingNumber: "AR-4820193756",
    estimatedDelivery: tahminiTeslim,
    steps: kargoAdimlari,
    currentStep: 2,
    orientation: "vertical",
    className: "max-w-md",
  },
};

export const YatayDagitimda: Story = {
  args: {
    title: "El örgüsü yün kazak",
    orderNumber: "#DLP-88015",
    carrier: "Yurtiçi Kargo",
    trackingNumber: "YK-7719044238",
    estimatedDelivery: "bugün",
    steps: kargoAdimlari,
    currentStep: 3,
    orientation: "horizontal",
    className: "max-w-3xl",
  },
};

export const TeslimEdildi: Story = {
  args: {
    title: "Retro deri omuz çantası",
    orderNumber: "#DLP-84190",
    carrier: "MNG Kargo",
    trackingNumber: "MNG-5530871209",
    steps: [
      { label: "Sipariş alındı", description: "10 Temmuz, 11:02" },
      { label: "Hazırlanıyor", description: "10 Temmuz, 18:45" },
      { label: "Kargoda", description: "11 Temmuz, 07:15" },
      { label: "Dağıtımda", description: "12 Temmuz, 09:30" },
      {
        label: "Teslim edildi",
        description: "12 Temmuz, 14:08 · Kapıda teslim alındı",
      },
    ],
    // currentStep adim sayisina esit -> tum asamalar tamamlandi
    currentStep: 5,
    orientation: "vertical",
    className: "max-w-md",
  },
};

export const IptalEdildi: Story = {
  args: {
    title: "Çiçek desenli yazlık elbise",
    orderNumber: "#DLP-91336",
    carrier: "Aras Kargo",
    trackingNumber: "AR-9048112765",
    status: "cancelled",
    steps: kargoAdimlari,
    // "Hazırlanıyor" asamasinda iptal edildi
    currentStep: 1,
    orientation: "vertical",
    className: "max-w-md",
  },
};

export const IadeSurecinde: Story = {
  args: {
    title: "Süet bilekli spor ayakkabı",
    orderNumber: "#DLP-87702",
    carrier: "Yurtiçi Kargo",
    trackingNumber: "YK-3312890456",
    status: "returned",
    statusMessage:
      "Beden uyuşmazlığı nedeniyle iade başlattınız. Ürün satıcıya ulaştığında iadeniz onaylanacak.",
    steps: [
      { label: "İade talebi", description: "18 Temmuz, 10:12" },
      { label: "İade onaylandı", description: "18 Temmuz, 16:40" },
      { label: "İade kargoda", description: "Satıcıya gönderiliyor" },
      { label: "İade tamamlandı", description: "Ödeme iadesi yapılacak" },
    ],
    currentStep: 2,
    orientation: "vertical",
    className: "max-w-md",
  },
};
