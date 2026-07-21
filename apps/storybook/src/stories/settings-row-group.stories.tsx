import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Badge,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SettingsGroup,
  SettingsRow,
  Switch,
} from "@ds/ui";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Globe,
  Lock,
  LogOut,
  Mail,
  Moon,
  ShieldAlert,
  Trash2,
  User,
} from "lucide-react";

const meta: Meta<typeof SettingsRow> = {
  title: "Composites/SettingsRow",
  component: SettingsRow,
};

export default meta;
type Story = StoryObj<typeof SettingsRow>;

const chevron = <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />;

export const TekSatir: Story = {
  args: {
    icon: <Bell className="size-4" />,
    title: "Anlık bildirimler",
    description: "Randevu hatırlatmalarını telefonuna gönder",
    control: <Switch defaultChecked aria-label="Anlık bildirimler" />,
  },
};

export const ProfilVeTercihler: Story = {
  render: () => (
    <div className="w-full max-w-lg space-y-6">
      <SettingsGroup
        title="Hesap"
        description="GlowScan profilinize bağlı temel bilgiler"
      >
        <SettingsRow
          icon={<User className="size-4" />}
          title="Ad ve soyad"
          description="Elif Yıldırım"
          control={
            <Button variant="ghost" size="sm">
              Düzenle
            </Button>
          }
        />
        <SettingsRow
          icon={<Mail className="size-4" />}
          title="E-posta"
          description="elif.yildirim@glowscan.app"
          control={<Badge variant="secondary">Doğrulandı</Badge>}
        />
        <SettingsRow
          icon={<CreditCard className="size-4" />}
          title="Abonelik"
          description="GlowScan Pro — aylık ₺149"
          control={chevron}
        />
      </SettingsGroup>

      <SettingsGroup
        title="Tercihler"
        description="Uygulama görünümü ve bildirim ayarları"
      >
        <SettingsRow
          icon={<Moon className="size-4" />}
          title="Koyu tema"
          description="Sistem temasını takip et"
          control={<Switch aria-label="Koyu tema" />}
        />
        <SettingsRow
          icon={<Bell className="size-4" />}
          title="Cilt analizi hatırlatmaları"
          description="Haftalık tarama önerileri al"
          control={<Switch defaultChecked aria-label="Analiz hatırlatmaları" />}
        />
        <SettingsRow
          icon={<Globe className="size-4" />}
          title="Dil"
          control={
            <Select defaultValue="tr">
              <SelectTrigger className="w-36" aria-label="Dil seçimi">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tr">Türkçe</SelectItem>
                <SelectItem value="en">İngilizce</SelectItem>
                <SelectItem value="de">Almanca</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      </SettingsGroup>
    </div>
  ),
};

export const TehlikeliBolge: Story = {
  render: () => (
    <div className="w-full max-w-lg space-y-6">
      <SettingsGroup title="Güvenlik">
        <SettingsRow
          icon={<Lock className="size-4" />}
          title="Şifreyi değiştir"
          description="Son güncelleme 3 ay önce"
          control={chevron}
        />
        <SettingsRow
          icon={<ShieldAlert className="size-4" />}
          title="İki adımlı doğrulama"
          description="Ekstra güvenlik katmanı"
          control={<Switch aria-label="İki adımlı doğrulama" />}
        />
      </SettingsGroup>

      <SettingsGroup
        title="Tehlikeli bölge"
        description="Bu işlemler geri alınamaz"
        danger
      >
        <SettingsRow
          danger
          icon={<LogOut className="size-4" />}
          title="Tüm cihazlardan çıkış yap"
          description="Aktif Dolap oturumlarını sonlandır"
          control={
            <Button variant="outline" size="sm">
              Çıkış yap
            </Button>
          }
        />
        <SettingsRow
          danger
          icon={<Trash2 className="size-4" />}
          title="Hesabı sil"
          description="Tüm ilanların ve verilerin kalıcı olarak silinir"
          control={
            <Button variant="destructive" size="sm">
              Hesabı sil
            </Button>
          }
        />
      </SettingsGroup>
    </div>
  ),
};
