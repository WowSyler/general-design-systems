import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { themes } from "@wowsyler/ds-tokens";

import {
  Badge,
  Button,
  DsThemeProvider,
  Input,
  ThemeDirectionToggle,
  ThemeModeToggle,
  ThemeSelect,
  useDsTheme,
} from "@wowsyler/ds-ui";

/**
 * DsThemeProvider — tema (5 proje), açık/koyu/sistem modu ve yazı yönünü
 * (ltr/rtl) yönetir. `applyTo="root"` gerçek uygulamalarda <html>'e,
 * `applyTo="self"` önizleme/iç içe temalarda bir sarmalayıcıya uygular.
 * ThemeModeToggle · ThemeSelect · ThemeDirectionToggle hazır kontrollerdir.
 */
const meta: Meta<typeof DsThemeProvider> = {
  title: "Foundations/ThemeProvider",
  component: DsThemeProvider,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof DsThemeProvider>;

const themeOptions = themes.map((t) => ({ name: t.name, label: t.label }));

function StatusLine() {
  const { theme, resolvedMode, dir } = useDsTheme();
  return (
    <p className="font-mono text-xs text-muted-foreground">
      tema: {theme} · mod: {resolvedMode} · yön: {dir}
    </p>
  );
}

function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ThemeSelect themes={themeOptions} />
      <ThemeModeToggle />
      <ThemeDirectionToggle />
    </div>
  );
}

function Sample() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <Input aria-label="Ara" placeholder="Hizmet ara…" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary">3 uygun saat</Badge>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" aria-label="Önceki gün">
            <ChevronLeft className="rtl:-scale-x-100" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Sonraki gün">
            <ChevronRight className="rtl:-scale-x-100" />
          </Button>
        </div>
      </div>
      <Button className="w-full">Randevu al</Button>
    </div>
  );
}

export const Kontroller: Story = {
  name: "Tema · mod · yön kontrolleri",
  render: () => (
    <DsThemeProvider
      applyTo="self"
      defaultTheme="randevu"
      defaultMode="light"
      className="w-[380px] max-w-full space-y-4 rounded-xl border border-border p-5 shadow-sm"
    >
      <Toolbar />
      <StatusLine />
      <Sample />
    </DsThemeProvider>
  ),
};

export const YonKarsilastirma: Story = {
  name: "LTR ve RTL yan yana",
  render: () => (
    <div className="grid w-[760px] max-w-full gap-4 sm:grid-cols-2">
      <DsThemeProvider
        applyTo="self"
        theme="fisly"
        mode="light"
        dir="ltr"
        className="space-y-3 rounded-xl border border-border p-5"
      >
        <StatusLine />
        <Sample />
      </DsThemeProvider>
      <DsThemeProvider
        applyTo="self"
        theme="fisly"
        mode="light"
        dir="rtl"
        className="space-y-3 rounded-xl border border-border p-5"
      >
        <StatusLine />
        <Sample />
      </DsThemeProvider>
    </div>
  ),
};

export const IcIceTemalar: Story = {
  name: "İç içe temalar (applyTo=self)",
  render: () => (
    <div className="grid w-[760px] max-w-full gap-3 sm:grid-cols-3">
      {(["glowscan", "dolap", "deploylens"] as const).map((name, i) => (
        <DsThemeProvider
          key={name}
          applyTo="self"
          theme={name}
          mode={i === 2 ? "dark" : "light"}
          className="space-y-3 rounded-xl border border-border p-4"
        >
          <StatusLine />
          <Button className="w-full">Birincil eylem</Button>
          <Button variant="outline" className="w-full">
            İkincil
          </Button>
        </DsThemeProvider>
      ))}
    </div>
  ),
};
