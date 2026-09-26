import type { Meta, StoryObj } from "@storybook/react-vite";

import { AccountCard, Grid } from "@wowsyler/ds-ui";

const meta: Meta<typeof AccountCard> = {
  title: "Composites/AccountCard",
  component: AccountCard,
};

export default meta;
type Story = StoryObj<typeof AccountCard>;

export const VadesizHesap: Story = {
  args: {
    name: "Garanti BBVA",
    label: "Vadesiz TL Hesabı",
    type: "bank",
    balance: 24850.75,
    last4: "4821",
    className: "max-w-sm",
  },
};

export const SanalKart: Story = {
  args: {
    name: "Fisly Kart",
    label: "Sanal Kart · Mastercard",
    type: "credit",
    variant: "gradient",
    balance: -3420.5,
    balanceLabel: "Güncel Borç",
    accountNumber: "•••• •••• •••• 6207",
    typeLabel: "Son ödeme 28 Tem",
    className: "max-w-sm",
  },
};

export const HesaplarListesi: Story = {
  render: () => (
    <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="lg" className="max-w-5xl items-stretch">
      <AccountCard
        name="Fisly Cüzdan"
        label="Ana bakiye"
        type="cash"
        variant="gradient"
        balance={12480.9}
        accountNumber="Fisly ID · 90 21 44"
      />
      <AccountCard
        name="Yapı Kredi"
        label="Vadesiz TL Hesabı"
        type="bank"
        balance={8215.4}
        last4="3390"
      />
      <AccountCard
        name="İş Bankası"
        label="Maximum Kredi Kartı"
        type="credit"
        balance={-1560.25}
        balanceLabel="Ekstre borcu"
        last4="7712"
      />
      <AccountCard
        name="Nakit Kasa"
        label="Fiziksel cüzdan"
        type="cash"
        balance={640}
        typeLabel="Elden takip"
      />
      <AccountCard
        name="Enpara.com"
        label="Birikim Hesabı"
        type="bank"
        balance={53200}
        last4="0148"
      />
      <AccountCard name="Denizbank" label="Bonus Kart" type="credit" balance={0} loading />
    </Grid>
  ),
};

export const Yukleniyor: Story = {
  args: {
    name: "Hesap yükleniyor",
    balance: 0,
    loading: true,
    className: "max-w-sm",
  },
};
