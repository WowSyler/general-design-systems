import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link, SectionHeader } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/SectionHeader", component: SectionHeader, ...nativeMeta, args: { title: "Önerilen ürünler", description: "Tarzına göre seçtik", action: <Link title="Tümü" size="sm" /> } } satisfies Meta<typeof SectionHeader>;
export default meta;
export const Varsayilan: StoryObj<typeof meta> = {};
