import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Receipt } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Grid,
  Section,
  VStack,
} from "@ds/ui";

const meta: Meta<typeof Section> = {
  title: "Layout/Section",
  component: Section,
};

export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {
  render: () => (
    <Section
      title="Son Fişler"
      description="Fisly hesabınıza bu ay eklenen gider fişleri."
      actions={
        <Button size="sm">
          <Plus className="mr-2 size-4" /> Fiş Ekle
        </Button>
      }
    >
      <Grid cols={{ base: 1, md: 3 }}>
        {[
          { title: "Market — Migros", amount: "₺842,50" },
          { title: "Yakıt — Opet", amount: "₺1.650,00" },
          { title: "Ofis — Kırtasiye", amount: "₺312,90" },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums">{item.amount}</p>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Section>
  ),
};

export const WithoutHeader: Story = {
  render: () => (
    <Section>
      <p className="text-sm text-muted-foreground">
        Başlıksız bölüm — yalnızca dikey boşluk düzeni sağlar.
      </p>
    </Section>
  ),
};

export const Stacked: Story = {
  render: () => (
    <VStack gap="xl">
      <Section
        title="Bu Haftanın Kombinleri"
        description="Dolap stilistinizin hava durumuna göre önerileri."
      >
        <Grid cols={{ base: 2, md: 4 }} gap="sm">
          {["Pazartesi", "Salı", "Çarşamba", "Perşembe"].map((day) => (
            <div
              key={day}
              className="flex min-h-24 items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </Grid>
      </Section>
      <Section
        title="Bekleyen Fişler"
        description="Henüz kategorize edilmemiş harcamalar."
        actions={<Button variant="outline" size="sm">Tümünü Gör</Button>}
      >
        <EmptyState
          icon={<Receipt className="size-6" />}
          title="Bekleyen fiş yok"
          description="Tüm fişleriniz kategorize edildi. Yeni fiş eklediğinizde burada görünür."
          action={<Button size="sm">Fiş Tara</Button>}
        />
      </Section>
    </VStack>
  ),
};
