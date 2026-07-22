"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

export interface PreviewRailItem {
  id: string;
  label: string;
  description?: React.ReactNode;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

export interface PreviewRailProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  items: PreviewRailItem[];
  orientation?: "vertical" | "horizontal";
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  renderPreview?: (item: PreviewRailItem) => React.ReactNode;
  children?: React.ReactNode;
  railClassName?: string;
  previewClassName?: string;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const SPRING_LAYOUT = {
  type: "spring" as const,
  stiffness: 360,
  damping: 32,
  mass: 0.6,
};

function useHoverCapable() {
  const [canHover, setCanHover] = React.useState(false);

  React.useEffect(() => {
    if (!window.matchMedia) return;

    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(query.matches);

    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  return canHover;
}

function DefaultPreview({ item }: { item: PreviewRailItem }) {
  return (
    <div>
      <p className="text-xl font-medium tracking-tight text-card-foreground">
        {item.label}
      </p>
      {item.description ? (
        <div className="mt-2 text-sm leading-6 text-muted-foreground">
          {item.description}
        </div>
      ) : null}
    </div>
  );
}

export function PreviewRail({
  items,
  orientation = "vertical",
  activeId,
  defaultActiveId,
  onActiveChange,
  renderPreview,
  children,
  className,
  railClassName,
  previewClassName,
  ...props
}: PreviewRailProps) {
  const reduceMotion = useReducedMotion();
  const canHover = useHoverCapable();
  const [internalActiveId, setInternalActiveId] = React.useState(
    defaultActiveId ?? items[0]?.id ?? "",
  );
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [focusedId, setFocusedId] = React.useState<string | null>(null);

  const requestedActiveId = activeId ?? internalActiveId;
  const selectedId = items.some((item) => item.id === requestedActiveId)
    ? requestedActiveId
    : (items[0]?.id ?? "");
  const displayedId = hoveredId ?? focusedId ?? selectedId;
  const displayedIndex = items.findIndex((item) => item.id === displayedId);
  const displayedItem = items[displayedIndex] ?? items[0]!;
  const isHorizontal = orientation === "horizontal";
  const gridTemplate = items.length
    ? `repeat(${items.length}, 2.5rem)`
    : undefined;
  const layoutTransition = reduceMotion ? { duration: 0 } : SPRING_LAYOUT;
  const previewOffset =
    (displayedIndex - Math.max(items.length - 1, 0) / 2) * 40;

  const handleSelect = (id: string) => {
    if (activeId === undefined) setInternalActiveId(id);
    onActiveChange?.(id);
  };

  if (!items.length) return null;

  return (
    <motion.div
      layoutRoot
      data-slot="preview-rail"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusedId(null);
        }
      }}
      className={cn(
        "relative isolate flex w-full overflow-visible",
        isHorizontal
          ? "min-h-80 flex-col items-center justify-end"
          : "min-h-[25rem] items-center",
        className,
      )}
      {...props}
    >
      <nav
        aria-label="Preview rail"
        onPointerLeave={() => setHoveredId(null)}
        style={
          isHorizontal
            ? { gridTemplateColumns: gridTemplate }
            : { gridTemplateRows: gridTemplate }
        }
        className={cn(
          "relative z-10 grid shrink-0",
          isHorizontal
            ? "h-12 w-fit max-w-full justify-center"
            : "w-12 content-center",
          railClassName,
        )}
      >
        {items.map((item, index) => {
          const selected = item.id === selectedId;
          const highlighted = item.id === displayedId;
          const distance =
            displayedIndex < 0
              ? Number.POSITIVE_INFINITY
              : Math.abs(index - displayedIndex);
          const scale = highlighted
            ? 1
            : distance === 1
              ? 0.68
              : distance === 2
                ? 0.44
                : 0.25;

          return (
            <a
              key={item.id}
              href={item.href ?? "#"}
              target={item.target}
              rel={
                item.rel ??
                (item.target === "_blank" ? "noreferrer noopener" : undefined)
              }
              aria-label={item.label}
              aria-current={selected ? "page" : undefined}
              onPointerEnter={() => {
                if (canHover) setHoveredId(item.id);
              }}
              onPointerDown={() => setFocusedId(null)}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible")) {
                  setFocusedId(item.id);
                }
              }}
              onClick={(event) => {
                if (!item.href) event.preventDefault();
                handleSelect(item.id);
              }}
              className={cn(
                "relative flex cursor-pointer text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isHorizontal
                  ? "h-12 w-10 items-end justify-center"
                  : "h-10 w-12 items-center",
              )}
            >
              <motion.span
                aria-hidden="true"
                animate={isHorizontal ? { scaleY: scale } : { scaleX: scale }}
                transition={layoutTransition}
                className={cn(
                  "block rounded-full bg-current will-change-transform",
                  isHorizontal
                    ? "h-12 w-0.5 origin-bottom"
                    : "h-0.5 w-12 origin-left",
                  highlighted && "text-foreground",
                )}
              />
            </a>
          );
        })}
      </nav>

      <div
        data-preview-rail-preview
        aria-live="polite"
        className={cn(
          "pointer-events-none absolute z-20 flex",
          isHorizontal
            ? "inset-x-0 bottom-16 justify-center"
            : "inset-y-0 right-4 left-16 items-center",
        )}
      >
        <motion.div
          animate={isHorizontal ? { x: previewOffset } : { y: previewOffset }}
          transition={layoutTransition}
          className={cn(
            "will-change-transform",
            isHorizontal ? "w-72" : "w-full max-w-sm",
            previewClassName,
          )}
        >
          <div className="rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={displayedItem.id}
                data-preview-rail-content
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 4, filter: "blur(6px)" }
                }
                animate={
                  reduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, filter: "blur(0px)" }
                }
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -2, filter: "blur(4px)" }
                }
                transition={{
                  duration: reduceMotion ? 0 : 0.18,
                  ease: EASE_OUT,
                }}
              >
                {renderPreview ? (
                  renderPreview(displayedItem)
                ) : (
                  <DefaultPreview item={displayedItem} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {children ? (
        <div className="min-h-0 min-w-0 flex-1">{children}</div>
      ) : null}
    </motion.div>
  );
}
