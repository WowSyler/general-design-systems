import * as React from "react";
import { screen } from "@testing-library/react";

import { BarChart, DonutChart, LineChart, ProgressRing, Sparkline, chartColors } from "../src/charts";
import { resolveNativeTheme, getTheme } from "@wowsyler/ds-tokens/native";
import { renderWithTheme } from "./utils";

describe("grafikler", () => {
  it("DonutChart dağılımı özetler ve lejant çizer", () => {
    const { container } = renderWithTheme(
      <DonutChart
        accessibilityLabel="Harcama dağılımı"
        centerValue="₺8.420"
        centerLabel="Toplam"
        data={[
          { label: "Market", value: 50 },
          { label: "Ulaşım", value: 30 },
          { label: "Eğlence", value: 20 },
        ]}
      />,
    );
    expect(screen.getByRole("img", { name: "Harcama dağılımı: Market %50, Ulaşım %30, Eğlence %20" })).toBeInTheDocument();
    expect(screen.getByText("₺8.420")).toBeInTheDocument();
    expect(container.querySelectorAll("circle").length).toBe(4);
  });

  it("ProgressRing değeri bildirir", () => {
    renderWithTheme(<ProgressRing value={82} label="Cilt skoru" />);
    expect(screen.getByRole("progressbar", { name: "Cilt skoru" })).toHaveAttribute("aria-valuenow", "82");
    expect(screen.getByText("%82")).toBeInTheDocument();
  });

  it("BarChart çubuk başına etiket ve özet üretir", () => {
    renderWithTheme(
      <BarChart
        highlightIndex={2}
        showValues
        data={[
          { label: "Tem", value: 3200 },
          { label: "Ağu", value: 4100 },
          { label: "Eyl", value: 2800 },
        ]}
      />,
    );
    expect(screen.getByRole("img", { name: "Çubuk grafik: Tem 3200, Ağu 4100, Eyl 2800" })).toBeInTheDocument();
    expect(screen.getByText("Eyl")).toBeInTheDocument();
  });

  it("LineChart ve Sparkline trendi okur", () => {
    renderWithTheme(
      <>
        <LineChart data={[{ label: "Pzt", value: 2 }, { label: "Sal", value: 5 }, { label: "Çar", value: 4 }]} />
        <Sparkline data={[5, 4, 3]} trendColor />
      </>,
    );
    expect(screen.getByRole("img", { name: "Çizgi grafik: 3 nokta, 2 değerinden 4 değerine" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Trend: düşüş" })).toBeInTheDocument();
  });

  it("chartColors tema paletini döndürür", () => {
    const t = resolveNativeTheme(getTheme("fisly"), "light");
    expect(chartColors(t)).toEqual([t.colors.chart1, t.colors.chart2, t.colors.chart3, t.colors.chart4, t.colors.chart5]);
  });
});
