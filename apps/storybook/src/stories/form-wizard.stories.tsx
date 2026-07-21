import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { CalendarCheck, CheckCircle2, Rocket } from "lucide-react";

import {
  Button,
  Checkbox,
  FormWizard,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@ds/ui";

type FormWizardStep = React.ComponentProps<typeof FormWizard>["steps"][number];

const meta: Meta<typeof FormWizard> = {
  title: "Composites/FormWizard",
  component: FormWizard,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-2xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FormWizard>;

/* Randevu — 3 adimli rezervasyon sihirbazi (canli dogrulama gecidi). */
export const RandevuRezervasyonu: Story = {
  name: "Randevu Rezervasyonu (canlı)",
  render: () => {
    const [hizmet, setHizmet] = React.useState("");
    const [ad, setAd] = React.useState("");
    const [telefon, setTelefon] = React.useState("");
    const [onay, setOnay] = React.useState(false);
    const [tamam, setTamam] = React.useState(false);

    if (tamam) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-10 text-center animate-fade-up">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-success/10 text-success ring-1 ring-inset ring-success/20">
            <CalendarCheck className="size-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Randevun oluşturuldu
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            {ad} adına {hizmet.toLowerCase()} randevusu alındı. Onay mesajı{" "}
            <span className="font-medium text-foreground">{telefon}</span>{" "}
            numarasına gönderildi.
          </p>
          <Button variant="outline" onClick={() => setTamam(false)}>
            Yeni randevu oluştur
          </Button>
        </div>
      );
    }

    const steps: FormWizardStep[] = [
      {
        title: "Hizmet",
        description: "Bir hizmet seçin",
        canProceed: hizmet !== "",
        content: (
          <RadioGroup value={hizmet} onValueChange={setHizmet} className="gap-2">
            {["Saç kesimi", "Sakal düzeltme", "Cilt bakımı"].map((secenek) => (
              <Label
                key={secenek}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-sm font-medium transition-colors hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem value={secenek} />
                {secenek}
              </Label>
            ))}
          </RadioGroup>
        ),
      },
      {
        title: "İletişim",
        description: "Sizi nasıl bilgilendirelim?",
        canProceed: ad.trim().length > 1 && telefon.trim().length >= 10,
        content: (
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="fw-ad">Ad Soyad</Label>
              <Input
                id="fw-ad"
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                placeholder="Elif Yılmaz"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="fw-tel">Telefon</Label>
              <Input
                id="fw-tel"
                type="tel"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder="0555 000 00 00"
              />
            </div>
          </div>
        ),
      },
      {
        title: "Onay",
        description: "Son bir adım kaldı",
        canProceed: onay,
        content: (
          <div className="space-y-4">
            <dl className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-muted/30 p-4 text-sm">
              <dt className="text-muted-foreground">Hizmet</dt>
              <dd className="col-span-2 font-medium text-foreground">
                {hizmet || "—"}
              </dd>
              <dt className="text-muted-foreground">Ad Soyad</dt>
              <dd className="col-span-2 font-medium text-foreground">
                {ad || "—"}
              </dd>
              <dt className="text-muted-foreground">Telefon</dt>
              <dd className="col-span-2 font-medium tabular-nums text-foreground">
                {telefon || "—"}
              </dd>
            </dl>
            <Label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
              <Checkbox
                checked={onay}
                onCheckedChange={(v) => setOnay(v === true)}
                className="mt-0.5"
              />
              <span>
                İptal koşullarını okudum ve randevu saatinden 2 saat önce
                ücretsiz iptal hakkım olduğunu kabul ediyorum.
              </span>
            </Label>
          </div>
        ),
      },
    ];

    return (
      <FormWizard
        steps={steps}
        completeLabel="Randevuyu onayla"
        onComplete={() => setTamam(true)}
      />
    );
  },
};

/* DeployLens — proje kurulumu; Tamamla adiminda yukleniyor durumu. */
export const DeployLensKurulumu: Story = {
  name: "DeployLens Proje Kurulumu (yükleniyor)",
  render: () => {
    const [depo, setDepo] = React.useState("");
    const [dal, setDal] = React.useState("main");
    const [gizli, setGizli] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [deploy, setDeploy] = React.useState(false);

    if (deploy) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-10 text-center animate-fade-up">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
            <Rocket className="size-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            İlk dağıtım başlatıldı
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            <span className="font-mono text-foreground">{depo}</span> deposunun{" "}
            <span className="font-medium text-foreground">{dal}</span> dalı
            derleniyor. Önizleme birkaç dakika içinde hazır olacak.
          </p>
        </div>
      );
    }

    const steps: FormWizardStep[] = [
      {
        title: "Depo",
        description: "Git deposu",
        canProceed: depo.trim().length > 3,
        content: (
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="fw-depo">Depo adı</Label>
              <Input
                id="fw-depo"
                value={depo}
                onChange={(e) => setDepo(e.target.value)}
                placeholder="deploylens/api-gateway"
                className="font-mono"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="fw-dal">Üretim dalı</Label>
              <Input
                id="fw-dal"
                value={dal}
                onChange={(e) => setDal(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
        ),
      },
      {
        title: "Ortam",
        description: "Gizli anahtarlar",
        optional: true,
        content: (
          <div className="grid gap-1.5">
            <Label htmlFor="fw-gizli">DATABASE_URL</Label>
            <Input
              id="fw-gizli"
              type="password"
              value={gizli}
              onChange={(e) => setGizli(e.target.value)}
              placeholder="postgres://..."
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Bu adım isteğe bağlıdır; anahtarları sonra da ekleyebilirsiniz.
            </p>
          </div>
        ),
      },
      {
        title: "Dağıtım",
        description: "İlk derleme",
        content: (
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
            <p className="text-foreground">
              Her şey hazır. Tamamla düğmesine bastığınızda{" "}
              <span className="font-mono">{depo || "depo"}</span> için önizleme
              dağıtımı tetiklenecek.
            </p>
          </div>
        ),
      },
    ];

    return (
      <FormWizard
        steps={steps}
        loading={loading}
        completeLabel="Dağıtımı başlat"
        onComplete={() => {
          setLoading(true);
          window.setTimeout(() => {
            setLoading(false);
            setDeploy(true);
          }, 1200);
        }}
      />
    );
  },
};

/* GlowScan — statik onizleme; ikinci adim aktif, ilerleme cubugu kapali. */
export const GlowScanCiltProfili: Story = {
  name: "GlowScan Cilt Profili (statik)",
  args: {
    defaultStep: 1,
    showProgress: false,
    completeLabel: "Taramayı başlat",
    steps: [
      {
        title: "Yaş aralığı",
        content: <p className="text-sm text-muted-foreground">25–34 seçildi.</p>,
      },
      {
        title: "Cilt tipi",
        description: "Cildini en iyi tanımlayan seçenek",
        content: (
          <div className="flex flex-wrap gap-2">
            {["Kuru", "Karma", "Yağlı", "Hassas"].map((tip, i) => (
              <span
                key={tip}
                className={
                  i === 1
                    ? "rounded-full border border-primary bg-primary/5 px-3 py-1.5 text-sm font-medium text-foreground ring-2 ring-primary/15"
                    : "rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground"
                }
              >
                {tip}
              </span>
            ))}
          </div>
        ),
      },
      {
        title: "Hedefler",
        optional: true,
        content: (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
            Nem dengesi ve leke azaltma hedefleri kaydedildi.
          </p>
        ),
      },
    ],
  },
};
