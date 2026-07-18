import type { Meta, StoryObj } from "@storybook/react";
import { Trash2 } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ds/ui";

const meta: Meta<typeof Dialog> = {
  title: "Primitives/Dialog",
  component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

const DeleteDialogBody = () => (
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Öğeyi sil</DialogTitle>
      <DialogDescription>
        &quot;dolap-web · v2.4.1 → v2.5.0&quot; karşılaştırma raporu kalıcı
        olarak silinecek. Bu işlem geri alınamaz.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="gap-2 sm:gap-0">
      <Button variant="outline">Vazgeç</Button>
      <Button variant="destructive">
        <Trash2 className="mr-2 size-4" /> Sil
      </Button>
    </DialogFooter>
  </DialogContent>
);

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Raporu sil</Button>
      </DialogTrigger>
      <DeleteDialogBody />
    </Dialog>
  ),
};

export const Open: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="destructive">Raporu sil</Button>
      </DialogTrigger>
      <DeleteDialogBody />
    </Dialog>
  ),
};
