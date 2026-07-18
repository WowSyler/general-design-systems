import type { Meta, StoryObj } from "@storybook/react";

import { Container } from "@ds/ui";

const meta: Meta<typeof Container> = {
  title: "Layout/Container",
  component: Container,
};

export default meta;
type Story = StoryObj<typeof Container>;

const DemoBlock = ({ label }: { label: string }) => (
  <div className="rounded-lg bg-muted px-4 py-6 text-center text-sm font-medium text-muted-foreground">
    {label}
  </div>
);

export const Default: Story = {
  render: () => (
    <Container>
      <DemoBlock label='Container size="xl" (varsayılan) — DeployLens panel içeriği bu genişlikte akar' />
    </Container>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 bg-background py-6">
      <Container size="sm">
        <DemoBlock label='size="sm" — Fisly fiş detay formu' />
      </Container>
      <Container size="md">
        <DemoBlock label='size="md" — GlowScan analiz sonucu sayfası' />
      </Container>
      <Container size="lg">
        <DemoBlock label='size="lg" — Randevu işletme profili' />
      </Container>
      <Container size="xl">
        <DemoBlock label='size="xl" — Dolap gardırop galerisi' />
      </Container>
      <Container size="full">
        <DemoBlock label='size="full" — DeployLens karşılaştırma tablosu (tam genişlik)' />
      </Container>
    </div>
  ),
};

export const Nested: Story = {
  render: () => (
    <Container size="xl" className="bg-muted/40 py-8">
      <div className="rounded-xl border border-border bg-background p-6">
        <p className="mb-4 text-sm text-muted-foreground">
          Dış konteyner: xl — sayfa çerçevesi
        </p>
        <Container size="md">
          <DemoBlock label="İç konteyner: md — dar okuma alanı (ör. GlowScan bakım önerileri)" />
        </Container>
      </div>
    </Container>
  ),
};
