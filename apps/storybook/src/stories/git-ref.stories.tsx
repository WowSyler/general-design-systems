import type { Meta, StoryObj } from "@storybook/react-vite";

import { GitRef } from "@ds/ui";

const meta: Meta<typeof GitRef> = {
  title: "Primitives/GitRef",
  component: GitRef,
};

export default meta;
type Story = StoryObj<typeof GitRef>;

export const Varsayilan: Story = {
  args: {
    type: "branch",
    value: "main",
  },
};

/** Uc tur: dal (branch), commit ve etiket (tag) — her biri kendi tonuyla. */
export const Turler: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <GitRef type="branch" value="feat/checkout-akisi" />
      <GitRef type="commit" value="a3f92c1e9b4" display="a3f92c1" />
      <GitRef type="tag" value="v2.4.0" />
    </div>
  ),
};

/** Iki boyut: liste satirlari icin sm, tekil vurgu icin md. */
export const Boyutlar: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <GitRef size="sm" type="branch" value="fix/oturum-suresi" />
      <GitRef size="md" type="branch" value="fix/oturum-suresi" />
    </div>
  ),
};

/** DeployLens — kopyalanabilir referanslar (tam hash panoya, kisa hash ekranda). */
export const Kopyalanabilir: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <GitRef type="branch" value="release/2026.7" copyable />
      <GitRef
        type="commit"
        value="7b1e0d4c8a2f5619"
        display="7b1e0d4"
        copyable
      />
      <GitRef type="tag" value="v2.4.0-rc.1" copyable />
    </div>
  ),
};

/** DeployLens — deploy satirlarinda inline dal + commit + surum etiketi. */
export const DeployLensDeployListesi: Story = {
  render: () => {
    const deployler = [
      {
        id: "dpl_8f21",
        dal: "main",
        commit: "a3f92c1e",
        tag: "v2.4.0",
        mesaj: "Ödeme akışında kur dönüşümü düzeltildi",
      },
      {
        id: "dpl_8f20",
        dal: "feat/checkout-akisi",
        commit: "7b1e0d4c",
        tag: null,
        mesaj: "Sepet özeti bileşeni eklendi",
      },
      {
        id: "dpl_8f1f",
        dal: "fix/oturum-suresi",
        commit: "c92aa081",
        tag: null,
        mesaj: "Token yenileme aralığı 15 dk'ya çekildi",
      },
    ];

    return (
      <div className="w-[32rem] divide-y divide-border rounded-lg border bg-card">
        {deployler.map((d) => (
          <div key={d.id} className="flex flex-col gap-2 px-4 py-3">
            <p className="truncate text-sm font-medium text-foreground">
              {d.mesaj}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <GitRef size="sm" type="branch" value={d.dal} />
              <GitRef
                size="sm"
                type="commit"
                value={`${d.commit}f5619b2`}
                display={d.commit}
                copyable
              />
              {d.tag ? (
                <GitRef size="sm" type="tag" value={d.tag} />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
