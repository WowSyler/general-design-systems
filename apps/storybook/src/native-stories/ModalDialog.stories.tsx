import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ModalDialog } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/ModalDialog", component: ModalDialog, ...nativeMeta, args: { visible: true, onClose: () => undefined } } satisfies Meta<typeof ModalDialog>;
export default meta;

export const Onay: StoryObj<typeof meta> = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <Button title="Diyaloğu aç" onPress={() => setOpen(true)} />
        <ModalDialog
          visible={open}
          onClose={() => setOpen(false)}
          title="Oturumu kapat"
          description="Tüm cihazlardaki oturumların kapatılacak."
          actions={[
            { label: "Vazgeç", variant: "ghost", onPress: () => setOpen(false) },
            { label: "Oturumu kapat", variant: "destructive", onPress: () => setOpen(false) },
          ]}
        />
      </>
    );
  },
};
