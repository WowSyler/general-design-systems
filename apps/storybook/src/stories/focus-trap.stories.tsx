import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { KeyRound, Trash2, X } from "lucide-react";

import { FocusTrap, Button } from "@ds/ui";

const meta: Meta<typeof FocusTrap> = {
  title: "Primitives/FocusTrap",
  component: FocusTrap,
};

export default meta;
type Story = StoryObj<typeof FocusTrap>;

/**
 * Randevu iptal onayi: tetikleyiciye basinca ustte bir onay katmani acilir ve
 * odak yalnizca katmanin icinde dolasir. Escape ya da "Vazgec" ile kapaninca
 * odak yeniden tetikleyici butona doner (restoreFocus).
 */
export const RandevuIptalOnayi: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Trash2 aria-hidden="true" />
          Randevuyu iptal et
        </Button>

        {open ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
            <FocusTrap
              role="dialog"
              aria-modal="true"
              aria-labelledby="iptal-baslik"
              onEscape={() => setOpen(false)}
              className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl animate-fade-up"
            >
              <h2 id="iptal-baslik" className="text-lg font-semibold">
                Randevuyu iptal etmek istiyor musunuz?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                14 Temmuz Salı 15:30 — Saç Kesimi randevunuz kalıcı olarak
                silinecek. Bu işlem geri alınamaz.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Vazgeç
                </Button>
                <Button variant="destructive" onClick={() => setOpen(false)}>
                  Evet, iptal et
                </Button>
              </div>
            </FocusTrap>
          </div>
        ) : null}
      </div>
    );
  },
};

/**
 * initialFocusRef ile ilk odak, ilk odaklanabilir ogeye degil dogrudan parola
 * alanina verilir. Tab/Shift+Tab odagi form icinde tutar.
 */
export const ParolaFormuIlkOdak: Story = {
  render: () => {
    const parolaRef = React.useRef<HTMLInputElement>(null);
    return (
      <FocusTrap
        initialFocusRef={parolaRef}
        aria-label="Hesap doğrulama"
        className="mx-auto w-full max-w-sm rounded-xl border border-border bg-card p-6 text-card-foreground shadow-md"
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <KeyRound className="size-4 text-primary" aria-hidden="true" />
          Fisly — Hesap Doğrulama
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Devam etmek için parolanızı yeniden girin.
        </p>
        <div className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="ft-eposta" className="text-sm font-medium">
              E-posta
            </label>
            <input
              id="ft-eposta"
              type="email"
              defaultValue="ozan@fisly.app"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="ft-parola" className="text-sm font-medium">
              Parola
            </label>
            <input
              id="ft-parola"
              ref={parolaRef}
              type="password"
              placeholder="••••••••"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>
        <Button className="mt-5 w-full">Doğrula ve devam et</Button>
      </FocusTrap>
    );
  },
};

/**
 * Ayni panel active açık/kapalı karşılaştırması. Sağdaki tuzak kapalı olduğunda
 * (active=false) Tab odağı panel dışına serbestçe çıkar.
 */
export const EtkinVeDevreDisi: Story = {
  render: () => {
    const Panel = ({ active }: { active: boolean }) => (
      <FocusTrap
        active={active}
        autoFocus={false}
        aria-label={active ? "Tuzak etkin panel" : "Tuzak kapalı panel"}
        className="flex-1 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">
            {active ? "Tuzak etkin" : "Tuzak kapalı"}
          </span>
          <X className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {active
            ? "Tab odağı bu üç butonun içinde döner."
            : "Tab odağı serbestçe dışarı çıkar."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">
            Birinci
          </Button>
          <Button variant="secondary" size="sm">
            İkinci
          </Button>
          <Button variant="secondary" size="sm">
            Üçüncü
          </Button>
        </div>
      </FocusTrap>
    );
    return (
      <div className="flex w-full max-w-2xl gap-4">
        <Panel active />
        <Panel active={false} />
      </div>
    );
  },
};
