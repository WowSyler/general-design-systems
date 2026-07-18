import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Shirt } from "lucide-react";

import {
  AppShell,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Grid,
  PageHeader,
} from "@ds/ui";

const meta: Meta<typeof AppShell> = {
  title: "Layout/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof AppShell>;

const navLinks = ["Gardırop", "Panel", "Stilist", "Lookbook"];

const outfits = [
  {
    title: "Ofis Şıklığı",
    description: "Siyah blazer + bej pantolon + beyaz sneaker",
    tag: "8 parça",
  },
  {
    title: "Hafta Sonu Rahatlığı",
    description: "Kot ceket + beyaz tişört + keten pantolon",
    tag: "5 parça",
  },
  {
    title: "Akşam Daveti",
    description: "İpek fular + midi elbise + topuklu ayakkabı",
    tag: "6 parça",
  },
];

export const Default: Story = {
  render: () => (
    <AppShell
      logo={
        <span className="flex items-center gap-2 font-semibold">
          <Shirt className="size-5 text-primary" /> Dolap
        </span>
      }
      nav={
        <>
          {navLinks.map((link, index) => (
            <a
              key={link}
              href="#"
              className={
                index === 0
                  ? "text-sm font-medium text-foreground"
                  : "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {link}
            </a>
          ))}
        </>
      }
      actions={
        <>
          <Button variant="ghost" size="sm">
            TR
          </Button>
          <Avatar className="size-8">
            <AvatarFallback>ZK</AvatarFallback>
          </Avatar>
        </>
      }
    >
      <Container size="xl">
        <PageHeader
          title="Kombinlerim"
          description="Gardırobunuzdaki parçalardan oluşturduğunuz kombinler."
          actions={
            <Button>
              <Plus className="mr-2 size-4" /> Yeni Kombin
            </Button>
          }
          className="mb-6"
        />
        <Grid cols={{ base: 1, md: 3 }} gap="lg">
          {outfits.map((outfit) => (
            <Card key={outfit.title}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  {outfit.title}
                  <Badge variant="secondary">{outfit.tag}</Badge>
                </CardTitle>
                <CardDescription>{outfit.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex min-h-28 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                  Kombin önizlemesi
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </AppShell>
  ),
};

export const WithBanner: Story = {
  render: () => (
    <AppShell
      logo={<span className="font-semibold">Dolap</span>}
      nav={
        <>
          {navLinks.map((link) => (
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
      actions={
        <>
          <Button variant="ghost" size="sm">
            TR
          </Button>
          <Avatar className="size-8">
            <AvatarFallback>ZK</AvatarFallback>
          </Avatar>
        </>
      }
      banner={
        <p className="px-4 py-2 text-center text-sm text-muted-foreground">
          Kış gardırobu analizi hazır — stilist önerilerinizi inceleyin.
        </p>
      }
      footer={
        <p className="px-6 py-4 text-center text-sm text-muted-foreground">
          © 2026 Dolap — Dijital gardırop asistanınız
        </p>
      }
    >
      <Container size="xl">
        <PageHeader
          title="Panel"
          description="Gardırop istatistikleriniz ve stilist önerileriniz."
          className="mb-6"
        />
        <Grid cols={{ base: 1, md: 3 }} gap="lg">
          {["124 parça", "18 kombin", "6 lookbook"].map((stat) => (
            <Card key={stat}>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold">{stat}</p>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </AppShell>
  ),
};
