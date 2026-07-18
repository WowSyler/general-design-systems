import type { Meta, StoryObj } from "@storybook/react";
import {
  GitCompareArrows,
  Rocket,
  History,
  Settings,
  SunMoon,
  LogOut,
  Shirt,
  LayoutGrid,
  Heart,
  Plus,
} from "lucide-react";

import { CommandPalette } from "@ds/ui";

const meta: Meta<typeof CommandPalette> = {
  title: "Iconic/CommandPalette",
  component: CommandPalette,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

/** DeployLens dağıtım aracının komut paleti. */
export const DeployLensPalet: Story = {
  render: () => (
    <CommandPalette
      placeholder="Komut ara veya yaz..."
      groups={[
        {
          heading: "Karşılaştırmalar",
          items: [
            {
              icon: <GitCompareArrows />,
              label: "Yeni karşılaştırma başlat",
              shortcut: "⌘ N",
            },
            {
              icon: <Rocket />,
              label: "Son dağıtımı incele",
              shortcut: "⌘ D",
            },
            {
              icon: <History />,
              label: "Karşılaştırma geçmişi",
              shortcut: "⌘ H",
            },
          ],
        },
        {
          heading: "Ayarlar",
          items: [
            { icon: <Settings />, label: "Proje ayarlarını aç", shortcut: "⌘ ," },
            { icon: <SunMoon />, label: "Temayı değiştir", shortcut: "⌘ T" },
            { icon: <LogOut />, label: "Çıkış yap" },
          ],
        },
      ]}
    />
  ),
};

/** Dolap gardırop uygulamasının komut paleti. */
export const DolapPalet: Story = {
  render: () => (
    <CommandPalette
      placeholder="Kıyafet, kombin veya komut ara..."
      groups={[
        {
          heading: "Hızlı Eylemler",
          items: [
            { icon: <Plus />, label: "Yeni kıyafet ekle", shortcut: "⌘ E" },
            { icon: <LayoutGrid />, label: "Kombin oluştur", shortcut: "⌘ K" },
          ],
        },
        {
          heading: "Gezinme",
          items: [
            { icon: <Shirt />, label: "Dolabıma git" },
            { icon: <Heart />, label: "Favorileri aç", shortcut: "⌘ F" },
          ],
        },
      ]}
    />
  ),
};
