import * as React from "react";
import { act, fireEvent, screen } from "@testing-library/react";

import { Accordion } from "../src/components/Accordion";
import { AvatarGroup } from "../src/components/AvatarGroup";
import { Banner, OfflineBanner } from "../src/components/Banner";
import { Container } from "../src/components/Container";
import { Grid } from "../src/components/Grid";
import { AppBar, Header } from "../src/components/Header";
import { IconButton } from "../src/components/IconButton";
import { KeyboardAwareScreen } from "../src/components/KeyboardAwareScreen";
import { AdaptiveNavigation, NavigationRail } from "../src/components/Navigation";
import { SectionHeader } from "../src/components/SectionHeader";
import { SettingsGroup, SettingsRow } from "../src/components/Settings";
import { Spinner } from "../src/components/Spinner";
import { HStack, Stack, VStack } from "../src/components/Stack";
import { StatusChip } from "../src/components/StatusChip";
import { ErrorState, LoadingState } from "../src/components/StatusStates";
import { SwipeableRow, type SwipeableRowHandle } from "../src/components/SwipeableRow";
import { Link, TextButton } from "../src/components/TextButton";
import { Text } from "../src/components/Text";
import { TABLET, renderWithTheme, setWindowSize, touchGesture } from "./utils";

const NAV = [
  { value: "home", label: "Ana sayfa" },
  { value: "stats", label: "İstatistik" },
];

describe("Yerleşim", () => {
  it("Stack/HStack/VStack çocukları ve ayraçları dizer", () => {
    renderWithTheme(
      <VStack gap="lg" testID="v">
        <HStack testID="h" divider={<Text>|</Text>}>
          <Text>A</Text>
          <Text>B</Text>
        </HStack>
        <Stack direction="row" wrap padding="sm">
          <Text>C</Text>
        </Stack>
      </VStack>,
    );
    expect(screen.getByTestId("v").style.rowGap).toBe("16px");
    expect(screen.getByTestId("h").style.flexDirection).toBe("row");
    expect(screen.getByText("|")).toBeInTheDocument();
  });

  it("Container azami genişliği uygular", () => {
    renderWithTheme(
      <Container size="sm" testID="c">
        <Text>x</Text>
      </Container>,
    );
    expect(screen.getByTestId("c").style.maxWidth).toBe("480px");
  });

  it("Grid telefonda 1, tablette 2 sütun kurar", () => {
    const ui = (
      <Grid columns={{ base: 1, md: 2 }}>
        <Text testID="g1">1</Text>
        <Text>2</Text>
      </Grid>
    );
    const { unmount } = renderWithTheme(ui);
    expect((screen.getByTestId("g1").parentElement as HTMLElement).style.width).toBe("100%");
    unmount();
    setWindowSize(TABLET.width, TABLET.height);
    renderWithTheme(ui);
    expect((screen.getByTestId("g1").parentElement as HTMLElement).style.width).toBe("50%");
  });

  it("KeyboardAwareScreen içerik ve sabit alt alanı render eder", () => {
    renderWithTheme(
      <KeyboardAwareScreen footer={<TextButton title="Devam" />}>
        <Text>Form</Text>
      </KeyboardAwareScreen>,
    );
    expect(screen.getByText("Form")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Devam" })).toBeInTheDocument();
  });
});

describe("Başlıklar ve butonlar", () => {
  it("Header geri butonu ve aksiyonlar; AppBar takma adı", () => {
    const onBack = vi.fn();
    renderWithTheme(
      <>
        <Header title="Siparişler" subtitle="3 aktif" onBack={onBack} actions={<IconButton accessibilityLabel="Ara" icon={<Text>?</Text>} />} />
        <AppBar title="Profil" variant="primary" large centerTitle />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Geri" }));
    expect(onBack).toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Siparişler" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Profil" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ara" })).toBeInTheDocument();
  });

  it("SectionHeader başlık ve aksiyon", () => {
    renderWithTheme(<SectionHeader title="Son işlemler" description="Bu ay" action={<Link title="Tümü" onPress={() => undefined} />} />);
    expect(screen.getByRole("heading", { name: "Son işlemler" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tümü" })).toBeInTheDocument();
  });

  it("IconButton seçili durumu ve render fonksiyonu", () => {
    const onPress = vi.fn();
    renderWithTheme(<IconButton accessibilityLabel="Favori" selected onPress={onPress} icon={({ color }) => <Text style={{ color }}>♥</Text>} />);
    const btn = screen.getByRole("button", { name: "Favori" });
    expect(btn).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(btn);
    expect(onPress).toHaveBeenCalled();
  });

  it("TextButton disabled iken çalışmaz", () => {
    const onPress = vi.fn();
    renderWithTheme(<TextButton title="Şifremi unuttum" disabled onPress={onPress} />);
    fireEvent.click(screen.getByRole("button", { name: "Şifremi unuttum" }));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe("Accordion ve ayarlar", () => {
  it("Accordion tekli modda birini açar", () => {
    renderWithTheme(
      <Accordion
        items={[
          { value: "a", title: "İade nasıl yapılır?", content: "14 gün içinde." },
          { value: "b", title: "Kargo ücreti?", content: "150 ₺ üzeri ücretsiz." },
        ]}
      />,
    );
    const a = screen.getByRole("button", { name: "İade nasıl yapılır?" });
    expect(a).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(a);
    expect(screen.getByText("14 gün içinde.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Kargo ücreti?" }));
    expect(screen.queryByText("14 gün içinde.")).toBeNull();
    expect(screen.getByText("150 ₺ üzeri ücretsiz.")).toBeInTheDocument();
  });

  it("SettingsGroup satırları: basılabilir ve anahtar", () => {
    const onPress = vi.fn();
    const onSwitch = vi.fn();
    renderWithTheme(
      <SettingsGroup title="Hesap" footer="Değişiklikler anında kaydedilir.">
        <SettingsRow title="Dil" value="Türkçe" onPress={onPress} />
        <SettingsRow title="Bildirimler" switchValue={false} onSwitchChange={onSwitch} />
        <SettingsRow title="Hesabı sil" destructive />
      </SettingsGroup>,
    );
    expect(screen.getByRole("heading", { name: "Hesap" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Dil, Türkçe" }));
    expect(onPress).toHaveBeenCalled();
    fireEvent.click(screen.getAllByRole("switch", { name: "Bildirimler" })[0]!);
    expect(onSwitch).toHaveBeenCalledWith(true);
    expect(screen.getByText("Hesabı sil")).toBeInTheDocument();
  });

  it("AvatarGroup taşmayı +N ile gösterir", () => {
    renderWithTheme(<AvatarGroup items={[{ name: "Ali Veli" }, { name: "Ayşe Kaya" }, { name: "Can Er" }, { name: "Deniz Su" }]} max={2} />);
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /4 kişi/ })).toBeInTheDocument();
  });
});

describe("Geri bildirim", () => {
  it("Banner tonuna göre rol alır ve kapatılır", () => {
    const onDismiss = vi.fn();
    renderWithTheme(
      <>
        <Banner tone="destructive" title="Ödeme başarısız" message="Kartınız reddedildi." onDismiss={onDismiss} />
        <Banner tone="info" message="Yeni özellik!" />
      </>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Ödeme başarısız");
    fireEvent.click(screen.getByRole("button", { name: "Kapat" }));
    expect(onDismiss).toHaveBeenCalled();
    expect(screen.getByText("Yeni özellik!")).toBeInTheDocument();
  });

  it("OfflineBanner görünürlüğe uyar", () => {
    const { rerender } = renderWithTheme(<OfflineBanner visible />);
    expect(screen.getByText("Çevrimdışısınız")).toBeInTheDocument();
    rerender(<OfflineBanner visible={false} />);
    expect(screen.queryByText("Çevrimdışısınız")).toBeNull();
  });

  it("Spinner, LoadingState ve ErrorState", () => {
    const onRetry = vi.fn();
    renderWithTheme(
      <>
        <Spinner label="Kaydediliyor" />
        <LoadingState message="Veriler yükleniyor" />
        <LoadingState skeleton message="Liste yükleniyor" />
        <ErrorState onRetry={onRetry} />
      </>,
    );
    expect(screen.getByRole("progressbar", { name: "Kaydediliyor" })).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("progressbar", { name: "Veriler yükleniyor" })).toBeInTheDocument();
    expect(screen.getByLabelText("Liste yükleniyor")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tekrar dene" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("StatusChip durumu etiketiyle okur", () => {
    renderWithTheme(<StatusChip label="Kargoda" tone="info" pulse />);
    expect(screen.getByLabelText("Durum: Kargoda")).toBeInTheDocument();
  });
});

describe("Jest ve gezinme", () => {
  it("SwipeableRow kaydırınca açılır, eylem çalışır, ref ile kapanır", async () => {
    const onDelete = vi.fn();
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const ref = React.createRef<SwipeableRowHandle>();
    renderWithTheme(
      <SwipeableRow ref={ref} onOpen={onOpen} onClose={onClose} actions={[{ key: "delete", label: "Sil", tone: "destructive", onPress: onDelete }]}>
        <Text testID="row">Market alışverişi</Text>
      </SwipeableRow>,
    );
    await touchGesture(screen.getByTestId("row"), 300, 100);
    expect(onOpen).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Sil" }));
    expect(onDelete).toHaveBeenCalled();
    act(() => ref.current?.open());
    act(() => ref.current?.close());
    expect(onClose).toHaveBeenCalled();
  });

  it("NavigationRail sekme değiştirir", () => {
    const onChange = vi.fn();
    renderWithTheme(<NavigationRail items={NAV} value="home" onValueChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "İstatistik" }));
    expect(onChange).toHaveBeenCalledWith("stats");
  });

  it("AdaptiveNavigation telefonda alt çubuk, tablette ray kurar", () => {
    const ui = (
      <AdaptiveNavigation items={NAV} value="home" onValueChange={() => undefined}>
        <Text>Sayfa</Text>
      </AdaptiveNavigation>
    );
    const before = (a: Element, b: Element) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    const { unmount } = renderWithTheme(ui);
    // Telefon: içerik önce, alt gezinme çubuğu sonra.
    expect(before(screen.getByText("Sayfa"), screen.getByRole("tab", { name: "Ana sayfa" }))).toBe(true);
    unmount();
    setWindowSize(TABLET.width, TABLET.height);
    renderWithTheme(ui);
    // Tablet: baştaki ray (tablist) içerikten önce gelir.
    expect(before(screen.getByRole("tablist"), screen.getByText("Sayfa"))).toBe(true);
    expect(screen.getByText("Sayfa")).toBeInTheDocument();
  });
});

describe("iç içe denetim yok", () => {
  it("SettingsRow anahtar satırında tek odaklanabilir denetim anahtardır", () => {
    const onSwitch = vi.fn();
    const { container } = renderWithTheme(<SettingsRow title="Bildirimler" switchValue onSwitchChange={onSwitch} />);
    const focusables = container.querySelectorAll('[tabindex="0"], input');
    expect(focusables).toHaveLength(1);
    fireEvent.click(screen.getByText("Bildirimler"));
    expect(onSwitch).toHaveBeenCalledWith(false);
  });
});
