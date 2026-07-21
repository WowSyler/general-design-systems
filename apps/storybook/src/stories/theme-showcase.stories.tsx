import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, Button, Container, Grid, Section, VStack } from "@ds/ui";

/**
 * Tema vitrini — toolbar'dan tema/mod değiştirildiğinde tüm semantik
 * yüzeylerin, tipografinin, radius kademelerinin ve marka gradyanının
 * nasıl tepki verdiğini tek ekranda gösterir.
 */
const meta: Meta = {
  title: "Theme/Showcase",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

interface SurfaceSwatch {
  name: string;
  className: string;
  bordered?: boolean;
}

const semanticSurfaces: SurfaceSwatch[] = [
  { name: "background", className: "bg-background text-foreground", bordered: true },
  { name: "card", className: "bg-card text-card-foreground", bordered: true },
  { name: "primary", className: "bg-primary text-primary-foreground" },
  { name: "secondary", className: "bg-secondary text-secondary-foreground" },
  { name: "muted", className: "bg-muted text-muted-foreground" },
  { name: "accent", className: "bg-accent text-accent-foreground" },
  { name: "destructive", className: "bg-destructive text-destructive-foreground" },
  { name: "success", className: "bg-success text-success-foreground" },
  { name: "warning", className: "bg-warning text-warning-foreground" },
  { name: "info", className: "bg-info text-info-foreground" },
];

const chartSwatches: SurfaceSwatch[] = [
  { name: "chart-1", className: "bg-chart-1" },
  { name: "chart-2", className: "bg-chart-2" },
  { name: "chart-3", className: "bg-chart-3" },
  { name: "chart-4", className: "bg-chart-4" },
  { name: "chart-5", className: "bg-chart-5" },
];

const radiusSteps = [
  { name: "rounded-sm", className: "rounded-sm" },
  { name: "rounded-md", className: "rounded-md" },
  { name: "rounded-lg", className: "rounded-lg" },
  { name: "rounded-xl", className: "rounded-xl" },
  { name: "rounded-2xl", className: "rounded-2xl" },
];

export const Showcase: Story = {
  render: () => (
    <div className="min-h-screen bg-background py-8 text-foreground">
      <Container size="xl">
        <VStack gap="xl">
          <VStack gap="xs">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Tema Vitrini
            </h1>
            <p className="text-sm text-muted-foreground">
              Toolbar&apos;dan tema (DeployLens, Dolap, Randevu, GlowScan,
              Fisly) ve açık/koyu mod değiştirin; aşağıdaki tüm yüzeyler
              semantik tokenlarla otomatik güncellenir.
            </p>
          </VStack>

          <Section
            title="Semantik Yüzeyler"
            description="Her kutu bg-* yüzeyini ve uyumlu text-*-foreground rengini kullanır."
          >
            <Grid cols={{ base: 2, sm: 3, lg: 5 }} gap="sm">
              {semanticSurfaces.map((surface) => (
                <div
                  key={surface.name}
                  className={`flex min-h-24 flex-col justify-between rounded-lg p-3 ${
                    surface.className
                  } ${surface.bordered ? "border border-border" : ""}`}
                >
                  <span className="text-sm font-semibold">{surface.name}</span>
                  <span className="text-xs opacity-80">Aa Bb Cc 123</span>
                </div>
              ))}
            </Grid>
          </Section>

          <Section
            title="Grafik Renkleri"
            description="Veri görselleştirme paleti — chart-1'den chart-5'e."
          >
            <Grid cols={{ base: 2, sm: 5 }} gap="sm">
              {chartSwatches.map((swatch) => (
                <div key={swatch.name} className="flex flex-col gap-2">
                  <div className={`h-16 rounded-lg ${swatch.className}`} />
                  <span className="text-center text-xs font-medium text-muted-foreground">
                    {swatch.name}
                  </span>
                </div>
              ))}
            </Grid>
          </Section>

          <Section
            title="Tipografi"
            description="Tema başına değişen font aileleri: sans, serif, display ve mono."
          >
            <VStack gap="md" className="rounded-lg border border-border p-6">
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  font-display
                </p>
                <p className="font-display text-3xl font-bold">
                  Cilt skorunuz bu hafta 78&apos;e yükseldi
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  font-sans
                </p>
                <p className="font-sans text-base">
                  Randevularınız otomatik pilotta: müşterileriniz boş
                  saatlerinizi görür, iki tıkla rezervasyon oluşturur ve
                  hatırlatmalar kendiliğinden gider.
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  font-serif
                </p>
                <p className="font-serif text-lg italic">
                  Gardırobunuzdaki her parça, doğru kombinle yeniden hayat
                  bulur.
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  font-mono
                </p>
                <p className="font-mono text-sm">
                  deploylens diff prod:v2.4.1 staging:v2.5.0-rc.1 --format=json
                </p>
              </div>
            </VStack>
          </Section>

          <Section
            title="Köşe Yarıçapı"
            description="Tümü --radius token'ından türetilir; tema değişince birlikte ölçeklenir."
          >
            <div className="flex flex-wrap items-end gap-6">
              {radiusSteps.map((step) => (
                <div key={step.name} className="flex flex-col items-center gap-2">
                  <div
                    className={`size-20 border-2 border-primary bg-primary/10 ${step.className}`}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="Marka Gradyanı"
            description="bg-brand-gradient — gradient-from ve gradient-to tokenlarından oluşur."
          >
            <div className="flex min-h-36 flex-col items-start justify-center gap-3 rounded-xl bg-brand-gradient p-8 text-primary-foreground">
              <Badge variant="secondary">Yeni</Badge>
              <p className="font-display text-2xl font-bold">
                Gelir-gider takibi hiç bu kadar kolay olmamıştı
              </p>
              <p className="max-w-lg text-sm opacity-90">
                Fişini fotoğrafla, Fisly gerisini halletsin. Kategoriler, KDV
                dökümü ve aylık rapor otomatik hazırlanır.
              </p>
            </div>
          </Section>

          <Section
            title="Bileşen Örneği"
            description="Aynı bileşenler, farklı temalarda farklı kimliğe bürünür."
          >
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-6">
              <Button>Birincil</Button>
              <Button variant="secondary">İkincil</Button>
              <Button variant="outline">Çerçeveli</Button>
              <Button variant="destructive">Sil</Button>
              <Badge>Varsayılan</Badge>
              <Badge variant="secondary">İkincil</Badge>
              <Badge variant="outline">Çerçeveli</Badge>
            </div>
          </Section>
        </VStack>
      </Container>
    </div>
  ),
};
