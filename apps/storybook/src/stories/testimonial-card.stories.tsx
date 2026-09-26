import type { Meta, StoryObj } from "@storybook/react-vite";

import { TestimonialCard } from "@wowsyler/ds-ui";

const meta: Meta<typeof TestimonialCard> = {
  title: "Marketing/TestimonialCard",
  component: TestimonialCard,
};

export default meta;
type Story = StoryObj<typeof TestimonialCard>;

export const Tekil: Story = {
  args: {
    quote:
      "Randevu'ya geçtiğimizden beri no-show oranımız yüzde kırktan yüzde beşe düştü. SMS hatırlatmaları müşterilerimizin çok hoşuna gidiyor.",
    name: "Elif Yıldırım",
    title: "Salon Sahibi · Ada Güzellik, Kadıköy",
    rating: 5,
    className: "max-w-md",
  },
};

export const YorumIzgarasi: Story = {
  render: () => (
    <div className="grid max-w-5xl gap-6 lg:grid-cols-3">
      <TestimonialCard
        quote="GlowScan raporunu seans öncesi ve sonrası karşılaştırmak müşteriye güven veriyor. Paket satışlarımız gözle görülür arttı."
        name="Merve Aksoy"
        title="Estetisyen · GlowLab Nişantaşı"
        rating={5}
      />
      <TestimonialCard
        quote="Fisly sayesinde ay sonunda muhasebeciye fiş yığını göndermiyorum. Fotoğrafını çekiyorum, gerisini uygulama hallediyor."
        name="Burak Demirtaş"
        title="Kurucu · Demirtaş Kafe"
        rating={4}
      />
      <TestimonialCard
        quote="Takvimi personelle paylaşmak ve boş saatleri tek bakışta görmek işimizi inanılmaz hızlandırdı."
        name="Zeynep Kaya"
        title="İşletme Müdürü · Kaya Kuaför"
        rating={5}
      />
    </div>
  ),
};

export const PuansizVeUnvansiz: Story = {
  args: {
    quote:
      "Kurulumdan sonraki ilk hafta 60'tan fazla online randevu aldık. Beklediğimizden çok daha kolaydı.",
    name: "Onur Şen",
    className: "max-w-md",
  },
};
