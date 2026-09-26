import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScoreBadge } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/ScoreBadge", component: ScoreBadge, ...nativeMeta, args: { value: 8.6 } } satisfies Meta<typeof ScoreBadge>;
export default meta;
export const Varsayilan: StoryObj<typeof meta> = {};
