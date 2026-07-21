"use client";

/**
 * LiveRegionAnnouncer — Ekran okuyucuya dinamik durum duyuran canli bolge.
 * Gorsel olarak gizli iki aria-live bolgesi (kibar/polite ve acil/assertive)
 * render eder ve imperative bir announce(mesaj, secenekler) API sunar. API
 * iki yolla erisilebilir: (1) sarmalanan agacta useAnnouncer() hook'u,
 * (2) bilesene verilen ref uzerinden useImperativeHandle ile.
 * Ayni metni pes pese duyurmak icin gorunmez bir sifir-genislik karakteriyle
 * icerigi degistirir; boylece okuyucu tekrar seslendirir (force secenegi).
 * Kullanim: Fisly "Fatura kaydedildi", DeployLens "Dagitim tamamlandi",
 * GlowScan "Analiz hatasi" gibi gorsel-disi durum bildirimleri.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

/** aria-live nezaket seviyesi: kibar (sira bekler) veya acil (hemen keser). */
export type AnnouncerPoliteness = "polite" | "assertive";

export interface AnnouncerAnnounceOptions {
  /** Bu duyuru icin nezaket seviyesi; verilmezse defaultPoliteness kullanilir. */
  politeness?: AnnouncerPoliteness;
  /** Ayni metni pes pese tekrar seslendirmeye zorla (varsayilan acik). */
  force?: boolean;
}

/** ref veya useAnnouncer ile erisilen imperative duyuru API'si. */
export interface LiveRegionAnnouncerHandle {
  /** Bir mesaji uygun canli bolgeye yazar ve seslendirtir. */
  announce: (message: string, options?: AnnouncerAnnounceOptions) => void;
  /** Her iki canli bolgeyi de temizler. */
  clear: () => void;
}

const LiveRegionAnnouncerContext =
  React.createContext<LiveRegionAnnouncerHandle | null>(null);

/**
 * useAnnouncer — En yakin LiveRegionAnnouncer'in imperative API'sini dondurur.
 * LiveRegionAnnouncer agaci disinda cagrilirsa hata firlatir.
 */
export function useAnnouncer(): LiveRegionAnnouncerHandle {
  const ctx = React.useContext(LiveRegionAnnouncerContext);
  if (!ctx) {
    throw new Error(
      "useAnnouncer, bir LiveRegionAnnouncer icinde kullanilmalidir"
    );
  }
  return ctx;
}

export interface LiveRegionAnnouncerProps {
  /** Duyuru API'sine useAnnouncer ile erisecek alt agac. */
  children?: React.ReactNode;
  /** options.politeness verilmediginde kullanilacak varsayilan seviye. */
  defaultPoliteness?: AnnouncerPoliteness;
  /**
   * Duyurudan sonra bolgeyi bu sure (ms) gectikten sonra temizler.
   * 0 veya verilmezse temizlenmez (icerik bolgede kalir).
   */
  clearAfter?: number;
  /** Gizli bolge kapsayicisina eklenecek sinif (nadiren gerekir). */
  className?: string;
}

/**
 * LiveRegionAnnouncer — Canli bolge duyurucu saglayici + imperative API.
 * Cocuklarini oldugu gibi render eder; yaninda iki gorsel-gizli aria-live
 * bolgesi ekler. Layout'u etkilemez (sr-only).
 */
const LiveRegionAnnouncer = React.forwardRef<
  LiveRegionAnnouncerHandle,
  LiveRegionAnnouncerProps
>(
  (
    { children, defaultPoliteness = "polite", clearAfter, className },
    ref
  ) => {
    const [politeMessage, setPoliteMessage] = React.useState("");
    const [assertiveMessage, setAssertiveMessage] = React.useState("");
    // Ayni metni pes pese seslendirtmek icin degisimi zorlayan gorunmez ek.
    const nonceRef = React.useRef(false);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(
      () => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      },
      []
    );

    const clear = React.useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setPoliteMessage("");
      setAssertiveMessage("");
    }, []);

    const announce = React.useCallback<LiveRegionAnnouncerHandle["announce"]>(
      (message, options) => {
        if (!message) return;
        const politeness = options?.politeness ?? defaultPoliteness;
        const force = options?.force ?? true;
        // Zorunlu ise sifir-genislik ekini degistir; boylece ozdes metin bile
        // farkli gorunur ve okuyucu tekrar seslendirir. ZWSP seslendirilmez.
        if (force) nonceRef.current = !nonceRef.current;
        const zeroWidth = "\u200B";
        const next = message + (nonceRef.current ? zeroWidth : "");

        if (politeness === "assertive") {
          setAssertiveMessage(next);
        } else {
          setPoliteMessage(next);
        }

        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        if (clearAfter && clearAfter > 0) {
          timerRef.current = setTimeout(clear, clearAfter);
        }
      },
      [defaultPoliteness, clearAfter, clear]
    );

    const handle = React.useMemo<LiveRegionAnnouncerHandle>(
      () => ({ announce, clear }),
      [announce, clear]
    );

    React.useImperativeHandle(ref, () => handle, [handle]);

    return (
      <LiveRegionAnnouncerContext.Provider value={handle}>
        {children}
        <div className={cn("sr-only", className)}>
          <div role="status" aria-live="polite" aria-atomic="true">
            {politeMessage}
          </div>
          <div role="alert" aria-live="assertive" aria-atomic="true">
            {assertiveMessage}
          </div>
        </div>
      </LiveRegionAnnouncerContext.Provider>
    );
  }
);
LiveRegionAnnouncer.displayName = "LiveRegionAnnouncer";

export { LiveRegionAnnouncer };
