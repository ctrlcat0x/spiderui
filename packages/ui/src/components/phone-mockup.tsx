"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

import { Button } from "./button";
import { cn } from "@workspace/ui/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export interface PhoneMockupProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  src?: string;
  alt?: string;
  children?: ReactNode;
  width?: string | number;
  height?: string | number;
  imageClassName?: string;
  screenClassName?: string;
  imagePriority?: boolean;
}

export function PhoneMockup({
  src,
  alt = "Phone screen",
  children,
  width = "100%",
  height = "auto",
  imageClassName,
  screenClassName,
  imagePriority = false,
  className,
  style,
  ...props
}: PhoneMockupProps) {
  const rawId = useId();
  const clipPathId = `phone-screen-${rawId.replace(/:/g, "")}`;

  return (
    <div
      className={cn("relative aspect-[433/882] max-w-full", className)}
      style={{ width, height, ...style }}
      {...props}
    >
      <svg
        aria-hidden="true"
        className="block size-full overflow-visible"
        viewBox="0 0 433 882"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 73C2 32.683 34.683 0 75 0h282c40.317 0 73 32.683 73 73v736c0 40.317-32.683 73-73 73H75C34.683 882 2 849.317 2 809V73Z"
          className="fill-zinc-500 dark:fill-zinc-200"
        />
        <path
          d="M0 171a1 1 0 0 1 1-1h2v34H1a1 1 0 0 1-1-1v-32ZM1 234a1 1 0 0 1 1-1h1.5v67H2a1 1 0 0 1-1-1v-65ZM1 319a1 1 0 0 1 1-1h1.5v67H2a1 1 0 0 1-1-1v-65ZM430 279h2a1 1 0 0 1 1 1v104a1 1 0 0 1-1 1h-2V279Z"
          className="fill-zinc-500 dark:fill-zinc-200"
        />
        <path
          d="M6 74C6 35.34 37.34 4 76 4h280c38.66 0 70 31.34 70 70v734c0 38.66-31.34 70-70 70H76c-38.66 0-70-31.34-70-70V74Z"
          className="fill-zinc-950"
        />
        <foreignObject
          x="21.25"
          y="19.25"
          width="389.5"
          height="843.5"
          clipPath={`url(#${clipPathId})`}
        >
          <div
            className={cn(
              "relative size-full overflow-hidden bg-muted text-foreground",
              screenClassName,
            )}
          >
            {src ? (
              <img
                src={src}
                alt={alt}
                loading={imagePriority ? "eager" : "lazy"}
                fetchPriority={imagePriority ? "high" : "auto"}
                decoding="async"
                className={cn("size-full object-cover", imageClassName)}
              />
            ) : (
              children
            )}
          </div>
        </foreignObject>
        <rect
          x="21.25"
          y="19.25"
          width="389.5"
          height="843.5"
          rx="55.75"
          className="fill-none stroke-white/15"
          strokeWidth="1"
        />
        <rect
          x="154"
          y="30"
          width="124"
          height="37"
          rx="18.5"
          className="fill-black"
        />
        <circle cx="259.5" cy="48.5" r="10.5" className="fill-zinc-950" />
        <circle cx="259.5" cy="48.5" r="5.5" className="fill-zinc-800" />
        <path
          d="M174 5h84v.5a2 2 0 0 1-2 2h-80a2 2 0 0 1-2-2V5Z"
          className="fill-white/25"
        />
        <defs>
          <clipPath id={clipPathId}>
            <rect x="21.25" y="19.25" width="389.5" height="843.5" rx="55.75" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export interface PhoneCarouselItem {
  id?: string;
  src?: string;
  alt: string;
  content?: ReactNode;
}

export interface PhoneCarouselProps extends Omit<
  ComponentProps<"section">,
  "children"
> {
  items: readonly PhoneCarouselItem[];
  variant?: "carousel" | "stack";
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  pauseOnHover?: boolean;
  phoneClassName?: string;
}

function wrapIndex(index: number, length: number) {
  if (length === 0) return 0;
  return ((index % length) + length) % length;
}

function getCircularOffset(index: number, activeIndex: number, length: number) {
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

export function PhoneCarousel({
  items,
  variant = "carousel",
  activeIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  autoPlay = true,
  interval = 3_000,
  showControls = true,
  pauseOnHover = true,
  phoneClassName,
  className,
  ...props
}: PhoneCarouselProps) {
  const reduceMotion = useReducedMotion();
  const [internalIndex, setInternalIndex] = useState(() =>
    wrapIndex(defaultActiveIndex, items.length),
  );
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const onActiveIndexChangeRef = useRef(onActiveIndexChange);

  useLayoutEffect(() => {
    onActiveIndexChangeRef.current = onActiveIndexChange;
  });

  const isControlled = activeIndex !== undefined;
  const currentIndex = wrapIndex(
    isControlled ? activeIndex : internalIndex,
    items.length,
  );
  const canNavigate = items.length > 1;

  const handleSelect = (nextIndex: number) => {
    const normalizedIndex = wrapIndex(nextIndex, items.length);
    if (!isControlled) setInternalIndex(normalizedIndex);
    onActiveIndexChangeRef.current?.(normalizedIndex);
  };

  useEffect(() => {
    if (
      !autoPlay ||
      reduceMotion ||
      !canNavigate ||
      isPaused ||
      (pauseOnHover && isHovering)
    ) {
      return;
    }

    const timer = window.setInterval(
      () => {
        if (isControlled) {
          onActiveIndexChangeRef.current?.(
            wrapIndex(currentIndex + 1, items.length),
          );
          return;
        }
        setInternalIndex((index) => wrapIndex(index + 1, items.length));
      },
      Math.max(500, interval),
    );

    return () => window.clearInterval(timer);
  }, [
    autoPlay,
    canNavigate,
    currentIndex,
    interval,
    isControlled,
    isHovering,
    isPaused,
    items.length,
    pauseOnHover,
    reduceMotion,
  ]);

  if (items.length === 0) return null;

  const isStack = variant === "stack";

  return (
    <section
      aria-label="Phone screen showcase"
      className={cn(
        "relative w-full overflow-hidden",
        isStack
          ? "min-h-[520px] sm:min-h-[610px]"
          : "min-h-[450px] sm:min-h-[560px]",
        className,
      )}
      {...props}
      onPointerEnter={() => setIsHovering(true)}
      onPointerLeave={() => setIsHovering(false)}
    >
      <div className="absolute inset-x-0 top-4 flex justify-center sm:top-6">
        <div className="relative h-[420px] w-full sm:h-[530px]">
          {items.map((item, index) => {
            const offset = getCircularOffset(index, currentIndex, items.length);
            const isVisible = Math.abs(offset) <= 1;
            const isActive = offset === 0;
            const x = isStack ? 0 : offset * 58;
            const y = isStack ? (offset + 1) * 24 : 0;
            const scale = isActive
              ? 1
              : isStack
                ? 0.92 + (offset + 1) * 0.035
                : 0.88;

            return (
              <motion.div
                key={item.id ?? `${index}-${item.alt}`}
                aria-hidden={!isActive}
                className="absolute left-1/2 top-0 w-[230px] -translate-x-1/2 sm:w-[290px]"
                initial={false}
                animate={{
                  x: `${x}%`,
                  y,
                  scale,
                  opacity: isVisible
                    ? isActive
                      ? 1
                      : isStack
                        ? 0.5
                        : 0.28
                    : 0,
                  zIndex: isStack
                    ? isActive
                      ? 30
                      : offset < 0
                        ? 10
                        : 20
                    : isActive
                      ? 20
                      : 10,
                }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.55, ease: EASE_OUT }
                }
              >
                <PhoneMockup
                  src={item.src}
                  alt={item.alt}
                  className={phoneClassName}
                >
                  {item.content}
                </PhoneMockup>
              </motion.div>
            );
          })}
        </div>
      </div>

      {showControls && canNavigate ? (
        <div className="absolute inset-x-0 bottom-5 z-40 flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full bg-background/80 shadow-sm backdrop-blur-md"
            onClick={() => handleSelect(currentIndex - 1)}
            aria-label="Show previous screen"
          >
            <ChevronLeft data-icon="inline-start" />
          </Button>
          {autoPlay ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80 shadow-sm backdrop-blur-md"
              onClick={() => setIsPaused((paused) => !paused)}
              aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
              aria-pressed={isPaused}
            >
              {isPaused ? (
                <Play data-icon="inline-start" />
              ) : (
                <Pause data-icon="inline-start" />
              )}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full bg-background/80 shadow-sm backdrop-blur-md"
            onClick={() => handleSelect(currentIndex + 1)}
            aria-label="Show next screen"
          >
            <ChevronRight data-icon="inline-end" />
          </Button>
        </div>
      ) : null}
    </section>
  );
}
