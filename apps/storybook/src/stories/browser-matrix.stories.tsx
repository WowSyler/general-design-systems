import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chrome, Compass, Flame, Globe } from "lucide-react";

import { BrowserMatrix } from "@wowsyler/ds-ui";

type Column = React.ComponentProps<typeof BrowserMatrix>["columns"][number];
type Row = React.ComponentProps<typeof BrowserMatrix>["rows"][number];

const meta: Meta<typeof BrowserMatrix> = {
  title: "Composites/BrowserMatrix",
  component: BrowserMatrix,
};

export default meta;
type Story = StoryObj<typeof BrowserMatrix>;

// DeployLens gorsel test kucukresmi: hafif bir SVG mockup (tema-notr placeholder).
const shot = (tint: string, tag: string): string => {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='100'>` +
    `<rect width='160' height='100' fill='rgb(244,246,251)'/>` +
    `<rect width='160' height='16' fill='${tint}'/>` +
    `<circle cx='9' cy='8' r='3' fill='rgba(255,255,255,0.7)'/>` +
    `<rect x='10' y='30' width='140' height='10' rx='3' fill='rgb(209,215,226)'/>` +
    `<rect x='10' y='48' width='108' height='10' rx='3' fill='rgb(209,215,226)'/>` +
    `<rect x='10' y='70' width='58' height='20' rx='5' fill='${tint}'/>` +
    `<rect x='78' y='70' width='42' height='20' rx='5' fill='rgb(224,228,238)'/>` +
    `<text x='151' y='96' font-family='sans-serif' font-size='9' fill='rgb(150,160,178)' text-anchor='end'>${tag}</text>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const primary = "rgb(99,102,241)";
const brand = "rgb(20,184,166)";

const tarayicilar = {
  chrome: { name: "Chrome", version: "126", icon: <Chrome className="size-4" /> },
  safari: { name: "Safari", version: "17.5", icon: <Compass className="size-4" /> },
  firefox: { name: "Firefox", version: "128", icon: <Flame className="size-4" /> },
  edge: { name: "Edge", version: "126", icon: <Globe className="size-4" /> },
};

const ortamlar: Column[] = [
  { label: "Masaüstü", device: "desktop", hint: "1440×900" },
  { label: "Tablet", device: "tablet", hint: "834×1112" },
  { label: "Mobil", device: "mobile", hint: "390×844" },
];

// DeployLens: bir PR'in gorsel gerileme (visual regression) sonucu — kucukresimli.
const gorselSatirlar: Row[] = [
  {
    browser: tarayicilar.chrome,
    cells: [
      { status: "passed", thumbnail: shot(primary, "1440×900") },
      { status: "passed", thumbnail: shot(primary, "834×1112") },
      { status: "passed", thumbnail: shot(primary, "390×844") },
    ],
  },
  {
    browser: tarayicilar.safari,
    cells: [
      { status: "passed", thumbnail: shot(brand, "1440×900") },
      { status: "warning", thumbnail: shot(brand, "834×1112"), note: "Yazı tipi kayması" },
      { status: "passed", thumbnail: shot(brand, "390×844") },
    ],
  },
  {
    browser: tarayicilar.firefox,
    cells: [
      { status: "passed", thumbnail: shot(primary, "1440×900") },
      { status: "passed", thumbnail: shot(primary, "834×1112") },
      { status: "failed", thumbnail: shot(primary, "390×844"), note: "12px taşma" },
    ],
  },
  {
    browser: tarayicilar.edge,
    cells: [
      { status: "passed", thumbnail: shot(brand, "1440×900") },
      { status: "passed", thumbnail: shot(brand, "834×1112") },
      { status: "skipped", note: "Çalıştırılmadı" },
    ],
  },
];

export const GorselTestMatrisi: Story = {
  args: {
    title: "Ödeme akışı · Görsel regresyon",
    subtitle: "Deneme kapsamı 12 ekran · 4 tarayıcı × 3 viewport",
    commit: "a1b2c3d",
    capturedAt: "6 dk önce",
    columns: ortamlar,
    rows: gorselSatirlar,
    className: "max-w-4xl",
  },
};

// Kompakt ikon-only matris (kucukresim yok) — hizli uyumluluk ozeti.
const kompaktSatirlar: Row[] = [
  {
    browser: tarayicilar.chrome,
    cells: [{ status: "passed" }, { status: "passed" }, { status: "passed" }],
  },
  {
    browser: tarayicilar.safari,
    cells: [
      { status: "passed" },
      { status: "passed" },
      { status: "warning", note: "Sticky başlık" },
    ],
  },
  {
    browser: tarayicilar.firefox,
    cells: [{ status: "passed" }, { status: "warning" }, { status: "passed" }],
  },
  {
    browser: tarayicilar.edge,
    cells: [{ status: "passed" }, { status: "passed" }, { status: "passed" }],
  },
];

export const KompaktOzet: Story = {
  args: {
    title: "Kontrol paneli uyumluluğu",
    subtitle: "Nightly çalıştırma · main dalı",
    commit: "9f4e2a1",
    capturedAt: "bugün 04:00",
    columns: ortamlar,
    rows: kompaktSatirlar,
    className: "max-w-2xl",
  },
};

// Kritik gerileme senaryosu — birden cok gecmedi/uyari, dikkat cekici ozet.
const gerilemeSatirlar: Row[] = [
  {
    browser: tarayicilar.chrome,
    cells: [
      { status: "passed" },
      { status: "failed", note: "Buton hizalaması" },
      { status: "passed" },
    ],
  },
  {
    browser: tarayicilar.safari,
    cells: [
      { status: "failed", note: "Grid çöktü" },
      { status: "failed", note: "Grid çöktü" },
      { status: "warning", note: "Kontrast düşük" },
    ],
  },
  {
    browser: tarayicilar.firefox,
    cells: [
      { status: "warning", note: "Gölge farkı" },
      { status: "passed" },
      { status: "failed", note: "Menü açılmıyor" },
    ],
  },
  {
    browser: tarayicilar.edge,
    cells: [{ status: "passed" }, { status: "passed" }, { status: "skipped" }],
  },
];

export const KritikGerileme: Story = {
  args: {
    title: "Yeniden tasarım · Regresyon uyarısı",
    subtitle: "PR #482 birleştirme öncesi engelleyici testler",
    commit: "c7d9e05",
    capturedAt: "2 dk önce",
    columns: ortamlar,
    rows: gerilemeSatirlar,
    className: "max-w-2xl",
  },
};
