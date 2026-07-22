"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@workspace/ui/lib/utils";

export const DEFAULT_UNDERLINE_PATHS = [
  "M5 21C27 16 50 12 72 15C85 17 97 22 110 24C123 27 135 19 150 13C163 9 174 20 191 22C228 26 255 16 305 18",
  "M5 24C42 17 85 10 128 7C169 4 224 9 220 20C216 30 173 37 155 27C147 21 181 12 210 9C244 5 278 8 305 13",
  "M5 30C17 15 27 16 39 26C52 35 65 12 79 18C92 23 98 33 113 21C128 9 143 15 156 24C169 31 181 6 196 15C211 29 220 15 231 11C240 9 247 27 261 18C278 7 286 26 305 23",
  "M17 33C51 33 86 34 105 32C119 30 83 19 65 15C47 11 35 7 44 6C82 4 194 9 300 14",
  "M5 21C66 17 126 14 187 13C227 12 266 13 305 14",
  "M5 30C72 25 127 18 164 16C171 16 149 31 151 35C154 39 186 25 205 20C239 10 269 6 305 5",
] as const;

const DRAW_EASE = [0.45, 0, 0.55, 1] as const;

export interface UnderlineHoverProps extends Omit<
  ComponentPropsWithoutRef<"a">,
  "children"
> {
  children: ReactNode;
  duration?: number;
  paths?: readonly string[];
  textClassName?: string;
  underlineClassName?: string;
  underlineColor?: string;
  strokeWidth?: number;
  ref?: Ref<HTMLAnchorElement>;
}

function UnderlinePath({
  path,
  color,
  strokeWidth,
}: {
  path: string;
  color: string;
  strokeWidth: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
      preserveAspectRatio="none"
      viewBox="0 0 310 40"
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export function UnderlineHover({
  children,
  duration = 0.5,
  paths = DEFAULT_UNDERLINE_PATHS,
  textClassName,
  underlineClassName,
  underlineColor = "currentColor",
  strokeWidth = 10,
  className,
  ref,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  ...props
}: UnderlineHoverProps) {
  const reduceMotion = useReducedMotion();
  const [activePathIndex, setActivePathIndex] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const pointerActiveRef = useRef(false);
  const focusActiveRef = useRef(false);
  const activeRef = useRef(false);
  const nextPathIndexRef = useRef<number | null>(null);
  const availablePaths = paths.length > 0 ? paths : DEFAULT_UNDERLINE_PATHS;
  const normalizedPathIndex =
    activePathIndex === null ? 0 : activePathIndex % availablePaths.length;
  const activePath = availablePaths[normalizedPathIndex] ?? "";

  const updateActiveState = () => {
    const nextActive = pointerActiveRef.current || focusActiveRef.current;

    if (nextActive && !activeRef.current) {
      const nextPathIndex =
        (nextPathIndexRef.current ??
          Math.floor(Math.random() * availablePaths.length)) %
        availablePaths.length;

      setActivePathIndex(nextPathIndex);
      nextPathIndexRef.current = (nextPathIndex + 1) % availablePaths.length;
    }

    activeRef.current = nextActive;
    setIsActive(nextActive);
  };

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    onMouseEnter?.(event);
    pointerActiveRef.current = true;
    updateActiveState();
  };

  const handleMouseLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    onMouseLeave?.(event);
    pointerActiveRef.current = false;
    updateActiveState();
  };

  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    onFocus?.(event);
    focusActiveRef.current = true;
    updateActiveState();
  };

  const handleBlur = (event: FocusEvent<HTMLAnchorElement>) => {
    onBlur?.(event);
    focusActiveRef.current = false;
    updateActiveState();
  };

  return (
    <a
      ref={ref}
      className={cn(
        "inline-flex w-fit flex-col items-stretch no-underline",
        className,
      )}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span className={cn("font-medium leading-[1.1]", textClassName)}>
        {children}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "relative h-[0.625em] w-full text-current",
          underlineClassName,
        )}
      >
        {reduceMotion && isActive ? (
          <UnderlinePath
            path={activePath}
            color={underlineColor}
            strokeWidth={strokeWidth}
          />
        ) : null}
        {!reduceMotion && activePathIndex !== null ? (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 310 40"
          >
            <motion.path
              key={activePathIndex}
              animate={
                isActive
                  ? { pathLength: 1, pathOffset: 0 }
                  : { pathLength: 1, pathOffset: 1 }
              }
              d={activePath}
              fill="none"
              initial={{ pathLength: 0, pathOffset: 0 }}
              stroke={underlineColor}
              strokeLinecap="round"
              strokeWidth={strokeWidth}
              transition={{ duration: Math.max(0, duration), ease: DRAW_EASE }}
            />
          </svg>
        ) : null}
      </span>
    </a>
  );
}
