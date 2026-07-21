"use client";
/**
 * TreeView — Genisletilebilir ic-ice agac gorunumu.
 * Node veri modeli (id, label, icon, children) uzerinden calisir;
 * ChevronRight donen expand/collapse, girinti seviyesi, aktif/secili
 * vurgu ve opsiyonel tri-state checkbox secim (parent yari-secili)
 * sunar. Klavye: Ok tuslari ile gezinme, Enter ile klasor ac/kapa,
 * Space ile isaretleme. role=tree/treeitem, aria-expanded/selected
 * ile erisilebilir. DeployLens dosya/org agaci, Fisly kategori>alt
 * kategori, Dolap kategori agaci gibi senaryolar icin uygundur.
 */
import * as React from "react";
import { Check, ChevronRight, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

export interface TreeViewNode {
  /** Benzersiz dugum kimligi. */
  id: string;
  /** Satirda gosterilecek etiket. */
  label: React.ReactNode;
  /** Etiketin solunda opsiyonel ikon (lucide vb.). */
  icon?: React.ReactNode;
  /** Alt dugumler; varsa dugum genisletilebilir olur. */
  children?: TreeViewNode[];
  /** Satiri devre disi birakir (secilemez/gezinilemez). */
  disabled?: boolean;
}

type CheckState = "checked" | "unchecked" | "indeterminate";

interface FlatNode {
  node: TreeViewNode;
  level: number;
  parentId: string | null;
  hasChildren: boolean;
}

export interface TreeViewProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Agac veri modeli (koklerin listesi). */
  data: TreeViewNode[];
  /** Baslangicta acik dugum kimlikleri (kontrolsuz). */
  defaultExpandedIds?: string[];
  /** Acik dugum kimlikleri (kontrollu). */
  expandedIds?: string[];
  /** Genisleme degisince tetiklenir. */
  onExpandedChange?: (ids: string[]) => void;
  /** Baslangicta aktif/secili dugum (kontrolsuz). */
  defaultActiveId?: string;
  /** Aktif/secili dugum (kontrollu). */
  activeId?: string;
  /** Aktif dugum degisince tetiklenir. */
  onActiveChange?: (id: string) => void;
  /** Tri-state checkbox secim modunu acar. */
  selectable?: boolean;
  /** Baslangicta isaretli yaprak kimlikleri (kontrolsuz). */
  defaultCheckedIds?: string[];
  /** Isaretli yaprak kimlikleri (kontrollu). */
  checkedIds?: string[];
  /** Isaretleme degisince tetiklenir (yaprak kimlikleri). */
  onCheckedChange?: (ids: string[]) => void;
}

/** Bir dugum agacinin tum yaprak kimliklerini toplar. */
function collectLeafIds(node: TreeViewNode): string[] {
  if (!node.children || node.children.length === 0) return [node.id];
  return node.children.flatMap(collectLeafIds);
}

/** Gorunur (acik atalar zincirindeki) dugumleri duz listeye acar. */
function flatten(
  nodes: TreeViewNode[],
  expanded: Set<string>,
  level: number,
  parentId: string | null,
  out: FlatNode[]
): void {
  for (const node of nodes) {
    const hasChildren = !!node.children && node.children.length > 0;
    out.push({ node, level, parentId, hasChildren });
    if (hasChildren && expanded.has(node.id)) {
      flatten(node.children!, expanded, level + 1, node.id, out);
    }
  }
}

/** Kontrollu/kontrolsuz ortak durum kancasi. */
function useControllable<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : uncontrolled;
  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );
  return [value, setValue] as const;
}

const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      data,
      defaultExpandedIds,
      expandedIds,
      onExpandedChange,
      defaultActiveId,
      activeId,
      onActiveChange,
      selectable = false,
      defaultCheckedIds,
      checkedIds,
      onCheckedChange,
      className,
      ...props
    },
    ref
  ) => {
    const [expanded, setExpanded] = useControllable<string[]>(
      expandedIds,
      defaultExpandedIds ?? [],
      onExpandedChange
    );
    const [active, setActive] = useControllable<string>(
      activeId,
      defaultActiveId ?? "",
      onActiveChange
    );
    const [checked, setChecked] = useControllable<string[]>(
      checkedIds,
      defaultCheckedIds ?? [],
      onCheckedChange
    );

    const expandedSet = React.useMemo(() => new Set(expanded), [expanded]);
    const checkedSet = React.useMemo(() => new Set(checked), [checked]);

    const flat = React.useMemo(() => {
      const out: FlatNode[] = [];
      flatten(data, expandedSet, 0, null, out);
      return out;
    }, [data, expandedSet]);

    const itemRefs = React.useRef(new Map<string, HTMLDivElement>());
    const registerItem = React.useCallback(
      (id: string, el: HTMLDivElement | null) => {
        if (el) itemRefs.current.set(id, el);
        else itemRefs.current.delete(id);
      },
      []
    );

    // Roving tabindex capasi: aktif dugum yoksa ilk gorunur dugum.
    const focusableId = active || flat[0]?.node.id || "";

    const focusNode = React.useCallback(
      (id: string) => {
        setActive(id);
        itemRefs.current.get(id)?.focus();
      },
      [setActive]
    );

    const toggleExpanded = React.useCallback(
      (id: string) => {
        const next = new Set(expandedSet);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpanded(Array.from(next));
      },
      [expandedSet, setExpanded]
    );

    const getCheckState = React.useCallback(
      (node: TreeViewNode): CheckState => {
        const leaves = collectLeafIds(node);
        let count = 0;
        for (const leaf of leaves) if (checkedSet.has(leaf)) count += 1;
        if (count === 0) return "unchecked";
        if (count === leaves.length) return "checked";
        return "indeterminate";
      },
      [checkedSet]
    );

    const toggleChecked = React.useCallback(
      (node: TreeViewNode) => {
        const leaves = collectLeafIds(node);
        const state = getCheckState(node);
        const next = new Set(checkedSet);
        // Tam isaretli/yari-isaretli -> temizle; degilse -> tumunu isaretle.
        const shouldCheck = state !== "checked";
        for (const leaf of leaves) {
          if (shouldCheck) next.add(leaf);
          else next.delete(leaf);
        }
        setChecked(Array.from(next));
      },
      [checkedSet, getCheckState, setChecked]
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>, id: string) => {
        const index = flat.findIndex((f) => f.node.id === id);
        const current = flat[index];
        if (!current) return;
        const { hasChildren, node, parentId } = current;
        const isOpen = expandedSet.has(id);

        const focusAt = (target: number) => {
          const clamped = Math.max(0, Math.min(flat.length - 1, target));
          const targetNode = flat[clamped];
          if (targetNode) focusNode(targetNode.node.id);
        };

        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            focusAt(index + 1);
            break;
          case "ArrowUp":
            event.preventDefault();
            focusAt(index - 1);
            break;
          case "ArrowRight":
            event.preventDefault();
            if (hasChildren && !isOpen) toggleExpanded(id);
            else if (hasChildren && isOpen) focusAt(index + 1);
            break;
          case "ArrowLeft":
            event.preventDefault();
            if (hasChildren && isOpen) toggleExpanded(id);
            else if (parentId) focusNode(parentId);
            break;
          case "Home":
            event.preventDefault();
            focusAt(0);
            break;
          case "End":
            event.preventDefault();
            focusAt(flat.length - 1);
            break;
          case "Enter":
            event.preventDefault();
            setActive(id);
            if (hasChildren) toggleExpanded(id);
            break;
          case " ":
            if (selectable) {
              event.preventDefault();
              toggleChecked(node);
            }
            break;
          default:
            break;
        }
      },
      [
        flat,
        expandedSet,
        focusNode,
        toggleExpanded,
        setActive,
        selectable,
        toggleChecked,
      ]
    );

    const renderNodes = (nodes: TreeViewNode[], level: number) =>
      nodes.map((node) => {
        const hasChildren = !!node.children && node.children.length > 0;
        const isOpen = expandedSet.has(node.id);
        const isActive = active === node.id;
        const checkState = selectable ? getCheckState(node) : "unchecked";

        return (
          <li key={node.id} role="none" className="relative">
            <div
              ref={(el) => registerItem(node.id, el)}
              role="treeitem"
              aria-level={level + 1}
              aria-selected={isActive}
              aria-expanded={hasChildren ? isOpen : undefined}
              aria-checked={
                selectable
                  ? checkState === "indeterminate"
                    ? "mixed"
                    : checkState === "checked"
                  : undefined
              }
              aria-disabled={node.disabled || undefined}
              tabIndex={node.disabled ? -1 : focusableId === node.id ? 0 : -1}
              onKeyDown={(e) => !node.disabled && handleKeyDown(e, node.id)}
              onClick={() => {
                if (node.disabled) return;
                setActive(node.id);
                if (hasChildren) toggleExpanded(node.id);
              }}
              style={{ paddingLeft: level * 16 + 8 }}
              className={cn(
                "group/tree-row flex h-9 select-none items-center gap-1.5 rounded-md pr-2 text-sm outline-none transition-colors duration-200",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background",
                node.disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-accent/60",
                isActive &&
                  !node.disabled &&
                  "bg-accent text-accent-foreground font-medium"
              )}
            >
              {/* Chevron / girinti yer tutucusu */}
              {hasChildren ? (
                <ChevronRight
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover/tree-row:text-foreground",
                    isOpen && "rotate-90"
                  )}
                  aria-hidden="true"
                />
              ) : (
                <span className="size-4 shrink-0" aria-hidden="true" />
              )}

              {/* Tri-state checkbox (opsiyonel) */}
              {selectable ? (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!node.disabled) toggleChecked(node);
                  }}
                  className={cn(
                    "grid size-4 shrink-0 place-content-center rounded-sm border transition-colors duration-200",
                    checkState === "unchecked"
                      ? "border-primary bg-background"
                      : "border-primary bg-primary text-primary-foreground"
                  )}
                  aria-hidden="true"
                >
                  {checkState === "checked" ? (
                    <Check className="size-3" />
                  ) : checkState === "indeterminate" ? (
                    <Minus className="size-3" />
                  ) : null}
                </span>
              ) : null}

              {node.icon ? (
                <span
                  className={cn(
                    "flex shrink-0 items-center text-muted-foreground [&_svg]:size-4",
                    isActive && "text-foreground"
                  )}
                  aria-hidden="true"
                >
                  {node.icon}
                </span>
              ) : null}

              <span className="truncate">{node.label}</span>
            </div>

            {hasChildren && isOpen ? (
              <ul role="group" className="m-0 list-none p-0">
                {renderNodes(node.children!, level + 1)}
              </ul>
            ) : null}
          </li>
        );
      });

    return (
      <div
        ref={ref}
        className={cn("w-full text-foreground", className)}
        {...props}
      >
        <ul role="tree" className="m-0 list-none p-0">
          {renderNodes(data, 0)}
        </ul>
      </div>
    );
  }
);
TreeView.displayName = "TreeView";

export { TreeView };
