import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Toaster, toast } from "@wowsyler/ds-ui";

/**
 * Toaster (sonner) — geçici bildirimler. Uygulama kökünde bir kez `<Toaster />`
 * render edilir, bildirimler her yerden `toast()` ile gösterilir.
 * DsThemeProvider içindeyse açık/koyu mod ve RTL yönü otomatik uygulanır.
 */
const meta: Meta<typeof Toaster> = {
  title: "Primitives/Toaster (Sonner)",
  component: Toaster,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Toaster>;

function Demo() {
  return (
    <div className="flex max-w-full flex-wrap justify-center gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast.success("Randevu onaylandı", {
            description: "Salı 14:30 — Saç kesimi, Merve Hanım",
          })
        }
      >
        Başarılı
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Ödeme alınamadı", {
            description: "Kart limitiniz yetersiz görünüyor.",
            action: { label: "Tekrar dene", onClick: () => undefined },
          })
        }
      >
        Hata
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(new Promise((r) => setTimeout(r, 1500)), {
            loading: "Fiş taranıyor…",
            success: "Fiş kaydedildi: 248,90 ₺",
            error: "Fiş okunamadı",
          })
        }
      >
        Süreç (promise)
      </Button>
      <Toaster richColors={false} />
    </div>
  );
}

export const Etkilesimli: Story = {
  name: "Etkileşimli tetikleyiciler",
  render: () => <Demo />,
};

/** Açılışta bildirim yığını gösterir — statik önizlemede de görünür */
function Stack() {
  React.useEffect(() => {
    toast("Yeni mesaj", { id: "st-1", description: "Elif: Ceket hâlâ satılık mı?" });
    toast.success("Deploy tamamlandı", { id: "st-2", description: "main → production · 42 sn" });
    toast.warning("Bütçe %85 doldu", { id: "st-3", description: "Market kategorisi — 1.700 / 2.000 ₺" });
    return () => {
      toast.dismiss();
    };
  }, []);
  return <Toaster expand duration={Infinity} />;
}

export const Yigin: Story = {
  name: "Bildirim yığını (açık)",
  render: () => <Stack />,
};
