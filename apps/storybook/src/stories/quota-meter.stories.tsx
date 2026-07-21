import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, QuotaMeter } from "@ds/ui";
import { ArrowUpRight, Globe, HardDrive, Users, Zap } from "lucide-react";

const meta: Meta<typeof QuotaMeter> = {
  title: "Composites/QuotaMeter",
  component: QuotaMeter,
};

export default meta;
type Story = StoryObj<typeof QuotaMeter>;

export const NormalKullanim: Story = {
  args: {
    label: "Depolama",
    used: 4.1,
    limit: 10,
    unit: "GB",
    icon: <HardDrive />,
    className: "max-w-sm",
  },
};

export const EsikUyarisi: Story = {
  args: {
    label: "Bant genişliği",
    used: 8.6,
    limit: 10,
    unit: "GB",
    icon: <Globe />,
    className: "max-w-sm",
    action: (
      <Button variant="outline" size="sm" className="w-full">
        <ArrowUpRight />
        Planı yükselt
      </Button>
    ),
  },
};

export const LimitAsildi: Story = {
  args: {
    label: "Fonksiyon çağrısı",
    used: 1_240_000,
    limit: 1_000_000,
    unit: "istek",
    icon: <Zap />,
    className: "max-w-sm",
    action: (
      <Button size="sm" className="w-full">
        <ArrowUpRight />
        Pro plana geç
      </Button>
    ),
  },
};

export const KoltukKotasi: Story = {
  args: {
    label: "Ekip koltuğu",
    used: 5,
    limit: 5,
    unit: "koltuk",
    icon: <Users />,
    className: "max-w-sm",
    action: (
      <Button variant="outline" size="sm" className="w-full">
        <ArrowUpRight />
        Koltuk ekle
      </Button>
    ),
  },
};

export const DeployLensFaturaPaneli: Story = {
  render: () => (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      <QuotaMeter
        label="Depolama"
        used={4.1}
        limit={10}
        unit="GB"
        icon={<HardDrive />}
      />
      <QuotaMeter
        label="Bant genişliği"
        used={8.6}
        limit={10}
        unit="GB"
        icon={<Globe />}
      />
      <QuotaMeter
        label="Fonksiyon çağrısı"
        used={1_240_000}
        limit={1_000_000}
        unit="istek"
        icon={<Zap />}
        action={
          <Button size="sm" className="w-full">
            <ArrowUpRight />
            Pro plana geç
          </Button>
        }
      />
      <QuotaMeter
        label="Ekip koltuğu"
        used={4}
        limit={5}
        unit="koltuk"
        icon={<Users />}
      />
    </div>
  ),
};
