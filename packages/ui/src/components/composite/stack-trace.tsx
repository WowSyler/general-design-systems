"use client";

/**
 * StackTrace — Hata yigin izi goruntuleyici (DeployLens hata detayi).
 * Ust kisimda hata tipi + mesaj basligini destructive tonda gosterir; altinda
 * her biri genisletilebilir kare (frame) listesi bulunur. Kareler dosya:satir,
 * fonksiyon adi ve acildiginda cevreleyen kod baglamini (hata satiri
 * vurgulanir) sunar. Uygulama kareleri belirgin, kutuphane kareleri soluk
 * gosterilir; kutuphane kareleri tek dokunusla gizlenip gosterilebilir. Tum
 * yigin izi tek tikla panoya kopyalanir. Icerik font-mono; tema-agnostik.
 *
 * StackTraceFrame tek bir kareyi (isterse kendi durumuyla) render eder ve ozel
 * kompozisyon icin disa acilir; StackTrace veri odakli kapsayicidir.
 */
import * as React from "react";
import { Bug, Check, ChevronRight, Copy, Eye, EyeOff, Package } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Kare acildiginda gosterilen tek bir kod baglami satiri. */
export interface StackTraceContextLine {
  /** Kaynaktaki gercek satir numarasi. */
  number: number;
  /** Satir icerigi (bosluklar korunur). */
  code: string;
  /** Hatanin olustugu satir; destructive tonda vurgulanir. */
  highlight?: boolean;
}

/** Tekil yigin izi karesi verisi. */
export interface StackTraceFrameData {
  /** Benzersiz kare kimligi (geri cagirimlarda dondurulur). */
  id: string;
  /** Cagrilan fonksiyon/metot adi (or. "deployBundle"). */
  functionName: string;
  /** Kaynak dosya yolu (or. "src/server/deploy.ts"). */
  file: string;
  /** Hata satir numarasi. */
  line: number;
  /** Opsiyonel sutun numarasi. */
  column?: number;
  /** Kutuphane/bagimlilik karesi mi (soluk gosterilir). */
  library?: boolean;
  /** Acildiginda gosterilecek cevreleyen kod baglami. */
  context?: StackTraceContextLine[];
}

/** Tek satirlik konum metni uretir (dosya:satir[:sutun]). */
function frameLocation(frame: StackTraceFrameData): string {
  const base = `${frame.file}:${frame.line}`;
  return frame.column != null ? `${base}:${frame.column}` : base;
}

/** Panoya kopyalanacak duz-metin yigin izini olusturur. */
function buildStackText(
  errorType: string,
  message: string,
  frames: StackTraceFrameData[]
): string {
  const header = `${errorType}: ${message}`;
  const lines = frames.map(
    (frame) => `    at ${frame.functionName} (${frameLocation(frame)})`
  );
  return [header, ...lines].join("\n");
}

/** Degeri panoya yazar; clipboard API yoksa gizli textarea yedegine duser. */
async function writeToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Izin reddi/guvensiz baglam: asagidaki yedege gec.
  }
  try {
    if (typeof document === "undefined") return false;
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/** "Kopyalandi" durumunu tutar; timeout sonunda kendini sifirlar. */
function useCopyState(timeout: number) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const copy = React.useCallback(
    async (text: string) => {
      const ok = await writeToClipboard(text);
      if (!ok) return false;
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), timeout);
      return true;
    },
    [timeout]
  );

  return { copied, copy };
}

export interface StackTraceFrameProps
  extends Omit<React.HTMLAttributes<HTMLLIElement>, "onToggle"> {
  /** Render edilecek kare verisi. */
  frame: StackTraceFrameData;
  /** Listedeki konum numarasi (#0 = en ust). Verilmezse gizlenir. */
  index?: number;
  /** Denetimli acik/kapali durum (verilmezse kendi durumunu tutar). */
  expanded?: boolean;
  /** Denetimsiz kullanimda baslangic durumu. */
  defaultExpanded?: boolean;
  /** Genisletme/daraltma geri cagirimi (denetimli kullanim icin). */
  onToggle?: (id: string) => void;
}

/**
 * StackTraceFrame — Tek bir yigin izi karesi (genisletilebilir kod baglami).
 */
const StackTraceFrame = React.forwardRef<HTMLLIElement, StackTraceFrameProps>(
  (
    { frame, index, expanded, defaultExpanded = false, onToggle, className, ...props },
    ref
  ) => {
    const [selfOpen, setSelfOpen] = React.useState(defaultExpanded);
    const isControlled = expanded !== undefined;
    const open = isControlled ? expanded : selfOpen;

    const context = frame.context ?? [];
    const hasContext = context.length > 0;
    const library = frame.library ?? false;
    const contentId = React.useId();

    const numberWidth = hasContext
      ? Math.max(...context.map((line) => String(line.number).length))
      : 0;

    const handleToggle = () => {
      if (!hasContext) return;
      onToggle?.(frame.id);
      if (!isControlled) setSelfOpen((value) => !value);
    };

    return (
      <li ref={ref} className={cn("py-0.5", className)} {...props}>
        <button
          type="button"
          onClick={handleToggle}
          disabled={!hasContext}
          aria-expanded={hasContext ? open : undefined}
          aria-controls={hasContext ? contentId : undefined}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-start transition-all duration-200",
            hasContext
              ? "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              : "cursor-default"
          )}
        >
          {index != null ? (
            <span
              className={cn(
                "shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums",
                library ? "bg-muted text-muted-foreground/70" : "bg-primary/10 text-primary"
              )}
              aria-hidden="true"
            >
              #{index}
            </span>
          ) : null}

          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "block truncate font-mono text-sm",
                library ? "text-muted-foreground" : "font-semibold text-foreground"
              )}
            >
              {frame.functionName}
            </span>
            <span className="mt-0.5 block truncate font-mono text-xs text-muted-foreground">
              {frame.file}
              <span className="text-muted-foreground/60">
                :{frame.line}
                {frame.column != null ? `:${frame.column}` : ""}
              </span>
            </span>
          </span>

          <span
            className={cn(
              "hidden shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide sm:inline-flex",
              library
                ? "bg-muted text-muted-foreground/70"
                : "bg-primary/10 text-primary"
            )}
          >
            {library ? (
              <Package className="size-3" aria-hidden="true" />
            ) : null}
            {library ? "Kütüphane" : "Uygulama"}
          </span>

          {hasContext ? (
            <ChevronRight
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200 rtl:-scale-x-100",
                open && "rotate-90 rtl:-rotate-90"
              )}
              aria-hidden="true"
            />
          ) : (
            <span className="size-4 shrink-0" aria-hidden="true" />
          )}
        </button>

        {hasContext && open ? (
          <div
            id={contentId}
            className="mt-1 overflow-hidden rounded-lg border bg-muted/40"
          >
            <pre className="relative overflow-x-auto py-2 font-mono text-xs leading-relaxed">
              <code>
                {context.map((line) => (
                  <span
                    key={line.number}
                    className={cn(
                      "flex",
                      line.highlight && "bg-destructive/10"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      style={{ minWidth: `${numberWidth + 1}ch` }}
                      className={cn(
                        "shrink-0 select-none px-3 text-end tabular-nums",
                        line.highlight
                          ? "border-s-2 border-destructive font-semibold text-destructive"
                          : "border-s-2 border-transparent text-muted-foreground/50"
                      )}
                    >
                      {line.number}
                    </span>
                    <span
                      className={cn(
                        "whitespace-pre px-3",
                        line.highlight ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {line.code || " "}
                    </span>
                  </span>
                ))}
              </code>
            </pre>
          </div>
        ) : null}
      </li>
    );
  }
);
StackTraceFrame.displayName = "StackTraceFrame";

export interface StackTraceProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onCopy"> {
  /** Hata tipi/adi (or. "TypeError", "DeployTimeoutError"). */
  errorType: string;
  /** Hata mesaji basligi. */
  message: string;
  /** En ustten (en yeni cagri) alta dogru siralanmis kareler. */
  frames: StackTraceFrameData[];
  /** Baslangicta acik olacak kare kimlikleri. */
  defaultExpandedIds?: string[];
  /** Kopyala butonunu goster (varsayilan acik). */
  copyable?: boolean;
  /** Kopyalanacak metni ezer; verilmezse yigin izinden uretilir. */
  copyText?: string;
  /** Basarili kopyalamadan sonra tetiklenir. */
  onCopy?: (text: string) => void;
  /** Kutuphane karelerini baslangicta goster (varsayilan acik). */
  defaultShowLibrary?: boolean;
}

/**
 * StackTrace — Hata basligi + genisletilebilir kare listesi + kopyala.
 */
const StackTrace = React.forwardRef<HTMLDivElement, StackTraceProps>(
  (
    {
      errorType,
      message,
      frames,
      defaultExpandedIds,
      copyable = true,
      copyText,
      onCopy,
      defaultShowLibrary = true,
      className,
      ...props
    },
    ref
  ) => {
    const [expanded, setExpanded] = React.useState<Set<string>>(
      () => new Set(defaultExpandedIds ?? [])
    );
    const [showLibrary, setShowLibrary] = React.useState(defaultShowLibrary);
    const { copied, copy } = useCopyState(2000);

    const libraryCount = React.useMemo(
      () => frames.filter((frame) => frame.library).length,
      [frames]
    );

    const toggleFrame = React.useCallback((id: string) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }, []);

    const handleCopy = async () => {
      const text = copyText ?? buildStackText(errorType, message, frames);
      const ok = await copy(text);
      if (ok) onCopy?.(text);
    };

    return (
      <div
        ref={ref}
        role="group"
        aria-label={`Hata yığın izi: ${errorType}`}
        className={cn(
          "overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        {/* Hata basligi (destructive) */}
        <div className="flex items-start gap-3 border-b border-destructive/20 bg-destructive/10 px-4 py-3">
          <span
            className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/15 text-destructive ring-1 ring-destructive/20"
            aria-hidden="true"
          >
            <Bug className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-sm font-bold text-destructive">
              {errorType}
            </p>
            <p className="mt-0.5 break-words font-mono text-sm text-foreground">
              {message}
            </p>
          </div>
          {copyable ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="shrink-0 bg-background/60"
              aria-label="Yığın izini panoya kopyala"
            >
              {copied ? (
                <Check className="size-3.5 text-success" aria-hidden="true" />
              ) : (
                <Copy className="size-3.5" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {copied ? "Kopyalandı" : "Kopyala"}
              </span>
              <span className="sr-only" role="status" aria-live="polite">
                {copied ? "Kopyalandı" : ""}
              </span>
            </Button>
          ) : null}
        </div>

        {/* Kare sayaci + kutuphane gizle/goster */}
        {libraryCount > 0 ? (
          <div className="flex items-center justify-between gap-2 border-b bg-muted/30 px-4 py-1.5">
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {frames.length} kare · {libraryCount} kütüphane
            </span>
            <button
              type="button"
              onClick={() => setShowLibrary((value) => !value)}
              aria-pressed={!showLibrary}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 pointer-coarse:min-h-11 text-xs font-medium text-muted-foreground transition-all duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
            >
              {showLibrary ? (
                <EyeOff className="size-3.5" aria-hidden="true" />
              ) : (
                <Eye className="size-3.5" aria-hidden="true" />
              )}
              {showLibrary
                ? "Kütüphane karelerini gizle"
                : "Kütüphane karelerini göster"}
            </button>
          </div>
        ) : null}

        {/* Kareler */}
        <ol className="divide-y divide-border/50 p-1.5">
          {frames.map((frame, frameIndex) => {
            if (!showLibrary && frame.library) return null;
            return (
              <StackTraceFrame
                key={frame.id}
                frame={frame}
                index={frameIndex}
                expanded={expanded.has(frame.id)}
                onToggle={toggleFrame}
              />
            );
          })}
        </ol>
      </div>
    );
  }
);
StackTrace.displayName = "StackTrace";

export { StackTrace, StackTraceFrame };
