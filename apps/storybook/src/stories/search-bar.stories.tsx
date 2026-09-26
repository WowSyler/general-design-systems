import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { SearchBar } from "@wowsyler/ds-ui";

const meta: Meta<typeof SearchBar> = {
  title: "Primitives/SearchBar",
  component: SearchBar,
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Varsayilan: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <SearchBar placeholder="Servis ara..." />
    </div>
  ),
};

export const Kisayollu: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <SearchBar placeholder="Dağıtım veya servis ara..." shortcut="⌘K" />
    </div>
  ),
};

export const KontrolluArama: Story = {
  render: function KontrolluAramaStory() {
    const [deger, setDeger] = React.useState("");
    const servisler = [
      "deploylens-api",
      "deploylens-web",
      "fisly-ocr-worker",
      "randevu-bildirim",
      "glowscan-analiz",
    ];
    const sonuclar = servisler.filter((s) =>
      s.toLowerCase().includes(deger.toLowerCase())
    );

    return (
      <div className="w-80 max-w-full space-y-3">
        <SearchBar
          placeholder="Servis ara..."
          shortcut="⌘K"
          value={deger}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDeger(e.target.value)
          }
        />
        <ul className="space-y-1 text-sm">
          {sonuclar.map((servis) => (
            <li
              key={servis}
              className="rounded-md border px-3 py-2 font-mono text-xs transition-all duration-200 hover:bg-muted"
            >
              {servis}
            </li>
          ))}
          {sonuclar.length === 0 ? (
            <li className="px-3 py-2 text-xs text-muted-foreground">
              Sonuç bulunamadı.
            </li>
          ) : null}
        </ul>
      </div>
    );
  },
};
