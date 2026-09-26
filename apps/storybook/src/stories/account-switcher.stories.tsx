import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { AccountSwitcher } from "@wowsyler/ds-ui";

type Account = React.ComponentProps<typeof AccountSwitcher>["accounts"][number];

const meta: Meta<typeof AccountSwitcher> = {
  title: "Composites/AccountSwitcher",
  component: AccountSwitcher,
};

export default meta;
type Story = StoryObj<typeof AccountSwitcher>;

// Dolap — satıcının yönettiği çoklu mağaza
const magazalar: Account[] = [
  {
    id: "vintage-kosem",
    name: "Vintage Köşem",
    description: "248 ürün · Kadın giyim",
    role: "Yönetici",
    initials: "VK",
  },
  {
    id: "retro-dolap",
    name: "Retro Dolap",
    description: "132 ürün · İkinci el",
    role: "Yönetici",
    initials: "RD",
  },
  {
    id: "mini-moda",
    name: "Mini Moda Butik",
    description: "64 ürün · Çocuk",
    role: "Editör",
    initials: "MM",
  },
];

// DeployLens — kullanıcının üye olduğu organizasyonlar
const organizasyonlar: Account[] = [
  {
    id: "acme-prod",
    name: "Acme Yazılım",
    description: "acme.deploylens.io · 12 üye",
    role: "Sahip",
    initials: "AY",
  },
  {
    id: "nova-labs",
    name: "Nova Labs",
    description: "nova-labs.deploylens.io · 5 üye",
    role: "Geliştirici",
    initials: "NL",
  },
  {
    id: "kisisel",
    name: "Kişisel Alan",
    description: "Yalnızca siz",
    role: "Sahip",
    initials: "KA",
  },
];

export const DolapMagazalari: Story = {
  render: () => {
    const [aktif, setAktif] = React.useState("vintage-kosem");
    return (
      <div className="w-72 max-w-full">
        <AccountSwitcher
          accounts={magazalar}
          value={aktif}
          onValueChange={setAktif}
          heading="Mağazalarım"
          searchPlaceholder="Mağaza ara…"
          emptyMessage="Mağaza bulunamadı."
          addAccountLabel="Yeni mağaza aç"
          onAddAccount={() => console.log("Yeni mağaza")}
        />
      </div>
    );
  },
};

export const DeployLensOrganizasyon: Story = {
  render: () => {
    const [aktif, setAktif] = React.useState("acme-prod");
    return (
      <div className="w-80 max-w-full">
        <AccountSwitcher
          accounts={organizasyonlar}
          value={aktif}
          onValueChange={setAktif}
          heading="Organizasyonlar"
          searchPlaceholder="Organizasyon ara…"
          emptyMessage="Organizasyon bulunamadı."
          addAccountLabel="Yeni organizasyon oluştur"
          onAddAccount={() => console.log("Yeni organizasyon")}
        />
      </div>
    );
  },
};

export const AcikListe: Story = {
  render: () => (
    <div className="flex h-96 w-72 max-w-full flex-col">
      <AccountSwitcher
        defaultOpen
        accounts={magazalar}
        defaultValue="retro-dolap"
        heading="Mağazalarım"
        addAccountLabel="Yeni mağaza aç"
        onAddAccount={() => console.log("Yeni mağaza")}
      />
    </div>
  ),
};
