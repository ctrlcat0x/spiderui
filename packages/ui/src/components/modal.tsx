"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@workspace/ui/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_EXIT = [0.4, 0, 1, 1] as const;
const PANEL_SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 36,
  mass: 0.9,
} as const;
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "summary",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");
const modalStack: object[] = [];
const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
} as const;
const subscribe = () => () => undefined;

let scrollLocks = 0;
let releaseScrollLock: (() => void) | null = null;

function getFocusableElements(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) =>
      element.tabIndex !== -1 &&
      !element.hasAttribute("inert") &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.getClientRects().length > 0,
  );
}

function lockDocumentScroll() {
  scrollLocks += 1;
  if (scrollLocks > 1) return;
  const body = document.body;
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  const previousOverflow = body.style.overflow;
  const previousPaddingRight = body.style.paddingRight;
  const currentPadding = Number.parseFloat(
    window.getComputedStyle(body).paddingRight,
  );
  body.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${
      (Number.isFinite(currentPadding) ? currentPadding : 0) + scrollbarWidth
    }px`;
  }
  releaseScrollLock = () => {
    body.style.overflow = previousOverflow;
    body.style.paddingRight = previousPaddingRight;
  };
}

function unlockDocumentScroll() {
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks > 0) return;
  releaseScrollLock?.();
  releaseScrollLock = null;
}

export interface UseModalOptions {
  open: boolean;
  onClose: () => void;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  lockScroll?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  container?: HTMLElement | null;
}

export function useModal({
  open,
  onClose,
  closeOnEscape = true,
  closeOnBackdrop = true,
  lockScroll = true,
  initialFocusRef,
  container,
}: UseModalOptions) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const target = mounted ? (container ?? document.body) : null;
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pointerStartedOutsideRef = useRef(false);
  const latestRef = useRef({
    onClose,
    closeOnEscape,
    closeOnBackdrop,
    initialFocusRef,
  });
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;

  latestRef.current = {
    onClose,
    closeOnEscape,
    closeOnBackdrop,
    initialFocusRef,
  };

  useIsomorphicLayoutEffect(() => {
    if (!open || !lockScroll) return;
    lockDocumentScroll();
    return unlockDocumentScroll;
  }, [lockScroll, open]);

  useEffect(() => {
    if (!open || !target) return;
    const overlay = overlayRef.current;
    const parent = overlay?.parentElement;
    if (!overlay || !parent) return;
    const changed: Array<[Element, string | null]> = [];
    for (const child of Array.from(parent.children)) {
      if (child === overlay) continue;
      changed.push([child, child.getAttribute("inert")]);
      child.setAttribute("inert", "");
    }
    return () => {
      for (const [child, previousValue] of changed) {
        if (previousValue === null) child.removeAttribute("inert");
        else child.setAttribute("inert", previousValue);
      }
    };
  }, [open, target]);

  useEffect(() => {
    if (!open) return;
    const token = {};
    modalStack.push(token);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (modalStack[modalStack.length - 1] !== token) return;
      if (!latestRef.current.closeOnEscape) return;
      event.preventDefault();
      event.stopPropagation();
      latestRef.current.onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const index = modalStack.indexOf(token);
      if (index >= 0) modalStack.splice(index, 1);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !target) return;
    const panel = panelRef.current;
    if (!panel) return;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const preferred = latestRef.current.initialFocusRef?.current;
    (preferred ?? getFocusableElements(panel)[0] ?? panel).focus({
      preventScroll: true,
    });
    const handleFocusIn = (event: FocusEvent) => {
      const node = event.target as Node | null;
      if (!node || panel.contains(node)) return;
      panel.focus({ preventScroll: true });
    };
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [open, target]);

  const handlePanelKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const elements = getFocusableElements(panel);
      if (elements.length === 0) {
        event.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    },
    [],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      pointerStartedOutsideRef.current = !panelRef.current?.contains(
        event.target as Node,
      );
    },
    [],
  );

  const handleOverlayClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!latestRef.current.closeOnBackdrop) return;
      if (panelRef.current?.contains(event.target as Node)) return;
      if (!pointerStartedOutsideRef.current) return;
      pointerStartedOutsideRef.current = false;
      latestRef.current.onClose();
    },
    [],
  );

  return {
    target,
    titleId,
    descriptionId,
    overlayProps: {
      ref: overlayRef,
      onPointerDown: handlePointerDown,
      onClick: handleOverlayClick,
    },
    panelProps: {
      ref: panelRef,
      role: "dialog" as const,
      "aria-modal": true as const,
      "aria-labelledby": titleId,
      tabIndex: -1 as const,
      onKeyDown: handlePanelKeyDown,
    },
  };
}

export type ModalSize = keyof typeof sizeClasses;
export type ModalFooterAlignment = "right" | "split";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  footerAlignment?: ModalFooterAlignment;
  size?: ModalSize;
  showClose?: boolean;
  closeLabel?: string;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  lockScroll?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  container?: HTMLElement | null;
  maxHeight?: string;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  footerAlignment = "right",
  size = "md",
  showClose = true,
  closeLabel = "Close dialog",
  closeOnEscape = true,
  closeOnBackdrop = true,
  lockScroll = true,
  initialFocusRef,
  container,
  maxHeight = "min(78vh, 620px)",
  className,
}: ModalProps) {
  const reduceMotion = useReducedMotion();
  const { target, titleId, descriptionId, overlayProps, panelProps } = useModal(
    {
      open,
      onClose,
      closeOnEscape,
      closeOnBackdrop,
      lockScroll,
      initialFocusRef,
      container,
    },
  );
  const variants = useMemo(
    () => ({
      backdrop: {
        closed: { opacity: 0 },
        open: {
          opacity: 1,
          transition: { duration: reduceMotion ? 0 : 0.2, ease: EASE_OUT },
        },
        gone: {
          opacity: 0,
          transition: { duration: reduceMotion ? 0 : 0.15, ease: EASE_EXIT },
        },
      },
      panel: reduceMotion
        ? {
            closed: { opacity: 0 },
            open: { opacity: 1, transition: { duration: 0 } },
            gone: { opacity: 0, transition: { duration: 0 } },
          }
        : {
            closed: { opacity: 0, scale: 0.96, y: 12 },
            open: {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                ...PANEL_SPRING,
                opacity: { duration: 0.16, ease: EASE_OUT },
              },
            },
            gone: {
              opacity: 0,
              scale: 0.98,
              y: 6,
              transition: { duration: 0.15, ease: EASE_EXIT },
            },
          },
    }),
    [reduceMotion],
  );

  if (!target) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="modal"
          {...overlayProps}
          initial="closed"
          animate="open"
          exit="gone"
          variants={{ closed: {}, open: {}, gone: {} }}
          className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6"
        >
          <motion.div
            aria-hidden="true"
            variants={variants.backdrop}
            className="absolute inset-0 bg-background/75 backdrop-blur-sm"
          />
          <motion.div
            {...panelProps}
            aria-describedby={description ? descriptionId : undefined}
            variants={variants.panel}
            style={{ maxHeight }}
            className={cn(
              "relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl outline-none",
              sizeClasses[size],
              className,
            )}
          >
            <div className="flex shrink-0 items-start gap-4 px-6 pt-6 pb-4">
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
                    className="mt-2 text-sm leading-6 text-muted-foreground"
                  >
                    {description}
                  </p>
                ) : null}
              </div>
              {showClose ? (
                <button
                  type="button"
                  aria-label={closeLabel}
                  onClick={onClose}
                  className="-mt-1 -mr-2 grid size-10 shrink-0 place-items-center rounded-lg text-muted-foreground outline-none transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M18 6 6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              ) : null}
            </div>
            {children ? (
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 text-sm leading-6 text-muted-foreground">
                {children}
              </div>
            ) : null}
            {footer ? (
              <div
                className={cn(
                  "flex shrink-0 items-center gap-3 border-t border-border px-6 py-4",
                  footerAlignment === "split"
                    ? "justify-between"
                    : "justify-end",
                )}
              >
                {footer}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    target,
  );
}
