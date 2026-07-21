import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScanFace } from "lucide-react";

import {
  AuthShell,
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
  VStack,
} from "@ds/ui";

const meta: Meta<typeof AuthShell> = {
  title: "Layout/AuthShell",
  component: AuthShell,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof AuthShell>;

export const Login: Story = {
  render: () => (
    <AuthShell
      logo={
        <span className="flex items-center gap-2 text-lg font-semibold">
          <ScanFace className="size-6 text-primary" /> GlowScan
        </span>
      }
      footer={
        <p>
          Hesabınız yok mu?{" "}
          <a href="#" className="font-medium text-foreground underline">
            Kayıt olun
          </a>
        </p>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Giriş Yap</CardTitle>
          <CardDescription>
            Cilt analizi geçmişinize erişmek için hesabınıza giriş yapın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VStack gap="md">
            <VStack gap="xs">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@eposta.com"
                autoComplete="email"
              />
            </VStack>
            <VStack gap="xs">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <a
                  href="#"
                  className="text-xs text-muted-foreground underline hover:text-foreground"
                >
                  Şifremi unuttum
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </VStack>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Beni hatırla
              </Label>
            </div>
          </VStack>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Giriş Yap</Button>
        </CardFooter>
      </Card>
    </AuthShell>
  ),
};

export const WideVariant: Story = {
  render: () => (
    <AuthShell
      maxWidth="md"
      logo={<span className="text-lg font-semibold">Fisly</span>}
      footer={<p>Giriş yaparak Kullanım Şartları&apos;nı kabul etmiş olursunuz.</p>}
    >
      <Card>
        <CardHeader>
          <CardTitle>İşletme Girişi</CardTitle>
          <CardDescription>
            Gelir-gider kayıtlarınıza erişmek için vergi numaranızla giriş
            yapın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VStack gap="md">
            <VStack gap="xs">
              <Label htmlFor="tax-no">Vergi Numarası</Label>
              <Input id="tax-no" inputMode="numeric" placeholder="1234567890" />
            </VStack>
            <VStack gap="xs">
              <Label htmlFor="biz-password">Şifre</Label>
              <Input id="biz-password" type="password" placeholder="••••••••" />
            </VStack>
          </VStack>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full">Giriş Yap</Button>
          <Button variant="outline" className="w-full">
            e-Devlet ile Giriş
          </Button>
        </CardFooter>
      </Card>
    </AuthShell>
  ),
};
