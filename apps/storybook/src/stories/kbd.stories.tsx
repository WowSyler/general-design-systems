import type { Meta, StoryObj } from "@storybook/react";

import { Kbd, KbdGroup } from "@ds/ui";

const meta: Meta<typeof Kbd> = {
  title: "Primitives/Kbd",
  component: Kbd,
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Varsayilan: Story = {
  render: () => <Kbd>⌘</Kbd>,
};

export const Kombinasyon: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
};

export const DeployLensKisayollari: Story = {
  render: () => (
    <div className="w-72 space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span>Komut paleti</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between">
        <span>Dağıtımı yeniden başlat</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>R</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between">
        <span>Günlükleri aç</span>
        <KbdGroup>
          <Kbd>G</Kbd>
          <Kbd>L</Kbd>
        </KbdGroup>
      </div>
    </div>
  ),
};
