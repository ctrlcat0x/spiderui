"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

export interface BounceSidebarItem {
  id: string;
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface BounceSidebarProps extends Omit<
  React.ComponentProps<"nav">,
  "onChange"
> {
  items: BounceSidebarItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  listClassName?: string;
  itemClassName?: string;
  indicatorClassName?: string;
}

const INDICATOR_SIZE = 6;

export function BounceSidebar({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
  listClassName,
  itemClassName,
  indicatorClassName,
  "aria-label": ariaLabel = "Sidebar navigation",
  ...props
}: BounceSidebarProps) {
  const reduceMotion = useReducedMotion();
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? items[0]?.id ?? "",
  );
  const [indicatorY, setIndicatorY] = React.useState(0);
  const listRef = React.useRef<HTMLUListElement>(null);
  const itemRefs = React.useRef(new Map<string, HTMLLIElement>());
  const selectedValue = items.some(
    (item) => item.id === (value ?? internalValue),
  )
    ? (value ?? internalValue)
    : (items[0]?.id ?? "");

  const measureIndicator = React.useCallback(() => {
    const selectedItem = itemRefs.current.get(selectedValue);
    if (!selectedItem) return;
    setIndicatorY(
      selectedItem.offsetTop + (selectedItem.offsetHeight - INDICATOR_SIZE) / 2,
    );
  }, [selectedValue]);

  React.useLayoutEffect(measureIndicator, [measureIndicator]);

  React.useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measureIndicator);
    observer.observe(list);
    return () => observer.disconnect();
  }, [measureIndicator]);

  const handleSelect = (id: string) => {
    if (value === undefined) setInternalValue(id);
    onValueChange?.(id);
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn("relative", className)}
      {...props}
    >
      <ul
        ref={listRef}
        className={cn(
          "relative flex list-none flex-col gap-2 pl-7",
          listClassName,
        )}
      >
        {items.length > 0 && (
          <li
            aria-hidden="true"
            role="presentation"
            className="pointer-events-none absolute inset-0"
          >
            <motion.span
              className={cn(
                "absolute left-3 top-0 size-1.5 rounded-full bg-foreground",
                indicatorClassName,
              )}
              initial={false}
              animate={{
                y: indicatorY,
                x: reduceMotion ? 0 : [0, -12, 0],
              }}
              transition={{
                y: reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 320, damping: 22, mass: 0.45 },
                x: reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.38, ease: "easeOut" },
              }}
            />
          </li>
        )}

        {items.map((item) => {
          const active = item.id === selectedValue;
          const content = (
            <>
              {item.icon && <span aria-hidden="true">{item.icon}</span>}
              <span>{item.label}</span>
            </>
          );
          const itemClasses = cn(
            "flex min-h-10 w-full items-center gap-2 rounded-lg px-2 text-left text-base font-medium outline-none transition-colors",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            active
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
            item.disabled && "cursor-not-allowed opacity-40",
            itemClassName,
          );

          return (
            <li
              key={item.id}
              ref={(node) => {
                if (node) itemRefs.current.set(item.id, node);
                else itemRefs.current.delete(item.id);
              }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-disabled={item.disabled || undefined}
                  tabIndex={item.disabled ? -1 : undefined}
                  onClick={(event) => {
                    if (item.disabled) event.preventDefault();
                    else handleSelect(item.id);
                  }}
                  className={itemClasses}
                >
                  {content}
                </a>
              ) : (
                <button
                  type="button"
                  disabled={item.disabled}
                  aria-current={active ? "page" : undefined}
                  onClick={() => handleSelect(item.id)}
                  className={itemClasses}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
