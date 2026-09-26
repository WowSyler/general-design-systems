import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Spinner", component: Spinner, ...nativeMeta, args: { size: "large", label: "Yükleniyor…" } } satisfies Meta<typeof Spinner>;
export default meta;
export const Varsayilan: StoryObj<typeof meta> = {};
