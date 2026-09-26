import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/ProgressBar", component: ProgressBar, ...nativeMeta, args: { value: 45, label: "Yükleniyor", showValue: true } } satisfies Meta<typeof ProgressBar>;
export default meta;
export const Varsayilan: StoryObj<typeof meta> = {};
