"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { Button } from "./button";
import { cn } from "@workspace/ui/lib/utils";

const RAIL_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 40,
  mass: 0.5,
} as const;
const PANEL_SPRING = {
  type: "spring",
  stiffness: 260,
  damping: 34,
  mass: 0.8,
} as const;
const EXIT_EASE = [0.4, 0, 1, 1] as const;

export type StepperDirection = 1 | -1;

export interface UseStepperOptions {
  total: number;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number, direction: StepperDirection) => void;
  onComplete?: () => void;
}

export interface UseStepperReturn {
  index: number;
  direction: StepperDirection;
  furthest: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  back: () => void;
  goTo: (index: number) => void;
}

function clampIndex(value: number, total: number) {
  if (total < 1) return 0;
  return Math.max(0, Math.min(total - 1, Math.trunc(value)));
}

export function useStepper({
  total,
  index,
  defaultIndex = 0,
  onIndexChange,
  onComplete,
}: UseStepperOptions): UseStepperReturn {
  const [internalIndex, setInternalIndex] = useState(() =>
    clampIndex(defaultIndex, total),
  );
  const currentIndex = clampIndex(index ?? internalIndex, total);
  const previousIndexRef = useRef(currentIndex);
  const furthestIndexRef = useRef(currentIndex);
  const onIndexChangeRef = useRef(onIndexChange);
  const onCompleteRef = useRef(onComplete);
  const controlled = index !== undefined;

  onIndexChangeRef.current = onIndexChange;
  onCompleteRef.current = onComplete;

  const direction: StepperDirection =
    currentIndex < previousIndexRef.current ? -1 : 1;
  previousIndexRef.current = currentIndex;
  furthestIndexRef.current = Math.max(furthestIndexRef.current, currentIndex);

  const goTo = useCallback(
    (nextIndex: number) => {
      const targetIndex = clampIndex(nextIndex, total);
      if (targetIndex === currentIndex) return;
      const nextDirection: StepperDirection =
        targetIndex > currentIndex ? 1 : -1;
      furthestIndexRef.current = Math.max(
        furthestIndexRef.current,
        targetIndex,
      );
      if (!controlled) setInternalIndex(targetIndex);
      onIndexChangeRef.current?.(targetIndex, nextDirection);
    },
    [controlled, currentIndex, total],
  );

  const next = useCallback(() => {
    if (currentIndex >= total - 1) {
      onCompleteRef.current?.();
      return;
    }
    goTo(currentIndex + 1);
  }, [currentIndex, goTo, total]);

  const back = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  return {
    index: currentIndex,
    direction,
    furthest: Math.min(furthestIndexRef.current, Math.max(total - 1, 0)),
    total,
    isFirst: currentIndex === 0,
    isLast: currentIndex === total - 1,
    next,
    back,
    goTo,
  };
}

export interface StepperStep {
  id: string;
  label: string;
  content: ReactNode;
}

export interface StepperProps {
  steps: readonly StepperStep[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number, direction: StepperDirection) => void;
  onComplete?: () => void;
  complete?: boolean;
  height?: number | string;
  backLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  completeLabel?: string;
  completeHint?: string;
  label?: string;
  className?: string;
  panelClassName?: string;
}

export function Stepper({
  steps,
  index,
  defaultIndex = 0,
  onIndexChange,
  onComplete,
  complete = false,
  height = 184,
  backLabel = "Back",
  nextLabel = "Next",
  finishLabel = "Finish",
  completeLabel = "All set",
  completeHint = "Step back to change anything",
  label = "Steps",
  className,
  panelClassName,
}: StepperProps) {
  const stepper = useStepper({
    total: steps.length,
    index,
    defaultIndex,
    onIndexChange,
    onComplete,
  });
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusTargetRef = useRef<"list" | "panel" | null>(null);
  const {
    index: currentIndex,
    direction,
    furthest,
    total,
    isFirst,
    isLast,
    next,
    back,
    goTo,
  } = stepper;

  useEffect(() => {
    const target = focusTargetRef.current;
    focusTargetRef.current = null;
    if (target === "list") {
      listRef.current
        ?.querySelector<HTMLButtonElement>('[data-current="true"]')
        ?.focus();
      return;
    }
    if (target === "panel") panelRef.current?.focus({ preventScroll: true });
  }, [currentIndex]);

  const panelVariants = useMemo(
    () => ({
      enter: (value: StepperDirection) =>
        reduceMotion ? { opacity: 0 } : { opacity: 0, x: value * 22 },
      center: reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 },
      exit: (value: StepperDirection) =>
        reduceMotion
          ? { opacity: 0, transition: { duration: 0 } }
          : {
              opacity: 0,
              x: value * -22,
              transition: { duration: 0.14, ease: EXIT_EASE },
            },
    }),
    [reduceMotion],
  );

  const handleStepKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let targetIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      targetIndex += 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      targetIndex -= 1;
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = furthest;
    } else {
      return;
    }

    event.preventDefault();
    targetIndex = Math.min(clampIndex(targetIndex, total), furthest);
    if (targetIndex === currentIndex) return;
    focusTargetRef.current = "list";
    goTo(targetIndex);
  };

  const currentStep = steps[currentIndex];
  if (!currentStep) return null;

  const position = `Step ${currentIndex + 1} of ${total}: ${currentStep.label}`;

  return (
    <div className={cn("w-full", className)}>
      <p aria-live="polite" className="sr-only">
        {complete ? completeLabel : position}
      </p>

      <span
        aria-hidden="true"
        className="mb-2 grid select-none text-sm font-medium text-foreground"
      >
        {steps.map((step, stepIndex) => (
          <motion.span
            key={step.id}
            className="col-start-1 row-start-1 truncate"
            initial={false}
            animate={{ opacity: stepIndex === currentIndex ? 1 : 0 }}
            transition={reduceMotion ? { duration: 0 } : PANEL_SPRING}
          >
            {step.label}
          </motion.span>
        ))}
      </span>

      <ol
        ref={listRef}
        aria-label={label}
        className="mb-4 flex list-none items-center gap-1 p-0"
      >
        {steps.map((step, stepIndex) => {
          const done = complete || stepIndex < currentIndex;
          const current = !complete && stepIndex === currentIndex;
          const available = stepIndex <= furthest;
          const tile = (
            <motion.span
              aria-hidden="true"
              className={cn(
                "grid size-9 place-items-center rounded-xl border text-sm font-medium tabular-nums shadow-sm",
                done && "border-primary bg-primary text-primary-foreground",
                current && "border-border bg-background text-foreground",
                !done &&
                  !current &&
                  "border-border bg-background text-muted-foreground",
              )}
              initial={false}
              animate={{ scale: current ? 1 : 0.92 }}
              transition={reduceMotion ? { duration: 0 } : RAIL_SPRING}
            >
              {done ? (
                <Check className="size-4" strokeWidth={2} />
              ) : (
                stepIndex + 1
              )}
            </motion.span>
          );

          return (
            <li
              key={step.id}
              className="flex flex-1 items-center gap-1 last:flex-none"
            >
              {available ? (
                <button
                  type="button"
                  data-current={current ? "true" : undefined}
                  tabIndex={current ? 0 : -1}
                  aria-current={current ? "step" : undefined}
                  aria-label={`Step ${stepIndex + 1} of ${total}: ${step.label}`}
                  onKeyDown={handleStepKeyDown}
                  onClick={() => {
                    if (current) return;
                    focusTargetRef.current = "list";
                    goTo(stepIndex);
                  }}
                  className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {tile}
                </button>
              ) : (
                <span>
                  <span className="sr-only">{`Step ${stepIndex + 1} of ${total}: ${step.label}`}</span>
                  {tile}
                </span>
              )}

              {stepIndex < total - 1 ? (
                <span
                  aria-hidden="true"
                  className="relative h-1 flex-1 overflow-hidden rounded-full bg-muted shadow-inner"
                >
                  <motion.span
                    className="absolute inset-0 origin-left rounded-full bg-primary"
                    initial={false}
                    animate={{
                      scaleX: complete || stepIndex < currentIndex ? 1 : 0,
                    }}
                    transition={reduceMotion ? { duration: 0 } : RAIL_SPRING}
                  />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div
        ref={panelRef}
        tabIndex={-1}
        role="group"
        aria-label={position}
        style={{ height }}
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-card shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
          panelClassName,
        )}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={complete ? "__complete" : currentStep.id}
            custom={direction}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? { duration: 0 } : PANEL_SPRING}
            className="absolute inset-0 overflow-y-auto overscroll-contain p-5 text-sm leading-relaxed text-card-foreground"
          >
            {complete ? (
              <div className="flex h-full flex-col items-center justify-center gap-1.5 text-center">
                <p className="font-medium">{completeLabel}</p>
                <p className="text-muted-foreground">{completeHint}</p>
              </div>
            ) : (
              currentStep.content
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex min-h-9 items-center gap-3">
        <AnimatePresence initial={false}>
          {!isFirst && !complete ? (
            <motion.div
              key="back"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.14 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  focusTargetRef.current = "panel";
                  back();
                }}
              >
                {backLabel}
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {!complete ? (
          <Button
            type="button"
            className="ml-auto min-w-20"
            aria-label={isLast ? finishLabel : nextLabel}
            onClick={() => {
              if (!isLast) focusTargetRef.current = "panel";
              next();
            }}
          >
            <span aria-hidden="true" className="grid">
              <motion.span
                className="col-start-1 row-start-1"
                initial={false}
                animate={{ opacity: isLast ? 0 : 1 }}
                transition={reduceMotion ? { duration: 0 } : PANEL_SPRING}
              >
                {nextLabel}
              </motion.span>
              <motion.span
                className="col-start-1 row-start-1"
                initial={false}
                animate={{ opacity: isLast ? 1 : 0 }}
                transition={reduceMotion ? { duration: 0 } : PANEL_SPRING}
              >
                {finishLabel}
              </motion.span>
            </span>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export type WizardStep = StepperStep;
export type WizardStepsProps = StepperProps;
export const WizardSteps = Stepper;
