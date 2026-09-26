import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, LabeledField, PasswordInput } from "@wowsyler/ds-ui";

const meta: Meta<typeof PasswordInput> = {
  title: "Primitives/PasswordInput",
  component: PasswordInput,
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Varsayilan: Story = {
  render: () => (
    <div className="w-80 max-w-full">
      <PasswordInput placeholder="Şifreniz" />
    </div>
  ),
};

export const Devre_Disi: Story = {
  name: "Devre Dışı",
  render: () => (
    <div className="w-80 max-w-full">
      <PasswordInput placeholder="Şifreniz" disabled />
    </div>
  ),
};

export const FislyGiris: Story = {
  name: "Fisly Giriş Formu",
  render: () => (
    <form className="w-80 max-w-full space-y-4" onSubmit={(e) => e.preventDefault()}>
      <LabeledField label="Şifre" htmlFor="fisly-sifre" required>
        <PasswordInput
          id="fisly-sifre"
          placeholder="En az 8 karakter"
          autoComplete="current-password"
        />
      </LabeledField>
      <Button type="submit" className="w-full">
        Giriş Yap
      </Button>
    </form>
  ),
};
