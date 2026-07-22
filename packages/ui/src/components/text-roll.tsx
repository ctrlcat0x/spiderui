"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";

import { cn } from "@workspace/ui/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export interface TextRollProps extends Omit<
  ComponentProps<"span">,
  "children"
> {
  items: readonly string[];
  interval?: number;
  duration?: number;
  initialIndex?: number;
  autoPlay?: boolean;
  loop?: boolean;
  perspective?: number;
  itemClassName?: string;
  onIndexChange?: (index: number) => void;
}

function clampIndex(index: number, itemCount: number) {
  if (itemCount === 0) return 0;
  return Math.min(Math.max(0, index), itemCount - 1);
}

export function TextRoll({
  items,
  interval = 1_600,
  duration = 0.45,
  initialIndex = 0,
  autoPlay = true,
  loop = true,
  perspective = 420,
  itemClassName,
  onIndexChange,
  className,
  style,
  ...props
}: TextRollProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(() =>
    clampIndex(initialIndex, items.length),
  );
  const onIndexChangeRef = useRef(onIndexChange);

  useLayoutEffect(() => {
    onIndexChangeRef.current = onIndexChange;
  });

  const safeIndex = clampIndex(activeIndex, items.length);
  const activeItem = items[safeIndex] ?? "";

  useEffect(() => {
    if (!autoPlay || reduceMotion || items.length < 2) return;

    const timer = window.setInterval(
      () => {
        setActiveIndex((currentIndex) => {
          const normalizedIndex = clampIndex(currentIndex, items.length);
          const isLastItem = normalizedIndex === items.length - 1;
          const nextIndex = isLastItem
            ? loop
              ? 0
              : normalizedIndex
            : normalizedIndex + 1;

          if (nextIndex !== normalizedIndex) {
            onIndexChangeRef.current?.(nextIndex);
          }

          return nextIndex;
        });
      },
      Math.max(interval, duration * 1_000),
    );

    return () => window.clearInterval(timer);
  }, [autoPlay, duration, interval, items.length, loop, reduceMotion]);

  if (items.length === 0) return null;

  return (
    <span
      className={cn(
        "relative inline-grid whitespace-nowrap align-bottom",
        className,
      )}
      style={{ perspective, ...style }}
      {...props}
    >
      <span className="sr-only" aria-live="polite">
        {activeItem}
      </span>
      {items.map((item, index) => (
        <span
          key={`${index}-${item}`}
          aria-hidden="true"
          className={cn("invisible col-start-1 row-start-1", itemClassName)}
        >
          {item}
        </span>
      ))}
      <span
        aria-hidden="true"
        className="col-start-1 row-start-1 [transform-style:preserve-3d]"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={`${safeIndex}-${activeItem}`}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, rotateX: -85, y: 20 }
            }
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, rotateX: 85, y: -20 }
            }
            transition={{
              duration: reduceMotion ? 0.12 : Math.max(0, duration),
              ease: EASE_OUT,
            }}
            className={cn(
              "absolute inset-x-0 top-0 origin-center [backface-visibility:hidden]",
              itemClassName,
            )}
          >
            {activeItem}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
