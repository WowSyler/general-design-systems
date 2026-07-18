import type { Meta, StoryObj } from "@storybook/react";
import { BellRing, CalendarCheck, Sparkles } from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Grid,
  MarketingShell,
  VStack,
} from "@ds/ui";

const meta: Meta<typeof MarketingShell> = {
  title: "Layout/MarketingShell",
  component: MarketingShell,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof MarketingShell>;

const features = [
  {
    icon: CalendarCheck,
    title: "Kolay Rezervasyon",
    description:
      "Müşterileriniz boş saatlerinizi görür, iki tıkla randevusunu oluşturur.",
  },
  {
    icon: BellRing,
    title: "Akıllı Hatırlatma",
    description:
      "Randevudan 24 saat ve 1 saat önce otomatik SMS ve e-posta hatırlatması.",
  },
  {
    icon: Sparkles,
    title: "Marka Sayfanız",
    description:
      "İşletmenize özel rezervasyon sayfası: logonuz, hizmetleriniz, yorumlarınız.",
  },
];

export const Default: Story = {
  render: () => (
    <MarketingShell
      logo={<span className="text-lg font-semibold">randevu.com</span>}
      nav={
        <>
          {["Özellikler", "Fiyatlar", "SSS"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link}
            </a>
          ))}
        </>
      }
      cta={<Button>Giriş</Button>}
      footer={
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 randevu.com — Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6">
            {["Gizlilik", "Kullanım Şartları", "İletişim"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      }
    >
      <VStack gap="xl">
        <VStack gap="md" align="center" className="py-12 text-center">
          <Badge variant="secondary">Berber, kuaför ve güzellik salonları için</Badge>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Randevularınız otomatik pilotta
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Telefonla randevu almayı bırakın. Müşterileriniz kendi randevusunu
            oluştursun, siz işinize odaklanın.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Button size="lg">Ücretsiz Başla</Button>
            <Button size="lg" variant="outline">
              Demo İzle
            </Button>
          </div>
        </VStack>
        <Grid cols={{ base: 1, md: 3 }} gap="lg">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </Grid>
      </VStack>
    </MarketingShell>
  ),
};
