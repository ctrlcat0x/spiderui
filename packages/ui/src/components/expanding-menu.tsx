"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

export type ExpandingMenuItem = {
  icon: ReactNode;
  label: string;
  value?: string;
};

export type ExpandingMenuProps = Omit<ComponentProps<"div">, "onChange"> & {
  items?: ExpandingMenuItem[];
  label?: string;
  defaultOpen?: boolean;
  onItemSelect?: (item: ExpandingMenuItem) => void;
};

type IconProps = { className?: string };

function Icon({ children, className }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function DocumentIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.75 3.75h7.5l3 3v13.5H6.75z" />
      <path d="M14.25 3.75v3h3M9.5 11h5M9.5 14.5h5" />
    </Icon>
  );
}

function BoardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.75" y="4.5" width="16.5" height="15" rx="2.25" />
      <path d="M9.25 8v8M14.75 8v5" />
    </Icon>
  );
}

function EventIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.75" y="5.5" width="16.5" height="14.25" rx="2.25" />
      <path d="M7.5 3.75v3.5M16.5 3.75v3.5M3.75 9.25h16.5M8 13h3M8 16h6" />
    </Icon>
  );
}

function TaskIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="m8.25 12 2.5 2.5 5-5" />
    </Icon>
  );
}

function CollectionIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5.25 7.25h13.5v12H5.25zM7.25 4.75h9.5M8.75 2.75h6.5" />
    </Icon>
  );
}

function ReminderIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 9.75a6 6 0 0 0-12 0c0 7-2.25 7-2.25 7h16.5S18 16.75 18 9.75Z" />
      <path d="M9.75 20h4.5" />
    </Icon>
  );
}

const DEFAULT_ITEMS: ExpandingMenuItem[] = [
  { icon: <DocumentIcon />, label: "Document" },
  { icon: <BoardIcon />, label: "Board" },
  { icon: <EventIcon />, label: "Event" },
  { icon: <TaskIcon />, label: "Task" },
  { icon: <CollectionIcon />, label: "Collection" },
  { icon: <ReminderIcon />, label: "Reminder" },
];

function PlusIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

function CloseIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="m6.75 6.75 10.5 10.5m0-10.5-10.5 10.5" />
    </Icon>
  );
}

export function ExpandingMenu({
  items = DEFAULT_ITEMS,
  label = "Add item",
  defaultOpen = false,
  onItemSelect,
  className,
  ...props
}: ExpandingMenuProps) {
  const [open, setOpen] = useState(defaultOpen);
  const layoutId = useId();
  const reducedMotion = useReducedMotion();
  const layoutTransition = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0.1, duration: 0.4 };

  return (
    <div className={cn("w-fit", className)} {...props}>
      <AnimatePresence mode="popLayout" initial={false}>
        {!open ? (
          <motion.button
            key="collapsed"
            layoutId={`${layoutId}-container`}
            type="button"
            aria-expanded="false"
            onClick={() => setOpen(true)}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={layoutTransition}
            className="flex min-h-12 items-center gap-2 whitespace-nowrap rounded-[2rem] bg-card px-6 py-3.5 text-base font-medium text-muted-foreground shadow-sm outline-none ring-1 ring-border/50 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:px-8 sm:py-4 sm:text-lg"
          >
            <motion.span
              layoutId={`${layoutId}-label`}
              className="flex items-center gap-2"
            >
              <PlusIcon className="size-6" />
              {label}
            </motion.span>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            layoutId={`${layoutId}-container`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={layoutTransition}
            className="w-[calc(100vw-2rem)] max-w-sm rounded-[1.375rem] bg-muted p-1 shadow-sm ring-1 ring-border/40"
          >
            <div className="flex items-center justify-between px-4 py-3.5">
              <motion.p
                layoutId={`${layoutId}-label`}
                className="text-[15px] font-semibold text-muted-foreground sm:text-base"
              >
                {label}
              </motion.p>
              <motion.button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                className="grid size-8 place-items-center rounded-full bg-foreground/20 text-background outline-none transition-colors hover:bg-foreground/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
              >
                <CloseIcon className="size-4" />
              </motion.button>
            </div>

            <div
              aria-label={label}
              className="grid grid-cols-3 gap-1 rounded-[1.125rem] bg-background p-3 shadow-sm sm:p-4"
            >
              {items.map((item) => (
                <motion.button
                  key={item.value ?? item.label}
                  type="button"
                  onClick={() => onItemSelect?.(item)}
                  whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                  className="group flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-3 text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:min-h-24 sm:gap-1.5 sm:rounded-[1.25rem] sm:py-4"
                >
                  <span className="[&>svg]:size-5 sm:[&>svg]:size-7">
                    {item.icon}
                  </span>
                  <span className="text-xs font-medium tracking-tight sm:text-sm">
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExpandingMenu;
