"use client";

import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@workspace/ui/lib/utils";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");
const subscribe = () => () => undefined;
const drawerStack: object[] = [];

function getFocusableElements(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) =>
      element.tabIndex !== -1 &&
      !element.hasAttribute("inert") &&
      element.getClientRects().length > 0,
  );
}

export type DrawerSide = "left" | "right" | "top" | "bottom";
export type DrawerFooterAlignment = "left" | "right" | "spread";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  footerAlignment?: DrawerFooterAlignment;
  side?: DrawerSide;
  width?: number | string;
  height?: number | string;
  showClose?: boolean;
  showHandle?: boolean;
  closeLabel?: string;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  lockScroll?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  dismissThreshold?: number;
  inwardPull?: number;
  container?: HTMLElement | null;
  className?: string;
  contentClassName?: string;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  children,
  description,
  footer,
  footerAlignment = "right",
  side = "right",
  width = 420,
  height = 420,
  showClose = true,
  showHandle = false,
  closeLabel = "Close drawer",
  closeOnEscape = true,
  closeOnBackdrop = true,
  lockScroll = true,
  initialFocusRef,
  dismissThreshold = 0.32,
  inwardPull = 0.08,
  container,
  className,
  contentClassName,
}: DrawerProps) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const target = mounted ? (container ?? document.body) : null;
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const pointerStartedOutsideRef = useRef(false);
  const releaseSelectionLockRef = useRef<(() => void) | null>(null);
  const dragControls = useDragControls();
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const descriptionId = useId();
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  const handleClose = useCallback(() => onOpenChangeRef.current(false), []);

  useEffect(() => {
    if (!open || !target) return;
    triggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const panel = panelRef.current;
    if (!panel) return;
    const preferred = initialFocusRef?.current;
    (preferred ?? getFocusableElements(panel)[0] ?? panel).focus({
      preventScroll: true,
    });
    const handleFocusIn = (event: FocusEvent) => {
      if (!panel.contains(event.target as Node)) {
        panel.focus({ preventScroll: true });
      }
    };
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      const trigger = triggerRef.current;
      requestAnimationFrame(() => {
        if (trigger?.isConnected) trigger.focus({ preventScroll: true });
      });
    };
  }, [initialFocusRef, open, target]);

  useEffect(() => {
    if (!open || !target) return;
    const token = {};
    drawerStack.push(token);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" ||
        !closeOnEscape ||
        drawerStack.at(-1) !== token
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const index = drawerStack.indexOf(token);
      if (index >= 0) drawerStack.splice(index, 1);
    };
  }, [closeOnEscape, handleClose, open, target]);

  useEffect(() => {
    if (!open || !target) return;
    const root = panelRef.current?.parentElement;
    if (!root) return;
    const changed: Array<[Element, string | null]> = [];
    for (const child of Array.from(target.children)) {
      if (child === root) continue;
      changed.push([child, child.getAttribute("inert")]);
      child.setAttribute("inert", "");
    }
    return () => {
      for (const [child, previous] of changed) {
        if (previous === null) child.removeAttribute("inert");
        else child.setAttribute("inert", previous);
      }
    };
  }, [open, target]);

  useEffect(() => {
    if (!open || !lockScroll) return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [lockScroll, open]);

  useEffect(
    () => () => {
      releaseSelectionLockRef.current?.();
    },
    [],
  );

  const handlePanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const panel = panelRef.current;
    if (!panel) return;
    const elements = getFocusableElements(panel);
    const first = elements[0];
    const last = elements.at(-1);
    if (!first || !last) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  };

  const handleDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    releaseSelectionLockRef.current?.();
    const body = document.body;
    const previousUserSelect = body.style.userSelect;
    const previousWebkitUserSelect = body.style.webkitUserSelect;
    body.style.userSelect = "none";
    body.style.webkitUserSelect = "none";

    const releaseSelectionLock = () => {
      body.style.userSelect = previousUserSelect;
      body.style.webkitUserSelect = previousWebkitUserSelect;
      document.removeEventListener("pointerup", releaseSelectionLock);
      document.removeEventListener("pointercancel", releaseSelectionLock);
      releaseSelectionLockRef.current = null;
    };

    releaseSelectionLockRef.current = releaseSelectionLock;
    document.addEventListener("pointerup", releaseSelectionLock, {
      once: true,
    });
    document.addEventListener("pointercancel", releaseSelectionLock, {
      once: true,
    });
    dragControls.start(event);
  };

  const handleDragEnd = (_event: PointerEvent, info: PanInfo) => {
    const horizontal = side === "left" || side === "right";
    const direction = side === "right" || side === "bottom" ? 1 : -1;
    const size = horizontal ? width : height;
    const numericSize = typeof size === "number" ? size : 420;
    const distance = direction * (horizontal ? info.offset.x : info.offset.y);
    const velocity =
      direction * (horizontal ? info.velocity.x : info.velocity.y);
    if (distance > numericSize * dismissThreshold || velocity > 650) {
      handleClose();
    }
  };

  const footerClasses = {
    left: "justify-start",
    right: "justify-end",
    spread: "justify-between",
  } as const;
  const horizontal = side === "left" || side === "right";
  const safeInwardPull = Math.min(Math.max(inwardPull, 0), 0.25);
  const hiddenTransform = {
    left: { x: "-100%", y: 0 },
    right: { x: "100%", y: 0 },
    top: { x: 0, y: "-100%" },
    bottom: { x: 0, y: "100%" },
  } as const;
  const edgeClasses = {
    left: "inset-y-2 left-2 rounded-l-lg rounded-r-2xl",
    right: "inset-y-2 right-2 rounded-l-2xl rounded-r-lg",
    top: "inset-x-2 top-2 rounded-t-lg rounded-b-2xl",
    bottom: "inset-x-2 bottom-2 rounded-t-2xl rounded-b-lg",
  } as const;
  const handleClasses = {
    left: "right-0 top-1/2 h-32 w-12 -translate-y-1/2",
    right: "left-0 top-1/2 h-32 w-12 -translate-y-1/2",
    top: "bottom-0 left-1/2 h-12 w-32 -translate-x-1/2",
    bottom: "top-0 left-1/2 h-12 w-32 -translate-x-1/2",
  } as const;

  if (!target) return null;

  return createPortal(
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.18 }}
          onPointerDown={(event) => {
            pointerStartedOutsideRef.current =
              event.target === event.currentTarget;
          }}
          onClick={(event) => {
            if (
              closeOnBackdrop &&
              pointerStartedOutsideRef.current &&
              event.target === event.currentTarget
            ) {
              handleClose();
            }
            pointerStartedOutsideRef.current = false;
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
          <motion.div
            ref={panelRef}
            role="dialog"
            data-side={side}
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            drag={horizontal ? "x" : "y"}
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={{
              left: side === "left" ? 0.7 : safeInwardPull,
              right: side === "right" ? 0.7 : safeInwardPull,
              top: side === "top" ? 0.7 : safeInwardPull,
              bottom: side === "bottom" ? 0.7 : safeInwardPull,
            }}
            dragTransition={{ bounceStiffness: 500, bounceDamping: 34 }}
            onDragEnd={handleDragEnd}
            onKeyDown={handlePanelKeyDown}
            initial={reduceMotion ? { opacity: 0 } : hiddenTransform[side]}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : hiddenTransform[side]}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 400, damping: 34, mass: 0.8 }
            }
            style={
              horizontal
                ? { width, maxWidth: "calc(100vw - 1rem)" }
                : { height, maxHeight: "calc(100vh - 1rem)" }
            }
            className={cn(
              "absolute flex flex-col overflow-hidden border bg-background shadow-2xl outline-none",
              edgeClasses[side],
              className,
            )}
          >
            {showHandle ? (
              <div
                aria-hidden="true"
                data-slot="drawer-handle"
                onPointerDown={handleDragStart}
                className={cn(
                  "absolute z-10 flex touch-none cursor-grab select-none items-center justify-center active:cursor-grabbing",
                  handleClasses[side],
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "rounded-full bg-muted-foreground/35",
                    horizontal ? "h-12 w-1" : "h-1 w-12",
                  )}
                />
              </div>
            ) : null}
            <header className="flex items-start gap-4 border-b px-6 py-5">
              <div className="min-w-0 flex-1">
                <h2
                  id={titleId}
                  className="text-lg font-semibold tracking-tight"
                >
                  {title}
                </h2>
                {description ? (
                  <p
                    id={descriptionId}
                    className="mt-1 text-sm text-muted-foreground"
                  >
                    {description}
                  </p>
                ) : null}
              </div>
              {showClose ? (
                <button
                  type="button"
                  aria-label={closeLabel}
                  onClick={handleClose}
                  className="grid size-10 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="none"
                  >
                    <path
                      d="M6 6l12 12M18 6 6 18"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              ) : null}
            </header>
            <div
              className={cn(
                "min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5",
                contentClassName,
              )}
            >
              {children}
            </div>
            {footer ? (
              <footer
                className={cn(
                  "flex flex-wrap items-center gap-3 border-t px-6 py-4",
                  footerClasses[footerAlignment],
                )}
              >
                {footer}
              </footer>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    target,
  );
}
