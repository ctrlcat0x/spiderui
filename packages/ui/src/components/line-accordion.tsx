"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

export interface LineAccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface LineAccordionProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  items: LineAccordionItem[];
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string[]) => void;
  allowMultiple?: boolean;
}

function toValues(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function LineAccordion({
  items,
  value,
  defaultValue,
  onValueChange,
  allowMultiple = false,
  className,
  ...props
}: LineAccordionProps) {
  const baseId = React.useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  const [internalValues, setInternalValues] = React.useState(() =>
    toValues(defaultValue),
  );
  const openValues = value === undefined ? internalValues : toValues(value);

  const handleToggle = (id: string) => {
    const isOpen = openValues.includes(id);
    const nextValues = isOpen
      ? openValues.filter((valueId) => valueId !== id)
      : allowMultiple
        ? [...openValues, id]
        : [id];

    if (value === undefined) setInternalValues(nextValues);
    onValueChange?.(nextValues);
  };

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.38, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div className={cn("w-full", className)} {...props}>
      {items.map((item) => {
        const isOpen = openValues.includes(item.id);
        const triggerId = `${baseId}-${item.id}-trigger`;
        const contentId = `${baseId}-${item.id}-content`;

        return (
          <div
            key={item.id}
            data-state={isOpen ? "open" : "closed"}
            className="border-b border-border/60 last:border-b-0"
          >
            <button
              id={triggerId}
              type="button"
              disabled={item.disabled}
              aria-controls={contentId}
              aria-expanded={isOpen}
              onClick={() => handleToggle(item.id)}
              className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium tracking-tight text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-50 sm:text-xl"
            >
              <span>{item.title}</span>
              <span
                aria-hidden="true"
                className="relative grid size-7 shrink-0 place-items-center text-foreground"
              >
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <motion.span
                  initial={false}
                  animate={{ scaleY: isOpen ? 0 : 1 }}
                  transition={transition}
                  className="absolute h-5 w-0.5 rounded-full bg-current"
                />
              </span>
            </button>

            <motion.div
              id={contentId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={transition}
              className="overflow-hidden"
            >
              <div className="max-w-4xl pb-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {item.content}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
