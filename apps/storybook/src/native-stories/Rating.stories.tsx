import type { Meta, StoryObj } from "@storybook/react-vite";
import { Rating } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Rating", component: Rating, ...nativeMeta, args: { value: 4.5, count: 128, showValue: true } } satisfies Meta<typeof Rating>;
export default meta;
export const Varsayilan: StoryObj<typeof meta> = {};
