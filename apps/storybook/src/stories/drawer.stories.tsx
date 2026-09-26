import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlidersHorizontal } from "lucide-react";

import {
  Button,
  Checkbox,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Label,
} from "@wowsyler/ds-ui";

const meta: Meta<typeof Drawer> = {
  title: "Primitives/Drawer",
  component: Drawer,
};

export default meta;
type Story = StoryObj<typeof Drawer>;

const kategoriler = [
  { id: "elbise", etiket: "Elbise" },
  { id: "pantolon", etiket: "Pantolon" },
  { id: "ceket", etiket: "Ceket" },
  { id: "ayakkabi", etiket: "Ayakkabı" },
  { id: "aksesuar", etiket: "Aksesuar" },
];

const FilterDrawerBody = () => (
  <DrawerContent>
    <div className="mx-auto w-full max-w-sm">
      <DrawerHeader>
        <DrawerTitle>Gardırobu filtrele</DrawerTitle>
        <DrawerDescription>
          Dolabınızda görmek istediğiniz kategorileri seçin.
        </DrawerDescription>
      </DrawerHeader>
      <div className="grid gap-3 px-4">
        {kategoriler.map((kategori) => (
          <div key={kategori.id} className="flex items-center gap-2">
            <Checkbox id={`drawer-${kategori.id}`} defaultChecked={kategori.id === "elbise"} />
            <Label htmlFor={`drawer-${kategori.id}`}>{kategori.etiket}</Label>
          </div>
        ))}
      </div>
      <DrawerFooter>
        <Button>Filtreleri uygula</Button>
        <DrawerClose asChild>
          <Button variant="outline">Vazgeç</Button>
        </DrawerClose>
      </DrawerFooter>
    </div>
  </DrawerContent>
);

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal className="mr-2 size-4" /> Filtrele
        </Button>
      </DrawerTrigger>
      <FilterDrawerBody />
    </Drawer>
  ),
};

export const Open: Story = {
  render: () => (
    <Drawer defaultOpen>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal className="mr-2 size-4" /> Filtrele
        </Button>
      </DrawerTrigger>
      <FilterDrawerBody />
    </Drawer>
  ),
};
