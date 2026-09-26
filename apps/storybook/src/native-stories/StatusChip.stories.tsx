import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusChip } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/StatusChip", component: StatusChip, ...nativeMeta, args: { label: "Senkronize ediliyor", tone: "pending", pulse: true } } satisfies Meta<typeof StatusChip>;
export default meta;
export const Varsayilan: StoryObj<typeof meta> = {};
