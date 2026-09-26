import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  GradientMesh,
} from "@wowsyler/ds-ui";

const meta: Meta<typeof GradientMesh> = {
  title: "Iconic/GradientMesh",
  component: GradientMesh,
};

export default meta;
type Story = StoryObj<typeof GradientMesh>;

/** Bir Card'ın arkasında dekoratif mesh katmanı olarak. */
export const KartArkasi: Story = {
  render: () => (
    <div className="relative overflow-hidden rounded-2xl p-10">
      <GradientMesh blobs={4} />
      <Card className="relative mx-auto max-w-md bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle>DeployLens Pro</CardTitle>
          <CardDescription>
            Sınırsız ortam, canlı dağıtım izleme ve öncelikli destek.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-3xl font-bold text-foreground">
            ₺499
            <span className="text-base font-normal text-muted-foreground">
              {" "}
              / ay
            </span>
          </p>
          <Button className="w-full">14 gün ücretsiz dene</Button>
        </CardContent>
      </Card>
    </div>
  ),
};

/** Tek başına dekor katmanı (bir kap içinde). */
export const TekBasina: Story = {
  render: () => (
    <div className="relative h-[320px] overflow-hidden rounded-2xl border border-border bg-background">
      <GradientMesh blobs={3} />
      <div className="relative flex h-full items-center justify-center">
        <span className="text-sm font-medium text-muted-foreground">
          GradientMesh · dekoratif statik mesh katmanı
        </span>
      </div>
    </div>
  ),
};
