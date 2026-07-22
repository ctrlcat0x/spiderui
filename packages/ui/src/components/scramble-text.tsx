"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

import { cn } from "@workspace/ui/lib/utils";

const DEFAULT_CHARACTERS = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";

export type ScrambleTextCaretVariant =
  | "line"
  | "block"
  | "underscore"
  | "custom"
  | "none";

export interface ScrambleTextProps extends Omit<
  ComponentProps<"span">,
  "children"
> {
  text: string;
  scrambleSpeed?: number;
  scrambledLetterCount?: number;
  characters?: string;
  scrambledClassName?: string;
  revealedClassName?: string;
  autoStart?: boolean;
  delay?: number;
  caret?: ReactNode;
  caretVariant?: ScrambleTextCaretVariant;
  showCaret?: boolean;
  blinkCaret?: boolean;
  caretClassName?: string;
  hideCaretOnComplete?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
}

export interface ScrambleTextHandle {
  start: () => void;
  reset: () => void;
}

function getRandomCharacter(characters: string) {
  return characters[Math.floor(Math.random() * characters.length)] ?? "";
}

function createScramble(
  text: string,
  revealedCount: number,
  scrambledLetterCount: number,
  characters: string,
) {
  const end = Math.min(
    text.length,
    revealedCount + Math.max(0, scrambledLetterCount),
  );

  return Array.from(text.slice(revealedCount, end), (character) =>
    /\s/.test(character) ? character : getRandomCharacter(characters),
  ).join("");
}

function ScrambleCaret({
  caret,
  variant,
  blink,
  className,
}: {
  caret?: ReactNode;
  variant: ScrambleTextCaretVariant;
  blink: boolean;
  className?: string;
}) {
  if (variant === "none") return null;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "ml-[0.14em] inline-block shrink-0 align-[-0.08em] text-current",
        variant === "line" && "h-[0.88em] w-[0.075em] rounded-full bg-current",
        variant === "block" &&
          "h-[0.82em] w-[0.48em] rounded-[0.06em] bg-current opacity-75",
        variant === "underscore" &&
          "h-[0.075em] w-[0.56em] translate-y-[0.08em] rounded-full bg-current",
        variant === "custom" && "leading-none",
        blink && "animate-[pulse_1s_steps(2,end)_infinite]",
        className,
      )}
    >
      {variant === "custom" ? (caret ?? "|") : null}
    </span>
  );
}

export const ScrambleText = forwardRef<ScrambleTextHandle, ScrambleTextProps>(
  function ScrambleText(
    {
      text,
      scrambleSpeed = 50,
      scrambledLetterCount = 2,
      characters = DEFAULT_CHARACTERS,
      scrambledClassName,
      revealedClassName,
      autoStart = true,
      delay = 0,
      caret,
      caretVariant = "line",
      showCaret = true,
      blinkCaret = true,
      caretClassName,
      hideCaretOnComplete = false,
      onStart,
      onComplete,
      className,
      ...props
    },
    ref,
  ) {
    const [revealedCount, setRevealedCount] = useState(0);
    const [scrambledText, setScrambledText] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const textRef = useRef(text);
    const onStartRef = useRef(onStart);
    const onCompleteRef = useRef(onComplete);
    const safeCharacters = characters || DEFAULT_CHARACTERS;

    useLayoutEffect(() => {
      textRef.current = text;
      onStartRef.current = onStart;
      onCompleteRef.current = onComplete;
    });

    const reset = useCallback(() => {
      setIsAnimating(false);
      setIsComplete(false);
      setRevealedCount(0);
      setScrambledText("");
    }, []);

    const start = useCallback(() => {
      const currentText = textRef.current;
      onStartRef.current?.();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setRevealedCount(currentText.length);
        setScrambledText("");
        setIsAnimating(false);
        setIsComplete(true);
        onCompleteRef.current?.();
        return;
      }

      setRevealedCount(0);
      setScrambledText(
        createScramble(currentText, 0, scrambledLetterCount, safeCharacters),
      );
      setIsComplete(currentText.length === 0);
      setIsAnimating(currentText.length > 0);

      if (currentText.length === 0) onCompleteRef.current?.();
    }, [safeCharacters, scrambledLetterCount]);

    useImperativeHandle(ref, () => ({ start, reset }), [reset, start]);

    useEffect(() => {
      if (!autoStart) {
        reset();
        return;
      }

      const timeout = window.setTimeout(start, Math.max(0, delay));
      return () => window.clearTimeout(timeout);
    }, [autoStart, delay, reset, start, text]);

    useEffect(() => {
      if (!isAnimating) return;

      let visibleCount = 0;
      const interval = window.setInterval(
        () => {
          visibleCount += 1;
          const nextCount = Math.min(textRef.current.length, visibleCount);

          setRevealedCount(nextCount);
          setScrambledText(
            createScramble(
              textRef.current,
              nextCount,
              scrambledLetterCount,
              safeCharacters,
            ),
          );

          if (nextCount >= textRef.current.length) {
            window.clearInterval(interval);
            setIsAnimating(false);
            setIsComplete(true);
            onCompleteRef.current?.();
          }
        },
        Math.max(1, scrambleSpeed),
      );

      return () => window.clearInterval(interval);
    }, [isAnimating, safeCharacters, scrambleSpeed, scrambledLetterCount]);

    const resolvedCaretVariant = caret === undefined ? caretVariant : "custom";
    const reserveCaret = showCaret && resolvedCaretVariant !== "none";
    const caretVisible = reserveCaret && !(hideCaretOnComplete && isComplete);
    const revealedText = text.slice(0, revealedCount);

    return (
      <span
        className={cn(
          "relative inline-grid whitespace-pre align-baseline",
          className,
        )}
        {...props}
      >
        <span className="sr-only">{text}</span>
        <span aria-hidden="true" className="invisible col-start-1 row-start-1">
          {text}
          {reserveCaret ? (
            <ScrambleCaret
              caret={caret}
              variant={resolvedCaretVariant}
              blink={false}
              className={caretClassName}
            />
          ) : null}
        </span>
        <span aria-hidden="true" className="col-start-1 row-start-1 text-left">
          <span className={revealedClassName}>{revealedText}</span>
          <span className={scrambledClassName}>{scrambledText}</span>
          {caretVisible ? (
            <ScrambleCaret
              caret={caret}
              variant={resolvedCaretVariant}
              blink={blinkCaret}
              className={caretClassName}
            />
          ) : null}
        </span>
      </span>
    );
  },
);

ScrambleText.displayName = "ScrambleText";
