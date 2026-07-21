import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { MessageComposer } from "@ds/ui";

const meta: Meta<typeof MessageComposer> = {
  title: "Composites/MessageComposer",
  component: MessageComposer,
};

export default meta;
type Story = StoryObj<typeof MessageComposer>;

/**
 * Dolap alici-satici mesajlasmasi: gonderilen mesajlar yukarida listelenir,
 * "Teklif gonder" ayri bir sistem satiri ekler. Enter ile gonder, Shift+Enter
 * ile yeni satir; metin bosken Gonder butonu pasiftir.
 */
export const DolapMesajlasma: Story = {
  render: () => {
    const [mesajlar, setMesajlar] = React.useState<string[]>([
      "Merhaba, vintage deri ceket hâlâ satılıyor mu?",
    ]);
    const [taslak, setTaslak] = React.useState("");

    return (
      <div className="flex w-[26rem] max-w-full flex-col gap-3">
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-3">
          {mesajlar.map((mesaj, index) => (
            <div
              key={index}
              className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground"
            >
              {mesaj}
            </div>
          ))}
        </div>

        <MessageComposer
          value={taslak}
          onValueChange={setTaslak}
          onSend={(deger) => {
            setMesajlar((onceki) => [...onceki, deger.trim()]);
            setTaslak("");
          }}
          onSendOffer={() =>
            setMesajlar((onceki) => [...onceki, "Teklif gönderildi: 850 ₺"])
          }
          onAttachPhoto={() => {}}
          onAttachFile={() => {}}
          placeholder="Satıcıya bir mesaj yazın..."
        />
      </div>
    );
  },
};

/**
 * Kisa mesaj limiti: maxLength verildiginde sag ustte canli karakter sayaci
 * gorunur; limite yaklasinca uyari, dolunca yikici renge doner.
 */
export const KarakterSinirli: Story = {
  render: () => (
    <div className="w-[26rem] max-w-full">
      <MessageComposer
        defaultValue="Merhaba, ürünle hâlâ ilgileniyorum. Kargoyu bugün alabilir miyim acaba?"
        maxLength={120}
        onSend={() => {}}
        onAttachPhoto={() => {}}
        onAttachFile={() => {}}
        placeholder="Kısa bir not bırakın..."
      />
    </div>
  ),
};

/**
 * Sade sohbet: "Teklif gonder" butonu ve ek butonlari olmadan yalnizca metin
 * ve Gonder. Coklu satir icin Shift+Enter kullanin (alan otomatik buyur).
 */
export const SadeSohbet: Story = {
  render: () => (
    <div className="w-[26rem] max-w-full">
      <MessageComposer
        hideAttachments
        defaultValue={"Randevu saatini teyit ediyorum.\nYarın 14.30 uygun mu?"}
        onSend={() => {}}
        placeholder="Mesajınızı yazın..."
      />
    </div>
  ),
};

/**
 * Devre disi durum: gonderim kapaliyken tum kontroller etkilesime kapanir
 * (or. sohbet arsivlenmis ya da kullanici engellenmis).
 */
export const DevreDisi: Story = {
  render: () => (
    <div className="w-[26rem] max-w-full">
      <MessageComposer
        disabled
        defaultValue="Bu sohbet arşivlendiği için yeni mesaj gönderemezsiniz."
        onSend={() => {}}
        onSendOffer={() => {}}
        placeholder="Mesaj gönderilemiyor..."
      />
    </div>
  ),
};
