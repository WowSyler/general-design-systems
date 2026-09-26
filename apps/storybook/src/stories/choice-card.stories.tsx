import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Droplets, ScanFace, Sparkles, Sun } from "lucide-react";

import { ChoiceCard, ChoiceCardGroup, type ChoiceCardOption } from "@wowsyler/ds-ui";

const meta: Meta<typeof ChoiceCardGroup> = {
  title: "Composites/ChoiceCard",
  component: ChoiceCardGroup,
};

export default meta;
type Story = StoryObj<typeof ChoiceCardGroup>;

/* GlowScan onboarding: cilt hedefi secimi */
const ciltHedefleri: ChoiceCardOption[] = [
  {
    value: "nem",
    icon: <Droplets />,
    title: "Nem ve Bariyer",
    description: "Kuruluk, pullanma ve gerginlik hissini azaltmak istiyorum.",
    badge: "En Popüler",
  },
  {
    value: "isilti",
    icon: <Sparkles />,
    title: "Işıltı ve Ton",
    description: "Mat, yorgun görünen cildime canlılık kazandırmak istiyorum.",
  },
  {
    value: "leke",
    icon: <Sun />,
    title: "Leke ve Güneş",
    description: "Güneş lekelerini ve ton eşitsizliğini azaltmayı hedefliyorum.",
  },
  {
    value: "gozenek",
    icon: <ScanFace />,
    title: "Gözenek ve Pürüz",
    description: "Belirgin gözenekleri ve pürüzlü dokuyu iyileştirmek istiyorum.",
  },
];

function CiltHedefiOrnek() {
  const [hedef, setHedef] = React.useState("nem");

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="space-y-1 text-center">
        <h2 className="text-lg font-semibold">Cildinde en çok neyi iyileştirmek istiyorsun?</h2>
        <p className="text-sm text-muted-foreground">
          Sana özel analiz akışını bu hedefe göre kuruyoruz.
        </p>
      </div>
      <ChoiceCardGroup
        options={ciltHedefleri}
        value={hedef}
        onValueChange={setHedef}
        columns={2}
        label="Cilt hedefi"
      />
    </div>
  );
}

export const CiltHedefi: Story = {
  render: () => <CiltHedefiOrnek />,
};

/* Fisly onboarding: kullanim amaci (emoji illustrasyon) */
const kullanimAmaclari: ChoiceCardOption[] = [
  {
    value: "kisisel",
    icon: "🧾",
    title: "Kişisel Bütçe",
    description: "Kendi gelir ve giderlerimi tek yerden takip etmek istiyorum.",
  },
  {
    value: "serbest",
    icon: "💼",
    title: "Serbest Çalışan",
    description: "Fatura kesip müşteri ödemelerimi düzenli izlemek istiyorum.",
    badge: "Önerilen",
  },
  {
    value: "isletme",
    icon: "🏪",
    title: "Küçük İşletme",
    description: "Ekip harcamalarını ve nakit akışını birlikte yönetiyoruz.",
  },
  {
    value: "muhasebe",
    icon: "📊",
    title: "Mali Müşavir",
    description: "Birden fazla müşterinin defterini tek panelden tutuyorum.",
    disabled: true,
  },
];

function KullanimAmaciOrnek() {
  const [amac, setAmac] = React.useState("serbest");

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Fisly&apos;yi ne için kullanacaksın?</h2>
        <p className="text-sm text-muted-foreground">
          Paneli ve raporları bu seçime göre kişiselleştiriyoruz.
        </p>
      </div>
      <ChoiceCardGroup
        options={kullanimAmaclari}
        value={amac}
        onValueChange={setAmac}
        columns={2}
        label="Kullanım amacı"
      />
      <p className="text-sm text-muted-foreground">
        Seçilen amaç: <span className="font-medium text-foreground">{amac}</span>
      </p>
    </div>
  );
}

export const KullanimAmaci: Story = {
  render: () => <KullanimAmaciOrnek />,
};

/* Tek kart varyantlari (grup olmadan) */
export const TekKart: Story = {
  render: () => (
    <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
      <ChoiceCard
        icon={<Sparkles />}
        title="Işıltı ve Ton"
        description="Mat cildime canlılık kazandırmak istiyorum."
        badge="Önerilen"
        selected
      />
      <ChoiceCard
        icon={<Droplets />}
        title="Nem ve Bariyer"
        description="Kuruluk ve gerginlik hissini azaltmak istiyorum."
      />
    </div>
  ),
};
