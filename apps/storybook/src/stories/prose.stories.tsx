import type { Meta, StoryObj } from "@storybook/react-vite";

import { Prose } from "@ds/ui";

const meta: Meta<typeof Prose> = {
  title: "Composites/Prose",
  component: Prose,
};

export default meta;
type Story = StoryObj<typeof Prose>;

export const MakaleOrnegi: Story = {
  render: () => (
    <Prose>
      <h2>Fiş taramada en iyi sonuçlar</h2>
      <p>
        Fisly, fişlerinizi saniyeler içinde tarayıp giderlerinizi otomatik olarak
        kategorilere ayırır. Doğruluk oranını artırmak için birkaç basit kurala
        dikkat etmeniz yeterli.
      </p>
      <h3>Çekim ipuçları</h3>
      <ul>
        <li>Fişi düz bir zemine yerleştirin ve buruşuklukları giderin.</li>
        <li>Doğal ışık altında, gölgesiz bir fotoğraf çekin.</li>
        <li>
          Fişin tamamı kadrajda olsun; toplam tutar ve tarih net okunmalı.
        </li>
      </ul>
      <blockquote>
        Kullanıcılarımızın %92'si ilk taramada doğru kategori eşleşmesi elde
        ediyor.
      </blockquote>
      <h3>Otomatik kategoriler</h3>
      <p>
        Tarama sonrası her kalem <code>kategori</code> alanıyla etiketlenir.
        Yanlış eşleşmeleri{" "}
        <a href="#duzenle">gider ayrıntıları sayfasından</a> tek dokunuşla
        düzeltebilirsiniz.
      </p>
    </Prose>
  ),
};

export const KisaIcerik: Story = {
  render: () => (
    <Prose>
      <h2>Randevu iptal politikası</h2>
      <p>
        Randevunuzu başlangıç saatinden en az <code>24 saat</code> önce ücretsiz
        iptal edebilirsiniz. Daha geç iptallerde seans ücretinin yarısı tahsil
        edilir.
      </p>
    </Prose>
  ),
};
