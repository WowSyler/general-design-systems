import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  GitCompareArrows,
  History,
  LogOut,
  Rocket,
  Settings,
  SunMoon,
} from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@wowsyler/ds-ui";

const meta: Meta<typeof Command> = {
  title: "Primitives/Command",
  component: Command,
};

export default meta;
type Story = StoryObj<typeof Command>;

const PaletteBody = () => (
  <>
    <CommandInput placeholder="Komut ara veya yaz..." />
    <CommandList>
      <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
      <CommandGroup heading="Karşılaştırma">
        <CommandItem>
          <GitCompareArrows className="mr-2 size-4" />
          <span>Yeni karşılaştırma başlat</span>
          <CommandShortcut>⌘N</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <Rocket className="mr-2 size-4" />
          <span>Son dağıtımı incele</span>
          <CommandShortcut>⌘D</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <History className="mr-2 size-4" />
          <span>Karşılaştırma geçmişi</span>
          <CommandShortcut>⌘H</CommandShortcut>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Genel">
        <CommandItem>
          <Settings className="mr-2 size-4" />
          <span>Ayarları aç</span>
          <CommandShortcut>⌘,</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <SunMoon className="mr-2 size-4" />
          <span>Temayı değiştir</span>
          <CommandShortcut>⌘T</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <LogOut className="mr-2 size-4" />
          <span>Çıkış yap</span>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </>
);

export const Default: Story = {
  render: () => (
    <Command className="max-w-md rounded-lg border shadow-md">
      <PaletteBody />
    </Command>
  ),
};

export const InDialog: Story = {
  render: () => (
    <CommandDialog defaultOpen>
      <PaletteBody />
    </CommandDialog>
  ),
};
