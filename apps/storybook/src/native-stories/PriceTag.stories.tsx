import type { Meta, StoryObj } from "@storybook/react-vite";
import { PriceTag } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/PriceTag", component: PriceTag, ...nativeMeta, args: { price: 450, originalPrice: 600, size: "lg" } } satisfies Meta<typeof PriceTag>;
export default meta;
export const Varsayilan: StoryObj<typeof meta> = {};
