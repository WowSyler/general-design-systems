/**
 * GitRef — Git referans rozeti (inline, kompakt).
 * Tur ikonu (branch -> GitBranch, commit -> GitCommit, tag -> Tag) ile
 * mono metni (dal adi, kisa commit hash veya tag adi) tek bir hap icinde
 * gosterir. cva "type" varyanti her turu kendi tonlu dolgusuyla ayirir.
 * Opsiyonel "copyable" ile sagda kucuk bir kopyala butonu belirir; kopyalanan
 * her zaman tam "value" degeridir (gorunen metin "display" ile kisaltilabilir).
 * Kopyalama zaten istemci bileseni olan CopyButton'a devredildigi icin GitRef'in
 * kendisi "use client" gerektirmez.
 * Kullanim: DeployLens deploy satirlari, PR/commit detaylari, surum etiketleri.
 */
import * as React from "react";
import { GitBranch, GitCommit, Tag as TagIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/ui-extras/copy-button";

/** GitRef tur secenekleri. */
export type GitRefType = "branch" | "commit" | "tag";

const gitRefVariants = cva(
  "inline-flex max-w-full items-center whitespace-nowrap rounded-md border font-mono font-medium tabular-nums align-middle transition-all duration-200 [&_svg]:shrink-0",
  {
    variants: {
      type: {
        branch: "border-info/25 bg-info/10 text-info",
        commit: "border-border bg-muted text-foreground",
        tag: "border-primary/25 bg-primary/10 text-primary",
      },
      size: {
        sm: "gap-1 px-1.5 py-0 text-[11px] [&_svg]:size-3",
        md: "gap-1.5 px-2 py-0.5 text-xs [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      type: "branch",
      size: "md",
    },
  }
);

/** Tur -> lucide ikon eslemesi. */
const iconMap: Record<GitRefType, React.ComponentType<{ className?: string }>> =
  {
    branch: GitBranch,
    commit: GitCommit,
    tag: TagIcon,
  };

/** Tur -> erisilebilirlik/kopya etiketi (sapkasiz olmayan Turkce). */
const labelMap: Record<GitRefType, string> = {
  branch: "Dal",
  commit: "Commit",
  tag: "Etiket",
};

export interface GitRefProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof gitRefVariants> {
  /** Referans degeri: dal adi, tam commit hash veya tag adi. Kopyalanan degerdir. */
  value: string;
  /** Gorunen metin (or. kisa hash). Verilmezse value gosterilir. */
  display?: string;
  /** Sagda kucuk bir kopyala butonu ekler (tam value kopyalanir). */
  copyable?: boolean;
  /** Tur ikonunu gizler; yalnizca mono metin gosterir. */
  hideIcon?: boolean;
}

/**
 * GitRef — Tur ikonu + mono referans metni, opsiyonel kopyala.
 */
const GitRef = React.forwardRef<HTMLSpanElement, GitRefProps>(
  (
    { value, display, copyable, hideIcon, type, size, className, ...props },
    ref
  ) => {
    const resolvedType: GitRefType = type ?? "branch";
    const resolvedSize = size ?? "md";
    const Icon = iconMap[resolvedType];

    return (
      <span
        ref={ref}
        title={value}
        className={cn(gitRefVariants({ type, size }), className)}
        {...props}
      >
        {hideIcon ? null : <Icon aria-hidden="true" />}
        <span className="sr-only">{labelMap[resolvedType]}: </span>
        <span className="min-w-0 truncate">{display ?? value}</span>
        {copyable ? (
          <CopyButton
            value={value}
            variant="ghost"
            aria-label={`${labelMap[resolvedType]} değerini kopyala`}
            className={cn(
              "-me-1 ms-0.5 size-5 rounded text-current opacity-70 transition-all duration-200 hover:bg-foreground/10 hover:text-current hover:opacity-100 [&_svg]:size-3",
              resolvedSize === "sm" && "-me-0.5 ms-0 size-4"
            )}
          />
        ) : null}
      </span>
    );
  }
);
GitRef.displayName = "GitRef";

export { GitRef, gitRefVariants };
