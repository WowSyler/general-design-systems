import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { CheckCircle2, Home, MapPin, Package } from "lucide-react";

import { AddressForm } from "@wowsyler/ds-ui";

type AddressValues = Parameters<
  NonNullable<React.ComponentProps<typeof AddressForm>["onSubmit"]>
>[0];

const meta: Meta<typeof AddressForm> = {
  title: "Composites/AddressForm",
  component: AddressForm,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof AddressForm>;

/**
 * Dolap kargo teslimat adresi ekleme. Boş formda zorunlu alanlar doldurulup
 * "Adresi Kaydet"e basılınca istemci tarafı doğrulama çalışır; geçerliyse
 * toplanan değerler kartın üstünde özet olarak gösterilir.
 */
function TeslimatAdresiDemo() {
  const [saved, setSaved] = React.useState<string | null>(null);

  return (
    <div className="w-[560px] max-w-full space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
      {saved ? (
        <div className="flex items-start gap-2 rounded-lg border border-success/40 bg-success/10 p-3 text-sm text-success">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-medium">Adres kaydedildi</p>
            <pre className="whitespace-pre-wrap font-mono text-xs text-success/90">{saved}</pre>
          </div>
        </div>
      ) : null}
      <AddressForm
        onSubmit={(values: AddressValues) => {
          setSaved(
            `${values.fullName} · +90 ${values.phone}\n${values.neighborhood}, ${values.district}/${values.province}\nBaşlık: ${values.label}${values.isDefault ? " · varsayılan" : ""}`
          );
        }}
      />
    </div>
  );
}

export const TeslimatAdresi: Story = {
  render: () => <TeslimatAdresiDemo />,
};

/**
 * Randevu profilinde kayıtlı adresi düzenleme. defaultValues ile alanlar
 * önceden doldurulur, varsayılan adres işaretlidir ve "Vazgeç" ikincil
 * aksiyonu görünür. Değişiklikler anlık olarak yeniden özetlenir.
 */
function AdresDuzenleDemo() {
  const [durum, setDurum] = React.useState("Kayıtlı adres yükleniyor…");

  return (
    <div className="w-[560px] max-w-full space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="size-4 text-primary" aria-hidden="true" />
        <span>{durum}</span>
      </div>
      <AddressForm
        title="Adresi Düzenle"
        description="Randevu onayı bu adrese gönderilecek. Bilgileri güncel tut."
        submitLabel="Değişiklikleri Kaydet"
        defaultValues={{
          fullName: "Elif Yılmaz",
          phone: "5051234567",
          province: "İstanbul",
          district: "Kadıköy",
          neighborhood: "Caferağa Mahallesi",
          addressLine: "Moda Caddesi No: 42, Kat 3, Daire 6",
          label: "ev",
          isDefault: true,
        }}
        onCancel={() => setDurum("Düzenleme iptal edildi, değişiklikler geri alındı.")}
        onSubmit={(values: AddressValues) => setDurum(`Güncellendi: ${values.district}/${values.province} adresi kaydedildi.`)}
      />
    </div>
  );
}

export const AdresDuzenle: Story = {
  render: () => <AdresDuzenleDemo />,
};

/**
 * Async gönderim: onSubmit bir Promise döndürür; birincil buton otomatik
 * olarak "Kaydediliyor…" yüklenme durumuna geçer. Özel adres başlığı
 * seçenekleri (Ev/İş/Kargo Noktası) ile Dolap gönderi senaryosu.
 */
function AsyncKayitDemo() {
  const [sonuc, setSonuc] = React.useState<string | null>(null);

  const kaydet = (values: { district: string; province: string }) =>
    new Promise<void>((resolve) => {
      setSonuc(null);
      setTimeout(() => {
        setSonuc(`${values.district}/${values.province} adresi sunucuya kaydedildi.`);
        resolve();
      }, 1400);
    });

  return (
    <div className="w-[560px] max-w-full space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
      {sonuc ? (
        <div className="flex items-center gap-2 rounded-lg border border-info/40 bg-info/10 p-3 text-sm text-info">
          <Package className="size-4 shrink-0" aria-hidden="true" />
          {sonuc}
        </div>
      ) : null}
      <AddressForm
        description="Kaydet'e basınca adres güvenli bağlantı üzerinden eşitlenir."
        labelOptions={[
          { value: "ev", label: "Ev", icon: <Home className="size-4" aria-hidden="true" /> },
          { value: "is", label: "İş", icon: <Package className="size-4" aria-hidden="true" /> },
          { value: "kargo", label: "Kargo Noktası", icon: <MapPin className="size-4" aria-hidden="true" /> },
        ]}
        onSubmit={kaydet}
      />
    </div>
  );
}

export const AsyncKayit: Story = {
  render: () => <AsyncKayitDemo />,
};
