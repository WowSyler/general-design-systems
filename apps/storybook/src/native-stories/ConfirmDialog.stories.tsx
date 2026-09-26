import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ConfirmDialog } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = {
  title: "Native/ConfirmDialog",
  component: ConfirmDialog,
  ...nativeMeta,
  args: { visible: true, title: "İşlem silinsin mi?", onConfirm: () => undefined, onCancel: () => undefined },
} satisfies Meta<typeof ConfirmDialog>;
export default meta;

/** Telefonda alttan sayfa + alt alta butonlar; tablette ortada kart + yan yana butonlar. */
export const Silme: StoryObj<typeof meta> = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <Button title="Sil" variant="destructive" onPress={() => setOpen(true)} />
        <ConfirmDialog
          visible={open}
          destructive
          title="İşlem silinsin mi?"
          description="Migros · ₺342,50 işlemi kalıcı olarak silinecek. Bu işlem geri alınamaz."
          confirmLabel="Sil"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </>
    );
  },
};
