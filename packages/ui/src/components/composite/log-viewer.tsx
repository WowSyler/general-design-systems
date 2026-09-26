/**
 * LogViewer — Akan gunluk (log) goruntuleyici (DeployLens dagitim ekrani).
 * Monospace satirlar, seviye renkleri (debug/info/warn/error tonlu), zaman
 * damgasi + satir numarasi gosterir. Seviye filtresi (rozetli sayaclar) ve
 * arama (eslesme vurgulu) ile daraltma; otomatik-kaydir ve satir-sarma
 * gecisleri; gorunur satirlari panoya kopyalama sunar. Koyu tonlu kod arka
 * plani (bg-muted/50) uzerinde calisir; tema-agnostik semantik tokenlar kullanir.
 */
"use client";

import * as React from "react";
import {
  ArrowDownToLine,
  Check,
  Copy,
  Search,
  Terminal,
  WrapText,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type LogViewerLevel = "debug" | "info" | "warn" | "error";

export interface LogViewerEntry {
  /** Benzersiz anahtar; verilmezse dizin kullanilir. */
  id?: string | number;
  /** Zaman damgasi; Date ise HH:MM:SS bicimlenir, string ise oldugu gibi gosterilir. */
  timestamp?: Date | string;
  level: LogViewerLevel;
  message: string;
  /** Istege bagli kaynak/servis etiketi (or. "build", "runtime"). */
  source?: string;
}

export interface LogViewerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onCopy"> {
  entries: LogViewerEntry[];
  /** Baslik cubugunda gosterilen kanal/dagitim adi. */
  title?: string;
  /** Canli akis rozetini (yanip sonen nokta) gosterir. */
  live?: boolean;
  /** Baslangicta gorunur seviyeler; verilmezse tumu gorunur. */
  defaultLevels?: LogViewerLevel[];
  /** Otomatik-kaydir baslangic durumu (varsayilan acik). */
  defaultAutoScroll?: boolean;
  /** Satir-sarma baslangic durumu (varsayilan kapali). */
  defaultWrap?: boolean;
  showLineNumbers?: boolean;
  showTimestamp?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Icerik alani icin maksimum yukseklik siniflari. */
  viewportClassName?: string;
  /** Gorunur satirlar kopyalandiginda cagrilir. */
  onCopy?: (text: string) => void;
}

const LEVEL_ORDER: LogViewerLevel[] = ["debug", "info", "warn", "error"];

const levelMeta: Record<
  LogViewerLevel,
  { short: string; label: string; text: string; bg: string; dot: string }
> = {
  error: {
    short: "HATA",
    label: "Hata",
    text: "text-destructive",
    bg: "bg-destructive/10",
    dot: "bg-destructive",
  },
  warn: {
    short: "UYARI",
    label: "Uyari",
    text: "text-warning",
    bg: "bg-warning/10",
    dot: "bg-warning",
  },
  info: {
    short: "BILGI",
    label: "Bilgi",
    text: "text-info",
    bg: "bg-info/10",
    dot: "bg-info",
  },
  debug: {
    short: "AYIKLA",
    label: "Ayikla",
    text: "text-muted-foreground",
    bg: "bg-muted-foreground/10",
    dot: "bg-muted-foreground",
  },
};

function formatTimestamp(ts: Date | string | undefined): string {
  if (ts == null) return "";
  if (ts instanceof Date) {
    return ts.toLocaleTimeString("tr-TR", { hour12: false });
  }
  return ts;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Mesaj icinde arama eslesmelerini <mark> ile vurgular. */
function renderMessage(message: string, query: string): React.ReactNode {
  const trimmed = query.trim();
  if (!trimmed) return message;
  const regex = new RegExp(`(${escapeRegExp(trimmed)})`, "gi");
  const parts = message.split(regex);
  return parts.map((part, index) =>
    part.toLowerCase() === trimmed.toLowerCase() ? (
      <mark
        key={index}
        className="rounded-sm bg-warning/40 px-0.5 text-foreground"
      >
        {part}
      </mark>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
}

interface ToolToggleProps {
  pressed: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

/** Arac cubugundaki aria-pressed durumlu ikonlu gecis butonu. */
function ToolToggle({ pressed, onClick, icon, label }: ToolToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      title={label}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md pointer-coarse:min-h-11 pointer-coarse:min-w-11 px-2.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3.5",
        pressed
          ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

const LogViewer = React.forwardRef<HTMLDivElement, LogViewerProps>(
  (
    {
      entries,
      title,
      live = false,
      defaultLevels,
      defaultAutoScroll = true,
      defaultWrap = false,
      showLineNumbers = true,
      showTimestamp = true,
      searchPlaceholder = "Gunlukte ara...",
      emptyMessage = "Gosterilecek kayit yok.",
      viewportClassName,
      onCopy,
      className,
      ...props
    },
    ref
  ) => {
    const [query, setQuery] = React.useState("");
    const [visibleLevels, setVisibleLevels] = React.useState<Set<LogViewerLevel>>(
      () => new Set(defaultLevels ?? LEVEL_ORDER)
    );
    const [autoScroll, setAutoScroll] = React.useState(defaultAutoScroll);
    const [wrap, setWrap] = React.useState(defaultWrap);
    const [copied, setCopied] = React.useState(false);

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const copyTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(
      () => () => {
        if (copyTimeout.current) clearTimeout(copyTimeout.current);
      },
      []
    );

    // Veride bulunan seviyeler ve sayaclari (severite sirasina gore).
    const levelCounts = React.useMemo(() => {
      const counts: Record<LogViewerLevel, number> = {
        debug: 0,
        info: 0,
        warn: 0,
        error: 0,
      };
      for (const entry of entries) counts[entry.level] += 1;
      return counts;
    }, [entries]);

    const presentLevels = LEVEL_ORDER.filter((level) => levelCounts[level] > 0);

    const normalizedQuery = query.trim().toLowerCase();

    const filtered = React.useMemo(
      () =>
        entries
          .map((entry, index) => ({ entry, lineNo: index + 1 }))
          .filter(({ entry }) => visibleLevels.has(entry.level))
          .filter(({ entry }) => {
            if (!normalizedQuery) return true;
            return (
              entry.message.toLowerCase().includes(normalizedQuery) ||
              (entry.source?.toLowerCase().includes(normalizedQuery) ?? false)
            );
          }),
      [entries, visibleLevels, normalizedQuery]
    );

    // Otomatik-kaydir: yeni icerik geldiginde en alta sabitle.
    React.useEffect(() => {
      if (!autoScroll) return;
      const node = scrollRef.current;
      if (node) node.scrollTop = node.scrollHeight;
    }, [autoScroll, filtered.length, wrap]);

    const toggleLevel = (level: LogViewerLevel) => {
      setVisibleLevels((prev) => {
        const next = new Set(prev);
        if (next.has(level)) next.delete(level);
        else next.add(level);
        return next;
      });
    };

    const lineNoWidth = Math.max(2, String(entries.length).length);

    const handleCopy = async () => {
      const text = filtered
        .map(({ entry, lineNo }) => {
          const ts = formatTimestamp(entry.timestamp);
          const parts = [
            showLineNumbers ? String(lineNo).padStart(lineNoWidth) : null,
            showTimestamp && ts ? ts : null,
            levelMeta[entry.level].short.padEnd(6),
            entry.source ? `[${entry.source}]` : null,
            entry.message,
          ].filter(Boolean);
          return parts.join("  ");
        })
        .join("\n");

      try {
        await navigator.clipboard?.writeText(text);
        setCopied(true);
        onCopy?.(text);
        if (copyTimeout.current) clearTimeout(copyTimeout.current);
        copyTimeout.current = setTimeout(() => setCopied(false), 2000);
      } catch {
        // Pano erisimi yoksa sessizce gec.
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        {/* Baslik cubugu */}
        <div className="flex items-center gap-2 border-b bg-muted/60 px-3 py-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-muted-foreground/40" />
            <span className="size-2.5 rounded-full bg-muted-foreground/25" />
            <span className="size-2.5 rounded-full bg-muted-foreground/15" />
          </div>
          <Terminal
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          {title ? (
            <span className="truncate font-mono text-xs font-medium text-muted-foreground">
              {title}
            </span>
          ) : null}
          {live ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success">
              <span className="size-1.5 rounded-full bg-success animate-glow-pulse" />
              Canli
            </span>
          ) : null}
          <span
            className="ms-auto shrink-0 text-[11px] tabular-nums text-muted-foreground"
            aria-live="polite"
          >
            {filtered.length} / {entries.length} satir
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="shrink-0"
            aria-label="Gorunur satirlari kopyala"
          >
            {copied ? (
              <Check className="text-success" aria-hidden="true" />
            ) : (
              <Copy aria-hidden="true" />
            )}
            <span className="hidden sm:inline">
              {copied ? "Kopyalandi" : "Kopyala"}
            </span>
          </Button>
        </div>

        {/* Arac cubugu: arama + seviye filtresi + gecisler */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b bg-muted/40 px-3 py-2">
          <div className="relative min-w-0 flex-1 sm:max-w-64">
            <Search
              className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Gunlukte ara"
              className={cn("h-8 ps-8 text-xs", query && "pe-8")}
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Aramayi temizle"
                className="absolute end-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {presentLevels.length > 0 ? (
            <div
              role="group"
              aria-label="Seviye filtresi"
              className="flex flex-wrap items-center gap-1"
            >
              {presentLevels.map((level) => {
                const meta = levelMeta[level];
                const active = visibleLevels.has(level);
                return (
                  <button
                    key={level}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleLevel(level)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2 py-1 touch-hitbox text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? cn(meta.bg, meta.text)
                        : "text-muted-foreground/60 hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full transition-colors",
                        active ? meta.dot : "bg-muted-foreground/40"
                      )}
                      aria-hidden="true"
                    />
                    {meta.label}
                    <span className="tabular-nums opacity-70">
                      {levelCounts[level]}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="ms-auto flex items-center gap-1">
            <ToolToggle
              pressed={autoScroll}
              onClick={() => setAutoScroll((value) => !value)}
              icon={<ArrowDownToLine aria-hidden="true" />}
              label="Otomatik kaydir"
            />
            <ToolToggle
              pressed={wrap}
              onClick={() => setWrap((value) => !value)}
              icon={<WrapText aria-hidden="true" />}
              label="Satir sarma"
            />
          </div>
        </div>

        {/* Govde: koyu tonlu kod alani */}
        <div
          ref={scrollRef}
          className={cn(
            "relative overflow-auto bg-muted/50 focus-visible:outline-none",
            viewportClassName ?? "max-h-80"
          )}
        >
          {filtered.length === 0 ? (
            <div className="flex h-24 items-center justify-center px-4 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div
              role="log"
              aria-label={title ? `Gunluk: ${title}` : "Gunluk kayitlari"}
              aria-live={live ? "polite" : "off"}
              className={cn(
                "py-1.5 font-mono text-xs",
                !wrap && "w-max min-w-full"
              )}
            >
              {filtered.map(({ entry, lineNo }, index) => {
                const meta = levelMeta[entry.level];
                const ts = formatTimestamp(entry.timestamp);
                return (
                  <div
                    key={entry.id ?? `${lineNo}-${index}`}
                    className="flex items-start gap-3 px-3 py-0.5 leading-5 transition-colors hover:bg-foreground/[0.04]"
                  >
                    {showLineNumbers ? (
                      <span
                        className="shrink-0 select-none text-end text-muted-foreground/50 tabular-nums"
                        style={{ minWidth: `${lineNoWidth + 1}ch` }}
                        aria-hidden="true"
                      >
                        {lineNo}
                      </span>
                    ) : null}
                    {showTimestamp && ts ? (
                      <span className="shrink-0 select-none text-muted-foreground tabular-nums">
                        {ts}
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        "shrink-0 select-none rounded px-1.5 text-center text-[10px] font-semibold uppercase leading-5 tracking-wide",
                        meta.bg,
                        meta.text
                      )}
                      style={{ minWidth: "3.5rem" }}
                    >
                      <span className="sr-only">{meta.label}: </span>
                      {meta.short}
                    </span>
                    {entry.source ? (
                      <span className="shrink-0 select-none text-muted-foreground/70">
                        {entry.source}
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        "min-w-0 text-foreground/90",
                        wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre"
                      )}
                    >
                      {renderMessage(entry.message, query)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
);
LogViewer.displayName = "LogViewer";

export { LogViewer };
