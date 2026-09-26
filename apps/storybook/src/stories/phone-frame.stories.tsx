import type { Meta, StoryObj } from "@storybook/react-vite";
import { History, Home, ScanLine, Sparkles, User } from "lucide-react";

import { BottomNav, PhoneFrame, ProgressRing } from "@wowsyler/ds-ui";

const meta: Meta<typeof PhoneFrame> = {
  title: "Composites/PhoneFrame",
  component: PhoneFrame,
};

export default meta;
type Story = StoryObj<typeof PhoneFrame>;

export const GlowScanEkrani: Story = {
  render: () => (
    <PhoneFrame>
      <div className="flex flex-1 flex-col">
        <header className="px-5 pb-4 pt-6">
          <p className="text-xs text-muted-foreground">Günaydın, Elif</p>
          <h2 className="text-lg font-semibold">Cilt Skorun</h2>
        </header>
        <div className="flex flex-col items-center gap-3 px-5">
          <ProgressRing value={82} label="82" size={120} />
          <p className="text-sm text-muted-foreground">
            Dünden %4 daha iyi görünüyor
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-2 px-5">
          <div className="rounded-xl border bg-card p-3">
            <p className="text-sm font-medium">Nem oranı dengede</p>
            <p className="text-xs text-muted-foreground">
              Sabah rutinini aynen sürdür
            </p>
          </div>
          <div className="rounded-xl border bg-card p-3">
            <p className="text-sm font-medium">T bölgesinde parlama</p>
            <p className="text-xs text-muted-foreground">
              Öğlen matlaştırıcı öneriliyor
            </p>
          </div>
        </div>
        <BottomNav
          className="mt-auto"
          items={[
            { icon: <Home className="size-5" />, label: "Ana Sayfa", active: true },
            { icon: <History className="size-5" />, label: "Geçmiş" },
            { icon: <Sparkles className="size-5" />, label: "Öneriler" },
            { icon: <User className="size-5" />, label: "Profil" },
          ]}
          centerAction={<ScanLine className="size-6" />}
          centerActionLabel="Cilt taraması başlat"
        />
      </div>
    </PhoneFrame>
  ),
};

export const KucukBoy: Story = {
  render: () => (
    <PhoneFrame size="sm">
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <ScanLine className="size-10 text-primary" />
        <h2 className="text-base font-semibold">Taramaya hazır</h2>
        <p className="text-xs text-muted-foreground">
          Telefonu yüzüne 20 cm mesafede tut ve sabit kal
        </p>
      </div>
      <BottomNav
        items={[
          { icon: <Home className="size-5" />, label: "Ana Sayfa" },
          { icon: <History className="size-5" />, label: "Geçmiş" },
          { icon: <User className="size-5" />, label: "Profil", active: true },
        ]}
      />
    </PhoneFrame>
  ),
};
