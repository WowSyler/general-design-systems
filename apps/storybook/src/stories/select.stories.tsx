import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ds/ui";

const meta: Meta<typeof Select> = {
  title: "Primitives/Select",
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Kategori seçin" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="yakit">Yakıt</SelectItem>
        <SelectItem value="yemek">Yemek</SelectItem>
        <SelectItem value="ofis">Ofis</SelectItem>
        <SelectItem value="ulasim">Ulaşım</SelectItem>
        <SelectItem value="konaklama">Konaklama</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithGroupsAndLabel: Story = {
  name: "Gruplu (Fisly Kategorileri)",
  render: () => (
    <div className="grid w-[280px] gap-1.5">
      <Label htmlFor="kategori">Fiş kategorisi</Label>
      <Select defaultValue="yakit">
        <SelectTrigger id="kategori">
          <SelectValue placeholder="Kategori seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Gider</SelectLabel>
            <SelectItem value="yakit">Yakıt</SelectItem>
            <SelectItem value="yemek">Yemek</SelectItem>
            <SelectItem value="ofis">Ofis malzemeleri</SelectItem>
            <SelectItem value="abonelik">Abonelikler</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Gelir</SelectLabel>
            <SelectItem value="satis">Satış</SelectItem>
            <SelectItem value="danismanlik">Danışmanlık</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled defaultValue="yemek">
      <SelectTrigger className="w-[240px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="yemek">Yemek</SelectItem>
      </SelectContent>
    </Select>
  ),
};
