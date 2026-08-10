"use client";

import * as React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

type Direction = "normal" | "reverse";

type PathItemProps = {
  children: React.ReactNode;
  index: number;
  count: number;
  path: string;
  progress: MotionValue<number>;
  rotate: boolean;
  rollingZIndex: boolean;
  zIndexBase: number;
  zIndexRange: number;
  hidden: boolean;
  itemClassName?: string;
  onHoverChange: (hovered: boolean) => void;
};

function wrap(value: number, min = 0, max = 100) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

function parseViewBox(viewBox: string) {
  const values = viewBox.trim().split(/[ ,]+/).map(Number);
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
    return { minX: 0, minY: 0, width: 100, height: 100 };
  }

  const [minX = 0, minY = 0, width = 100, height = 100] = values;
  return {
    minX,
    minY,
    width: Math.max(width, 1),
    height: Math.max(height, 1),
  };
}

function PathItem({
  children,
  index,
  count,
  path,
  progress,
  rotate,
  rollingZIndex,
  zIndexBase,
  zIndexRange,
  hidden,
  itemClassName,
  onHoverChange,
}: PathItemProps) {
  const distance = useTransform(progress, (value) =>
    wrap(value + (index / count) * 100),
  );
  const offsetDistance = useTransform(distance, (value) => `${value}%`);
  const zIndex = useTransform(distance, (value) =>
    Math.round(zIndexBase + (value / 100) * zIndexRange),
  );

  return (
    <motion.div
      aria-hidden={hidden || undefined}
      className="absolute left-0 top-0 will-change-[offset-distance]"
      onPointerEnter={() => onHoverChange(true)}
      onPointerLeave={() => onHoverChange(false)}
      style={{
        offsetPath: `path('${path.replaceAll("'", "\\'")}')`,
        offsetDistance,
        offsetAnchor: "center",
        offsetRotate: rotate ? "auto" : "0deg",
        zIndex: rollingZIndex ? zIndex : undefined,
      }}
    >
      <div className={itemClassName}>{children}</div>
    </motion.div>
  );
}

export interface MarqueeAlongPathProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children: React.ReactNode;
  path: string;
  viewBox?: string;
  pathId?: string;
  speed?: number;
  direction?: Direction;
  repeat?: number;
  showPath?: boolean;
  pathClassName?: string;
  itemClassName?: string;
  pauseOnHover?: boolean;
  hoverSpeedFactor?: number;
  draggable?: boolean;
  dragSensitivity?: number;
  rotate?: boolean;
  rollingZIndex?: boolean;
  zIndexBase?: number;
  zIndexRange?: number;
}

export function MarqueeAlongPath({
  children,
  path,
  viewBox = "0 0 100 100",
  pathId,
  speed = 8,
  direction = "normal",
  repeat = 3,
  showPath = false,
  pathClassName,
  itemClassName,
  pauseOnHover = false,
  hoverSpeedFactor = 0.2,
  draggable = false,
  dragSensitivity = 0.12,
  rotate = true,
  rollingZIndex = true,
  zIndexBase = 1,
  zIndexRange = 10,
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onPointerEnter,
  onPointerLeave,
  ...props
}: MarqueeAlongPathProps) {
  const generatedId = React.useId();
  const resolvedPathId =
    pathId ?? `marquee-path-${generatedId.replaceAll(":", "")}`;
  const reducedMotion = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const draggingRef = React.useRef(false);
  const hoveredRef = React.useRef(false);
  const lastPointerXRef = React.useRef(0);
  const lastPointerYRef = React.useRef(0);
  const dragVelocityRef = React.useRef(0);
  const progress = useMotionValue(0);
  const [stageScale, setStageScale] = React.useState(1);
  const parsedViewBox = React.useMemo(() => parseViewBox(viewBox), [viewBox]);
  const childArray = React.useMemo(
    () => React.Children.toArray(children),
    [children],
  );
  const copies = Math.max(1, Math.floor(repeat));
  const items = React.useMemo(
    () =>
      Array.from({ length: copies }, (_, copyIndex) =>
        childArray.map((child, childIndex) => ({
          child,
          copyIndex,
          key: `${copyIndex}-${childIndex}`,
        })),
      ).flat(),
    [childArray, copies],
  );

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      setStageScale(
        Math.min(
          container.clientWidth / parsedViewBox.width,
          container.clientHeight / parsedViewBox.height,
        ),
      );
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [parsedViewBox.height, parsedViewBox.width]);

  useAnimationFrame((_, delta) => {
    if (reducedMotion || draggingRef.current || items.length === 0) return;

    const hoverFactor = hoveredRef.current
      ? pauseOnHover
        ? 0
        : Math.max(0, hoverSpeedFactor)
      : 1;
    const directionFactor = direction === "normal" ? 1 : -1;
    const momentum = dragVelocityRef.current;

    progress.set(
      progress.get() +
        directionFactor * speed * hoverFactor * (delta / 1000) +
        momentum,
    );
    dragVelocityRef.current *= 0.92;
    if (Math.abs(dragVelocityRef.current) < 0.001) dragVelocityRef.current = 0;
  });

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    if (!draggable || event.defaultPrevented) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    lastPointerXRef.current = event.clientX;
    lastPointerYRef.current = event.clientY;
    dragVelocityRef.current = 0;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (!draggable || !draggingRef.current || event.defaultPrevented) return;

    event.preventDefault();
    const deltaX = event.clientX - lastPointerXRef.current;
    const deltaY = event.clientY - lastPointerYRef.current;
    const distance = Math.hypot(deltaX, deltaY);
    const delta = (deltaX >= 0 ? distance : -distance) * dragSensitivity;
    progress.set(progress.get() + delta);
    dragVelocityRef.current = delta;
    lastPointerXRef.current = event.clientX;
    lastPointerYRef.current = event.clientY;
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.type === "pointerup") onPointerUp?.(event);
    else onPointerCancel?.(event);
    if (!draggable || !draggingRef.current) return;

    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={containerRef}
      data-slot="marquee-along-path"
      className={cn(
        "relative isolate overflow-hidden",
        draggable &&
          "cursor-grab touch-none select-none active:cursor-grabbing",
        className,
      )}
      {...props}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div
        className="absolute left-1/2 top-1/2 origin-center"
        aria-live="off"
        style={{
          width: parsedViewBox.width,
          height: parsedViewBox.height,
          transform: `translate(-50%, -50%) scale(${stageScale})`,
        }}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full"
          viewBox={viewBox}
          preserveAspectRatio="none"
        >
          <path
            id={resolvedPathId}
            d={path}
            fill="none"
            className={cn(
              showPath ? "stroke-border" : "stroke-transparent",
              pathClassName,
            )}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div
          className="absolute"
          style={{
            left: -parsedViewBox.minX,
            top: -parsedViewBox.minY,
            width: parsedViewBox.width,
            height: parsedViewBox.height,
          }}
        >
          {items.map(({ child, copyIndex, key }, index) => (
            <PathItem
              key={key}
              index={index}
              count={items.length}
              path={path}
              progress={progress}
              rotate={rotate}
              rollingZIndex={rollingZIndex}
              zIndexBase={zIndexBase}
              zIndexRange={zIndexRange}
              hidden={copyIndex > 0}
              itemClassName={itemClassName}
              onHoverChange={(hovered) => {
                hoveredRef.current = hovered;
              }}
            >
              {child}
            </PathItem>
          ))}
        </div>
      </div>
    </div>
  );
}
