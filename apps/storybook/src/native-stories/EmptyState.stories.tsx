import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, EmptyState, Text } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = {
  title: "Native/EmptyState",
  component: EmptyState,
  ...nativeMeta,
  args: {
    title: "Henüz fiş yok",
    description: "İlk fişini tarayarak harcamalarını takip etmeye başla.",
    icon: <Text style={{ fontSize: 24 }}>🧾</Text>,
    action: <Button title="Fiş tara" />,
  },
} satisfies Meta<typeof EmptyState>;
export default meta;
export const Varsayilan: StoryObj<typeof meta> = {};
