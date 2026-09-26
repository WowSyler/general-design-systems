import * as React from "react";
import { fireEvent, screen } from "@testing-library/react";

import { Avatar } from "../src/components/Avatar";
import { Badge } from "../src/components/Badge";
import { BottomNav } from "../src/components/BottomNav";
import { Button } from "../src/components/Button";
import { Card } from "../src/components/Card";
import { Checkbox } from "../src/components/Checkbox";
import { Chip } from "../src/components/Chip";
import { Divider } from "../src/components/Divider";
import { EmptyState } from "../src/components/EmptyState";
import { Input } from "../src/components/Input";
import { ListRow } from "../src/components/ListRow";
import { MetricBar } from "../src/components/MetricBar";
import { ProgressBar } from "../src/components/ProgressBar";
import { ScoreBadge } from "../src/components/ScoreBadge";
import { Screen } from "../src/components/Screen";
import { SegmentedControl } from "../src/components/SegmentedControl";
import { SkeletonBlock, SkeletonText } from "../src/components/SkeletonBlock";
import { StatCard } from "../src/components/StatCard";
import { Tabs } from "../src/components/Tabs";
import { Text } from "../src/components/Text";
import { Toast } from "../src/components/Toast";
import { ToggleSwitch } from "../src/components/ToggleSwitch";
import { TABLET, renderWithTheme, setWindowSize } from "./utils";

describe("Button", () => {
  it("basınca onPress çağırır", () => {
    const onPress = vi.fn();
    renderWithTheme(<Button title="Kaydet" onPress={onPress} />);
    fireEvent.click(screen.getByRole("button", { name: "Kaydet" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("disabled ve loading iken basılamaz", () => {
    const onPress = vi.fn();
    const { rerender } = renderWithTheme(<Button title="Gönder" disabled onPress={onPress} />);
    const btn = screen.getByRole("button", { name: "Gönder" });
    expect(btn).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(btn);
    rerender(<Button title="Gönder" loading onPress={onPress} />);
    expect(screen.getByRole("button", { name: "Gönder" })).toHaveAttribute("aria-busy", "true");
    fireEvent.click(screen.getByRole("button", { name: "Gönder" }));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe("Temel görünüm bileşenleri", () => {
  it("Card, Divider, Text ve EmptyState render olur", () => {
    renderWithTheme(
      <Card testID="card">
        <Text>İçerik</Text>
        <Divider />
        <EmptyState title="Henüz kayıt yok" description="İlk kaydını ekle" action={<Button title="Ekle" />} />
      </Card>,
    );
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Henüz kayıt yok" })).toBeInTheDocument();
    expect(screen.getByText("İlk kaydını ekle")).toBeInTheDocument();
  });

  it("Badge ve ScoreBadge erişilebilir etiket taşır", () => {
    renderWithTheme(
      <>
        <Badge label="Yeni" variant="success" soft />
        <ScoreBadge value={8.42} />
      </>,
    );
    expect(screen.getByLabelText("Yeni")).toBeInTheDocument();
    expect(screen.getByLabelText("Skor: 8.4 / 10")).toBeInTheDocument();
  });

  it("StatCard metrik ve değişimi özetler", () => {
    renderWithTheme(<StatCard label="Gelir" value="12.400 ₺" delta={{ value: "+%12", trend: "up" }} />);
    expect(screen.getByLabelText("Gelir, 12.400 ₺, değişim +%12")).toBeInTheDocument();
    expect(screen.getByText("▲ +%12")).toBeInTheDocument();
  });

  it("MetricBar ve ProgressBar progressbar rolü ve değer bildirir", () => {
    renderWithTheme(
      <>
        <MetricBar label="Nem" value={72} />
        <ProgressBar value={140} label="Yükleme" showValue />
      </>,
    );
    expect(screen.getByRole("progressbar", { name: "Nem" })).toHaveAttribute("aria-valuenow", "72");
    const p = screen.getByRole("progressbar", { name: "Yükleme" });
    expect(p).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByText("%100")).toBeInTheDocument();
  });

  it("Avatar baş harflere düşer ve durum etiketini okur", () => {
    renderWithTheme(<Avatar name="Ozan Küçük" presence="online" />);
    expect(screen.getByRole("img", { name: "Ozan Küçük, çevrimiçi" })).toBeInTheDocument();
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("Skeleton iskeletleri meşgul durumu bildirir", () => {
    renderWithTheme(
      <>
        <SkeletonBlock accessibilityLabel="Kart yükleniyor" />
        <SkeletonText lines={3} />
      </>,
    );
    expect(screen.getByLabelText("Kart yükleniyor")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByLabelText("İçerik yükleniyor")).toHaveAttribute("aria-busy", "true");
  });

  it("Screen içeriği render eder; tablette içerik genişliği sınırlanır", () => {
    setWindowSize(TABLET.width, TABLET.height);
    renderWithTheme(
      <Screen scroll contentContainerStyle={{}}>
        <Text testID="inner">Ekran</Text>
      </Screen>,
    );
    const inner = screen.getByTestId("inner");
    const content = inner.parentElement as HTMLElement;
    expect(content.style.maxWidth).toBe("720px");
  });
});

describe("Etkileşimli primitifler", () => {
  it("Input etiket, hata ve değişiklik", () => {
    const onChange = vi.fn();
    renderWithTheme(<Input label="E-posta" error="Geçersiz e-posta" onChangeText={onChange} />);
    const input = screen.getByRole("textbox", { name: "E-posta" });
    fireEvent.change(input, { target: { value: "a@b.co" } });
    expect(onChange).toHaveBeenCalledWith("a@b.co");
    expect(screen.getByText("Geçersiz e-posta")).toBeInTheDocument();
  });

  it("Chip seçili durumu ve basma", () => {
    const onPress = vi.fn();
    renderWithTheme(<Chip label="Elbise" selected onPress={onPress} />);
    const chip = screen.getByRole("button", { name: "Elbise" });
    expect(chip).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(chip);
    expect(onPress).toHaveBeenCalled();
  });

  it("Checkbox değeri tersine çevirir", () => {
    const onChange = vi.fn();
    renderWithTheme(<Checkbox value={false} onValueChange={onChange} label="Koşulları kabul ediyorum" />);
    const cb = screen.getByRole("checkbox", { name: "Koşulları kabul ediyorum" });
    expect(cb).toHaveAttribute("aria-checked", "false");
    fireEvent.click(cb);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("ToggleSwitch etikete basınca değişir", () => {
    const onChange = vi.fn();
    renderWithTheme(<ToggleSwitch value={false} onValueChange={onChange} label="Bildirimler" />);
    fireEvent.click(screen.getByText("Bildirimler"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("ListRow basılabilir satır ve türetilmiş etiket", () => {
    const onPress = vi.fn();
    renderWithTheme(<ListRow title="Market" subtitle="Bugün" value="-120 ₺" showChevron onPress={onPress} />);
    fireEvent.click(screen.getByRole("button", { name: "Market, Bugün, -120 ₺" }));
    expect(onPress).toHaveBeenCalled();
  });

  it("SegmentedControl ve Tabs seçim bildirir", () => {
    const onSeg = vi.fn();
    const onTab = vi.fn();
    renderWithTheme(
      <>
        <SegmentedControl
          accessibilityLabel="Görünüm"
          items={[
            { value: "day", label: "Gün" },
            { value: "week", label: "Hafta" },
          ]}
          value="day"
          onValueChange={onSeg}
        />
        <Tabs
          items={[
            { value: "a", label: "Özet" },
            { value: "b", label: "Detay", disabled: true },
          ]}
          value="a"
          onValueChange={onTab}
        />
      </>,
    );
    expect(screen.getByRole("tab", { name: "Gün" })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("tab", { name: "Hafta" }));
    expect(onSeg).toHaveBeenCalledWith("week");
    fireEvent.click(screen.getByRole("tab", { name: "Detay" }));
    expect(onTab).not.toHaveBeenCalled();
    expect(screen.getAllByRole("tablist")).toHaveLength(2);
  });

  it("BottomNav sekme değiştirir ve rozet okur", () => {
    const onChange = vi.fn();
    renderWithTheme(
      <BottomNav
        items={[
          { value: "home", label: "Ana sayfa" },
          { value: "inbox", label: "Mesajlar", badge: 120 },
        ]}
        value="home"
        onValueChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("tab", { name: "Mesajlar, 99+ bildirim" }));
    expect(onChange).toHaveBeenCalledWith("inbox");
  });

  it("Toast görünür olunca alert olarak duyurulur ve kapatılır", () => {
    const onDismiss = vi.fn();
    renderWithTheme(<Toast visible title="Kaydedildi" message="Değişiklikler kaydedildi" variant="success" onDismiss={onDismiss} />);
    expect(screen.getByRole("alert", { name: "Kaydedildi. Değişiklikler kaydedildi" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Kapat" }));
    expect(onDismiss).toHaveBeenCalled();
  });
});
