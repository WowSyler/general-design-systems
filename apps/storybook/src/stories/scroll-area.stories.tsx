import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, ScrollArea, ScrollBar, Separator } from "@wowsyler/ds-ui";

const meta: Meta<typeof ScrollArea> = {
  title: "Primitives/ScrollArea",
  component: ScrollArea,
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

const etiketler = [
  "Yazlık elbise",
  "Keten pantolon",
  "Denim ceket",
  "Beyaz gömlek",
  "Spor ayakkabı",
  "Deri çanta",
  "Trençkot",
  "Triko kazak",
  "Midi etek",
  "Blazer",
  "Süet bot",
  "İpek fular",
  "Kargo pantolon",
  "Oversize tişört",
  "Yün palto",
  "Loafer",
  "Saten bluz",
  "Kot şort",
  "Hırka",
  "Topuklu sandalet",
];

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-56 max-w-full rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">
          Gardırop etiketleri
        </h4>
        {etiketler.map((etiket) => (
          <div key={etiket}>
            <div className="text-sm">{etiket}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 max-w-full whitespace-nowrap rounded-md border">
      <div className="flex w-max gap-2 p-4">
        {etiketler.map((etiket) => (
          <Badge key={etiket} variant="secondary">
            {etiket}
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
