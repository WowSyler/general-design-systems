import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Code2,
  Eye,
  Info,
  PanelLeftClose,
  PanelRightClose,
  ScrollText,
  Split,
} from "lucide-react";

import {
  Badge,
  Button,
  ResizableSplitPane,
} from "@wowsyler/ds-ui";

const meta: Meta<typeof ResizableSplitPane> = {
  title: "Layout/ResizableSplitPane",
  component: ResizableSplitPane,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ResizableSplitPane>;

type LogLevel = "info" | "success" | "warning";

const logKayitlari: {
  saat: string;
  seviye: LogLevel;
  mesaj: string;
}[] = [
  { saat: "14:02:11", seviye: "info", mesaj: "Derleme başlatıldı — commit a1f9c2e" },
  { saat: "14:02:14", seviye: "info", mesaj: "Bağımlılıklar çözümleniyor (pnpm install)" },
  { saat: "14:02:39", seviye: "success", mesaj: "Bağımlılıklar 25s içinde yüklendi" },
  { saat: "14:02:41", seviye: "info", mesaj: "Vite üretim derlemesi çalışıyor" },
  { saat: "14:03:02", seviye: "warning", mesaj: "Kullanılmayan import: utils/date.ts:12" },
  { saat: "14:03:18", seviye: "success", mesaj: "Derleme tamamlandı — 4 sayfa üretildi" },
  { saat: "14:03:20", seviye: "info", mesaj: "Edge ağına dağıtım kuyruğa alındı" },
  { saat: "14:03:44", seviye: "success", mesaj: "Yayında: deploylens-app.vercel.app" },
];

const seviyeStili: Record<LogLevel, { renk: string; ikon: React.ReactNode }> = {
  info: {
    renk: "text-info",
    ikon: <Info className="mt-0.5 size-3.5 shrink-0 text-info" />,
  },
  success: {
    renk: "text-success",
    ikon: <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />,
  },
  warning: {
    renk: "text-warning",
    ikon: <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" />,
  },
};

export const Default: Story = {
  name: "Log ve Detay (DeployLens)",
  render: () => (
    <ResizableSplitPane
      className="h-[440px]"
      defaultRatio={58}
      min={30}
      max={80}
      first={
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5 text-sm font-medium">
            <ScrollText className="size-4 text-muted-foreground" />
            Derleme günlüğü
            <Badge variant="secondary" className="ml-auto tabular-nums">
              {logKayitlari.length} satır
            </Badge>
          </div>
          <div className="flex-1 space-y-1.5 overflow-auto p-3 font-mono text-xs">
            {logKayitlari.map((log, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted/60"
              >
                <span className="tabular-nums text-muted-foreground">{log.saat}</span>
                {seviyeStili[log.seviye].ikon}
                <span className="text-foreground">{log.mesaj}</span>
              </div>
            ))}
          </div>
        </div>
      }
      second={
        <div className="flex h-full flex-col">
          <div className="border-b border-border bg-muted/40 px-4 py-2.5 text-sm font-medium">
            Dağıtım detayı
          </div>
          <div className="flex-1 space-y-4 overflow-auto p-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-success" />
              <span className="font-medium">Başarılı</span>
              <Badge className="ml-auto bg-success/15 text-success">yayında</Badge>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Ortam</dt>
                <dd className="font-medium">Production</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Süre</dt>
                <dd className="font-medium tabular-nums">1 dk 33 sn</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Commit</dt>
                <dd className="font-mono text-xs">a1f9c2e</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Tetikleyen</dt>
                <dd className="font-medium">Zeynep Kaya</dd>
              </div>
            </dl>
            <p className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              Ortadaki kolu sürükleyerek bölmeleri yeniden boyutlandırın. Çift
              tıklayarak varsayılana dönün; klavye ile ok tuşlarını kullanın.
            </p>
          </div>
        </div>
      }
    />
  ),
};

export const DikeyKodOnizleme: Story = {
  name: "Kod ve Önizleme (Dikey)",
  render: () => (
    <ResizableSplitPane
      direction="vertical"
      className="h-[520px]"
      defaultRatio={45}
      min={20}
      max={75}
      first={
        <div className="flex h-full flex-col bg-muted/30">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-sm font-medium">
            <Code2 className="size-4 text-muted-foreground" />
            button.tsx
          </div>
          <pre className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground">
            {`export function Button({ label }: Props) {
  return (
    <button className="btn-primary">
      {label}
    </button>
  );
}`}
          </pre>
        </div>
      }
      second={
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5 text-sm font-medium">
            <Eye className="size-4 text-muted-foreground" />
            Canlı önizleme
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto bg-background p-6">
            <Button size="lg">Şimdi Dağıt</Button>
          </div>
        </div>
      }
    />
  ),
};

export const Kontrollu: Story = {
  name: "Kontrollü Oran",
  render: () => {
    const [oran, setOran] = React.useState(50);
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setOran(25)}>
            <PanelLeftClose className="size-4" /> Sola daralt
          </Button>
          <Button variant="outline" size="sm" onClick={() => setOran(50)}>
            <Split className="size-4" /> Eşitle
          </Button>
          <Button variant="outline" size="sm" onClick={() => setOran(75)}>
            <PanelRightClose className="size-4" /> Sağa genişlet
          </Button>
          <Badge variant="secondary" className="ml-auto tabular-nums">
            Sol panel: %{Math.round(oran)}
          </Badge>
        </div>
        <ResizableSplitPane
          className="h-[360px]"
          ratio={oran}
          onRatioChange={setOran}
          min={15}
          max={85}
          first={
            <div className="flex h-full items-center justify-center bg-muted/30 p-4 text-sm font-medium text-muted-foreground">
              Filtreler
            </div>
          }
          second={
            <div className="flex h-full items-center justify-center bg-background p-4 text-sm font-medium text-muted-foreground">
              Sonuç listesi
            </div>
          }
        />
        <p className="text-xs text-muted-foreground">
          Oran dışarıdan kontrol edilir: butonlar oranı belirler, sürükleme ise{" "}
          <code className="font-mono">onRatioChange</code> ile state&apos;i günceller.
        </p>
      </div>
    );
  },
};
