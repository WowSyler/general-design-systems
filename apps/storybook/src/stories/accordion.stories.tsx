import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@wowsyler/ds-ui";

const meta: Meta<typeof Accordion> = {
  title: "Primitives/Accordion",
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  name: "SSS (Randevu)",
  render: () => (
    <Accordion type="single" collapsible className="w-[420px] max-w-full">
      <AccordionItem value="iptal">
        <AccordionTrigger>Randevumu nasıl iptal edebilirim?</AccordionTrigger>
        <AccordionContent>
          Randevu detay sayfasındaki &quot;İptal Et&quot; butonunu
          kullanabilirsiniz. Randevu saatine 2 saatten az kaldıysa iptal
          yerine yeniden planlama önerilir.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="hatirlatma">
        <AccordionTrigger>Hatırlatma mesajı ne zaman gelir?</AccordionTrigger>
        <AccordionContent>
          Randevunuzdan 24 saat ve 1 saat önce SMS ile hatırlatma gönderilir.
          Bildirim tercihlerinizi ayarlar sayfasından değiştirebilirsiniz.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="odeme">
        <AccordionTrigger>Ön ödeme iade edilir mi?</AccordionTrigger>
        <AccordionContent>
          Randevu saatinden en az 12 saat önce yapılan iptallerde ön ödeme
          otomatik olarak kartınıza iade edilir.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  name: "Çoklu Açılır",
  render: () => (
    <Accordion type="multiple" className="w-[420px] max-w-full" defaultValue={["tarama"]}>
      <AccordionItem value="tarama">
        <AccordionTrigger>Fisly fişleri nasıl tarar?</AccordionTrigger>
        <AccordionContent>
          Fişin fotoğrafını çekmeniz yeterli; tutar, tarih ve KDV otomatik
          olarak ayıklanır ve doğru kategoriye atanır.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="rapor">
        <AccordionTrigger>Aylık rapor alabilir miyim?</AccordionTrigger>
        <AccordionContent>
          Evet, gelir-gider özetinizi PDF veya Excel olarak dışa
          aktarabilirsiniz.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
