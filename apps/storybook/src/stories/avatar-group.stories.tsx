import type { Meta, StoryObj } from "@storybook/react-vite";

import { AvatarGroup } from "@ds/ui";

const meta: Meta<typeof AvatarGroup> = {
  title: "Composites/AvatarGroup",
  component: AvatarGroup,
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

const ekip = [
  { initials: "OK", label: "Ozan Küçük" },
  { initials: "ES", label: "Elif Sarıkaya" },
  { initials: "MA", label: "Mert Aydın" },
  { initials: "ZT", label: "Zeynep Tekin" },
  { initials: "BC", label: "Burak Çetin" },
  { initials: "DY", label: "Deniz Yılmaz" },
  { initials: "AK", label: "Aslı Kaya" },
];

export const DeployEkibi: Story = {
  args: {
    items: ekip,
    max: 4,
  },
};

export const TumUyelerGorunur: Story = {
  args: {
    items: ekip.slice(0, 3),
  },
};

export const KucukBoy: Story = {
  args: {
    items: ekip,
    max: 5,
    size: "sm",
  },
};
