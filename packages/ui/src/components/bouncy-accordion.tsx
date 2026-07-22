"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

const ROW_TRANSITION: Transition = {
  type: "spring",
  duration: 0.55,
  bounce: 0.38,
};
const CONTENT_OPEN_TRANSITION: Transition = {
  type: "spring",
  duration: 0.58,
  bounce: 0.32,
};
const CONTENT_CLOSE_TRANSITION: Transition = {
  type: "spring",
  duration: 0.46,
  bounce: 0.26,
};
const CHEVRON_TRANSITION: Transition = {
  type: "spring",
  duration: 0.42,
  bounce: 0.28,
};

export interface BouncyAccordionItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface BouncyAccordionClassNames {
  root?: string;
  item?: string;
  trigger?: string;
  icon?: string;
  title?: string;
  chevron?: string;
  content?: string;
  description?: string;
}

export interface BouncyAccordionProps {
  items: BouncyAccordionItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  collapsible?: boolean;
  className?: string;
  classNames?: BouncyAccordionClassNames;
}

function useAccordionValue({
  value,
  defaultValue,
  onValueChange,
}: Pick<BouncyAccordionProps, "value" | "defaultValue" | "onValueChange">) {
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? null,
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = React.useCallback(
    (nextValue: string | null) => {
      if (!isControlled) setInternalValue(nextValue);
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  return [currentValue, setValue] as const;
}

interface BouncyAccordionRowProps {
  item: BouncyAccordionItem;
  open: boolean;
  startsGroup: boolean;
  endsGroup: boolean;
  separatedFromPrevious: boolean;
  contentId: string;
  triggerId: string;
  reduceMotion: boolean;
  classNames?: BouncyAccordionClassNames;
  onToggle: () => void;
}

function BouncyAccordionRow({
  item,
  open,
  startsGroup,
  endsGroup,
  separatedFromPrevious,
  contentId,
  triggerId,
  reduceMotion,
  classNames,
  onToggle,
}: BouncyAccordionRowProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState(0);
  const transition = reduceMotion ? { duration: 0 } : ROW_TRANSITION;

  React.useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const updateHeight = () => setContentHeight(content.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(content);
    return () => observer.disconnect();
  }, [item.description]);

  return (
    <motion.div
      layout="position"
      initial={false}
      animate={{ marginTop: separatedFromPrevious ? 12 : 0 }}
      transition={transition}
    >
      <motion.div
        data-state={open ? "open" : "closed"}
        initial={false}
        animate={{
          borderTopLeftRadius: startsGroup ? 28 : 0,
          borderTopRightRadius: startsGroup ? 28 : 0,
          borderBottomLeftRadius: endsGroup ? 28 : 0,
          borderBottomRightRadius: endsGroup ? 28 : 0,
        }}
        transition={transition}
        className={cn(
          "overflow-hidden bg-card text-card-foreground",
          item.disabled && "opacity-50",
          classNames?.item,
        )}
      >
        <button
          id={triggerId}
          type="button"
          disabled={item.disabled}
          aria-expanded={open}
          aria-controls={contentId}
          onClick={onToggle}
          className={cn(
            "flex min-h-14 w-full items-center gap-4 px-5 text-left outline-none transition-colors hover:bg-muted/30 focus-visible:bg-muted/50 disabled:pointer-events-none",
            classNames?.trigger,
          )}
        >
          {item.icon ? (
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center text-muted-foreground [&_svg]:size-5",
                classNames?.icon,
              )}
            >
              {item.icon}
            </span>
          ) : null}
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-[15px] font-medium",
              classNames?.title,
            )}
          >
            {item.title}
          </span>
          <motion.span
            aria-hidden="true"
            animate={{ rotate: open ? 180 : 0 }}
            transition={reduceMotion ? { duration: 0 } : CHEVRON_TRANSITION}
            className={cn(
              "grid size-6 shrink-0 place-items-center text-muted-foreground",
              classNames?.chevron,
            )}
          >
            <ChevronDown className="size-4" />
          </motion.span>
        </button>

        <motion.div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          aria-hidden={!open}
          initial={false}
          animate={{ height: open && item.description ? contentHeight : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : open
                ? CONTENT_OPEN_TRANSITION
                : CONTENT_CLOSE_TRANSITION
          }
          className={cn("overflow-hidden", classNames?.content)}
        >
          <motion.div
            ref={contentRef}
            initial={false}
            animate={{ opacity: open ? 1 : 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }
            }
            className="px-5 pb-5"
          >
            <div
              className={cn(
                "text-[15px] leading-6 text-muted-foreground",
                classNames?.description,
              )}
            >
              {item.description}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function BouncyAccordion({
  items,
  value,
  defaultValue = null,
  onValueChange,
  collapsible = true,
  className,
  classNames,
}: BouncyAccordionProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const baseId = React.useId().replace(/:/g, "");
  const [activeValue, setActiveValue] = useAccordionValue({
    value,
    defaultValue,
    onValueChange,
  });
  const activeIndex = items.findIndex((item) => item.id === activeValue);

  const handleToggle = React.useCallback(
    (id: string) => {
      if (activeValue === id) {
        if (collapsible) setActiveValue(null);
        return;
      }
      setActiveValue(id);
    },
    [activeValue, collapsible, setActiveValue],
  );

  return (
    <div
      data-slot="bouncy-accordion"
      className={cn("w-full", className, classNames?.root)}
    >
      {items.map((item, index) => {
        const open = activeValue === item.id;
        const previousIsOpen = activeIndex === index - 1;
        const nextIsOpen = activeIndex === index + 1;

        return (
          <BouncyAccordionRow
            key={item.id}
            item={item}
            open={open}
            startsGroup={open || index === 0 || previousIsOpen}
            endsGroup={open || index === items.length - 1 || nextIsOpen}
            separatedFromPrevious={index > 0 && (open || previousIsOpen)}
            contentId={`${baseId}-content-${index}`}
            triggerId={`${baseId}-trigger-${index}`}
            reduceMotion={reduceMotion}
            classNames={classNames}
            onToggle={() => handleToggle(item.id)}
          />
        );
      })}
    </div>
  );
}

interface AccordionItemProps {
  title: React.ReactNode;
  id?: string;
  value?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function Accordion(
  props: BouncyAccordionProps | AccordionItemProps,
): React.ReactElement | null {
  if ("items" in props) return <BouncyAccordion {...props} />;
  return null;
}

export interface AccordionsProps extends Omit<BouncyAccordionProps, "items"> {
  children?: React.ReactNode;
}

export function Accordions({ children, ...props }: AccordionsProps) {
  const items: BouncyAccordionItem[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<AccordionItemProps>(child)) return;

    const {
      title,
      id,
      value,
      icon,
      disabled,
      children: description,
    } = child.props;

    items.push({
      id: value ?? id ?? String(title),
      title,
      description,
      icon,
      disabled,
    });
  });

  return <BouncyAccordion items={items} {...props} />;
}
