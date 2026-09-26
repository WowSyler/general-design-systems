import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomNav } from "@wowsyler/ds-ui-native";

import { NAV_ITEMS } from "./_support/navItems";

import { nativeMeta } from "./_support/meta";


const meta = { title: "Native/BottomNav", component: BottomNav, ...nativeMeta, args: { items: NAV_ITEMS, value: "home", onValueChange: () => undefined } } satisfies Meta<typeof BottomNav>;
export default meta;

export const Etkilesimli: StoryObj<typeof meta> = {
  render: (args) => {
    const [v, setV] = React.useState(args.value);
    return <BottomNav {...args} value={v} onValueChange={setV} />;
  },
};
