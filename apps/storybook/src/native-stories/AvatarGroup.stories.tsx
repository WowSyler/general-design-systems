import type { Meta, StoryObj } from "@storybook/react-vite";
import { AvatarGroup } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = {
  title: "Native/AvatarGroup",
  component: AvatarGroup,
  ...nativeMeta,
  args: { items: [{ name: "Ali Veli" }, { name: "Ayşe Kaya" }, { name: "Can Er" }, { name: "Deniz Su" }, { name: "Ece Tan" }], max: 3, size: "lg" },
} satisfies Meta<typeof AvatarGroup>;
export default meta;
export const Varsayilan: StoryObj<typeof meta> = {};
