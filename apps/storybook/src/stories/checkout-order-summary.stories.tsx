import type { Meta, StoryObj } from "@storybook/react-vite";

import { CheckoutOrderSummary } from "@wowsyler/ds-ui";

const meta: Meta<typeof CheckoutOrderSummary> = {
  title: "Commerce/CheckoutOrderSummary",
  component: CheckoutOrderSummary,
};

export default meta;
type Story = StoryObj<typeof CheckoutOrderSummary>;

export const DolapSepeti: Story = {
  render: () => (
    <CheckoutOrderSummary
      title="Sipariş Özeti"
      items={[
        {
          id: "gomlek",
          name: "Mavi Oxford Gömlek",
          note: "M Beden · Mavi",
          quantity: 1,
          unitPrice: 450,
        },
        {
          id: "sneaker",
          name: "Beyaz Deri Sneaker",
          note: "42 Numara",
          quantity: 1,
          unitPrice: 780,
        },
        {
          id: "corap",
          name: "Pamuklu Çorap Seti",
          note: "3'lü paket",
          quantity: 2,
          unitPrice: 90,
        },
      ]}
      shipping={49.9}
      discount={120}
      couponCode="DOLAP20"
      taxRate={10}
      onCheckout={() => console.log("Dolap ödemesine geçildi")}
    />
  ),
};

export const RandevuOnOdeme: Story = {
  render: () => (
    <CheckoutOrderSummary
      title="Ön Ödeme Özeti"
      items={[
        {
          id: "sac",
          name: "Saç Kesim & Fön",
          note: "14 Temmuz Pzt · 14:30",
          unitPrice: 350,
        },
        {
          id: "sakal",
          name: "Sakal Şekillendirme",
          note: "Ek işlem",
          unitPrice: 150,
        },
      ]}
      shipping={0}
      taxAmount={0}
      totalNote="Kalan tutar salonda tahsil edilir"
      ctaLabel="Ön ödemeyi tamamla"
      footnote="iyzico ile güvenli ödeme"
      onCheckout={() => console.log("Randevu ön ödemesi alındı")}
    />
  ),
};

export const KuponsuzSade: Story = {
  render: () => (
    <CheckoutOrderSummary
      items={[
        {
          id: "elbise",
          name: "Çiçekli Yazlık Elbise",
          note: "S Beden",
          unitPrice: 640,
        },
      ]}
      shipping={0}
      taxRate={10}
      onCheckout={() => console.log("Ödemeye geçildi")}
    />
  ),
};
