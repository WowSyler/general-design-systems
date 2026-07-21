import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductTourCoachmark, Button } from "@ds/ui";
import {
  Rocket,
  Activity,
  RotateCcw,
  Server,
  Camera,
  Sparkles,
  Heart,
  Play,
} from "lucide-react";

type ProductTourStep = React.ComponentProps<typeof ProductTourCoachmark>["steps"][number];

const meta: Meta<typeof ProductTourCoachmark> = {
  title: "Composites/Product Tour Coachmark",
  component: ProductTourCoachmark,
};
export default meta;

type Story = StoryObj<typeof ProductTourCoachmark>;

/* ------------------------------------------------------------------ */
/* 1) DeployLens masaustu dashboard turu                               */
/* ------------------------------------------------------------------ */

const dashboardSteps: ProductTourStep[] = [
  {
    target: "#dl-deploy",
    title: "Tek tikla dağıtım",
    description:
      "Yeni bir sürümü üretime almak için buradan başlıyorsunuz. DeployLens tüm adımları sizin için otomatikleştirir.",
    placement: "bottom",
  },
  {
    target: "#dl-metric",
    title: "Sağlık metrikleri",
    description:
      "Başarı oranı, gecikme ve hata bütçesi gerçek zamanlı olarak burada. Kritik eşik aşılırsa uyarı alırsınız.",
    placement: "bottom",
  },
  {
    target: "#dl-rollback",
    title: "Anında geri alma",
    description:
      "Bir dağıtım sorun çıkarırsa tek tıkla önceki kararlı sürüme dönebilirsiniz. Ortalama geri alma süresi 12 saniye.",
    placement: "left",
  },
  {
    target: "#dl-env",
    title: "Ortamlar arası geçiş",
    description:
      "Staging ve üretim ortamlarını buradan yönetin. Her ortamın kendi değişken seti ve erişim kuralları vardır.",
    placement: "top",
  },
];

function DashboardStage() {
  const [open, setOpen] = React.useState(true);
  const [step, setStep] = React.useState(0);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Dağıtım panosu
          </h1>
          <p className="text-sm text-muted-foreground">
            api-gateway · main dalı · son senkron 2 dk önce
          </p>
        </div>
        <button
          id="dl-deploy"
          className="inline-flex items-center gap-2 rounded-md bg-primary bg-sheen px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-all hover:shadow-md"
        >
          <Rocket className="size-4" aria-hidden="true" />
          Yeni dağıtım
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div
          id="dl-metric"
          className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="size-4 text-success" aria-hidden="true" />
            Başarı oranı
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-foreground">
            %99,4
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
          <div className="text-sm text-muted-foreground">P95 gecikme</div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-foreground">
            142 ms
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
          <div className="text-sm text-muted-foreground">Hata bütçesi</div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-foreground">
            %78
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-sm font-medium text-foreground">
            Son dağıtımlar
          </span>
          <div
            id="dl-env"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground"
          >
            <Server className="size-3.5 text-muted-foreground" aria-hidden="true" />
            Üretim
          </div>
        </div>
        <div className="divide-y">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="text-sm font-medium text-foreground">v2.14.0</div>
              <div className="text-xs text-muted-foreground">
                Ozan Küçük · 14 dk önce
              </div>
            </div>
            <button
              id="dl-rollback"
              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Geri al
            </button>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="text-sm font-medium text-foreground">v2.13.2</div>
              <div className="text-xs text-muted-foreground">
                Deniz Aksoy · 3 saat önce
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Kararlı</span>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setStep(0);
          setOpen(true);
        }}
      >
        <Play className="size-3.5" aria-hidden="true" />
        Turu yeniden başlat
      </Button>

      <ProductTourCoachmark
        steps={dashboardSteps}
        open={open}
        step={step}
        onStepChange={setStep}
        onOpenChange={setOpen}
      />
    </div>
  );
}

export const DashboardTuru: Story = {
  render: () => <DashboardStage />,
};

/* ------------------------------------------------------------------ */
/* 2) GlowScan mobil onboarding — konum varyasyonlari                  */
/* ------------------------------------------------------------------ */

const mobilSteps: ProductTourStep[] = [
  {
    target: "#gs-scan",
    title: "Cildini tara",
    description:
      "Ortadaki butona dokunarak yüzünü tara. GlowScan 40'tan fazla cilt işaretini saniyeler içinde analiz eder.",
    placement: "top",
  },
  {
    target: "#gs-routine",
    title: "Günlük rutinin",
    description:
      "Sana özel sabah ve akşam bakım adımların burada listelenir. Tamamladıkça seri puanın artar.",
    placement: "right",
  },
  {
    target: "#gs-profile",
    title: "Cilt günlüğün",
    description:
      "İlerlemeni fotoğraflarla takip et, analizlerin zaman içindeki değişimini gör.",
    placement: "bottom",
  },
];

function MobilStage() {
  const [open, setOpen] = React.useState(true);
  const [step, setStep] = React.useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-[320px] rounded-[2rem] border bg-card p-4 text-card-foreground shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Merhaba,</div>
            <div className="font-display text-lg font-semibold text-foreground">
              Selin
            </div>
          </div>
          <div
            id="gs-profile"
            className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
          >
            SK
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-brand-gradient p-4 text-primary-foreground">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="size-4" aria-hidden="true" />
            Cilt puanın
          </div>
          <div className="mt-1 text-3xl font-bold tabular-nums">82</div>
        </div>

        <div
          id="gs-routine"
          className="mt-4 rounded-xl border p-3"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Heart className="size-4 text-destructive" aria-hidden="true" />
            Akşam rutini
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            3 adımdan 1'i tamamlandı
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <button
            id="gs-scan"
            className="flex size-16 items-center justify-center rounded-full bg-primary bg-sheen text-primary-foreground shadow-glow transition-transform active:scale-95"
          >
            <Camera className="size-7" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setStep(0);
          setOpen(true);
        }}
      >
        <Play className="size-3.5" aria-hidden="true" />
        Tanıtımı tekrar göster
      </Button>

      <ProductTourCoachmark
        steps={mobilSteps}
        open={open}
        step={step}
        onStepChange={setStep}
        onOpenChange={setOpen}
      />
    </div>
  );
}

export const MobilOnboarding: Story = {
  render: () => <MobilStage />,
};

/* ------------------------------------------------------------------ */
/* 3) Dolap — karartmasiz tekil ipucu                                  */
/* ------------------------------------------------------------------ */

const ipucuSteps: ProductTourStep[] = [
  {
    target: "#dolap-sat",
    title: "Yeni özellik: Hızlı satış",
    description:
      "Artık dolabındaki bir ürünü tek fotoğrafla listeleyebilirsin. Fiyatı biz öneriyoruz, sen onaylıyorsun.",
    placement: "bottom",
  },
];

function IpucuStage() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Dolabım
          </h2>
          <button
            id="dolap-sat"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-all hover:shadow-md"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Ürün sat
          </button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Henüz aktif ilanın yok. Gardırobundaki kullanmadığın parçaları
          listeleyerek kazanmaya başla.
        </p>
      </div>

      {!open ? (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Play className="size-3.5" aria-hidden="true" />
          İpucunu tekrar göster
        </Button>
      ) : null}

      <ProductTourCoachmark
        steps={ipucuSteps}
        open={open}
        onOpenChange={setOpen}
        overlay={false}
      />
    </div>
  );
}

export const KarartmasizIpucu: Story = {
  render: () => <IpucuStage />,
};
