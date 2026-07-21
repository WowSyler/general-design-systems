import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings } from "lucide-react";

import {
  Button,
  Input,
  Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ds/ui";

const meta: Meta<typeof Sheet> = {
  title: "Primitives/Sheet",
  component: Sheet,
};

export default meta;
type Story = StoryObj<typeof Sheet>;

const SettingsSheetBody = () => (
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Hesap ayarları</SheetTitle>
      <SheetDescription>
        GlowScan profil bilgilerinizi güncelleyin. Değişiklikler kaydedildiğinde
        cilt analizi geçmişiniz korunur.
      </SheetDescription>
    </SheetHeader>
    <div className="grid gap-4 py-6">
      <div className="grid gap-2">
        <Label htmlFor="sheet-ad">Ad Soyad</Label>
        <Input id="sheet-ad" defaultValue="Elif Kaya" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sheet-eposta">E-posta</Label>
        <Input id="sheet-eposta" type="email" defaultValue="elif.kaya@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sheet-cilt">Cilt tipi</Label>
        <Input id="sheet-cilt" defaultValue="Karma" />
      </div>
    </div>
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="outline">Vazgeç</Button>
      </SheetClose>
      <Button>Kaydet</Button>
    </SheetFooter>
  </SheetContent>
);

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 size-4" /> Ayarlar
        </Button>
      </SheetTrigger>
      <SettingsSheetBody />
    </Sheet>
  ),
};

export const Open: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 size-4" /> Ayarlar
        </Button>
      </SheetTrigger>
      <SettingsSheetBody />
    </Sheet>
  ),
};
