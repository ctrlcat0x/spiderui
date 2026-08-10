"use client";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Tabs as TabsPrimitive } from "radix-ui";
import {
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from "react";

import { cn } from "@workspace/ui/lib/utils";

export interface DiscreteTabItem {
  value: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  content: ReactNode;
  disabled?: boolean;
}

export interface DiscreteTabsProps extends Omit<
  ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
  "children" | "value" | "defaultValue" | "onValueChange"
> {
  items: readonly DiscreteTabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  listLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

const sizeClasses = {
  sm: {
    trigger: "h-12 min-w-12 gap-2 px-3 text-xs [&_svg]:size-5",
    active: "px-4",
  },
  md: {
    trigger: "h-16 min-w-16 gap-2.5 px-4 text-sm [&_svg]:size-6",
    active: "px-5",
  },
  lg: {
    trigger: "h-20 min-w-20 gap-3 px-5 text-base [&_svg]:size-7",
    active: "px-6",
  },
} as const;

export function DiscreteTabs({
  items,
  value,
  defaultValue,
  onValueChange,
  listLabel = "Sections",
  size = "md",
  className,
  listClassName,
  triggerClassName,
  contentClassName,
  orientation = "horizontal",
  ...props
}: DiscreteTabsProps) {
  const reduceMotion = useReducedMotion();
  const layoutGroupId = useId();
  const hasInteractedRef = useRef(false);
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? items[0]?.value ?? "",
  );
  const activeValue = value ?? internalValue;

  const handleValueChange = (nextValue: string) => {
    hasInteractedRef.current = true;
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <TabsPrimitive.Root
      value={activeValue}
      onValueChange={handleValueChange}
      orientation={orientation}
      className={cn("w-fit", className)}
      {...props}
    >
      <LayoutGroup id={layoutGroupId}>
        <TabsPrimitive.List
          aria-label={listLabel}
          className={cn(
            "flex w-fit items-center gap-3",
            orientation === "vertical" && "flex-col",
            listClassName,
          )}
        >
          {items.map((item) => {
            const active = item.value === activeValue;
            const Icon = item.icon;

            return (
              <TabsPrimitive.Trigger
                key={item.value}
                value={item.value}
                disabled={item.disabled}
                asChild
              >
                <motion.button
                  layout
                  type="button"
                  title={item.label}
                  aria-label={item.label}
                  className={cn(
                    "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-mono font-medium uppercase text-muted-foreground shadow-sm outline outline-2 outline-background transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40",
                    sizeClasses[size].trigger,
                    active && "bg-secondary text-foreground",
                    active && sizeClasses[size].active,
                    triggerClassName,
                  )}
                  style={{ willChange: "transform" }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          layout: {
                            type: "spring",
                            damping: 20,
                            stiffness: 230,
                            mass: 1.2,
                          },
                        }
                  }
                  whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                >
                  <motion.span
                    layout="position"
                    className="flex shrink-0"
                    style={{ willChange: "transform" }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            layout: {
                              type: "spring",
                              damping: 20,
                              stiffness: 230,
                              mass: 1.2,
                            },
                          }
                    }
                  >
                    <Icon aria-hidden="true" className="shrink-0" />
                  </motion.span>
                  {active ? (
                    <motion.span
                      key={item.value}
                      className="whitespace-nowrap"
                      initial={
                        reduceMotion || !hasInteractedRef.current
                          ? false
                          : { opacity: 0, filter: "blur(4px)" }
                      }
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 0.2, ease: [0.86, 0, 0.07, 1] }
                      }
                    >
                      {item.label}
                    </motion.span>
                  ) : null}
                </motion.button>
              </TabsPrimitive.Trigger>
            );
          })}
        </TabsPrimitive.List>
      </LayoutGroup>

      {items.map((item) => (
        <TabsPrimitive.Content
          key={item.value}
          value={item.value}
          className={cn(
            "mt-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            contentClassName,
          )}
        >
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
