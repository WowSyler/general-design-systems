import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActionButton } from "@ds/ui";
import { CalendarCheck, CreditCard, LogIn } from "lucide-react";

const meta: Meta<typeof ActionButton> = {
  title: "Composites/Action Button",
  component: ActionButton,
};
export default meta;

type Story = StoryObj<typeof ActionButton>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Boyutlar, fullWidth ve pill sekli bir arada. "xl" birincil CTA'lar icin
 * ek boyutu sunar.
 */
export const Boyutlar: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <ActionButton size="sm">Kucuk</ActionButton>
        <ActionButton size="default">Varsayilan</ActionButton>
        <ActionButton size="lg">Buyuk</ActionButton>
        <ActionButton size="xl">Ekstra buyuk</ActionButton>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ActionButton shape="pill" variant="secondary">
          Pill sekil
        </ActionButton>
        <ActionButton variant="outline">Outline</ActionButton>
      </div>
      <div className="w-72">
        <ActionButton size="lg" fullWidth>
          <CreditCard />
          Tam genislik
        </ActionButton>
      </div>
    </div>
  ),
};

/**
 * onClick bir Promise dondurdugu icin yuklenme otomatik tetiklenir; islem
 * cozulunce kisa sureligine basari ikonu belirir. Fisly odeme akisi ornegi.
 */
export const AsenkronOdeme: Story = {
  render: () => (
    <ActionButton
      size="xl"
      loadingText="Odeme aliniyor..."
      successText="Odeme alindi"
      onClick={() => wait(1800)}
    >
      <CreditCard />
      2.480,00 TL ode
    </ActionButton>
  ),
};

/**
 * Basarisiz istek (Promise reddi) hata durumunu gecici olarak gosterir.
 * Randevu-al ve giris CTA'lari icin tipik kullanim.
 */
export const GirisVeRandevu: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ActionButton
        fullWidth
        loadingText="Giris yapiliyor..."
        onClick={() => wait(1500)}
        className="w-72"
      >
        <LogIn />
        Giris yap
      </ActionButton>
      <ActionButton
        variant="secondary"
        shape="pill"
        loadingText="Randevu olusturuluyor..."
        errorText="Slot dolu, tekrar dene"
        onClick={() => wait(1500).then(() => Promise.reject(new Error("dolu")))}
      >
        <CalendarCheck />
        Randevu al
      </ActionButton>
    </div>
  ),
};

/**
 * Statik onizleme: yuklenme, basari ve hata durumlari disaridan zorlanir.
 */
export const Durumlar: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <ActionButton loading loadingText="Yukleniyor">
        Yukleniyor
      </ActionButton>
      <ActionButton status="success" successText="Kaydedildi">
        Kaydet
      </ActionButton>
      <ActionButton status="error" errorText="Basarisiz">
        Gonder
      </ActionButton>
    </div>
  ),
};
