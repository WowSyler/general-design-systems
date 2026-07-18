import type { Meta, StoryObj } from "@storybook/react";

import { Card, CardContent, CardHeader, CardTitle, Grid } from "@ds/ui";

const meta: Meta<typeof Grid> = {
  title: "Layout/Grid",
  component: Grid,
};

export default meta;
type Story = StoryObj<typeof Grid>;

const Cell = ({ label }: { label: string }) => (
  <div className="flex min-h-20 items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground">
    {label}
  </div>
);

export const Responsive: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Varsayılan: base 1 → sm 2 → lg 3 kolon. Pencereyi daraltıp genişleterek
        deneyin.
      </p>
      <Grid>
        {[
          "Prod v2.4.1",
          "Staging v2.5.0-rc.1",
          "Preview PR#482",
          "Prod v2.4.0",
          "Staging v2.4.9",
          "Preview PR#479",
        ].map((label) => (
          <Cell key={label} label={label} />
        ))}
      </Grid>
    </div>
  ),
};

export const FourColumns: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        cols=&#123;&#123; base: 2, md: 4 &#125;&#125; — Fisly KPI şeridi
      </p>
      <Grid cols={{ base: 2, md: 4 }} gap="sm">
        <Cell label="Gelir ₺84.200" />
        <Cell label="Gider ₺31.750" />
        <Cell label="KDV ₺6.480" />
        <Cell label="Net ₺52.450" />
      </Grid>
    </div>
  ),
};

export const DenseGallery: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        cols=&#123;&#123; base: 2, sm: 3, lg: 6 &#125;&#125; gap=&quot;xs&quot; —
        Dolap gardırop küçük görünümü
      </p>
      <Grid cols={{ base: 2, sm: 3, lg: 6 }} gap="xs">
        {[
          "Keten gömlek",
          "Siyah blazer",
          "Bej pantolon",
          "Beyaz sneaker",
          "İpek fular",
          "Kot ceket",
        ].map((label) => (
          <Cell key={label} label={label} />
        ))}
      </Grid>
    </div>
  ),
};

export const WithCards: Story = {
  render: () => (
    <Grid cols={{ base: 1, md: 3 }} gap="lg">
      {[
        {
          title: "Cilt Analizi",
          body: "Yüz fotoğrafınızdan nem, gözenek ve leke skorları çıkarılır.",
        },
        {
          title: "Rutin Önerisi",
          body: "Skorlarınıza göre sabah ve akşam bakım rutini oluşturulur.",
        },
        {
          title: "İlerleme Takibi",
          body: "Haftalık taramalarla cilt skorunuzun değişimini izleyin.",
        },
      ].map((item) => (
        <Card key={item.title}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.body}</p>
          </CardContent>
        </Card>
      ))}
    </Grid>
  ),
};
