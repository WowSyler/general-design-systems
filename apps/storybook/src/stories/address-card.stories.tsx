import type { Meta, StoryObj } from "@storybook/react-vite";

import { AddressCard } from "@wowsyler/ds-ui";

const meta: Meta<typeof AddressCard> = {
  title: "Composites/AddressCard",
  component: AddressCard,
};

export default meta;
type Story = StoryObj<typeof AddressCard>;

export const EvAdresi: Story = {
  args: {
    type: "home",
    recipient: "Elif Şahin",
    phone: "+90 532 418 27 60",
    address:
      "Bağdat Caddesi No:142 D:5, Caddebostan Mahallesi, 34728 Kadıköy / İstanbul",
    isDefault: true,
    onEdit: () => {},
    onDelete: () => {},
    className: "max-w-md",
  },
};

export const IsAdresi: Story = {
  args: {
    type: "work",
    typeLabel: "Ofis",
    recipient: "Burak Demirtaş",
    phone: "+90 216 555 09 12",
    address:
      "Kozyatağı, Değirmen Sokak No:18 Kat:4, Ariva Plaza, 34742 Kadıköy / İstanbul",
    onEdit: () => {},
    onDelete: () => {},
    className: "max-w-md",
  },
};

export const KayitliAdresler: Story = {
  render: () => (
    <div
      role="radiogroup"
      aria-label="Teslimat adresi seçin"
      className="flex max-w-md flex-col gap-3"
    >
      <AddressCard
        type="home"
        recipient="Elif Şahin"
        phone="+90 532 418 27 60"
        address="Bağdat Caddesi No:142 D:5, Caddebostan, 34728 Kadıköy / İstanbul"
        isDefault
        selected
        onSelect={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />
      <AddressCard
        type="work"
        typeLabel="Ofis"
        recipient="Elif Şahin"
        phone="+90 216 555 09 12"
        address="Kozyatağı, Değirmen Sokak No:18 Kat:4, 34742 Kadıköy / İstanbul"
        onSelect={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />
      <AddressCard
        type="other"
        typeLabel="Annemin Evi"
        recipient="Ayşe Şahin"
        phone="+90 535 271 84 39"
        address="Cumhuriyet Mahallesi, Lale Sokak No:7, 16110 Nilüfer / Bursa"
        onSelect={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </div>
  ),
};

export const Yukleniyor: Story = {
  args: {
    recipient: "Adres yükleniyor",
    address: "",
    loading: true,
    className: "max-w-md",
  },
};
