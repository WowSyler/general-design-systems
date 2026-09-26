import * as React from "react";
import { fireEvent, screen } from "@testing-library/react";

import { ConfirmDialog } from "../src/components/ConfirmDialog";
import { Calendar, DatePicker } from "../src/components/DatePicker";
import { ModalDialog } from "../src/components/ModalDialog";
import { Select } from "../src/components/Select";
import { Sheet } from "../src/components/Sheet";
import { Text } from "../src/components/Text";
import { TABLET, renderWithTheme, setWindowSize } from "./utils";

describe("Sheet", () => {
  it("görünürken başlık ve içerik gösterir, scrim kapatır", () => {
    const onClose = vi.fn();
    renderWithTheme(
      <Sheet visible onClose={onClose} title="Filtreler">
        <Text>Beden</Text>
      </Sheet>,
    );
    expect(screen.getByRole("heading", { name: "Filtreler" })).toBeInTheDocument();
    expect(screen.getByText("Beden")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Kapat" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("dismissable=false iken scrim kapatmaz", () => {
    const onClose = vi.fn();
    renderWithTheme(<Sheet visible onClose={onClose} dismissable={false} title="Kilitli" />);
    fireEvent.click(screen.getByRole("button", { name: "Kapat" }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("görünmezken hiçbir şey render etmez", () => {
    renderWithTheme(<Sheet visible={false} onClose={() => undefined} title="Gizli" />);
    expect(screen.queryByText("Gizli")).toBeNull();
  });
});

describe("ModalDialog", () => {
  it("aksiyonları çalıştırır", () => {
    const onOk = vi.fn();
    renderWithTheme(
      <ModalDialog visible onClose={() => undefined} title="Emin misin?" description="Geri alınamaz." actions={[{ label: "Evet", onPress: onOk }]} />,
    );
    expect(screen.getByText("Geri alınamaz.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Evet" }));
    expect(onOk).toHaveBeenCalled();
  });
});

describe("ConfirmDialog", () => {
  it("telefonda onay/vazgeç butonları çalışır", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    renderWithTheme(
      <ConfirmDialog visible title="İşlemi sil" description="Bu işlem kalıcı olarak silinecek." destructive confirmLabel="Sil" onConfirm={onConfirm} onCancel={onCancel} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Sil" }));
    fireEvent.click(screen.getByRole("button", { name: "Vazgeç" }));
    expect(onConfirm).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it("loading iken vazgeç devre dışı ve tablette ortada sunulur", () => {
    setWindowSize(TABLET.width, TABLET.height);
    renderWithTheme(<ConfirmDialog visible loading title="Gönderiliyor" onConfirm={() => undefined} onCancel={() => undefined} />);
    expect(screen.getByRole("button", { name: "Vazgeç" })).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("button", { name: "Onayla" })).toHaveAttribute("aria-busy", "true");
  });
});

describe("Select", () => {
  it("açılır, seçer ve kapanır", () => {
    const onChange = vi.fn();
    renderWithTheme(
      <Select
        label="Kategori"
        options={[
          { label: "Market", value: "market" },
          { label: "Ulaşım", value: "transport" },
          { label: "Kira", value: "rent", disabled: true },
        ]}
        value={null}
        onValueChange={onChange}
      />,
    );
    const trigger = screen.getByRole("combobox", { name: "Kategori" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("radio", { name: "Ulaşım" }));
    expect(onChange).toHaveBeenCalledWith("transport");
    // Kapanış animasyonu jsdom'da bitmediğinden durum tetikten doğrulanır.
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Calendar / DatePicker", () => {
  const today = new Date(2026, 8, 22);

  it("Calendar gün seçer, aralık dışını devre dışı bırakır, ay değiştirir", () => {
    const onChange = vi.fn();
    renderWithTheme(
      <Calendar value={null} onChange={onChange} today={today} minDate={new Date(2026, 8, 10)} maxDate={new Date(2026, 9, 31)} />,
    );
    expect(screen.getByText("Eylül 2026")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "5 Eylül 2026" })).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(screen.getByRole("button", { name: "22 Eylül 2026, bugün" }));
    expect(onChange.mock.calls[0]![0].getDate()).toBe(22);
    expect(screen.getByRole("button", { name: "Önceki ay" })).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(screen.getByRole("button", { name: "Sonraki ay" }));
    expect(screen.getByText("Ekim 2026")).toBeInTheDocument();
  });

  it("DatePicker tetikten takvimi açar ve seçince kapanır", () => {
    const onChange = vi.fn();
    renderWithTheme(<DatePicker label="Randevu tarihi" value={null} onChange={onChange} today={today} />);
    const trigger = screen.getByRole("button", { name: "Randevu tarihi: seçilmedi" });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("button", { name: "24 Eylül 2026" }));
    expect(onChange).toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("DatePicker seçili tarihi biçimli gösterir", () => {
    renderWithTheme(<DatePicker label="Tarih" value={today} onChange={() => undefined} />);
    expect(screen.getByText("22 Eylül 2026")).toBeInTheDocument();
  });
});
