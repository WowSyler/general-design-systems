import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { PaymentMethodCard, PaymentMethodCardAdd } from "@wowsyler/ds-ui";

type Brand = React.ComponentProps<typeof PaymentMethodCard>["brand"];

const meta: Meta<typeof PaymentMethodCard> = {
  title: "Commerce/PaymentMethodCard",
  component: PaymentMethodCard,
};

export default meta;
type Story = StoryObj<typeof PaymentMethodCard>;

export const Varsayilan: Story = {
  args: {
    brand: "visa",
    last4: "4242",
    expiry: "08/27",
    holder: "Ozan Küçük",
    isDefault: true,
    onEdit: () => console.log("Kart düzenleniyor"),
    onRemove: () => console.log("Kart siliniyor"),
    className: "max-w-md",
  },
};

type Kart = {
  id: string;
  brand: Brand;
  last4: string;
  expiry: string;
  holder: string;
};

const kartlar: Kart[] = [
  { id: "1", brand: "visa", last4: "4242", expiry: "08/27", holder: "Ozan Küçük" },
  { id: "2", brand: "mastercard", last4: "5588", expiry: "11/26", holder: "Ozan Küçük" },
  { id: "3", brand: "troy", last4: "9012", expiry: "03/29", holder: "Ozan Küçük" },
];

function OdemeYontemleri() {
  const [seciliId, setSeciliId] = React.useState("1");
  return (
    <div
      role="radiogroup"
      aria-label="Kayıtlı ödeme yöntemleri"
      className="flex w-full max-w-md flex-col gap-3"
    >
      <p className="text-sm font-medium text-foreground">
        Fisly aboneliğin için ödeme yöntemini seç
      </p>
      {kartlar.map((kart) => (
        <PaymentMethodCard
          key={kart.id}
          brand={kart.brand}
          last4={kart.last4}
          expiry={kart.expiry}
          holder={kart.holder}
          isDefault={kart.id === "1"}
          selected={seciliId === kart.id}
          onSelect={() => setSeciliId(kart.id)}
          onEdit={() => console.log(`Kart ${kart.last4} düzenleniyor`)}
          onRemove={() => console.log(`Kart ${kart.last4} siliniyor`)}
        />
      ))}
      <PaymentMethodCardAdd
        label="Yeni kart ekle"
        onClick={() => console.log("Yeni kart ekleme akışı açılıyor")}
      />
    </div>
  );
}

export const SeciliListe: Story = {
  render: () => <OdemeYontemleri />,
};

export const Markalar: Story = {
  render: () => {
    const marka: { brand: Brand; last4: string; expiry: string }[] = [
      { brand: "visa", last4: "4242", expiry: "08/27" },
      { brand: "mastercard", last4: "5588", expiry: "11/26" },
      { brand: "amex", last4: "0005", expiry: "05/28" },
      { brand: "troy", last4: "9012", expiry: "03/29" },
      { brand: "generic", last4: "7777", expiry: "12/25" },
    ];
    return (
      <div className="flex w-full max-w-md flex-col gap-3">
        {marka.map((k) => (
          <PaymentMethodCard
            key={k.last4}
            brand={k.brand}
            last4={k.last4}
            expiry={k.expiry}
          />
        ))}
      </div>
    );
  },
};

export const BosVaryant: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <PaymentMethodCardAdd
        label="Kart ekle"
        onClick={() => console.log("Randevu ödeme kartı ekleniyor")}
      />
    </div>
  ),
};
