import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  House,
  ScanLine,
  History,
  User,
  Shirt,
  LayoutGrid,
  Heart,
  Settings,
} from "lucide-react";

import { Dock } from "@ds/ui";

const meta: Meta<typeof Dock> = {
  title: "Iconic/Dock",
  component: Dock,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Dock>;

/** GlowScan mobil uygulamasının alt gezinme dock'u. */
export const GlowScanAltDock: Story = {
  render: function GlowScanRender() {
    const [aktif, setAktif] = React.useState("tarama");
    return (
      <Dock
        items={[
          {
            icon: <House />,
            label: "Ana Sayfa",
            active: aktif === "ana",
            onClick: () => setAktif("ana"),
          },
          {
            icon: <ScanLine />,
            label: "Tarama",
            active: aktif === "tarama",
            onClick: () => setAktif("tarama"),
          },
          {
            icon: <History />,
            label: "Geçmiş",
            active: aktif === "gecmis",
            onClick: () => setAktif("gecmis"),
          },
          {
            icon: <User />,
            label: "Profil",
            active: aktif === "profil",
            onClick: () => setAktif("profil"),
          },
        ]}
      />
    );
  },
};

/** Dolap gardırop uygulamasının kısayol dock'u. */
export const DolapDock: Story = {
  render: function DolapRender() {
    const [aktif, setAktif] = React.useState("dolabim");
    return (
      <Dock
        items={[
          {
            icon: <Shirt />,
            label: "Dolabım",
            active: aktif === "dolabim",
            onClick: () => setAktif("dolabim"),
          },
          {
            icon: <LayoutGrid />,
            label: "Kombinler",
            active: aktif === "kombinler",
            onClick: () => setAktif("kombinler"),
          },
          {
            icon: <Heart />,
            label: "Favoriler",
            active: aktif === "favoriler",
            onClick: () => setAktif("favoriler"),
          },
          {
            icon: <Settings />,
            label: "Ayarlar",
            active: aktif === "ayarlar",
            onClick: () => setAktif("ayarlar"),
          },
        ]}
      />
    );
  },
};
