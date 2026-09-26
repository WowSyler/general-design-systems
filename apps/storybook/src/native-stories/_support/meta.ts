import type { Decorator } from "@storybook/react-vite";

import { nativeParameters, withNativeTheme } from "./native";

/** Native story meta'sının ortak kısmı. */
export const nativeMeta: { decorators: Decorator[]; parameters: typeof nativeParameters } = {
  decorators: [withNativeTheme],
  parameters: nativeParameters,
};
