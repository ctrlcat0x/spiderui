"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@workspace/ui/lib/utils";

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

export interface SmoothInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "size"
> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  invalid?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  caretClassName?: string;
}

export const SmoothInput = forwardRef<HTMLInputElement, SmoothInputProps>(
  (
    {
      id,
      label,
      description,
      errorMessage,
      invalid = false,
      containerClassName,
      inputClassName,
      caretClassName,
      className,
      value,
      defaultValue,
      onChange,
      onSelect,
      onFocus,
      onBlur,
      type = "text",
      disabled,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const resolvedId = id ?? generatedId;
    const inputRef = useRef<HTMLInputElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const controlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(
      String(defaultValue ?? ""),
    );
    const [focused, setFocused] = useState(false);
    const [selectionCollapsed, setSelectionCollapsed] = useState(true);
    const currentValue = controlled ? String(value ?? "") : internalValue;
    const x = useMotionValue(0);
    const reducedMotion = useReducedMotion();
    const springX = useSpring(x, { stiffness: 520, damping: 42, mass: 0.45 });
    const resolvedInvalid = invalid || Boolean(errorMessage);
    const descriptionId = description ? `${resolvedId}-description` : undefined;
    const errorId = errorMessage ? `${resolvedId}-error` : undefined;
    const describedBy = [ariaDescribedBy, descriptionId, errorId]
      .filter(Boolean)
      .join(" ");

    const updateCaret = useCallback(() => {
      const input = inputRef.current;
      const measure = measureRef.current;
      if (!input || !measure) return;
      const start = input.selectionStart ?? currentValue.length;
      const end = input.selectionEnd ?? start;
      const prefix = currentValue.slice(0, start);
      measure.textContent =
        type === "password" ? "•".repeat(prefix.length) : prefix;
      setSelectionCollapsed(start === end);
      x.set(measure.getBoundingClientRect().width - input.scrollLeft);
    }, [currentValue, type, x]);

    useLayoutEffect(() => {
      updateCaret();
    }, [updateCaret]);

    useEffect(() => {
      const input = inputRef.current;
      if (!input) return;
      const handleSelectionChange = () => {
        if (document.activeElement === input) updateCaret();
      };
      const resizeObserver = new ResizeObserver(updateCaret);
      resizeObserver.observe(input);
      document.addEventListener("selectionchange", handleSelectionChange);
      document.fonts?.ready.then(updateCaret);
      return () => {
        resizeObserver.disconnect();
        document.removeEventListener("selectionchange", handleSelectionChange);
      };
    }, [updateCaret]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!controlled) setInternalValue(event.target.value);
      onChange?.(event);
      requestAnimationFrame(updateCaret);
    };

    return (
      <div
        className={cn("flex w-full flex-col gap-2", containerClassName)}
        data-slot="smooth-input-field"
      >
        {label ? (
          <label
            htmlFor={resolvedId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          <span
            ref={measureRef}
            aria-hidden="true"
            className={cn(
              "pointer-events-none invisible absolute left-3 top-1/2 -translate-y-1/2 whitespace-pre",
              "text-base font-normal tracking-normal",
              inputClassName,
            )}
          />
          <input
            {...props}
            ref={(node) => {
              inputRef.current = node;
              setRef(forwardedRef, node);
            }}
            id={resolvedId}
            type={type}
            value={controlled ? value : internalValue}
            disabled={disabled}
            aria-invalid={resolvedInvalid || undefined}
            aria-describedby={describedBy || undefined}
            onChange={handleChange}
            onScroll={updateCaret}
            onSelect={(event) => {
              updateCaret();
              onSelect?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              updateCaret();
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            className={cn(
              "h-11 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none",
              "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15",
              "disabled:cursor-not-allowed disabled:opacity-50",
              resolvedInvalid &&
                "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/15",
              focused && "caret-transparent",
              inputClassName,
              className,
            )}
          />
          {focused && selectionCollapsed && !disabled ? (
            <motion.span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute left-3 top-1/2 h-5 w-px -translate-y-1/2 bg-foreground",
                caretClassName,
              )}
              style={{ x: reducedMotion ? x : springX }}
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                times: [0, 0.48, 0.5, 1],
              }}
            />
          ) : null}
        </div>
        {description ? (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
        {errorMessage ? (
          <p id={errorId} role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  },
);

SmoothInput.displayName = "SmoothInput";
