import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordInput } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/PasswordInput", component: PasswordInput, ...nativeMeta, args: { label: "Yeni parola", isNew: true, defaultValue: "gizli-parola", strength: 3 } } satisfies Meta<typeof PasswordInput>;
export default meta;
export const Varsayilan: StoryObj<typeof meta> = {};
