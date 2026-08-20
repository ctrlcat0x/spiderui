"use client";

import { useId, useState, type ComponentProps } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

const SPRING: Transition = {
  type: "spring",
  bounce: 0.35,
  duration: 0.7,
};

export type ExpandingButtonProps = Omit<ComponentProps<"div">, "onSelect"> & {
  label?: string;
  options?: string[];
  defaultOpen?: boolean;
  onSelect?: (option: string) => void;
};

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5"
    >
      <path d="m14.5 6-6 6 6 6M9 12h10" />
    </svg>
  );
}

export function ExpandingButton({
  label = "Choose view",
  options = ["List", "Board", "Timeline"],
  defaultOpen = false,
  onSelect,
  className,
  ...props
}: ExpandingButtonProps) {
  const [open, setOpen] = useState(defaultOpen);
  const optionsId = useId();
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion ? { duration: 0 } : SPRING;

  const handleSelect = (option: string) => {
    onSelect?.(option);
    setOpen(false);
  };

  return (
    <div
      data-slot="expanding-button"
      className={cn(
        "relative flex min-h-16 w-full items-center justify-center font-semibold",
        className,
      )}
      {...props}
    >
      <motion.button
        type="button"
        aria-expanded={open}
        aria-controls={optionsId}
        disabled={open}
        onClick={() => setOpen(true)}
        initial={false}
        animate={{
          scaleX: open ? 1.5 : 1,
          scaleY: open ? 0.9 : 1,
          opacity: open ? 0 : 1,
          filter: open ? "blur(8px)" : "blur(0px)",
        }}
        transition={transition}
        whileTap={reducedMotion ? undefined : { scale: 0.96 }}
        className="absolute z-10 min-h-12 whitespace-nowrap rounded-full bg-muted px-8 py-3 tracking-tight text-foreground outline-none ring-1 ring-border/40 transition-colors hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
      >
        {label}
      </motion.button>

      <motion.div
        id={optionsId}
        aria-hidden={!open}
        initial={false}
        animate={{
          scaleX: open ? 1 : 0.2,
          scaleY: open ? 1 : 0.9,
          opacity: open ? 1 : 0,
          filter: open ? "blur(0px)" : "blur(8px)",
        }}
        transition={transition}
        className={cn(
          "absolute z-0 flex max-w-full items-center justify-center gap-2",
          !open && "pointer-events-none",
        )}
      >
        <motion.button
          type="button"
          aria-label="Back"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          whileTap={reducedMotion ? undefined : { scale: 0.96 }}
          className="grid size-12 shrink-0 place-items-center rounded-full bg-muted text-foreground outline-none ring-1 ring-border/40 transition-colors hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeftIcon />
        </motion.button>

        {options.map((option) => (
          <motion.button
            key={option}
            type="button"
            tabIndex={open ? 0 : -1}
            onClick={() => handleSelect(option)}
            whileTap={reducedMotion ? undefined : { scale: 0.96 }}
            className="min-h-12 whitespace-nowrap rounded-full bg-muted px-5 py-3 tracking-tight text-foreground outline-none ring-1 ring-border/40 transition-colors hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring sm:px-6"
          >
            {option}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

export default ExpandingButton;
