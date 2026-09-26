import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Chip, HStack, Sheet, Text, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/Sheet", component: Sheet, ...nativeMeta, args: { visible: true, onClose: () => undefined, title: "Filtrele" } } satisfies Meta<typeof Sheet>;
export default meta;

/** Telefonda alttan sayfa, tablette (kısa kenar ≥ 600) ortada kart. */
export const Filtreler: StoryObj<typeof meta> = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <Button title="Filtreleri aç" onPress={() => setOpen(true)} />
        <Sheet visible={open} onClose={() => setOpen(false)} title="Filtrele">
          <VStack gap="lg">
            <Text variant="overline">Beden</Text>
            <HStack gap="sm" wrap>
              {["XS", "S", "M", "L", "XL"].map((b) => (
                <Chip key={b} label={b} selected={b === "M"} onPress={() => undefined} />
              ))}
            </HStack>
            <Button title="Sonuçları göster (128)" fullWidth onPress={() => setOpen(false)} />
          </VStack>
        </Sheet>
      </>
    );
  },
};
