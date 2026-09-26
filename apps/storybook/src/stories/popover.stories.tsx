import type { Meta, StoryObj } from "@storybook/react-vite";
import { Wallet } from "lucide-react";

import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@wowsyler/ds-ui";

const meta: Meta<typeof Popover> = {
  title: "Primitives/Popover",
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

const BudgetPopoverBody = () => (
  <PopoverContent className="w-80 max-w-full">
    <div className="grid gap-4">
      <div className="space-y-1">
        <h4 className="font-medium leading-none">Bütçe limiti</h4>
        <p className="text-sm text-muted-foreground">
          Fisly aylık harcama limitinizi belirleyin.
        </p>
      </div>
      <div className="grid gap-2">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="popover-kategori">Kategori</Label>
          <Input id="popover-kategori" defaultValue="Market" className="col-span-2 h-8" />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="popover-limit">Aylık limit</Label>
          <Input id="popover-limit" defaultValue="7.500 ₺" className="col-span-2 h-8" />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="popover-uyari">Uyarı eşiği</Label>
          <Input id="popover-uyari" defaultValue="%80" className="col-span-2 h-8" />
        </div>
      </div>
      <Button size="sm">Kaydet</Button>
    </div>
  </PopoverContent>
);

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Wallet className="mr-2 size-4" /> Bütçe limiti
        </Button>
      </PopoverTrigger>
      <BudgetPopoverBody />
    </Popover>
  ),
};

export const Open: Story = {
  render: () => (
    <div className="flex min-h-[360px] items-start justify-center pt-4">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Wallet className="mr-2 size-4" /> Bütçe limiti
          </Button>
        </PopoverTrigger>
        <BudgetPopoverBody />
      </Popover>
    </div>
  ),
};
