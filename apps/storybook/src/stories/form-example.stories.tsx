import type { Meta, StoryObj } from "@storybook/react";
import { LogIn } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
} from "@ds/ui";

const meta: Meta<typeof Card> = {
  title: "Primitives/FormExample",
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  name: "Giriş Formu",
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Randevu&apos;ya giriş yap</CardTitle>
        <CardDescription>
          İşletme panelinize erişmek için hesabınızla oturum açın.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="giris-eposta">E-posta</Label>
          <Input
            id="giris-eposta"
            type="email"
            placeholder="salon@aura.com.tr"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="giris-sifre">Şifre</Label>
          <Input id="giris-sifre" type="password" placeholder="••••••••" />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="beni-hatirla" defaultChecked />
          <Label htmlFor="beni-hatirla" className="font-normal">
            Beni hatırla
          </Label>
        </div>
      </CardContent>
      <CardFooter className="grid gap-2">
        <Button className="w-full">
          <LogIn className="mr-2 size-4" /> Giriş yap
        </Button>
        <Button variant="link" className="w-full">
          Şifremi unuttum
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const KayitFormu: Story = {
  name: "Kayıt Formu",
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Fisly hesabı oluştur</CardTitle>
        <CardDescription>
          14 gün ücretsiz deneyin, kredi kartı gerekmez.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="kayit-ad">Ad Soyad</Label>
          <Input id="kayit-ad" placeholder="Zeynep Arslan" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="kayit-eposta">E-posta</Label>
          <Input
            id="kayit-eposta"
            type="email"
            placeholder="zeynep@ornek.com"
          />
        </div>
        <div className="flex items-start gap-2">
          <Checkbox id="kayit-kvkk" className="mt-0.5" />
          <Label htmlFor="kayit-kvkk" className="font-normal leading-snug">
            KVKK aydınlatma metnini ve kullanım koşullarını kabul ediyorum.
          </Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Hesap oluştur</Button>
      </CardFooter>
    </Card>
  ),
};
