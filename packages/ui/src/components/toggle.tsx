"use client";

import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

const toggleSizes = {
  sm: {
    track: "h-7 w-12 p-1",
    thumb: "size-5",
    line: "h-2",
    ring: "size-2",
    travel: 20,
  },
  default: {
    track: "h-9 w-16 p-1",
    thumb: "size-7",
    line: "h-2.5",
    ring: "size-2.5",
    travel: 28,
  },
  lg: {
    track: "h-11 w-20 p-1.5",
    thumb: "size-8",
    line: "h-3",
    ring: "size-3",
    travel: 36,
  },
} as const;

export interface ToggleProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "role"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  accentColor?: React.CSSProperties["backgroundColor"];
  size?: keyof typeof toggleSizes;
}

type ToggleStyle = React.CSSProperties & {
  "--toggle-accent"?: string;
};

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      checked: checkedProp,
      defaultChecked = false,
      onCheckedChange,
      accentColor,
      size = "default",
      className,
      style,
      disabled,
      onClick,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] =
      React.useState(defaultChecked);
    const checked = checkedProp ?? uncontrolledChecked;
    const shouldReduceMotion = useReducedMotion();
    const metrics = toggleSizes[size];

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled) return;

      const nextChecked = !checked;
      if (checkedProp === undefined) setUncontrolledChecked(nextChecked);
      onCheckedChange?.(nextChecked);
    };

    return (
      <button
        ref={ref}
        type={type}
        role="switch"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        disabled={disabled}
        onClick={handleClick}
        style={
          {
            "--toggle-accent": accentColor ?? "var(--primary)",
            ...style,
          } as ToggleStyle
        }
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center overflow-hidden rounded-full bg-muted shadow-[inset_0_1px_2px_oklch(0_0_0/0.16),inset_0_0_0_1px_oklch(0_0_0/0.08)] transition-[background-color,box-shadow,scale] duration-150 ease-out",
          "data-[state=checked]:bg-[var(--toggle-accent)] data-[state=checked]:shadow-[inset_0_1px_2px_oklch(0_0_0/0.12),inset_0_0_0_1px_oklch(0_0_0/0.08)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "active:not-disabled:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50",
          metrics.track,
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-[20%] w-px rounded-full bg-background/35",
            metrics.line,
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-[14%] rounded-full border border-foreground/30",
            metrics.ring,
          )}
        />
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{ x: checked ? metrics.travel : 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 520, damping: 28, mass: 0.72 }
          }
          className={cn(
            "pointer-events-none z-10 block rounded-full border border-foreground/10 bg-background shadow-[0_2px_5px_oklch(0_0_0/0.28)]",
            metrics.thumb,
          )}
        />
      </button>
    );
  },
);

Toggle.displayName = "Toggle";

export { Toggle };
