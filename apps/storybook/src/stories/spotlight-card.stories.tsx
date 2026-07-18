import type { Meta, StoryObj } from "@storybook/react";
import { GitBranch, LineChart, ShieldCheck } from "lucide-react";

import { SpotlightCard } from "@ds/ui";

const meta: Meta<typeof SpotlightCard> = {
  title: "Iconic/SpotlightCard",
  component: SpotlightCard,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof SpotlightCard>;

export const Tekil: Story = {
  render: () => (
    <SpotlightCard className="max-w-sm">
      <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-2.5 text-primary">
        <LineChart className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-card-foreground">
        Gerçek zamanlı metrikler
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        DeployLens her dağıtımın p95 gecikmesini, hata oranını ve throughput
        değerini canlı akışta gösterir. İmleci kartın üzerinde gezdirin.
      </p>
    </SpotlightCard>
  ),
};

export const OzellikIzgarasi: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-4 sm:grid-cols-3">
      <SpotlightCard>
        <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-2.5 text-primary">
          <GitBranch className="size-5" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-card-foreground">
          Otomatik geri alma
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Hata bütçesi aşılırsa dağıtım saniyeler içinde önceki sürüme döner.
        </p>
      </SpotlightCard>
      <SpotlightCard>
        <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-2.5 text-primary">
          <LineChart className="size-5" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-card-foreground">
          Anomali tespiti
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Trafikteki ani sapmaları yakalar, ekibe Slack üzerinden haber verir.
        </p>
      </SpotlightCard>
      <SpotlightCard>
        <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-2.5 text-primary">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-card-foreground">
          Güvenli dağıtım
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Her sürüm imzalanır; onay olmadan üretime hiçbir değişiklik çıkmaz.
        </p>
      </SpotlightCard>
    </div>
  ),
};
