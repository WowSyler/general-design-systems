/**
 * CodeBlock — Duz metin kod blogu.
 * Uc nokta suslu baslik cubugu, istege bagli baslik + dil rozeti ve
 * opsiyonel satir numaralariyla monospace icerik gosterir.
 * Sozdizimi vurgusu yoktur; CLI ciktilari icin idealdir.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface CodeBlockProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  code: string;
  /** Baslik cubugunda rozet olarak gosterilen dil adi. */
  language?: string;
  /** Baslik cubugunda gosterilen dosya/komut adi. */
  title?: string;
  /** Sol kenarda secilemez satir numaralari goster. */
  showLineNumbers?: boolean;
}

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ code, language, title, showLineNumbers = false, className, ...props }, ref) => {
    const lines = code.split("\n");
    const numberWidth = String(lines.length).length;

    return (
      <div
        ref={ref}
        className={cn("overflow-hidden rounded-xl border bg-muted/50", className)}
        {...props}
      >
        <div className="flex items-center gap-2 border-b bg-muted/60 px-4 py-2.5">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-muted-foreground/40" />
            <span className="size-2.5 rounded-full bg-muted-foreground/25" />
            <span className="size-2.5 rounded-full bg-muted-foreground/15" />
          </div>
          {title ? (
            <span className="truncate text-xs font-medium text-muted-foreground">
              {title}
            </span>
          ) : null}
          {language ? (
            <span className="ml-auto rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {language}
            </span>
          ) : null}
        </div>
        <pre
          tabIndex={0}
          aria-label={title ? `Kod blogu: ${title}` : "Kod blogu"}
          className="overflow-x-auto p-4 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <code>
            {showLineNumbers
              ? lines.map((line, index) => (
                  <span key={index} className="flex">
                    <span
                      className="shrink-0 select-none pr-4 text-right text-muted-foreground/50"
                      style={{ minWidth: `${numberWidth + 2}ch` }}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <span className="whitespace-pre">{line}</span>
                  </span>
                ))
              : code}
          </code>
        </pre>
      </div>
    );
  }
);
CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
