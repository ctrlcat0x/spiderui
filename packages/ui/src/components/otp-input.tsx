"use client";

import type { OTPFieldInput, OTPFieldRoot } from "@base-ui/react/otp-field";
import { OTPFieldPreview as OTPField } from "@base-ui/react/otp-field";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  Fragment,
  forwardRef,
  useContext,
  useId,
  useMemo,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@workspace/ui/lib/utils";

const DEFAULT_LENGTH = 6;
const MAX_LENGTH = 12;

export type OTPInputSize = "sm" | "default";

interface OTPInputContextValue {
  invalid: boolean;
  length: number;
  mask: boolean;
  reduceMotion: boolean;
  size: OTPInputSize;
}

const OTPInputContext = createContext<OTPInputContextValue | null>(null);

function useOTPInputContext() {
  const context = useContext(OTPInputContext);

  if (!context) {
    throw new Error("OTP input parts must be rendered inside <OTPInput>.");
  }

  return context;
}

function resolveLength(length?: number) {
  if (!Number.isFinite(length) || !length || length < 1) {
    return DEFAULT_LENGTH;
  }

  return Math.min(Math.floor(length), MAX_LENGTH);
}

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export interface OTPInputProps extends Omit<
  OTPFieldRoot.Props,
  "children" | "className" | "length"
> {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  description?: ReactNode;
  errorMessage?: ReactNode;
  invalid?: boolean;
  label?: ReactNode;
  length?: number;
  size?: OTPInputSize;
}

export const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      children,
      className,
      containerClassName,
      description,
      errorMessage,
      id,
      invalid = false,
      label,
      length,
      mask = false,
      required = false,
      size = "default",
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const reduceMotion = useReducedMotion() ?? false;
    const resolvedId = id ?? generatedId;
    const resolvedLength = resolveLength(length);
    const resolvedInvalid =
      invalid || Boolean(errorMessage) || ariaInvalid === true;
    const descriptionId = description ? `${resolvedId}-description` : undefined;
    const errorId = errorMessage ? `${resolvedId}-error` : undefined;
    const describedBy = [ariaDescribedBy, descriptionId, errorId]
      .filter(Boolean)
      .join(" ");
    const context = useMemo<OTPInputContextValue>(
      () => ({
        invalid: resolvedInvalid,
        length: resolvedLength,
        mask: Boolean(mask),
        reduceMotion,
        size,
      }),
      [mask, reduceMotion, resolvedInvalid, resolvedLength, size],
    );

    return (
      <div
        className={cn(
          "flex w-full flex-col items-start gap-2",
          containerClassName,
        )}
        data-invalid={resolvedInvalid || undefined}
        data-slot="otp-input-field"
      >
        {label ? (
          <label
            className="text-sm font-medium text-foreground"
            htmlFor={resolvedId}
          >
            {label}
            {required ? (
              <span aria-hidden="true" className="text-destructive">
                {" "}
                *
              </span>
            ) : null}
          </label>
        ) : null}

        <OTPInputContext.Provider value={context}>
          <OTPField.Root
            {...props}
            aria-describedby={describedBy || undefined}
            aria-invalid={resolvedInvalid || ariaInvalid}
            className={cn(
              "flex max-w-full items-center gap-2 data-disabled:cursor-not-allowed data-disabled:opacity-50 sm:gap-3",
              className,
            )}
            data-slot="otp-input"
            id={resolvedId}
            length={resolvedLength}
            mask={mask}
            ref={ref}
            required={required}
          >
            {children ?? <OTPInputSlots separatorAfter={3} />}
          </OTPField.Root>
        </OTPInputContext.Provider>

        {description ? (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
        {errorMessage ? (
          <p
            id={errorId}
            aria-live="polite"
            className="text-sm text-destructive"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  },
);
OTPInput.displayName = "OTPInput";

export const OTPInputGroup = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 sm:gap-3", className)}
    data-slot="otp-input-group"
    {...props}
  />
));
OTPInputGroup.displayName = "OTPInputGroup";

export interface OTPInputSlotProps extends Omit<
  OTPFieldInput.Props,
  "className"
> {
  className?: string;
}

export const OTPInputSlot = forwardRef<HTMLInputElement, OTPInputSlotProps>(
  ({ className, ...props }, forwardedRef) => {
    const { invalid, mask, reduceMotion, size } = useOTPInputContext();

    return (
      <OTPField.Input
        {...props}
        render={(inputProps, state) => {
          const {
            className: inputClassName,
            ref: inputRef,
            tabIndex,
            ...resolvedInputProps
          } = inputProps;
          const active = !state.disabled && !state.readOnly && tabIndex === 0;
          const displayValue = state.value ? (mask ? "•" : state.value) : "";
          const slotInvalid = invalid || state.valid === false;

          return (
            <motion.div
              animate={{
                borderColor: slotInvalid
                  ? "var(--color-destructive)"
                  : active
                    ? "var(--color-foreground)"
                    : "var(--color-border)",
              }}
              className={cn(
                "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-background font-medium text-foreground shadow-xs",
                size === "sm"
                  ? "size-9 text-base sm:size-10"
                  : "size-10 text-lg sm:size-14 sm:text-xl",
                slotInvalid && "ring-2 ring-destructive/15",
                state.disabled && "cursor-not-allowed bg-muted/30",
                state.readOnly && "cursor-default bg-muted/30",
                className,
              )}
              data-active={active || undefined}
              data-slot="otp-input-slot"
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 400, damping: 28 }
              }
            >
              <input
                {...resolvedInputProps}
                aria-invalid={slotInvalid || resolvedInputProps["aria-invalid"]}
                className={cn(
                  "absolute inset-0 z-10 cursor-text touch-manipulation opacity-0",
                  inputClassName,
                )}
                ref={(node) => {
                  setRef(inputRef, node);
                  setRef(forwardedRef, node);
                }}
                tabIndex={state.disabled ? -1 : tabIndex}
              />

              <AnimatePresence initial={false} mode="popLayout">
                {displayValue ? (
                  <motion.span
                    key={`${state.index}-${displayValue}`}
                    aria-hidden="true"
                    initial={
                      reduceMotion
                        ? false
                        : { filter: "blur(6px)", opacity: 0, scale: 0.8, y: 8 }
                    }
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : { filter: "blur(4px)", opacity: 0, scale: 0.9, y: -6 }
                    }
                    transition={{ duration: reduceMotion ? 0 : 0.18 }}
                  >
                    {displayValue}
                  </motion.span>
                ) : null}
              </AnimatePresence>

              {active && !displayValue ? (
                <motion.span
                  aria-hidden="true"
                  className="h-5 w-0.5 rounded-full bg-foreground sm:h-6"
                  animate={reduceMotion ? undefined : { opacity: [1, 0.25, 1] }}
                  transition={{
                    duration: 1.1,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              ) : null}
            </motion.div>
          );
        }}
      />
    );
  },
);
OTPInputSlot.displayName = "OTPInputSlot";

export const OTPInputSeparator = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    {...props}
    className={cn("text-muted-foreground/50", className)}
    data-slot="otp-input-separator"
    ref={ref}
    role="separator"
  >
    <svg aria-hidden="true" className="size-3" fill="none" viewBox="0 0 12 12">
      <circle cx="2" cy="6" r="1.5" fill="currentColor" />
      <circle cx="10" cy="6" r="1.5" fill="currentColor" />
    </svg>
  </div>
));
OTPInputSeparator.displayName = "OTPInputSeparator";

export interface OTPInputSlotsProps {
  className?: string;
  separatorAfter?: number | readonly number[];
  slotClassName?: string;
}

export function OTPInputSlots({
  className,
  separatorAfter,
  slotClassName,
}: OTPInputSlotsProps) {
  const { length } = useOTPInputContext();
  const separators = useMemo(
    () =>
      new Set(
        (Array.isArray(separatorAfter)
          ? separatorAfter
          : [separatorAfter]
        ).filter(
          (index): index is number =>
            Number.isInteger(index) &&
            Number(index) > 0 &&
            Number(index) < length,
        ),
      ),
    [length, separatorAfter],
  );

  return (
    <OTPInputGroup className={className}>
      {Array.from({ length }, (_, index) => (
        <Fragment key={index}>
          {separators.has(index) ? <OTPInputSeparator /> : null}
          <OTPInputSlot
            aria-label={`Digit ${index + 1} of ${length}`}
            className={slotClassName}
          />
        </Fragment>
      ))}
    </OTPInputGroup>
  );
}

export { OTPInput as OTP };
