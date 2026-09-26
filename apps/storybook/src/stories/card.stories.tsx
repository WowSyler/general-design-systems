import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Sparkles } from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@wowsyler/ds-ui";

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  name: "Tam Örnek (GlowScan)",
  render: () => (
    <Card className="w-[360px] max-w-full">
      <CardHeader>
        <CardTitle>Haftalık cilt analizi</CardTitle>
        <CardDescription>
          Son taramanız 16 Temmuz 2026 tarihinde yapıldı.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Nem skoru</span>
          <span className="font-medium">78 / 100</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Gözenek durumu</span>
          <span className="font-medium">İyi</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Kızarıklık</span>
          <span className="font-medium">Düşük</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Geçmiş</Button>
        <Button>
          Yeni tarama <ArrowRight className="ml-2 size-4" />
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const PlanKarti: Story = {
  name: "Plan Kartı",
  render: () => (
    <Card className="w-[320px] max-w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Fisly Pro</CardTitle>
          <Badge variant="info-soft">
            <Sparkles className="mr-1 size-3" /> Popüler
          </Badge>
        </div>
        <CardDescription>Serbest çalışanlar için tam kapsam.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <p>
          <span className="text-3xl font-bold">₺149</span>
          <span className="text-muted-foreground"> / ay</span>
        </p>
        <Separator />
        <ul className="grid gap-1.5 text-muted-foreground">
          <li>Sınırsız fiş tarama</li>
          <li>Otomatik KDV ayıklama</li>
          <li>Excel / PDF dışa aktarım</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Planı seç</Button>
      </CardFooter>
    </Card>
  ),
};

export const SadeKart: Story = {
  name: "Sade İçerik",
  render: () => (
    <Card className="w-[360px] max-w-full">
      <CardContent className="pt-6 text-sm text-muted-foreground">
        Dolap ipucu: 6 aydır giymediğiniz 14 parça var. Bağış listesi
        oluşturmak için gardırop analizini açın.
      </CardContent>
    </Card>
  ),
};
