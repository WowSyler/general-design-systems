import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useForm,
} from "@wowsyler/ds-ui";

/**
 * Form — react-hook-form entegrasyonu (zod şeması için `zodResolver` da
 * @wowsyler/ds-ui'den dışa aktarılır). `FormField` her alanı
 * `FormItem/FormLabel/FormControl/FormMessage` ile bağlar: etiket–kontrol
 * ilişkisi, `aria-invalid`, `aria-describedby` ve hata mesajı otomatik kurulur.
 */
const meta: Meta<typeof Form> = {
  title: "Primitives/Form",
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Form>;

type Values = { name: string; email: string; phone: string; consent: boolean };

const rules = {
  name: { minLength: { value: 2, message: "Ad soyad en az 2 karakter olmalı" }, required: "Ad soyad gerekli" },
  email: { pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Geçerli bir e-posta adresi girin" } },
  phone: { pattern: { value: /^5\d{9}$/, message: "Telefon 5 ile başlayan 10 haneli olmalı (ör. 5321234567)" } },
  consent: { validate: (v: boolean) => v || "Devam etmek için onay gerekli" },
} as const;

function BookingForm({ showErrors = false }: { showErrors?: boolean }) {
  const form = useForm<Values>({
    defaultValues: showErrors
      ? { name: "A", email: "ayse@", phone: "0532", consent: false }
      : { name: "", email: "", phone: "", consent: false },
    mode: "onTouched",
  });
  const [sent, setSent] = React.useState<Values | null>(null);

  React.useEffect(() => {
    if (showErrors) void form.trigger();
  }, [showErrors, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(setSent)}
        noValidate
        className="w-[400px] max-w-full space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Randevu bilgileri</h3>
          <p className="text-sm text-muted-foreground">Onay SMS&apos;i bu numaraya gönderilir.</p>
        </div>
        <FormField
          control={form.control}
          name="name"
          rules={rules.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad soyad</FormLabel>
              <FormControl>
                <Input autoComplete="name" placeholder="Ayşe Yılmaz" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={rules.email}
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-posta</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" placeholder="ayse@ornek.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          rules={rules.phone}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cep telefonu</FormLabel>
              <FormControl>
                <Input type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="5321234567" {...field} />
              </FormControl>
              <FormDescription>Başında 0 olmadan, 10 hane.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="consent"
          rules={rules.consent}
          render={({ field }) => (
            <FormItem className="flex min-h-11 flex-row items-start gap-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>KVKK aydınlatma metnini okudum ve onaylıyorum</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Randevuyu oluştur
        </Button>
        {sent ? (
          <p role="status" className="text-sm text-success">
            Gönderildi: {sent.name} · {sent.phone}
          </p>
        ) : null}
      </form>
    </Form>
  );
}

export const Varsayilan: Story = {
  name: "Randevu formu (doğrulama kuralları)",
  render: () => <BookingForm />,
};

export const Hatalar: Story = {
  name: "Doğrulama hataları",
  render: () => <BookingForm showErrors />,
};
