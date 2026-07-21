import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowDownToLine, Menu, Search } from "lucide-react";

import { SkipLink, SkipLinkGroup } from "@ds/ui";

const meta: Meta<typeof SkipLink> = {
  title: "Primitives/SkipLink",
  component: SkipLink,
};

export default meta;
type Story = StoryObj<typeof SkipLink>;

/**
 * Bağlantı normalde gizlidir (sr-only). Panele tıklayıp Tab tuşuna
 * basıldığında sol-üst köşede belirir. Ekran okuyucu ve klavye
 * kullanıcıları tekrar eden gezinme bloklarını atlayabilir.
 */
export const Varsayilan: Story = {
  render: () => (
    <div className="relative min-h-40 rounded-lg border border-dashed border-border p-6">
      <SkipLink href="#ana-icerik">
        <ArrowDownToLine aria-hidden="true" />
        İçeriğe atla
      </SkipLink>
      <p className="text-sm text-muted-foreground">
        Bu alana tıklayıp <span className="font-medium text-foreground">Tab</span>{" "}
        tuşuna basın: gizli “İçeriğe atla” bağlantısı sol-üstte belirir.
      </p>
      <main id="ana-icerik" className="mt-4 text-sm">
        Ana içerik buradan başlar.
      </main>
    </div>
  ),
};

/**
 * Bağlantının odaklanınca aldığı görünüm — üç varyantla önizleme.
 * (Gerçekte yalnızca klavye focus'unda görünür.)
 */
export const GorunurOnizleme: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <SkipLink
        href="#ana-icerik"
        variant="default"
        className="not-sr-only relative inset-auto z-auto inline-flex items-center gap-2 px-4 py-2"
      >
        <ArrowDownToLine aria-hidden="true" />
        İçeriğe atla
      </SkipLink>
      <SkipLink
        href="#ana-icerik"
        variant="secondary"
        className="not-sr-only relative inset-auto z-auto inline-flex items-center gap-2 px-4 py-2"
      >
        <ArrowDownToLine aria-hidden="true" />
        İçeriğe atla
      </SkipLink>
      <SkipLink
        href="#ana-icerik"
        variant="outline"
        className="not-sr-only relative inset-auto z-auto inline-flex items-center gap-2 px-4 py-2"
      >
        <ArrowDownToLine aria-hidden="true" />
        İçeriğe atla
      </SkipLink>
    </div>
  ),
};

/**
 * DeployLens uygulama kabuğunun en başı: birden fazla atlama bağlantısı
 * SkipLinkGroup içinde gruplanır. Tab ile sırasıyla gezinme, arama ve
 * ana içerik hedeflerine atlanabilir.
 */
export const DeployLensUygulamaKabugu: Story = {
  render: () => (
    <div className="relative overflow-hidden rounded-xl border border-border">
      <SkipLinkGroup label="Atlama bağlantıları">
        <SkipLink href="#gezinme">
          <ArrowDownToLine aria-hidden="true" />
          Gezinmeye atla
        </SkipLink>
        <SkipLink href="#ana-icerik" variant="secondary">
          <ArrowDownToLine aria-hidden="true" />
          İçeriğe atla
        </SkipLink>
      </SkipLinkGroup>

      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Menu className="size-4 text-muted-foreground" aria-hidden="true" />
          DeployLens
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Search className="size-4" aria-hidden="true" />
          <span>Ara</span>
        </div>
      </header>

      <div className="grid grid-cols-[10rem_1fr]">
        <nav
          id="gezinme"
          aria-label="Ana gezinme"
          className="space-y-1 border-r border-border bg-muted/40 p-3 text-sm"
        >
          <div className="rounded-md bg-primary/10 px-2 py-1.5 font-medium text-primary">
            Dağıtımlar
          </div>
          <div className="px-2 py-1.5 text-muted-foreground">Ortamlar</div>
          <div className="px-2 py-1.5 text-muted-foreground">Günlükler</div>
        </nav>
        <main id="ana-icerik" className="p-4 text-sm">
          <h2 className="mb-1 font-semibold">Son dağıtımlar</h2>
          <p className="text-muted-foreground">
            Panele tıklayıp <span className="font-medium text-foreground">Tab</span>{" "}
            tuşuna basın; atlama bağlantıları sol-üstte tek tek belirir.
          </p>
        </main>
      </div>
    </div>
  ),
};
