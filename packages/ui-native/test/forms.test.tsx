import * as React from "react";
import { fireEvent, screen } from "@testing-library/react";

import { CategoryPicker } from "../src/components/CategoryPicker";
import { FormField, useFormField } from "../src/components/FormField";
import { CurrencyInput, MoneyText } from "../src/components/Money";
import { NumericKeypad } from "../src/components/NumericKeypad";
import { OTPInput } from "../src/components/OTPInput";
import { PasswordInput } from "../src/components/PasswordInput";
import { QuantityStepper } from "../src/components/QuantityStepper";
import { RadioGroup } from "../src/components/RadioGroup";
import { SearchBar } from "../src/components/SearchBar";
import { Slider } from "../src/components/Slider";
import { TextArea } from "../src/components/TextArea";
import { TimeSlotPicker } from "../src/components/TimeSlotPicker";
import { Text } from "../src/components/Text";
import { renderWithTheme, touchGesture } from "./utils";

describe("FormField", () => {
  it("zorunlu etiket, hata ve bağlam sağlar", () => {
    let ctx: ReturnType<typeof useFormField> = null;
    function Child() {
      ctx = useFormField();
      return <Text>denetim</Text>;
    }
    renderWithTheme(
      <FormField label="Ad" required error="Ad zorunlu">
        <Child />
      </FormField>,
    );
    expect(screen.getByLabelText("Ad, zorunlu")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Ad zorunlu");
    expect(ctx!.required).toBe(true);
    expect(ctx!.error).toBe("Ad zorunlu");
    expect(document.getElementById(ctx!.labelId)).not.toBeNull();
  });
});

describe("Metin girişleri", () => {
  it("TextArea sayaç gösterir ve değişikliği bildirir", () => {
    const onChange = vi.fn();
    renderWithTheme(<TextArea label="Not" maxLength={20} defaultValue="Merhaba" onChangeText={onChange} />);
    expect(screen.getByText("7/20")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "Not" }), { target: { value: "Merhaba dünya" } });
    expect(onChange).toHaveBeenCalledWith("Merhaba dünya");
    expect(screen.getByText("13/20")).toBeInTheDocument();
  });

  it("PasswordInput göster/gizle ve güç göstergesi", () => {
    renderWithTheme(<PasswordInput label="Parola" strength={3} />);
    const input = screen.getByLabelText("Parola") as HTMLInputElement;
    expect(input.type).toBe("password");
    fireEvent.click(screen.getByRole("button", { name: "Parolayı göster" }));
    expect((screen.getByLabelText("Parola") as HTMLInputElement).type).toBe("text");
    expect(screen.getByLabelText("Parola gücü: İyi")).toBeInTheDocument();
  });

  it("SearchBar temizler ve gönderir", () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    renderWithTheme(<SearchBar value="elbise" onChangeText={onChange} onSubmit={onSubmit} placeholder="Ürün ara" />);
    const box = screen.getByRole("searchbox", { name: "Ürün ara" });
    fireEvent.keyDown(box, { key: "Enter" });
    fireEvent.click(screen.getByRole("button", { name: "Aramayı temizle" }));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("OTPInput yalnızca rakam alır ve dolunca tamamlar", () => {
    const onChange = vi.fn();
    const onComplete = vi.fn();
    renderWithTheme(<OTPInput value="" length={4} onChange={onChange} onComplete={onComplete} />);
    const input = screen.getByLabelText("Doğrulama kodu, 4 hane");
    fireEvent.change(input, { target: { value: "12a34" } });
    expect(onChange).toHaveBeenCalledWith("1234");
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("CurrencyInput tutarı sayıya çevirir; MoneyText biçimler", () => {
    const onValue = vi.fn();
    renderWithTheme(
      <>
        <CurrencyInput label="Tutar" value={null} onChangeValue={onValue} />
        <MoneyText amount={-250} signed colorize />
        <MoneyText amount={1250.5} signed />
      </>,
    );
    fireEvent.change(screen.getByRole("textbox", { name: "Tutar" }), { target: { value: "1.250,75" } });
    expect(onValue).toHaveBeenCalledWith(1250.75);
    expect(screen.getByText("₺")).toBeInTheDocument();
    const neg = screen.getByLabelText(/^eksi .*250,00/);
    expect(neg.textContent?.startsWith("−")).toBe(true);
    const pos = screen.getByLabelText(/^artı .*1\.250,50/);
    expect(pos.textContent?.startsWith("+")).toBe(true);
  });
});

describe("Seçim denetimleri", () => {
  it("RadioGroup seçim bildirir, devre dışı seçeneği atlar", () => {
    const onChange = vi.fn();
    renderWithTheme(
      <RadioGroup
        accessibilityLabel="Teslimat"
        variant="card"
        options={[
          { value: "std", label: "Standart", description: "3-5 gün" },
          { value: "exp", label: "Hızlı", description: "1 gün" },
          { value: "pick", label: "Mağazadan", disabled: true },
        ]}
        value="std"
        onValueChange={onChange}
      />,
    );
    expect(screen.getByRole("radiogroup", { name: "Teslimat" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Standart, 3-5 gün" })).toHaveAttribute("aria-checked", "true");
    fireEvent.click(screen.getByRole("radio", { name: "Hızlı, 1 gün" }));
    fireEvent.click(screen.getByRole("radio", { name: "Mağazadan" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("exp");
  });

  it("CategoryPicker kategori seçer", () => {
    const onChange = vi.fn();
    renderWithTheme(
      <CategoryPicker
        options={[
          { value: "food", label: "Yemek" },
          { value: "bills", label: "Faturalar" },
        ]}
        value="food"
        onValueChange={onChange}
      />,
    );
    expect(screen.getByRole("radio", { name: "Yemek" })).toHaveAttribute("aria-checked", "true");
    fireEvent.click(screen.getByRole("radio", { name: "Faturalar" }));
    expect(onChange).toHaveBeenCalledWith("bills");
  });

  it("TimeSlotPicker dolu dilimi seçtirmez, boş listede mesaj gösterir", () => {
    const onChange = vi.fn();
    const { rerender } = renderWithTheme(
      <TimeSlotPicker
        sections={[{ title: "Sabah", slots: [{ value: "09:00" }, { value: "09:30", disabled: true }] }]}
        value={null}
        onValueChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("radio", { name: "09:30, dolu" }));
    fireEvent.click(screen.getByRole("radio", { name: "09:00" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    rerender(<TimeSlotPicker slots={[]} value={null} onValueChange={onChange} />);
    expect(screen.getByText("Bu gün için uygun saat yok.")).toBeInTheDocument();
  });
});

describe("Sayısal denetimler", () => {
  it("QuantityStepper sınırlara uyar", () => {
    const onChange = vi.fn();
    renderWithTheme(<QuantityStepper value={1} min={1} max={3} onValueChange={onChange} />);
    expect(screen.getByRole("button", { name: "Azalt" })).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(screen.getByRole("button", { name: "Artır" }));
    expect(onChange).toHaveBeenCalledWith(2);
    // Web'de değer, değişimi duyuran bir durum bölgesidir (native'de adjustable).
    expect(screen.getByRole("status", { name: "Adet" })).toHaveTextContent("1");
    expect(screen.queryByRole("slider")).toBeNull();
  });

  it("NumericKeypad denetimli değeri günceller", () => {
    const onChange = vi.fn();
    const onKey = vi.fn();
    renderWithTheme(<NumericKeypad value="12" onChange={onChange} onKeyPress={onKey} />);
    fireEvent.click(screen.getByRole("button", { name: "5" }));
    expect(onChange).toHaveBeenLastCalledWith("125");
    fireEvent.click(screen.getByRole("button", { name: "Ondalık ayırıcı" }));
    expect(onChange).toHaveBeenLastCalledWith("12,");
    fireEvent.click(screen.getByRole("button", { name: "Sil" }));
    expect(onChange).toHaveBeenLastCalledWith("1");
    expect(onKey).toHaveBeenCalledTimes(3);
  });

  it("Slider değer ve aralığı bildirir; dokununca değer değişir", async () => {
    const onChange = vi.fn();
    renderWithTheme(<Slider label="Bütçe" value={40} min={0} max={100} step={10} showValue onValueChange={onChange} />);
    const slider = screen.getByRole("slider", { name: "Bütçe" });
    expect(slider).toHaveAttribute("aria-valuenow", "40");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
    expect(screen.getByText("40")).toBeInTheDocument();
    // jsdom'da düzen genişliği 0 → her dokunuş uç değere (max) çözülür.
    await touchGesture(slider, 300);
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it("Slider disabled iken durum bildirir", () => {
    renderWithTheme(<Slider label="Kilitli" value={0} disabled onValueChange={() => undefined} />);
    expect(screen.getByRole("slider", { name: "Kilitli" })).toHaveAttribute("aria-disabled", "true");
  });
});
