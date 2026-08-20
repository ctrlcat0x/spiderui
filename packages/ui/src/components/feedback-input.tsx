"use client";

import {
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

export type FeedbackOption = {
  value: number;
  emoji: string;
  label: string;
};

const DEFAULT_OPTIONS: FeedbackOption[] = [
  { value: 1, emoji: "😞", label: "Very dissatisfied" },
  { value: 2, emoji: "🙁", label: "Dissatisfied" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Satisfied" },
  { value: 5, emoji: "😍", label: "Very satisfied" },
];

const SURFACE = "bg-[#f4f4f5] dark:bg-[#262626]";
const BURST_COUNT = 5;
const HOLD_INTERVAL = 550;
const MAX_PARTICLES = 60;
const EASE = [0.4, 0.3, 0.5, 1] as const;
const GAP = 16;
const EDGE = 8;

const SIZES = {
  sm: {
    trigger: "size-8 text-lg",
    emoji: "text-[26px]",
    pill: "gap-0.5 p-1",
    burst: 26,
  },
  md: {
    trigger: "size-10 text-2xl",
    emoji: "text-[34px]",
    pill: "gap-1 p-1.5",
    burst: 34,
  },
  lg: {
    trigger: "size-12 text-[28px]",
    emoji: "text-[42px]",
    pill: "gap-1.5 p-2",
    burst: 42,
  },
} as const;

type Align = "left" | "center" | "right";
type Placement = { side: "top" | "bottom"; shift: number; tailX: number };
type Particle = {
  id: number;
  emoji: string;
  originX: number;
  originY: number;
  x: number;
  drift: number;
  tilt: number;
  travel: number;
  scale: number;
  blur: number;
  fadeAt: number;
  duration: number;
  delay: number;
};

const random = (min: number, max: number) => min + Math.random() * (max - min);

function getPlacement(
  trigger: DOMRect,
  width: number,
  height: number,
  align: Align,
): Placement {
  const anchored =
    align === "left"
      ? trigger.left
      : align === "right"
        ? trigger.right - width
        : trigger.left + trigger.width / 2 - width / 2;
  const leftOverflow = EDGE - anchored;
  const rightOverflow = anchored + width - (window.innerWidth - EDGE);
  const shift =
    leftOverflow > 0 ? leftOverflow : rightOverflow > 0 ? -rightOverflow : 0;

  return {
    side: trigger.top - height - GAP < EDGE ? "bottom" : "top",
    shift,
    tailX: trigger.left + trigger.width / 2 - (anchored + shift),
  };
}

function makeParticles(
  emoji: string,
  seed: number,
  from: DOMRect,
  bar: DOMRect,
): Particle[] {
  const originX = from.left + from.width / 2 - bar.left;
  const originY = from.top + from.height / 2 - bar.top;

  return Array.from({ length: BURST_COUNT }, (_, index) => {
    const lane = random(-1, 1);
    const direction = lane < 0 ? -1 : 1;
    return {
      id: seed + index,
      emoji,
      originX,
      originY,
      x: lane * 6,
      drift: lane * 78,
      tilt: random(1, 4) * direction,
      travel: 450 * random(0.86, 1),
      scale: random(0.78, 1.05),
      blur: random(0.18, 0.3),
      fadeAt: random(0.55, 0.88),
      duration: random(1.4, 1.8),
      delay: index * 0.25,
    };
  });
}

const BurstEmoji = memo(function BurstEmoji({
  particle,
  size,
  onDone,
}: {
  particle: Particle;
  size: number;
  onDone: (id: number) => void;
}) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute z-0 select-none leading-none will-change-transform"
      style={{
        left: particle.originX,
        top: particle.originY,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        fontSize: size,
      }}
      initial={{
        x: particle.x,
        y: 0,
        scale: 0.6,
        opacity: 0,
        rotate: 0,
        filter: "blur(0px)",
      }}
      animate={{
        x: particle.x + particle.drift,
        y: -particle.travel,
        scale: [
          0.6,
          particle.scale * 1.15,
          particle.scale,
          particle.scale * 0.75,
        ],
        rotate: [0, particle.tilt, -particle.tilt * 0.65, particle.tilt * 0.35],
        opacity: [0, 1, 1, 0],
        filter: ["blur(0px)", "blur(0px)", `blur(${particle.blur * size}px)`],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        ease: EASE,
        rotate: { times: [0, 0.3, 0.65, 1], ease: "easeInOut" },
        scale: { times: [0, 0.1, 0.22, 1], ease: "easeOut" },
        opacity: { times: [0, 0.03, particle.fadeAt, 1], ease: "linear" },
        filter: { times: [0, 0.12, 1] },
      }}
      onAnimationComplete={() => onDone(particle.id)}
    >
      {particle.emoji}
    </motion.span>
  );
});

export type FeedbackInputProps = Omit<
  ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  options?: FeedbackOption[];
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number, option: FeedbackOption) => void;
  size?: keyof typeof SIZES;
  align?: Align;
  asChild?: boolean;
};

export function FeedbackInput({
  options = DEFAULT_OPTIONS,
  value,
  defaultValue,
  onValueChange,
  size = "md",
  align = "center",
  asChild = false,
  className,
  children,
  ...props
}: FeedbackInputProps) {
  const pickerId = useId();
  const reducedMotion = useReducedMotion();
  const styles = SIZES[size];
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [placement, setPlacement] = useState<Placement>({
    side: "top",
    shift: 0,
    tailX: 0,
  });
  const selectedValue = value ?? internalValue;
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const seedRef = useRef(0);
  const holdRef = useRef<number | null>(null);
  const justOpenedRef = useRef(false);

  const setTriggerRef = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
  }, []);

  const stopHold = useCallback(() => {
    if (holdRef.current === null) return;
    window.clearInterval(holdRef.current);
    holdRef.current = null;
  }, []);

  const close = useCallback(() => {
    stopHold();
    setOpen(false);
    setParticles([]);
  }, [stopHold]);

  const placeBar = useCallback(
    (node: HTMLDivElement | null) => {
      barRef.current = node;
      const trigger = triggerRef.current;
      if (!node || !trigger) return;
      setPlacement(
        getPlacement(
          trigger.getBoundingClientRect(),
          node.offsetWidth,
          node.offsetHeight,
          align,
        ),
      );
    },
    [align],
  );

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, open]);

  useEffect(() => {
    if (!open) return;
    const selectedIndex = options.findIndex(
      (option) => option.value === selectedValue,
    );
    const nextIndex = selectedIndex >= 0 ? selectedIndex : 0;
    setActiveIndex(nextIndex);
    optionRefs.current[nextIndex]?.focus();
  }, [open, options, selectedValue]);

  useEffect(() => stopHold, [stopHold]);

  const selectOption = useCallback(
    (option: FeedbackOption, from: DOMRect) => {
      if (value === undefined) setInternalValue(option.value);
      onValueChange?.(option.value, option);
      const bar = barRef.current?.getBoundingClientRect();
      if (reducedMotion || !bar) return;
      seedRef.current += BURST_COUNT;
      setParticles((current) =>
        [
          ...current,
          ...makeParticles(option.emoji, seedRef.current, from, bar),
        ].slice(-MAX_PARTICLES),
      );
    },
    [onValueChange, reducedMotion, value],
  );

  const startHold = useCallback(
    (option: FeedbackOption, from: DOMRect) => {
      selectOption(option, from);
      stopHold();
      holdRef.current = window.setInterval(
        () => selectOption(option, from),
        HOLD_INTERVAL,
      );
    },
    [selectOption, stopHold],
  );

  const settleParticle = useCallback((id: number) => {
    setParticles((current) => current.filter((particle) => particle.id !== id));
  }, []);

  const handleTriggerPointerDown = useCallback(() => {
    if (open) return;
    setOpen(true);
    justOpenedRef.current = true;
    const handlePointerUp = (event: globalThis.PointerEvent) => {
      document.removeEventListener("pointerup", handlePointerUp);
      const target = document.elementFromPoint(
        event.clientX,
        event.clientY,
      ) as HTMLElement | null;
      const picked = target?.closest<HTMLElement>("[data-feedback-value]");
      const option = options.find(
        (item) => String(item.value) === picked?.dataset.feedbackValue,
      );
      if (picked && option)
        selectOption(option, picked.getBoundingClientRect());
      if (!triggerRef.current?.contains(target)) justOpenedRef.current = false;
    };
    document.addEventListener("pointerup", handlePointerUp);
  }, [open, options, selectOption]);

  const handlePickerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!options.length) return;
      let nextIndex = activeIndex;
      if (event.key === "ArrowRight")
        nextIndex = (activeIndex + 1) % options.length;
      else if (event.key === "ArrowLeft")
        nextIndex = (activeIndex - 1 + options.length) % options.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = options.length - 1;
      else return;
      event.preventDefault();
      setActiveIndex(nextIndex);
      optionRefs.current[nextIndex]?.focus();
    },
    [activeIndex, options.length],
  );

  const Trigger = asChild ? Slot : "button";
  const top = placement.side === "top";
  const anchor =
    align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2";
  const centering = align === "center" ? "-50%" : 0;
  const nudge =
    align === "right"
      ? { marginRight: -placement.shift }
      : { marginLeft: placement.shift };

  return (
    <div
      ref={rootRef}
      data-slot="feedback-input"
      className={cn("relative flex w-fit items-center", className)}
      {...props}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Choose a satisfaction level"
            className={cn(
              "absolute z-30",
              anchor,
              top ? "bottom-full mb-4" : "top-full mt-4",
            )}
            initial={{
              opacity: 0,
              y: top ? 10 : -10,
              scale: 0.85,
              x: centering,
            }}
            animate={{ opacity: 1, y: 0, scale: 1, x: centering }}
            exit={{ opacity: 0, y: top ? 6 : -6, scale: 0.9, x: centering }}
            transition={
              reducedMotion
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 520, damping: 30 }
            }
            style={{ originY: top ? 1 : 0, ...nudge }}
          >
            <div
              id={pickerId}
              ref={placeBar}
              role="radiogroup"
              aria-label="Satisfaction level"
              onKeyDown={handlePickerKeyDown}
              className={cn(
                "relative flex items-center rounded-full shadow-sm",
                SURFACE,
                styles.pill,
              )}
            >
              {particles.map((particle) => (
                <BurstEmoji
                  key={particle.id}
                  particle={particle}
                  size={styles.burst}
                  onDone={settleParticle}
                />
              ))}
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={option.value === selectedValue}
                  aria-label={`${option.label}, ${option.value} out of ${options.length}`}
                  tabIndex={index === activeIndex ? 0 : -1}
                  data-feedback-value={option.value}
                  onFocus={() => setActiveIndex(index)}
                  onPointerDown={(event) =>
                    startHold(
                      option,
                      event.currentTarget.getBoundingClientRect(),
                    )
                  }
                  onPointerUp={stopHold}
                  onPointerLeave={stopHold}
                  onPointerCancel={stopHold}
                  onClick={(event) =>
                    event.detail === 0 &&
                    selectOption(
                      option,
                      event.currentTarget.getBoundingClientRect(),
                    )
                  }
                  className={cn(
                    "relative z-10 rounded-full p-1 leading-none outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    styles.emoji,
                  )}
                  initial={reducedMotion ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 800,
                    damping: 25,
                    delay: reducedMotion ? 0 : 0.04 + index * 0.035,
                  }}
                  whileHover={
                    reducedMotion ? undefined : { scale: 1.28, y: -4 }
                  }
                  whileTap={{ scale: 0.92 }}
                >
                  {option.emoji}
                </motion.button>
              ))}
            </div>
            <span
              aria-hidden
              className={cn(
                "absolute size-3 -translate-x-1/2 rounded-full",
                SURFACE,
                top ? "-bottom-1" : "-top-1",
              )}
              style={{ left: placement.tailX }}
            />
            <span
              aria-hidden
              className={cn(
                "absolute size-1.5 -translate-x-1/2 rounded-full",
                SURFACE,
                top ? "-bottom-4" : "-top-4",
              )}
              style={{ left: placement.tailX + 6 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Trigger
        ref={setTriggerRef}
        type={asChild ? undefined : "button"}
        aria-controls={open ? pickerId : undefined}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={
          open
            ? "Close satisfaction picker"
            : selectedOption
              ? `${selectedOption.label}, ${selectedOption.value} out of ${options.length}`
              : "Rate your satisfaction"
        }
        onPointerDown={handleTriggerPointerDown}
        onClick={() => {
          if (justOpenedRef.current) {
            justOpenedRef.current = false;
            return;
          }
          if (open) close();
          else setOpen(true);
        }}
        className={
          asChild
            ? undefined
            : cn(
                "relative z-10 grid place-items-center rounded-full text-foreground/60 shadow-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                SURFACE,
                styles.trigger,
              )
        }
      >
        {asChild ? (
          children
        ) : open ? (
          <span aria-hidden className="text-[1.35em] font-light leading-none">
            ×
          </span>
        ) : (
          <span aria-hidden className="select-none leading-none">
            {selectedOption?.emoji ?? "🙂"}
          </span>
        )}
      </Trigger>
    </div>
  );
}

export default FeedbackInput;
