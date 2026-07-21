import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SafeArea } from "@ds/ui";
import { Home, Search, Bell, User } from "lucide-react";

const meta: Meta<typeof SafeArea> = {
  title: "Layout/SafeArea",
  component: SafeArea,
};

export default meta;
type Story = StoryObj<typeof SafeArea>;

/**
 * Storybook masaustunde gercek bir `env(safe-area-inset-*)` degeri olmadigindan,
 * hikayeler `base` prop'u ile taban dolguyu gorunur kilar ve bir telefon cercevesi
 * icinde centik/home-bar bolgelerini simule eder. Gercek cihazda env() degeri
 * base'den buyukse otomatik olarak o kullanilir.
 */
const PhoneFrame = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-[2.5rem] border-4 border-foreground/80 bg-background shadow-lg">
    {/* Centik (notch) */}
    <div className="relative flex h-6 items-center justify-center bg-foreground/80">
      <div className="h-1.5 w-16 rounded-full bg-background/40" />
    </div>
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <SafeArea
      base="1.25rem"
      className="bg-primary text-primary-foreground"
    >
      <div className="rounded-md bg-primary-foreground/10 p-4 text-sm font-medium">
        Tüm kenarlarda güvenli alan dolgusu (sides=&quot;all&quot;). İçerik,
        çentik ve kavisli köşelerden en az{" "}
        <code className="font-mono">base</code> kadar uzak durur.
      </div>
    </SafeArea>
  ),
};

export const BottomNav: Story = {
  name: "Alt Navigasyon (home-bar)",
  render: () => (
    <PhoneFrame>
      <div className="flex h-[420px] flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-base font-semibold text-foreground">
            Dolap — Gardırobum
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Alt navigasyon çubuğu, home-bar bölgesine denk gelmemesi için{" "}
            <code className="font-mono">SafeArea</code> ile alttan güvenli alan
            dolgusu alır. Böylece dokunma hedefleri çubuğa kadar itilmez.
          </p>
        </div>
        <SafeArea
          sides="bottom"
          base="0.5rem"
          className="border-t border-border bg-card"
        >
          <nav className="flex items-stretch justify-around">
            {[
              { icon: Home, label: "Ana Sayfa", active: true },
              { icon: Search, label: "Keşfet", active: false },
              { icon: Bell, label: "Bildirim", active: false },
              { icon: User, label: "Profil", active: false },
            ].map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}
          </nav>
        </SafeArea>
      </div>
    </PhoneFrame>
  ),
};

export const Sides: Story = {
  name: "Kenar Seçenekleri",
  render: () => (
    <div className="flex flex-col gap-4">
      <SafeArea
        sides="top"
        base="1.5rem"
        className="rounded-lg bg-info/15 ring-1 ring-info/40"
      >
        <div className="px-4 pb-4 text-sm text-foreground">
          <span className="font-mono font-semibold">sides=&quot;top&quot;</span>{" "}
          — yalnızca üstten dolgu (durum çubuğu / çentik altı başlık).
        </div>
      </SafeArea>

      <SafeArea
        sides="x"
        base="1.5rem"
        className="rounded-lg bg-success/15 ring-1 ring-success/40"
      >
        <div className="py-4 text-sm text-foreground">
          <span className="font-mono font-semibold">sides=&quot;x&quot;</span> —
          yatay (sol + sağ) dolgu; yatay moddaki kavisli kenarlar için.
        </div>
      </SafeArea>

      <SafeArea
        sides={["top", "x"]}
        base="1.5rem"
        className="rounded-lg bg-warning/15 ring-1 ring-warning/40"
      >
        <div className="pb-4 text-sm text-foreground">
          <span className="font-mono font-semibold">
            sides=&#123;[&quot;top&quot;, &quot;x&quot;]&#125;
          </span>{" "}
          — dizi ile birden çok kenar (üst + yatay).
        </div>
      </SafeArea>
    </div>
  ),
};
