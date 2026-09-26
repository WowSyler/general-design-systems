import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/TextArea", component: TextArea, ...nativeMeta, args: { label: "Ürün açıklaması", defaultValue: "Bir kez giyildi, etiketi üzerinde.", maxLength: 300, helperText: "Kusurları belirtmeyi unutma." } } satisfies Meta<typeof TextArea>;
export default meta;
export const Varsayilan: StoryObj<typeof meta> = {};
