import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings2, Trash2, UserPlus } from "lucide-react";

import {
  Button,
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogRoot,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@ds/ui";

const meta: Meta<typeof ResponsiveDialog> = {
  title: "Composites/ResponsiveDialog",
  component: ResponsiveDialog,
};

export default meta;
type Story = StoryObj<typeof ResponsiveDialog>;

/**
 * Masaustunde (md+) merkezi diyalog, mobilde alttan cekmece. Storybook'ta
 * ustteki viewport aracindan "Mobil"i secerek ayni bilesenin cekmece olarak
 * acildigini gorebilirsiniz.
 */
export const Varsayilan: Story = {
  render: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <ResponsiveDialog
        title="Hesabı sil"
        description="Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak kaldırılacak."
        trigger={
          <Button variant="destructive">
            <Trash2 /> Hesabı sil
          </Button>
        }
        footer={
          <>
            <ResponsiveDialogClose asChild>
              <Button variant="outline">Vazgeç</Button>
            </ResponsiveDialogClose>
            <ResponsiveDialogClose asChild>
              <Button variant="destructive">Evet, sil</Button>
            </ResponsiveDialogClose>
          </>
        }
      >
        <p className="text-muted-foreground">
          Silme işlemini onaylamak için aşağıdaki butona dokunun. Devam
          etmeden önce yedeklerinizi indirdiğinizden emin olun.
        </p>
      </ResponsiveDialog>
    </div>
  ),
};

/**
 * Ayni bilesen mobil viewport'ta alttan acilan bir cekmeceye donusur; dokunma
 * hedefleri buyur, altlik butonlari tam genislige yayilir.
 */
export const Mobil: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
  render: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <ResponsiveDialog
        defaultOpen
        title="Yeni üye davet et"
        description="Ekibinize katılması için e-posta adresini paylaşın."
        trigger={
          <Button className="w-full">
            <UserPlus /> Üye davet et
          </Button>
        }
        footer={
          <>
            <ResponsiveDialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Kapat
              </Button>
            </ResponsiveDialogClose>
            <Button className="w-full sm:w-auto">Davet gönder</Button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            E-posta adresi
            <input
              type="email"
              placeholder="ornek@sirket.com"
              className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-ring focus-visible:ring-2"
            />
          </label>
          <p className="text-sm text-muted-foreground">
            Davet edilen kişiye giriş bağlantısı içeren bir e-posta gönderilir.
          </p>
        </div>
      </ResponsiveDialog>
    </div>
  ),
};

/**
 * Alt parcalarin dogrudan kullanimi: ResponsiveDialogRoot + Trigger + Content +
 * Header/Body/Footer ile serbest kurgu. Kontrollu acik durum ornegi.
 */
export const AltParcalar: Story = {
  render: function AltParcalarStory() {
    const [acik, setAcik] = React.useState(false);

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">
          Durum: {acik ? "açık" : "kapalı"}
        </p>
        <ResponsiveDialogRoot open={acik} onOpenChange={setAcik}>
          <ResponsiveDialogTrigger asChild>
            <Button variant="outline">
              <Settings2 /> Tercihleri düzenle
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent>
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Bildirim tercihleri</ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                Hangi durumlarda bildirim almak istediğinizi seçin.
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>
            <ResponsiveDialogBody>
              <ul className="space-y-3">
                {[
                  "Dağıtım tamamlandığında",
                  "Bir test başarısız olduğunda",
                  "Haftalık özet raporu",
                ].map((etiket) => (
                  <li
                    key={etiket}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5"
                  >
                    <span className="text-sm text-foreground">{etiket}</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="size-4 accent-primary"
                    />
                  </li>
                ))}
              </ul>
            </ResponsiveDialogBody>
            <ResponsiveDialogFooter>
              <ResponsiveDialogClose asChild>
                <Button variant="ghost">İptal</Button>
              </ResponsiveDialogClose>
              <Button onClick={() => setAcik(false)}>Kaydet</Button>
            </ResponsiveDialogFooter>
          </ResponsiveDialogContent>
        </ResponsiveDialogRoot>
      </div>
    );
  },
};
