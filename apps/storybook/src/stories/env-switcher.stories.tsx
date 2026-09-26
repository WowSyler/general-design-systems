import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { EnvSwitcher } from "@wowsyler/ds-ui";

type Environment = React.ComponentProps<typeof EnvSwitcher>["environments"][number];

const meta: Meta<typeof EnvSwitcher> = {
  title: "Composites/EnvSwitcher",
  component: EnvSwitcher,
};

export default meta;
type Story = StoryObj<typeof EnvSwitcher>;

// DeployLens — standart dağıtım ortamları
const ortamlar: Environment[] = [
  {
    id: "production",
    name: "Production",
    description: "main · eu-west-1",
    tone: "success",
  },
  {
    id: "staging",
    name: "Staging",
    description: "release/2.4 · eu-west-1",
    tone: "warning",
  },
  {
    id: "development",
    name: "Development",
    description: "develop · local",
    tone: "info",
  },
];

export const DeployLensHeader: Story = {
  render: () => {
    const [aktif, setAktif] = React.useState("production");
    return (
      <div className="flex w-full max-w-2xl items-center justify-between rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
        <span className="text-sm font-semibold text-foreground">DeployLens</span>
        <EnvSwitcher
          environments={ortamlar}
          value={aktif}
          onValueChange={setAktif}
          heading="Dağıtım hedefi"
          pulse
        />
      </div>
    );
  },
};

export const OnizlemeVeBolgeler: Story = {
  render: () => {
    const [aktif, setAktif] = React.useState("preview-142");
    const genisOrtamlar: Environment[] = [
      {
        id: "production",
        name: "Production",
        description: "main · vercel.app",
        tone: "success",
      },
      {
        id: "preview-142",
        name: "Preview #142",
        description: "feat/checkout-akisi",
        tone: "primary",
      },
      {
        id: "staging",
        name: "Staging",
        description: "release/2.4",
        tone: "warning",
      },
      {
        id: "canary",
        name: "Canary",
        description: "Dağıtım duraklatıldı",
        tone: "destructive",
        disabled: true,
      },
    ];
    return (
      <div className="w-72 max-w-full">
        <EnvSwitcher
          environments={genisOrtamlar}
          value={aktif}
          onValueChange={setAktif}
          label="Hedef"
          heading="Ortamlar"
        />
      </div>
    );
  },
};

export const AcikListe: Story = {
  render: () => (
    <div className="flex h-80 w-72 max-w-full flex-col">
      <EnvSwitcher
        defaultOpen
        environments={ortamlar}
        defaultValue="staging"
        heading="Dağıtım hedefi"
      />
    </div>
  ),
};
