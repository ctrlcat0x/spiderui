import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

const colorClasses = {
  default:
    "bg-foreground text-background dark:bg-background dark:text-foreground",
  slate: "bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-950",
  orange: "bg-orange-600 text-white dark:bg-orange-500 dark:text-white",
  purple: "bg-purple-600 text-white dark:bg-purple-500 dark:text-white",
  emerald: "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white",
} as const;

const sizeClasses = {
  sm: "h-8 rounded-md px-3 text-sm",
  default: "h-10 rounded-lg px-5 text-base",
  lg: "h-12 rounded-xl px-7 text-lg",
} as const;

export interface RichButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: keyof typeof colorClasses;
  size?: keyof typeof sizeClasses;
}

export const RichButton = React.forwardRef<HTMLButtonElement, RichButtonProps>(
  (
    {
      className,
      color = "default",
      size = "default",
      type = "button",
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      data-slot="rich-button"
      data-color={color}
      data-size={size}
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium shadow-[inset_0_1px_0_oklch(1_0_0/0.35),0_4px_12px_oklch(0_0_0/0.2)] transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.96] active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        colorClasses[color],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);

RichButton.displayName = "RichButton";
