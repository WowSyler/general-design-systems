import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronsUpDown, KeyRound } from "lucide-react";

import {
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@wowsyler/ds-ui";

/**
 * Collapsible — tek bir bölümü açıp kapatan en yalın açılır alan
 * (Accordion'un tekil, başlıksız hâli). Radix tabanlı; klavye ve
 * `aria-expanded` davranışı hazırdır.
 */
const meta: Meta<typeof Collapsible> = {
  title: "Primitives/Collapsible",
  component: Collapsible,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

const envVars = [
  { key: "DATABASE_URL", scope: "Tümü" },
  { key: "STRIPE_SECRET_KEY", scope: "Production" },
  { key: "SENTRY_DSN", scope: "Tümü" },
  { key: "FEATURE_FLAGS_URL", scope: "Preview" },
];

function EnvList({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-[380px] max-w-full space-y-2 rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <KeyRound className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <h4 className="truncate text-sm font-semibold">Ortam değişkenleri</h4>
          <Badge variant="secondary">{envVars.length}</Badge>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={open ? "Listeyi daralt" : "Listeyi genişlet"}>
            <ChevronsUpDown className="size-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border border-border px-3 py-2 font-mono text-xs">
        {envVars[0]?.key}
      </div>
      <CollapsibleContent className="space-y-2">
        {envVars.slice(1).map((v) => (
          <div
            key={v.key}
            className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2"
          >
            <span className="truncate font-mono text-xs">{v.key}</span>
            <span className="shrink-0 text-xs text-muted-foreground">{v.scope}</span>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export const Kapali: Story = {
  name: "Deploy Lens — kapalı",
  render: () => <EnvList />,
};

export const Acik: Story = {
  name: "Deploy Lens — açık",
  render: () => <EnvList defaultOpen />,
};

export const MetinTetikleyici: Story = {
  name: "Metin tetikleyici (Randevu iptal koşulları)",
  render: () => (
    <Collapsible defaultOpen className="w-[420px] max-w-full rounded-xl border border-border bg-card p-4 text-sm shadow-sm">
      <p className="font-medium">Ücretsiz iptal: randevudan 12 saat öncesine kadar.</p>
      <CollapsibleContent className="mt-2 space-y-1.5 text-muted-foreground">
        <p>12 saatten az kala yapılan iptallerde ön ödemenin %50&apos;si iade edilir.</p>
        <p>Randevuya gelinmezse ön ödeme iade edilmez.</p>
      </CollapsibleContent>
      <CollapsibleTrigger asChild>
        <Button variant="link" className="mt-1 h-auto px-0">
          Koşulları gizle / göster
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  ),
};
