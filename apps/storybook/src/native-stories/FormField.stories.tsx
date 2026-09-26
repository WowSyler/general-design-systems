import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, FormField, Input, PasswordInput, RadioGroup, TextArea, VStack } from "@wowsyler/ds-ui-native";

import { nativeMeta } from "./_support/meta";

const meta = { title: "Native/FormField", component: FormField, ...nativeMeta, args: { label: "Cilt tipi", children: null } } satisfies Meta<typeof FormField>;
export default meta;

export const KayitFormu: StoryObj<typeof meta> = {
  render: () => {
    const [skin, setSkin] = React.useState<string | null>(null);
    const [pw, setPw] = React.useState("");
    const strength = (Math.min(4, Math.floor(pw.length / 3)) as 0 | 1 | 2 | 3 | 4);
    return (
      <VStack gap="lg">
        <Input label="Ad soyad" placeholder="Adınız" />
        <PasswordInput label="Parola" isNew value={pw} onChangeText={setPw} strength={strength} helperText="En az 8 karakter" />
        <FormField label="Cilt tipi" required error={skin === null ? "Bir seçenek belirleyin" : undefined}>
          <RadioGroup
            orientation="horizontal"
            options={[
              { value: "dry", label: "Kuru" },
              { value: "oily", label: "Yağlı" },
              { value: "mixed", label: "Karma" },
            ]}
            value={skin}
            onValueChange={setSkin}
          />
        </FormField>
        <TextArea label="Notlar" placeholder="Hassasiyetler, alerjiler…" maxLength={200} />
        <Button title="Kaydet" fullWidth />
      </VStack>
    );
  },
};
