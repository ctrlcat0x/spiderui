"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

export type Carousel004Item = {
  id: string;
  src: string;
  alt: string;
};

export interface Carousel004Props extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  items: Carousel004Item[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  loop?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
  aspectRatio?: string;
}

const SLIDE_SPRING = {
  type: "spring" as const,
  stiffness: 340,
  damping: 36,
  mass: 0.8,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function wrap(value: number, length: number) {
  return ((value % length) + length) % length;
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("size-6", direction === "right" && "rotate-180")}
      fill="none"
    >
      <path
        d="m15 5-7 7 7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Carousel004({
  items,
  index: controlledIndex,
  defaultIndex = 0,
  onIndexChange,
  loop = false,
  autoPlay = false,
  autoPlayInterval = 4000,
  pauseOnHover = true,
  aspectRatio = "16 / 9",
  className,
  ...props
}: Carousel004Props) {
  const reducedMotion = useReducedMotion();
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const thumbnailRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const [internalIndex, setInternalIndex] = React.useState(() =>
    clamp(defaultIndex, 0, Math.max(items.length - 1, 0)),
  );
  const [viewportWidth, setViewportWidth] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const x = useMotionValue(0);
  const activeIndex = clamp(
    controlledIndex ?? internalIndex,
    0,
    Math.max(items.length - 1, 0),
  );

  const setActiveIndex = React.useCallback(
    (nextIndex: number) => {
      if (items.length === 0) return;
      const resolvedIndex = loop
        ? wrap(nextIndex, items.length)
        : clamp(nextIndex, 0, items.length - 1);
      if (controlledIndex === undefined) setInternalIndex(resolvedIndex);
      if (resolvedIndex !== activeIndex) onIndexChange?.(resolvedIndex);
    },
    [activeIndex, controlledIndex, items.length, loop, onIndexChange],
  );

  React.useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateWidth = () => setViewportWidth(viewport.clientWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (dragging || viewportWidth === 0) return;
    const controls = animate(x, -activeIndex * viewportWidth, {
      ...(reducedMotion ? { duration: 0 } : SLIDE_SPRING),
    });
    return () => controls.stop();
  }, [activeIndex, dragging, reducedMotion, viewportWidth, x]);

  React.useEffect(() => {
    thumbnailRefs.current[activeIndex]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex, reducedMotion]);

  React.useEffect(() => {
    if (
      !autoPlay ||
      reducedMotion ||
      dragging ||
      (pauseOnHover && hovered) ||
      items.length < 2
    ) {
      return;
    }

    const timer = window.setTimeout(
      () => setActiveIndex(activeIndex + 1),
      Math.max(1000, autoPlayInterval),
    );
    return () => window.clearTimeout(timer);
  }, [
    activeIndex,
    autoPlay,
    autoPlayInterval,
    dragging,
    hovered,
    items.length,
    pauseOnHover,
    reducedMotion,
    setActiveIndex,
  ]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    setDragging(false);
    const crossedDistance = Math.abs(info.offset.x) > viewportWidth * 0.22;
    const crossedVelocity = Math.abs(info.velocity.x) > 500;
    if (crossedDistance || crossedVelocity) {
      setActiveIndex(activeIndex + (info.offset.x < 0 ? 1 : -1));
      return;
    }
    animate(
      x,
      -activeIndex * viewportWidth,
      reducedMotion ? { duration: 0 } : SLIDE_SPRING,
    );
  };

  if (items.length === 0) return null;

  const previousDisabled = !loop && activeIndex === 0;
  const nextDisabled = !loop && activeIndex === items.length - 1;

  return (
    <div
      data-slot="carousel-004"
      className={cn("w-full", className)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      {...props}
    >
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Image gallery"
        tabIndex={0}
        className="group relative overflow-hidden rounded-[1.5rem] bg-muted outline-none ring-black/10 focus-visible:ring-2 dark:ring-white/20"
        style={{ aspectRatio }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            setActiveIndex(activeIndex - 1);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            setActiveIndex(activeIndex + 1);
          }
        }}
      >
        <motion.div
          className="flex h-full touch-pan-y"
          drag={items.length > 1 ? "x" : false}
          dragConstraints={{
            left: -(items.length - 1) * viewportWidth,
            right: 0,
          }}
          dragElastic={loop ? 0.12 : 0.06}
          dragMomentum={false}
          onDragStart={() => setDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ x }}
        >
          {items.map((item, itemIndex) => (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${itemIndex + 1} of ${items.length}: ${item.alt}`}
              aria-hidden={itemIndex !== activeIndex}
              className="h-full min-w-full overflow-hidden"
            >
              <img
                src={item.src}
                alt={item.alt}
                draggable={false}
                loading={itemIndex < 2 ? "eager" : "lazy"}
                className="size-full select-none object-cover"
              />
            </div>
          ))}
        </motion.div>

        <button
          type="button"
          aria-label="Previous image"
          disabled={previousDisabled}
          onClick={() => setActiveIndex(activeIndex - 1)}
          className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/75 text-slate-800 shadow-sm backdrop-blur-md transition-[background-color,opacity,scale] hover:bg-white active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-30 sm:left-6 sm:size-12"
        >
          <Chevron direction="left" />
        </button>
        <button
          type="button"
          aria-label="Next image"
          disabled={nextDisabled}
          onClick={() => setActiveIndex(activeIndex + 1)}
          className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/75 text-slate-800 shadow-sm backdrop-blur-md transition-[background-color,opacity,scale] hover:bg-white active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-30 sm:right-6 sm:size-12"
        >
          <Chevron direction="right" />
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Choose image"
        className="mt-3 flex h-20 gap-1.5 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:h-24"
      >
        {items.map((item, itemIndex) => {
          const selected = itemIndex === activeIndex;
          return (
            <motion.button
              key={item.id}
              ref={(node) => {
                thumbnailRefs.current[itemIndex] = node;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={`Show ${item.alt}`}
              onClick={() => setActiveIndex(itemIndex)}
              initial={false}
              animate={{ width: selected ? 150 : 54 }}
              transition={reducedMotion ? { duration: 0 } : SLIDE_SPRING}
              className="relative h-full shrink-0 overflow-hidden rounded-md outline-none ring-black/10 focus-visible:ring-2 dark:ring-white/20"
            >
              <img
                src={item.src}
                alt=""
                draggable={false}
                loading="lazy"
                className="size-full select-none object-cover"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset transition-colors",
                  selected
                    ? "ring-black/25 dark:ring-white/35"
                    : "ring-black/10 dark:ring-white/10",
                )}
              />
            </motion.button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Showing image {activeIndex + 1} of {items.length}
      </p>
    </div>
  );
}
