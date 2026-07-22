"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

export interface MotionAccordionItem {
  question: React.ReactNode;
  answer: React.ReactNode;
}

export interface MotionAccordionProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  items: MotionAccordionItem[];
  gap?: number;
}

interface MotionAccordionRowProps {
  item: MotionAccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  triggerId: string;
  panelId: string;
}

function MotionAccordionRow({
  item,
  isOpen,
  onToggle,
  triggerId,
  panelId,
}: MotionAccordionRowProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState(0);
  const reduceMotion = useReducedMotion();

  React.useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const updateHeight = () => setContentHeight(content.scrollHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(content);
    return () => observer.disconnect();
  }, [item.answer]);

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.85 };

  return (
    <motion.div
      layout
      initial={false}
      animate={{ scale: isOpen ? 1 : 0.985 }}
      transition={transition}
      className="overflow-hidden rounded-[1.875rem] border border-border/60 bg-card text-card-foreground shadow-sm"
      style={{ originX: 0.5, originY: 0 }}
    >
      <button
        id={triggerId}
        type="button"
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full cursor-pointer select-none items-center justify-between gap-4 px-7 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <span className="text-[clamp(1.1rem,1.6vw,1.3rem)] font-medium leading-snug tracking-tight">
          {item.question}
        </span>
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.05 : 1 }}
          transition={transition}
          className="relative inline-flex size-12 shrink-0 items-center justify-center"
        >
          <span className="absolute h-px w-3.5 rounded-full bg-current" />
          <motion.span
            className="absolute h-3.5 w-px rounded-full bg-current"
            animate={{ scaleY: isOpen ? 0 : 1 }}
            transition={transition}
          />
        </motion.span>
      </button>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        initial={false}
        animate={{
          height: isOpen ? contentHeight : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={transition}
        className="overflow-hidden"
      >
        <motion.div
          ref={contentRef}
          initial={false}
          animate={{ y: isOpen ? 0 : -8 }}
          transition={transition}
          className="px-7 pb-7 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
        >
          {item.answer}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function MotionAccordion({
  items,
  gap = 10,
  className,
  ...props
}: MotionAccordionProps) {
  const rawId = React.useId();
  const baseId = `motion-accordion-${rawId.replace(/:/g, "")}`;
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div
        data-slot="motion-accordion"
        className="flex flex-col rounded-[2.125rem] p-3"
        style={{ gap }}
      >
        {items.map((item, index) => (
          <MotionAccordionRow
            key={`${baseId}-${index}`}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            triggerId={`${baseId}-trigger-${index}`}
            panelId={`${baseId}-panel-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
