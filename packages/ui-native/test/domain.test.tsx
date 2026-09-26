import * as React from "react";
import { fireEvent, screen } from "@testing-library/react";

import { BudgetBar } from "../src/components/BudgetBar";
import { PeriodSwitcher } from "../src/components/PeriodSwitcher";
import { PriceTag } from "../src/components/PriceTag";
import { ProductCard } from "../src/components/ProductCard";
import { Rating } from "../src/components/Rating";
import { SkinMetricCard } from "../src/components/SkinMetricCard";
import { TransactionRow } from "../src/components/TransactionRow";
import { renderWithTheme } from "./utils";

describe("Fisly", () => {
  it("TransactionRow gider/gelir ve bekleyen durumu okur", () => {
    const onPress = vi.fn();
    renderWithTheme(
      <>
        <TransactionRow title="Migros" subtitle="22 Eyl · Market" amount={-342.5} onPress={onPress} />
        <TransactionRow title="Maaş" amount={45000} pending />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Migros, gider .*342,50/ }));
    expect(onPress).toHaveBeenCalled();
    expect(screen.getByLabelText(/Maaş, gelir .*45\.000,00.*Bekliyor/)).toBeInTheDocument();
  });

  it("PeriodSwitcher önceki/sonraki ve granülerlik", () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    const onGran = vi.fn();
    renderWithTheme(
      <PeriodSwitcher
        label="Eylül 2026"
        caption="1–30 Eyl"
        onPrev={onPrev}
        onNext={onNext}
        canNext={false}
        granularities={[
          { value: "month", label: "Ay" },
          { value: "year", label: "Yıl" },
        ]}
        granularity="month"
        onGranularityChange={onGran}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Önceki dönem" }));
    fireEvent.click(screen.getByRole("button", { name: "Sonraki dönem" }));
    fireEvent.click(screen.getByRole("tab", { name: "Yıl" }));
    expect(onPrev).toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
    expect(onGran).toHaveBeenCalledWith("year");
    expect(screen.getByLabelText("Eylül 2026, 1–30 Eyl")).toBeInTheDocument();
  });

  it("BudgetBar aşımı bildirir", () => {
    renderWithTheme(<BudgetBar label="Market" spent={1200} limit={1000} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar.getAttribute("aria-label")).toMatch(/%120, .*200,00 aşıldı/);
  });
});

describe("Dolap", () => {
  it("PriceTag indirim yüzdesini hesaplar", () => {
    renderWithTheme(<PriceTag price={450} originalPrice={600} />);
    expect(screen.getByText("%25")).toBeInTheDocument();
    expect(screen.getByLabelText(/Fiyat .*450.*önceki .*600.*yüzde 25 indirim/)).toBeInTheDocument();
  });

  it("Rating salt görüntü ve etkileşimli", () => {
    const onChange = vi.fn();
    const { container } = renderWithTheme(
      <>
        <Rating value={4.5} count={128} showValue />
        <Rating value={2} onChange={onChange} accessibilityLabel="Satıcı puanı" />
      </>,
    );
    expect(screen.getByLabelText("Puan: 5 üzerinden 4,5, 128 değerlendirme")).toBeInTheDocument();
    const slider = screen.getByRole("slider", { name: /Satıcı puanı/ });
    expect(slider).toHaveAttribute("aria-valuenow", "2");
    // Etkileşimli yıldızların dördüncüsüne bas.
    const stars = slider.querySelectorAll('[tabindex="0"], [tabindex="-1"]');
    fireEvent.click(stars[3] ?? slider);
    expect(onChange).toHaveBeenCalledWith(4);
    expect(container).toBeTruthy();
  });

  it("ProductCard detay ve favori", () => {
    const onPress = vi.fn();
    const onFav = vi.fn();
    renderWithTheme(
      <ProductCard title="Keten gömlek" brand="Mango" meta="M beden" price={450} originalPrice={600} badge="Yeni" onPress={onPress} onToggleFavorite={onFav} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Mango, Keten gömlek, M beden" }));
    fireEvent.click(screen.getByRole("button", { name: "Favorilere ekle" }));
    expect(onPress).toHaveBeenCalled();
    expect(onFav).toHaveBeenCalledWith(true);
    expect(screen.getByText("Yeni")).toBeInTheDocument();
  });

  it("ProductCard satıldı rozeti", () => {
    renderWithTheme(<ProductCard title="Çanta" price={300} soldOut />);
    expect(screen.getByText("Satıldı")).toBeInTheDocument();
  });
});

describe("GlowScan", () => {
  it("SkinMetricCard seviye ve değişimi özetler", () => {
    renderWithTheme(<SkinMetricCard label="Nem" score={38} delta={-4} hint="Nemlendiriciyi artırın." />);
    expect(screen.getByLabelText("Nem: 100 üzerinden 38, Dikkat, önceki analize göre eksi 4")).toBeInTheDocument();
    expect(screen.getByText("▼ 4")).toBeInTheDocument();
  });
});
