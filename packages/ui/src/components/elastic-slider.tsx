"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

const CLICK_THRESHOLD = 3;
const DEAD_ZONE = 32;
const MAX_CURSOR_RANGE = 200;
const MAX_STRETCH = 8;
const HANDLE_BUFFER = 8;
const LABEL_OFFSET = 16;
const VALUE_OFFSET = 4;
const useSafeInsertionEffect = globalThis.document
  ? React.useInsertionEffect
  : React.useEffect;

type ChangeHandler<T> = (state: T) => void;
type SetStateFn<T> = React.Dispatch<React.SetStateAction<T>>;

function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: {
  prop?: T;
  defaultProp: T;
  onChange?: ChangeHandler<T>;
}): [T, SetStateFn<T>] {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultProp);
  const previousValueRef = React.useRef(uncontrolledValue);
  const onChangeRef = React.useRef(onChange);
  const controlled = prop !== undefined;
  const value = controlled ? prop : uncontrolledValue;

  useSafeInsertionEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    if (controlled || previousValueRef.current === uncontrolledValue) return;
    previousValueRef.current = uncontrolledValue;
    onChangeRef.current?.(uncontrolledValue);
  }, [controlled, uncontrolledValue]);

  const setValue = React.useCallback<SetStateFn<T>>(
    (nextValue) => {
      if (!controlled) {
        setUncontrolledValue(nextValue);
        return;
      }
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (current: T) => T)(prop)
          : nextValue;
      if (resolvedValue !== prop) onChangeRef.current?.(resolvedValue);
    },
    [controlled, prop],
  );

  return [value, setValue];
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function decimalsForStep(step: number) {
  const value = step.toString();
  const decimalIndex = value.indexOf(".");
  return decimalIndex === -1 ? 0 : value.length - decimalIndex - 1;
}

function roundValue(value: number, step: number) {
  return Number(
    (Math.round(value / step) * step).toFixed(decimalsForStep(step)),
  );
}

function snapToDecile(value: number, min: number, max: number) {
  const normalizedValue = (value - min) / (max - min);
  const nearestDecile = Math.round(normalizedValue * 10) / 10;
  return Math.abs(normalizedValue - nearestDecile) <= 0.03125
    ? min + nearestDecile * (max - min)
    : value;
}

export interface ElasticSliderProps {
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function ElasticSlider({
  label,
  value: valueProp,
  defaultValue,
  onValueChange,
  min = 0,
  max = 1,
  step = 0.01,
  formatValue,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: ElasticSliderProps) {
  const safeMax = max > min ? max : min + 1;
  const safeStep = step > 0 ? step : 0.01;
  const [rawValue, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? min,
    onChange: onValueChange,
  });
  const value = clamp(rawValue, min, safeMax);
  const shouldReduceMotion = useReducedMotion();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const valueRef = React.useRef<HTMLSpanElement>(null);
  const pointerDownPositionRef = React.useRef<{ x: number; y: number } | null>(
    null,
  );
  const pendingPointerFocusRef = React.useRef(false);
  const isClickRef = React.useRef(true);
  const animationRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const wrapperRectRef = React.useRef<DOMRect | null>(null);
  const scaleRef = React.useRef(1);
  const [isInteracting, setIsInteracting] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [keyboardFocusRing, setKeyboardFocusRing] = React.useState(false);
  const [dodge, setDodge] = React.useState({ left: 38, right: 72 });
  const percentage = ((value - min) / (safeMax - min)) * 100;
  const displayValue = formatValue
    ? formatValue(value)
    : value.toFixed(decimalsForStep(safeStep));
  const isActive = isInteracting || isHovered;
  const fillPercent = useMotionValue(percentage);
  const fillWidth = useTransform(fillPercent, (percent) => `${percent}%`);
  const handleLeft = useTransform(
    fillPercent,
    (percent) => `max(4px, calc(${percent}% - 8px))`,
  );
  const rubberStretch = useMotionValue(0);
  const rubberWidth = useTransform(
    rubberStretch,
    (stretch) => `calc(100% + ${Math.abs(stretch)}px)`,
  );
  const rubberX = useTransform(rubberStretch, (stretch) =>
    stretch < 0 ? stretch : 0,
  );

  React.useEffect(() => {
    if (!isInteracting && !animationRef.current) fillPercent.jump(percentage);
  }, [fillPercent, isInteracting, percentage]);

  const percentFromValue = React.useCallback(
    (nextValue: number) => ((nextValue - min) / (safeMax - min)) * 100,
    [min, safeMax],
  );

  const positionToValue = React.useCallback(
    (clientX: number) => {
      const rect = wrapperRectRef.current;
      if (!rect) return min;
      const sceneX = (clientX - rect.left) / scaleRef.current;
      const nativeWidth = wrapperRef.current?.offsetWidth ?? rect.width;
      return clamp(
        min + clamp(sceneX / nativeWidth, 0, 1) * (safeMax - min),
        min,
        safeMax,
      );
    },
    [min, safeMax],
  );

  const animateFillTo = React.useCallback(
    (targetPercent: number) => {
      animationRef.current?.stop();
      if (shouldReduceMotion) {
        fillPercent.jump(targetPercent);
        animationRef.current = null;
        return;
      }
      animationRef.current = animate(fillPercent, targetPercent, {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => {
          animationRef.current = null;
        },
      });
    },
    [fillPercent, shouldReduceMotion],
  );

  const computeRubberStretch = React.useCallback(
    (clientX: number, direction: number) => {
      const rect = wrapperRectRef.current;
      if (!rect) return 0;
      const distancePast =
        direction < 0 ? rect.left - clientX : clientX - rect.right;
      const overflow = Math.max(0, distancePast - DEAD_ZONE);
      return (
        direction *
        MAX_STRETCH *
        Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1))
      );
    },
    [],
  );

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      pointerDownPositionRef.current = { x: event.clientX, y: event.clientY };
      isClickRef.current = true;
      setIsInteracting(true);
      pendingPointerFocusRef.current = true;
      setKeyboardFocusRing(false);
      trackRef.current?.focus({ preventScroll: true });
      requestAnimationFrame(() => {
        pendingPointerFocusRef.current = false;
      });
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      wrapperRectRef.current = rect;
      scaleRef.current = rect.width / wrapper.offsetWidth;
    },
    [disabled],
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isInteracting || !pointerDownPositionRef.current || disabled) return;
      const deltaX = event.clientX - pointerDownPositionRef.current.x;
      const deltaY = event.clientY - pointerDownPositionRef.current.y;
      if (isClickRef.current && Math.hypot(deltaX, deltaY) > CLICK_THRESHOLD) {
        isClickRef.current = false;
        setIsDragging(true);
      }
      if (isClickRef.current) return;
      const rect = wrapperRectRef.current;
      if (rect && !shouldReduceMotion) {
        if (event.clientX < rect.left) {
          rubberStretch.jump(computeRubberStretch(event.clientX, -1));
        } else if (event.clientX > rect.right) {
          rubberStretch.jump(computeRubberStretch(event.clientX, 1));
        } else {
          rubberStretch.jump(0);
        }
      }
      const nextValue = positionToValue(event.clientX);
      animationRef.current?.stop();
      animationRef.current = null;
      fillPercent.jump(percentFromValue(nextValue));
      setValue(roundValue(nextValue, safeStep));
    },
    [
      computeRubberStretch,
      disabled,
      fillPercent,
      isInteracting,
      percentFromValue,
      positionToValue,
      rubberStretch,
      safeStep,
      setValue,
      shouldReduceMotion,
    ],
  );

  const finishInteraction = React.useCallback(() => {
    setIsInteracting(false);
    setIsDragging(false);
    pointerDownPositionRef.current = null;
  }, []);

  const handlePointerCancel = React.useCallback(() => {
    animationRef.current?.stop();
    animationRef.current = null;
    rubberStretch.jump(0);
    finishInteraction();
  }, [finishInteraction, rubberStretch]);

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isInteracting || disabled) return;
      if (isClickRef.current) {
        const rawNextValue = positionToValue(event.clientX);
        const discreteSteps = (safeMax - min) / safeStep;
        const snappedValue =
          discreteSteps <= 10
            ? clamp(
                min + Math.round((rawNextValue - min) / safeStep) * safeStep,
                min,
                safeMax,
              )
            : snapToDecile(rawNextValue, min, safeMax);
        animateFillTo(percentFromValue(snappedValue));
        setValue(roundValue(snappedValue, safeStep));
      }
      if (!shouldReduceMotion && rubberStretch.get() !== 0) {
        animate(rubberStretch, 0, {
          type: "spring",
          visualDuration: 0.35,
          bounce: 0.15,
        });
      }
      finishInteraction();
    },
    [
      animateFillTo,
      disabled,
      finishInteraction,
      isInteracting,
      min,
      percentFromValue,
      positionToValue,
      rubberStretch,
      safeMax,
      safeStep,
      setValue,
      shouldReduceMotion,
    ],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const arrowStep = event.shiftKey ? safeStep * 10 : safeStep;
      let nextValue: number | null = null;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowUp":
          nextValue = value + arrowStep;
          break;
        case "ArrowLeft":
        case "ArrowDown":
          nextValue = value - arrowStep;
          break;
        case "Home":
          nextValue = min;
          break;
        case "End":
          nextValue = safeMax;
          break;
        default:
          return;
      }
      event.preventDefault();
      setKeyboardFocusRing(true);
      const snappedValue = roundValue(clamp(nextValue, min, safeMax), safeStep);
      animateFillTo(percentFromValue(snappedValue));
      setValue(snappedValue);
    },
    [
      animateFillTo,
      disabled,
      min,
      percentFromValue,
      safeMax,
      safeStep,
      setValue,
      value,
    ],
  );

  React.useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const measure = () => {
      const trackWidth = wrapper.offsetWidth;
      if (!trackWidth) return;
      const left = labelRef.current
        ? ((LABEL_OFFSET + labelRef.current.offsetWidth + HANDLE_BUFFER) /
            trackWidth) *
          100
        : 38;
      const right = valueRef.current
        ? ((trackWidth -
            VALUE_OFFSET -
            valueRef.current.offsetWidth -
            HANDLE_BUFFER) /
            trackWidth) *
          100
        : 72;
      setDodge((current) =>
        current.left === left && current.right === right
          ? current
          : { left, right },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    if (labelRef.current) observer.observe(labelRef.current);
    if (valueRef.current) observer.observe(valueRef.current);
    return () => observer.disconnect();
  }, [displayValue, label]);

  const valueDodgesText = percentage < dodge.left || percentage > dodge.right;
  const handleOpacity = !isActive
    ? 0
    : valueDodgesText
      ? 0.1
      : isDragging
        ? 0.8
        : 0.5;
  const discreteSteps = (safeMax - min) / safeStep;
  const hashMarkCount = Math.max(
    0,
    Math.round(discreteSteps <= 10 ? discreteSteps - 1 : 9),
  );
  const hashMarkPercent = (index: number) =>
    discreteSteps <= 10
      ? (((index + 1) * safeStep) / (safeMax - min)) * 100
      : (index + 1) * 10;

  return (
    <div
      ref={wrapperRef}
      data-slot="elastic-slider"
      className={cn(
        "relative h-12 w-full",
        disabled && "opacity-50",
        className,
      )}
    >
      <motion.div
        ref={trackRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        data-slot="elastic-slider-track"
        data-active={isActive}
        data-focus-visible={keyboardFocusRing}
        aria-label={ariaLabel ?? label}
        aria-orientation="horizontal"
        aria-valuemin={min}
        aria-valuemax={safeMax}
        aria-valuenow={value}
        aria-valuetext={displayValue}
        aria-disabled={disabled}
        className={cn(
          "group/elastic-slider absolute inset-0 touch-none overflow-hidden rounded-2xl bg-muted outline-none select-none",
          "data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-ring/50 data-[focus-visible=true]:ring-offset-2 data-[focus-visible=true]:ring-offset-background",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
        )}
        style={{ width: rubberWidth, x: rubberX }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onFocus={() => {
          if (!pendingPointerFocusRef.current) setKeyboardFocusRing(true);
        }}
        onBlur={() => setKeyboardFocusRing(false)}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {Array.from({ length: hashMarkCount }, (_, index) => (
            <div
              key={index}
              className="absolute top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent transition-colors duration-150 group-data-[active=true]/elastic-slider:bg-muted-foreground/30"
              style={{ left: `${hashMarkPercent(index)}%` }}
            />
          ))}
        </div>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 bg-muted-foreground/10 transition-colors duration-150 group-data-[active=true]/elastic-slider:bg-muted-foreground/20"
          style={{ width: fillWidth }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 h-7 w-1 rounded-full bg-foreground"
          style={{ left: handleLeft, y: "-50%" }}
          animate={{
            opacity: handleOpacity,
            scaleX: isActive ? 1 : 0.25,
            scaleY: isActive && valueDodgesText ? 0.75 : 1,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  scaleX: {
                    type: "spring",
                    visualDuration: 0.25,
                    bounce: 0.15,
                  },
                  scaleY: {
                    type: "spring",
                    visualDuration: 0.2,
                    bounce: 0.1,
                  },
                  opacity: { duration: 0.15 },
                }
          }
        />
        <span
          ref={labelRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm font-medium text-muted-foreground"
        >
          {label}
        </span>
        <span
          ref={valueRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono text-xs font-medium text-muted-foreground tabular-nums transition-colors duration-150 group-data-[active=true]/elastic-slider:text-foreground"
        >
          {displayValue}
        </span>
      </motion.div>
    </div>
  );
}
