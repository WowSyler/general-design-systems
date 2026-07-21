/**
 * QrCode — Stilize/dekoratif QR kod gosterim blogu.
 * ONEMLI: Gercek bir QR kodlamasi YAPMAZ; taranabilir veri uretmez.
 * "value" yalnizca deterministik bir tohum olarak kullanilir: ayni deger her
 * zaman ayni desenle sonuclanir. Modul gridi FNV-1a hash + mulberry32 PRNG ile
 * uretilir; uc kosede klasik "bulma" (finder) kareleri cizilir. Opsiyonel
 * merkez logo, altyazi ve Indir/Paylas butonlari icerir.
 * SVG modulleri currentColor (text-foreground) ile, zemin ise tona gore
 * card/muted tokeni ile boyanir; boylece bilesen tema-agnostik kalir.
 * Kullanim: Randevu check-in / dijital bilet, GlowScan seans QR'i, Fisly fatura
 * dogrulama kartlari gibi gorsel/marka amacli QR vitrinleri.
 */
import * as React from "react";
import { Download, Share2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const qrCodeVariants = cva(
  "inline-flex flex-col items-center gap-3 text-foreground",
  {
    variants: {
      tone: {
        card: "",
        muted: "",
      },
    },
    defaultVariants: {
      tone: "card",
    },
  }
);

type QrCodeTone = NonNullable<VariantProps<typeof qrCodeVariants>["tone"]>;

/** Tona gore SVG zemini ve finder "delik" dolgusu (semantik token). */
const surfaceFill: Record<QrCodeTone, string> = {
  card: "hsl(var(--card))",
  muted: "hsl(var(--muted))",
};

/** Tona gore cerceve ve logo arkasi zemin sinifi. */
const surfaceClass: Record<QrCodeTone, string> = {
  card: "bg-card",
  muted: "bg-muted",
};

/** Modul kose yuvarlaklik carpani (viewBox birimine gore rx). */
const moduleRadius: Record<"square" | "dots", number> = {
  square: 0.12,
  dots: 0.46,
};

/** Deterministik FNV-1a 32-bit hash. */
function hashSeed(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — tohumdan 0..1 arasi deterministik akis. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bir hucrenin uc kosedeki 7x7 finder bolgesine (veya ayirici seridine) ait olup olmadigi. */
function isReserved(row: number, col: number, n: number): boolean {
  const inTopLeft = row <= 7 && col <= 7;
  const inTopRight = row <= 7 && col >= n - 8;
  const inBottomLeft = row >= n - 8 && col <= 7;
  return inTopLeft || inTopRight || inBottomLeft;
}

/**
 * Deterministik modul matrisi uretir.
 * Finder bolgeleri ve (logo varsa) merkez temizlik alani veri modulu icermez.
 */
function buildMatrix(
  seed: number,
  n: number,
  clearFrom: number,
  clearTo: number
): boolean[][] {
  const rand = mulberry32(seed);
  const matrix: boolean[][] = [];
  for (let row = 0; row < n; row += 1) {
    const line: boolean[] = [];
    for (let col = 0; col < n; col += 1) {
      const r = rand();
      const reserved = isReserved(row, col, n);
      const inClear =
        row >= clearFrom && row < clearTo && col >= clearFrom && col < clearTo;
      line.push(!reserved && !inClear && r > 0.52);
    }
    matrix.push(line);
  }
  return matrix;
}

export interface QrCodeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof qrCodeVariants> {
  /**
   * Deseni belirleyen tohum (URL, bilet no vb.). GERCEK KODLANMAZ; yalnizca
   * ayni desenin tekrar uretilmesini saglar.
   */
  value: string;
  /** Kod altinda gosterilecek aciklama/etiket. */
  caption?: React.ReactNode;
  /** Merkeze yerlestirilecek logo/ikon (aria gizli). */
  logo?: React.ReactNode;
  /** Piksel cinsinden kenar uzunlugu. Varsayilan 208. */
  size?: number;
  /** Grid modul sayisi (tek sayiya yuvarlanir, 21..41 arasi). Varsayilan 29. */
  modules?: number;
  /** Modul kosesi: kare veya nokta. Varsayilan "square". */
  moduleStyle?: "square" | "dots";
  /** Indir/Paylas buton satirini gosterir. Varsayilan true. */
  showActions?: boolean;
  /** "İndir" butonu etiketi. */
  downloadLabel?: string;
  /** "Paylaş" butonu etiketi. */
  shareLabel?: string;
  /** Indir tiklamasi. */
  onDownload?: () => void;
  /** Paylas tiklamasi. */
  onShare?: () => void;
  /** SVG icin erisilebilirlik etiketi. */
  "aria-label"?: string;
}

const QrCode = React.forwardRef<HTMLDivElement, QrCodeProps>(
  (
    {
      value,
      caption,
      logo,
      size = 208,
      modules = 29,
      moduleStyle = "square",
      showActions = true,
      downloadLabel = "İndir",
      shareLabel = "Paylaş",
      onDownload,
      onShare,
      tone,
      className,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const resolvedTone: QrCodeTone = tone ?? "card";
    const quiet = 3;

    // Modul sayisini tek sayiya sabitle ve makul araliga kirp.
    const clamped = Math.min(41, Math.max(21, Math.round(modules)));
    const n = clamped % 2 === 0 ? clamped + 1 : clamped;

    // Logo varsa merkezde temizlenecek (tek boyutlu) kare alan.
    const hasLogo = logo != null;
    const rawClear = Math.round(n * 0.3);
    const clearSpan = hasLogo ? (rawClear % 2 === 0 ? rawClear + 1 : rawClear) : 0;
    const clearFrom = hasLogo ? Math.floor((n - clearSpan) / 2) : -1;
    const clearTo = hasLogo ? clearFrom + clearSpan : -1;

    const matrix = buildMatrix(hashSeed(value), n, clearFrom, clearTo);
    const rx = moduleRadius[moduleStyle];
    const total = n + quiet * 2;
    const fill = surfaceFill[resolvedTone];

    // Uc kose finder pozisyonlari (modul birimi, quiet zone dahil).
    const finders: Array<[number, number]> = [
      [quiet, quiet],
      [quiet + n - 7, quiet],
      [quiet, quiet + n - 7],
    ];

    const logoSizePct = hasLogo ? ((clearSpan + 1) / total) * 100 : 0;

    return (
      <div
        ref={ref}
        className={cn(qrCodeVariants({ tone: resolvedTone }), className)}
        {...props}
      >
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-2xl border border-border/70 shadow-md transition-all duration-300 hover:shadow-lg",
            surfaceClass[resolvedTone]
          )}
          style={{ width: size, height: size }}
        >
          <svg
            role="img"
            aria-label={ariaLabel ?? "QR kod"}
            width="100%"
            height="100%"
            viewBox={`0 0 ${total} ${total}`}
            shapeRendering="crispEdges"
            className="block text-foreground"
          >
            <rect x={0} y={0} width={total} height={total} fill={fill} />
            {matrix.map((line, row) =>
              line.map((filled, col) =>
                filled ? (
                  <rect
                    key={`${row}-${col}`}
                    x={col + quiet + (1 - 0.92) / 2}
                    y={row + quiet + (1 - 0.92) / 2}
                    width={0.92}
                    height={0.92}
                    rx={rx}
                    fill="currentColor"
                  />
                ) : null
              )
            )}
            {finders.map(([fx, fy], index) => (
              <g key={`finder-${index}`}>
                <rect
                  x={fx}
                  y={fy}
                  width={7}
                  height={7}
                  rx={1.8}
                  fill="currentColor"
                />
                <rect
                  x={fx + 1}
                  y={fy + 1}
                  width={5}
                  height={5}
                  rx={1.3}
                  fill={fill}
                />
                <rect
                  x={fx + 2}
                  y={fy + 2}
                  width={3}
                  height={3}
                  rx={0.9}
                  fill="currentColor"
                />
              </g>
            ))}
          </svg>
          {hasLogo ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-xl text-foreground shadow-sm ring-1 ring-border/60 [&_svg]:size-1/2",
                  surfaceClass[resolvedTone]
                )}
                style={{ width: `${logoSizePct}%`, height: `${logoSizePct}%` }}
              >
                {logo}
              </span>
            </div>
          ) : null}
        </div>

        {caption != null ? (
          <p className="max-w-64 text-center text-sm font-medium text-muted-foreground">
            {caption}
          </p>
        ) : null}

        {showActions ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDownload}
            >
              <Download aria-hidden="true" />
              {downloadLabel}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onShare}>
              <Share2 aria-hidden="true" />
              {shareLabel}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
);
QrCode.displayName = "QrCode";

export { QrCode, qrCodeVariants };
