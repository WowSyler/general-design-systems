import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ds/ui";

const meta: Meta<typeof Tabs> = {
  title: "Primitives/Tabs",
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="genel" className="w-[440px]">
      <TabsList>
        <TabsTrigger value="genel">Genel</TabsTrigger>
        <TabsTrigger value="uyeler">Üyeler</TabsTrigger>
        <TabsTrigger value="faturalama">Faturalama</TabsTrigger>
      </TabsList>
      <TabsContent value="genel" className="text-sm text-muted-foreground">
        Çalışma alanı adı, zaman dilimi ve dil ayarları burada yönetilir.
      </TabsContent>
      <TabsContent value="uyeler" className="text-sm text-muted-foreground">
        Ekip üyelerini davet edin, rollerini düzenleyin.
      </TabsContent>
      <TabsContent
        value="faturalama"
        className="text-sm text-muted-foreground"
      >
        Plan: DeployLens Team — sonraki fatura 1 Ağustos 2026.
      </TabsContent>
    </Tabs>
  ),
};

export const WithCards: Story = {
  name: "Kart İçerikli",
  render: () => (
    <Tabs defaultValue="genel" className="w-[440px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="genel">Genel</TabsTrigger>
        <TabsTrigger value="uyeler">Üyeler</TabsTrigger>
        <TabsTrigger value="faturalama">Faturalama</TabsTrigger>
      </TabsList>
      <TabsContent value="genel">
        <Card>
          <CardHeader>
            <CardTitle>Çalışma alanı</CardTitle>
            <CardDescription>
              Temel bilgileri güncelleyin; değişiklikler anında yayınlanır.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="ws-ad">Ad</Label>
              <Input id="ws-ad" defaultValue="DeployLens Ekibi" />
            </div>
            <Button className="w-fit">Kaydet</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="uyeler">
        <Card>
          <CardHeader>
            <CardTitle>Üyeler</CardTitle>
            <CardDescription>3 aktif üye, 1 bekleyen davet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Üye davet et</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="faturalama">
        <Card>
          <CardHeader>
            <CardTitle>Faturalama</CardTitle>
            <CardDescription>
              Team planı — aylık 24 USD, sonraki yenileme 1 Ağustos 2026.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Planı değiştir</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};
