import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@ds/ui";

const meta: Meta<typeof AlertDialog> = {
  title: "Primitives/AlertDialog",
  component: AlertDialog,
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

const DeleteAccountBody = () => (
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Hesabınızı silmek istediğinize emin misiniz?</AlertDialogTitle>
      <AlertDialogDescription>
        Fisly hesabınız ve tüm gelir-gider kayıtlarınız kalıcı olarak
        silinecek. Faturalarınız, kategorileriniz ve raporlarınız geri
        getirilemez.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Vazgeç</AlertDialogCancel>
      <AlertDialogAction>Hesabı sil</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
);

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Hesabı sil</Button>
      </AlertDialogTrigger>
      <DeleteAccountBody />
    </AlertDialog>
  ),
};

export const Open: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Hesabı sil</Button>
      </AlertDialogTrigger>
      <DeleteAccountBody />
    </AlertDialog>
  ),
};
