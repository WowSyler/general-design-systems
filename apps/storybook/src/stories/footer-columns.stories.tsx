import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShoppingBag } from "lucide-react";

import { FooterColumns } from "@wowsyler/ds-ui";

const meta: Meta<typeof FooterColumns> = {
  title: "Marketing/FooterColumns",
  component: FooterColumns,
};

export default meta;
type Story = StoryObj<typeof FooterColumns>;

export const Varsayilan: Story = {
  args: {
    logo: (
      <span className="flex items-center gap-2 text-base font-bold">
        <ShoppingBag className="size-5 text-primary" aria-hidden="true" />
        Dolap
      </span>
    ),
    description:
      "İkinci el modanın adresi. Giymediğini sat, beğendiğini uygun fiyata al.",
    columns: [
      {
        title: "Alışveriş",
        links: [
          { label: "Kadın", href: "#" },
          { label: "Erkek", href: "#" },
          { label: "Çocuk", href: "#" },
          { label: "Ayakkabı & Çanta", href: "#" },
        ],
      },
      {
        title: "Satış",
        links: [
          { label: "İlan Ver", href: "#" },
          { label: "Kargo Süreci", href: "#" },
          { label: "Komisyon Oranları", href: "#" },
        ],
      },
      {
        title: "Destek",
        links: [
          { label: "Yardım Merkezi", href: "#" },
          { label: "Güvenli Alışveriş", href: "#" },
          { label: "İade Koşulları", href: "#" },
          { label: "İletişim", href: "#" },
        ],
      },
    ],
    bottom: (
      <>
        <span>© 2026 Dolap. Tüm hakları saklıdır.</span>
        <span>Gizlilik · Kullanım Koşulları · Çerezler</span>
      </>
    ),
  },
};

export const SadeKolonlar: Story = {
  args: {
    columns: [
      {
        title: "Kategoriler",
        links: [
          { label: "Gömlek", href: "#" },
          { label: "Elbise", href: "#" },
          { label: "Sneaker", href: "#" },
        ],
      },
      {
        title: "Kurumsal",
        links: [
          { label: "Hakkımızda", href: "#" },
          { label: "Kariyer", href: "#" },
        ],
      },
    ],
  },
};
