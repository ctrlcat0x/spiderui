"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

const HIDE_ANGLE = Math.PI / 2 - 0.04;
const MAX_ANGLE = Math.PI / 2;
const RUBBER_BAND = 0.32;
const FLICK_POWER = 0.22;

export type WheelPickerOption =
  | string
  | { value: string; label?: React.ReactNode; disabled?: boolean };

interface NormalizedOption {
  value: string;
  label: React.ReactNode;
  disabled: boolean;
}

export interface WheelPickerProps {
  children: React.ReactNode;
  className?: string;
  itemHeight?: number;
  visibleCount?: 3 | 5 | 7;
  lens?: boolean;
  "aria-label"?: string;
}

export interface WheelPickerColumnProps {
  options: WheelPickerOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (
    value: string,
    option: { value: string; label: React.ReactNode },
  ) => void;
  onValueCommit?: (
    value: string,
    option: { value: string; label: React.ReactNode },
  ) => void;
  loop?: boolean;
  disabled?: boolean;
  name?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

interface WheelPickerContextValue {
  itemHeight: number;
  visibleCount: number;
  lens: boolean;
}

const WheelPickerContext = React.createContext<WheelPickerContextValue>({
  itemHeight: 44,
  visibleCount: 5,
  lens: true,
});

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeOption(option: WheelPickerOption): NormalizedOption {
  if (typeof option === "string") {
    return { value: option, label: option, disabled: false };
  }

  return {
    value: option.value,
    label: option.label ?? option.value,
    disabled: option.disabled ?? false,
  };
}

function WheelPickerItem({
  index,
  itemHeight,
  itemId,
  label,
  loopSize,
  offset,
  optionDisabled,
  selected,
  visibleCount,
}: {
  index: number;
  itemHeight: number;
  itemId: string;
  label: React.ReactNode;
  loopSize: number;
  offset: MotionValue<number>;
  optionDisabled: boolean;
  selected: boolean;
  visibleCount: number;
}) {
  const step = Math.PI / (visibleCount + 2);
  const radius = itemHeight / step;
  const distance = useTransform(offset, (current) => {
    let delta = index * itemHeight - current;

    if (loopSize > 0) {
      delta = ((delta % loopSize) + loopSize) % loopSize;
      if (delta > loopSize / 2) delta -= loopSize;
    }

    return delta / itemHeight;
  });
  const angle = useTransform(distance, (value) =>
    clamp(value * step, -MAX_ANGLE, MAX_ANGLE),
  );
  const y = useTransform(angle, (value) => radius * Math.sin(value));
  const rotateX = useTransform(
    angle,
    (value) => `${(-value * 180) / Math.PI}deg`,
  );
  const opacity = useTransform(distance, (value) => {
    const absoluteAngle = Math.abs(value) * step;
    return absoluteAngle >= HIDE_ANGLE ? 0 : Math.cos(absoluteAngle) ** 1.15;
  });
  const visibility = useTransform(distance, (value) =>
    Math.abs(value) * step >= HIDE_ANGLE ? "hidden" : "visible",
  );
  const emphasis = useTransform(distance, (value) =>
    clamp(1 - Math.abs(value), 0, 1),
  );
  const mixPercent = useTransform(emphasis, (value) =>
    (value * 100).toFixed(1),
  );
  const color = useMotionTemplate`color-mix(in oklab, var(--foreground) ${mixPercent}%, var(--muted-foreground))`;

  return (
    <motion.div
      id={itemId}
      role="option"
      aria-disabled={optionDisabled || undefined}
      aria-selected={selected}
      className="absolute inset-x-0 top-1/2"
      style={{
        backfaceVisibility: "hidden",
        height: itemHeight,
        marginTop: -itemHeight / 2,
        opacity,
        rotateX,
        visibility,
        y,
      }}
    >
      <motion.span
        className={cn(
          "absolute inset-0 flex items-center justify-center truncate px-1 text-[17px] font-medium leading-none tabular-nums",
          optionDisabled && "text-muted-foreground/40",
        )}
        style={optionDisabled ? undefined : { color }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

export function WheelPickerColumn({
  options,
  value,
  defaultValue,
  onChange,
  onValueCommit,
  loop = false,
  disabled = false,
  name,
  className,
  id: suppliedId,
  "aria-label": ariaLabel,
}: WheelPickerColumnProps) {
  const { itemHeight, visibleCount, lens } =
    React.useContext(WheelPickerContext);
  const generatedId = React.useId();
  const id = suppliedId ?? `wheel-column-${generatedId.replace(/[:«»]/g, "")}`;
  const reduceMotion = useReducedMotion();
  const items = React.useMemo(() => options.map(normalizeOption), [options]);
  const count = items.length;
  const canLoop = loop && count >= visibleCount + 2;
  const loopSize = canLoop ? count * itemHeight : 0;
  const maxOffset = Math.max(0, (count - 1) * itemHeight);
  const step = Math.PI / (visibleCount + 2);
  const radius = itemHeight / step;
  const initialIndexRef = React.useRef<number | null>(null);

  if (initialIndexRef.current === null) {
    const initialValue = value ?? defaultValue;
    const initialIndex =
      initialValue == null
        ? -1
        : items.findIndex((item) => item.value === initialValue);
    const firstEnabled = items.findIndex((item) => !item.disabled);
    initialIndexRef.current =
      initialIndex >= 0 ? initialIndex : Math.max(0, firstEnabled);
  }

  const offset = useMotionValue(initialIndexRef.current * itemHeight);
  const [activeIndex, setActiveIndex] = React.useState(initialIndexRef.current);
  const activeIndexRef = React.useRef(activeIndex);
  const committedIndexRef = React.useRef(activeIndex);
  const itemsRef = React.useRef(items);
  const onChangeRef = React.useRef(onChange);
  const onValueCommitRef = React.useRef(onValueCommit);
  const suppressChangeRef = React.useRef(false);
  const animationRef = React.useRef<AnimationPlaybackControls | null>(null);
  const wheelTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const dragRef = React.useRef<{
    pointerId: number;
    startClientY: number;
    startOffset: number;
    moved: boolean;
  } | null>(null);

  React.useLayoutEffect(() => {
    itemsRef.current = items;
    onChangeRef.current = onChange;
    onValueCommitRef.current = onValueCommit;
  });

  const wrapIndex = React.useCallback(
    (index: number) => {
      if (count === 0) return 0;
      if (canLoop) return ((index % count) + count) % count;
      return clamp(index, 0, count - 1);
    },
    [canLoop, count],
  );

  const nearestEnabled = React.useCallback(
    (index: number, direction: number) => {
      if (count === 0 || !items[wrapIndex(index)]?.disabled) return index;

      const directions = direction === 0 ? [1, -1] : [direction, -direction];
      for (let distance = 1; distance < count; distance += 1) {
        for (const sign of directions) {
          const candidate = index + sign * distance;
          if (!canLoop && (candidate < 0 || candidate >= count)) continue;
          if (!items[wrapIndex(candidate)]?.disabled) return candidate;
        }
      }

      return index;
    },
    [canLoop, count, items, wrapIndex],
  );

  const stopAnimation = React.useCallback(() => {
    animationRef.current?.stop();
    animationRef.current = null;
    suppressChangeRef.current = false;
  }, []);

  const commit = React.useCallback(() => {
    const index = activeIndexRef.current;
    if (committedIndexRef.current === index) return;

    committedIndexRef.current = index;
    const item = itemsRef.current[index];
    if (item) {
      onValueCommitRef.current?.(item.value, {
        value: item.value,
        label: item.label,
      });
    }
  }, []);

  const animateTo = React.useCallback(
    (target: number, velocity = 0, suppressChange = false) => {
      stopAnimation();
      suppressChangeRef.current = suppressChange;
      const handleComplete = () => {
        animationRef.current = null;
        suppressChangeRef.current = false;
        commit();
      };

      animationRef.current = animate(
        offset,
        target,
        reduceMotion
          ? { duration: 0.16, ease: "easeOut", onComplete: handleComplete }
          : {
              type: "spring",
              stiffness: 200,
              damping: 24,
              mass: 0.9,
              velocity,
              restDelta: 0.25,
              restSpeed: 2,
              onComplete: handleComplete,
            },
      );
    },
    [commit, offset, reduceMotion, stopAnimation],
  );

  const snapToIndex = React.useCallback(
    (index: number, velocity = 0, suppressChange = false) => {
      if (count === 0) return;

      const safeIndex = clamp(wrapIndex(index), 0, count - 1);
      let target = safeIndex * itemHeight;

      if (canLoop) {
        const current = Math.round(offset.get() / itemHeight);
        let difference =
          (((safeIndex - wrapIndex(current)) % count) + count) % count;
        if (difference > count / 2) difference -= count;
        target = (current + difference) * itemHeight;
      }

      animateTo(target, velocity, suppressChange);
    },
    [animateTo, canLoop, count, itemHeight, offset, wrapIndex],
  );

  const settle = React.useCallback(() => {
    if (count === 0) return;

    const velocity = offset.getVelocity();
    let projectedOffset = offset.get() + velocity * FLICK_POWER;
    if (!canLoop) projectedOffset = clamp(projectedOffset, 0, maxOffset);

    const direction = velocity > 20 ? 1 : velocity < -20 ? -1 : 0;
    const index = nearestEnabled(
      Math.round(projectedOffset / itemHeight),
      direction,
    );
    snapToIndex(wrapIndex(index), velocity);
  }, [
    canLoop,
    count,
    itemHeight,
    maxOffset,
    nearestEnabled,
    offset,
    snapToIndex,
    wrapIndex,
  ]);

  React.useEffect(
    () =>
      offset.on("change", (current) => {
        const index = wrapIndex(Math.round(current / itemHeight));
        if (index === activeIndexRef.current) return;

        activeIndexRef.current = index;
        setActiveIndex(index);
        const item = itemsRef.current[index];
        if (item && !suppressChangeRef.current) {
          onChangeRef.current?.(item.value, {
            value: item.value,
            label: item.label,
          });
        }
      }),
    [itemHeight, offset, wrapIndex],
  );

  React.useEffect(() => {
    if (value == null) return;
    const index = items.findIndex((item) => item.value === value);
    if (
      index < 0 ||
      index === activeIndexRef.current ||
      dragRef.current ||
      animationRef.current
    )
      return;
    snapToIndex(index, 0, true);
  }, [items, snapToIndex, value]);

  React.useEffect(() => {
    if (count === 0 || dragRef.current || animationRef.current) return;
    if (activeIndexRef.current >= count) snapToIndex(count - 1);
  }, [count, snapToIndex]);

  React.useEffect(() => {
    if (dragRef.current || animationRef.current) return;
    offset.set(activeIndexRef.current * itemHeight);
  }, [itemHeight, offset]);

  React.useEffect(() => {
    if (canLoop || count === 0 || dragRef.current) return;
    if (offset.get() > maxOffset) snapToIndex(count - 1);
  }, [canLoop, count, maxOffset, offset, snapToIndex]);

  React.useEffect(() => {
    const node = containerRef.current;
    if (!node || disabled) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      stopAnimation();
      const delta =
        event.deltaMode === 1 ? event.deltaY * (itemHeight / 2) : event.deltaY;
      let nextOffset = offset.get() + delta * 0.55;
      if (!canLoop) nextOffset = clamp(nextOffset, 0, maxOffset);
      offset.set(nextOffset);

      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => {
        wheelTimerRef.current = null;
        settle();
      }, 130);
    };

    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  }, [canLoop, disabled, itemHeight, maxOffset, offset, settle, stopAnimation]);

  React.useEffect(
    () => () => {
      animationRef.current?.stop();
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    },
    [],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button > 0) return;

    stopAnimation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startClientY: event.clientY,
      startOffset: offset.get(),
      moved: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const delta = drag.startClientY - event.clientY;
    if (Math.abs(delta) > 3) drag.moved = true;
    let nextOffset = drag.startOffset + delta;

    if (!canLoop) {
      if (nextOffset < 0) nextOffset *= RUBBER_BAND;
      if (nextOffset > maxOffset) {
        nextOffset = maxOffset + (nextOffset - maxOffset) * RUBBER_BAND;
      }
    }

    offset.set(nextOffset);
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;

    if (drag.moved || event.type === "pointercancel") {
      settle();
      return;
    }

    const node = containerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const tapY = event.clientY - (rect.top + rect.height / 2);
    const steps = Math.round(Math.asin(clamp(tapY / radius, -1, 1)) / step);

    if (steps === 0) {
      commit();
      return;
    }

    const current = Math.round(offset.get() / itemHeight);
    const index = nearestEnabled(current + steps, steps > 0 ? 1 : -1);
    snapToIndex(wrapIndex(index));
  };

  const moveBy = React.useCallback(
    (delta: number) => {
      const current = Math.round(offset.get() / itemHeight);
      const index = nearestEnabled(current + delta, delta > 0 ? 1 : -1);
      snapToIndex(wrapIndex(index));
    },
    [itemHeight, nearestEnabled, offset, snapToIndex, wrapIndex],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    const commands: Record<string, () => void> = {
      ArrowDown: () => moveBy(1),
      ArrowUp: () => moveBy(-1),
      PageDown: () => moveBy(visibleCount),
      PageUp: () => moveBy(-visibleCount),
      Home: () => snapToIndex(nearestEnabled(0, 1)),
      End: () => snapToIndex(nearestEnabled(count - 1, -1)),
    };
    const command = commands[event.key];
    if (!command) return;
    event.preventDefault();
    command();
  };

  return (
    <div
      ref={containerRef}
      id={id}
      role="listbox"
      aria-label={ariaLabel}
      aria-orientation="vertical"
      aria-activedescendant={
        disabled || count === 0 ? undefined : `${id}-option-${activeIndex}`
      }
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      data-slot="wheel-picker-column"
      className={cn(
        "relative min-w-0 flex-1 cursor-pointer touch-none select-none overflow-hidden outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring/60 active:cursor-grabbing",
        "[mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.14)_10%,rgba(0,0,0,0.4)_20%,rgba(0,0,0,0.72)_28%,black_38%,black_62%,rgba(0,0,0,0.72)_72%,rgba(0,0,0,0.4)_80%,rgba(0,0,0,0.14)_90%,transparent_100%)]",
        disabled && "pointer-events-none opacity-45",
        className,
      )}
      style={{ height: itemHeight * visibleCount }}
      onKeyDown={handleKeyDown}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
    >
      {lens ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-1 top-1/2 -translate-y-1/2 rounded-xl bg-foreground/5"
          style={{ height: itemHeight }}
        />
      ) : null}
      <motion.div
        className="absolute inset-0"
        style={{ perspective: itemHeight * 21, transformStyle: "preserve-3d" }}
      >
        {items.map((item, index) => (
          <WheelPickerItem
            key={`${item.value}-${index}`}
            index={index}
            itemHeight={itemHeight}
            itemId={`${id}-option-${index}`}
            label={item.label}
            loopSize={loopSize}
            offset={offset}
            optionDisabled={item.disabled}
            selected={index === activeIndex}
            visibleCount={visibleCount}
          />
        ))}
      </motion.div>
      {name ? (
        <input
          name={name}
          type="hidden"
          value={items[activeIndex]?.value ?? ""}
        />
      ) : null}
    </div>
  );
}

export function WheelPicker({
  children,
  className,
  itemHeight = 44,
  visibleCount = 5,
  lens = true,
  "aria-label": ariaLabel,
}: WheelPickerProps) {
  const context = React.useMemo(
    () => ({ itemHeight, visibleCount, lens }),
    [itemHeight, lens, visibleCount],
  );

  return (
    <WheelPickerContext.Provider value={context}>
      <div
        role="group"
        aria-label={ariaLabel}
        data-slot="wheel-picker"
        className={cn("flex w-full min-w-0 items-stretch", className)}
      >
        {children}
      </div>
    </WheelPickerContext.Provider>
  );
}
