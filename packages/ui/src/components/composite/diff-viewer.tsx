/**
 * DiffViewer — Kod diff (fark) goruntuleyici.
 * Satir-satir ekleme (bg-success/10 text-success, +), silme (bg-destructive/10
 * text-destructive, -) ve degismeyen satirlari; eski/yeni iki kolon satir
 * numarasiyla monospace olarak gosterir. Dosya basligi + degisim ozeti (+N -M)
 * ve unified/split gorunum destekler. DeployLens dagitim kod farki icin.
 */
import * as React from "react";
import { FileDiff } from "lucide-react";

import { cn } from "@/lib/utils";

type DiffViewerLineType = "add" | "remove" | "context";

export interface DiffViewerLine {
  /** Satir turu: ekleme, silme veya degismeyen (baglam). */
  type: DiffViewerLineType;
  /** Eski dosyadaki satir numarasi (ekleme satirlarinda bos). */
  oldLineNumber?: number;
  /** Yeni dosyadaki satir numarasi (silme satirlarinda bos). */
  newLineNumber?: number;
  content: string;
}

export interface DiffViewerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Basliktaki dosya adi/yolu. */
  fileName: string;
  /** Yeniden adlandirmada eski dosya adi (varsa "eski -> yeni" gosterilir). */
  renamedFrom?: string;
  /** Diff satirlari sirali. */
  lines: DiffViewerLine[];
  /** Gorunum: alt alta (unified) veya yan yana (split). Varsayilan unified. */
  view?: "unified" | "split";
  /** Ozet ekleme sayisi; verilmezse satirlardan hesaplanir. */
  additions?: number;
  /** Ozet silme sayisi; verilmezse satirlardan hesaplanir. */
  deletions?: number;
}

const rowStyles: Record<DiffViewerLineType, string> = {
  add: "bg-success/10 text-success",
  remove: "bg-destructive/10 text-destructive",
  context: "text-foreground",
};

const markerStyles: Record<DiffViewerLineType, string> = {
  add: "text-success",
  remove: "text-destructive",
  context: "text-muted-foreground/40",
};

const markerGlyph: Record<DiffViewerLineType, string> = {
  add: "+",
  remove: "-",
  context: " ",
};

const lineTypeText: Record<DiffViewerLineType, string> = {
  add: "eklendi",
  remove: "silindi",
  context: "degismedi",
};

interface SplitRow {
  left?: DiffViewerLine;
  right?: DiffViewerLine;
}

/** Unified satir listesini yan yana satir ciftlerine cevirir. */
function toSplitRows(lines: DiffViewerLine[]): SplitRow[] {
  const rows: SplitRow[] = [];
  let i = 0;
  while (i < lines.length) {
    const current = lines[i];
    if (current === undefined) break;
    if (current.type === "context") {
      rows.push({ left: current, right: current });
      i += 1;
      continue;
    }
    const removes: DiffViewerLine[] = [];
    const adds: DiffViewerLine[] = [];
    let next = lines[i];
    while (next !== undefined && next.type === "remove") {
      removes.push(next);
      i += 1;
      next = lines[i];
    }
    while (next !== undefined && next.type === "add") {
      adds.push(next);
      i += 1;
      next = lines[i];
    }
    const rowCount = Math.max(removes.length, adds.length);
    for (let j = 0; j < rowCount; j += 1) {
      rows.push({ left: removes[j], right: adds[j] });
    }
  }
  return rows;
}

function LineNumberCell({
  value,
  width,
}: {
  value?: number;
  width: number;
}) {
  return (
    <span
      className="shrink-0 select-none border-e border-border/60 px-2 text-end tabular-nums text-muted-foreground/60"
      style={{ minWidth: `${width + 2}ch` }}
      aria-hidden="true"
    >
      {value ?? ""}
    </span>
  );
}

function DiffStat({ additions, deletions }: { additions: number; deletions: number }) {
  const total = additions + deletions;
  let greens = total > 0 ? Math.round((additions / total) * 5) : 0;
  if (additions > 0 && greens === 0) greens = 1;
  if (deletions > 0 && greens === 5) greens = 4;
  return (
    <div className="flex items-center gap-2 text-xs font-medium tabular-nums">
      <span className="text-success">+{additions}</span>
      <span className="text-destructive">-{deletions}</span>
      <span className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "size-2 rounded-[2px]",
              total === 0
                ? "bg-muted"
                : i < greens
                  ? "bg-success"
                  : "bg-destructive"
            )}
          />
        ))}
      </span>
    </div>
  );
}

const DiffViewer = React.forwardRef<HTMLDivElement, DiffViewerProps>(
  (
    {
      fileName,
      renamedFrom,
      lines,
      view = "unified",
      additions,
      deletions,
      className,
      ...props
    },
    ref
  ) => {
    const totalAdd = additions ?? lines.filter((l) => l.type === "add").length;
    const totalDel = deletions ?? lines.filter((l) => l.type === "remove").length;

    const maxOld = lines.reduce((m, l) => Math.max(m, l.oldLineNumber ?? 0), 0);
    const maxNew = lines.reduce((m, l) => Math.max(m, l.newLineNumber ?? 0), 0);
    const oldWidth = String(maxOld || 1).length;
    const newWidth = String(maxNew || 1).length;

    const summary = `${fileName}: ${totalAdd} satir eklendi, ${totalDel} satir silindi`;

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md",
          className
        )}
        {...props}
      >
        <div className="flex flex-wrap items-center gap-3 border-b bg-muted/40 px-4 py-2.5">
          <FileDiff className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="flex min-w-0 items-center gap-1.5 font-mono text-xs">
            {renamedFrom ? (
              <>
                <span className="truncate text-muted-foreground line-through">
                  {renamedFrom}
                </span>
                <span className="text-muted-foreground/50" aria-hidden="true">
                  &rarr;
                </span>
              </>
            ) : null}
            <span className="truncate font-medium text-foreground">{fileName}</span>
          </div>
          <div className="ms-auto flex items-center gap-3">
            <DiffStat additions={totalAdd} deletions={totalDel} />
            <span className="rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {view === "split" ? "yan yana" : "birlesik"}
            </span>
          </div>
        </div>

        {view === "split" ? (
          <SplitBody rows={toSplitRows(lines)} oldWidth={oldWidth} newWidth={newWidth} summary={summary} />
        ) : (
          <div
            tabIndex={0}
            role="group"
            aria-label={summary}
            className="relative overflow-x-auto font-mono text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            {lines.map((line, index) => (
              <div key={index} className={cn("flex w-max min-w-full", rowStyles[line.type])}>
                <LineNumberCell value={line.oldLineNumber} width={oldWidth} />
                <LineNumberCell value={line.newLineNumber} width={newWidth} />
                <span
                  className={cn("shrink-0 select-none px-2", markerStyles[line.type])}
                  aria-hidden="true"
                >
                  {markerGlyph[line.type]}
                </span>
                <span className="sr-only">{lineTypeText[line.type]}: </span>
                <span className="whitespace-pre pe-4">{line.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
DiffViewer.displayName = "DiffViewer";

function SplitCell({
  line,
  side,
  width,
}: {
  line?: DiffViewerLine;
  side: "left" | "right";
  width: number;
}) {
  if (!line) {
    return <div className="flex h-6 bg-muted/30" aria-hidden="true" />;
  }
  const value = side === "left" ? line.oldLineNumber : line.newLineNumber;
  return (
    <div className={cn("flex h-6 w-max min-w-full items-center", rowStyles[line.type])}>
      <LineNumberCell value={value} width={width} />
      <span
        className={cn("shrink-0 select-none px-2", markerStyles[line.type])}
        aria-hidden="true"
      >
        {markerGlyph[line.type]}
      </span>
      <span className="whitespace-pre pe-4">{line.content}</span>
    </div>
  );
}

function SplitBody({
  rows,
  oldWidth,
  newWidth,
  summary,
}: {
  rows: SplitRow[];
  oldWidth: number;
  newWidth: number;
  summary: string;
}) {
  return (
    <div
      role="group"
      aria-label={summary}
      className="flex divide-x divide-border font-mono text-sm leading-relaxed rtl:divide-x-reverse"
    >
      <div
        tabIndex={0}
        className="relative min-w-0 flex-1 overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        {rows.map((row, index) => (
          <SplitCell key={index} line={row.left} side="left" width={oldWidth} />
        ))}
      </div>
      <div
        tabIndex={0}
        className="relative min-w-0 flex-1 overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        {rows.map((row, index) => (
          <SplitCell key={index} line={row.right} side="right" width={newWidth} />
        ))}
      </div>
    </div>
  );
}

export { DiffViewer };
