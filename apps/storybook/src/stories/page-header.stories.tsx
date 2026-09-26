import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarPlus, Download, Filter } from "lucide-react";

import { Badge, Button, PageHeader, Tabs, TabsContent, TabsList, TabsTrigger } from "@wowsyler/ds-ui";

const meta: Meta<typeof PageHeader> = {
  title: "Layout/PageHeader",
  component: PageHeader,
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  render: () => (
    <PageHeader
      title="Rezervasyonlar"
      description="Kadıköy Kuaför Salonu için bugünkü ve yaklaşan randevuları yönetin."
      actions={
        <>
          <Button variant="outline">
            <Filter className="mr-2 size-4" /> Filtrele
          </Button>
          <Button>
            <CalendarPlus className="mr-2 size-4" /> Yeni Rezervasyon
          </Button>
        </>
      }
    />
  ),
};

export const TitleOnly: Story = {
  render: () => <PageHeader title="Gardırobum" />,
};

export const WithBadgeAndTabs: Story = {
  render: () => (
    <PageHeader
      title={
        <span className="flex items-center gap-2">
          Dağıtım Karşılaştırması
          <Badge variant="secondary">v2.5.0-rc.1</Badge>
        </span>
      }
      description="DeployLens — staging ve production ortamları arasındaki farkları inceleyin."
      actions={
        <Button variant="outline">
          <Download className="mr-2 size-4" /> Raporu indir
        </Button>
      }
    >
      <Tabs defaultValue="ozet">
        <TabsList>
          <TabsTrigger value="ozet">Özet</TabsTrigger>
          <TabsTrigger value="degisiklikler">Değişiklikler</TabsTrigger>
          <TabsTrigger value="metrikler">Metrikler</TabsTrigger>
        </TabsList>
        {/* Her sekme bir panele bağlı olmalı (aria-controls geçerli kalsın) */}
        <TabsContent value="ozet" className="text-sm text-muted-foreground">
          Sürüm özeti: 12 commit, 3 PR birleştirildi.
        </TabsContent>
        <TabsContent value="degisiklikler" className="text-sm text-muted-foreground">
          Değişiklik listesi
        </TabsContent>
        <TabsContent value="metrikler" className="text-sm text-muted-foreground">
          Performans metrikleri
        </TabsContent>
      </Tabs>
    </PageHeader>
  ),
};
