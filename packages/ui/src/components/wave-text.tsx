"use client";

import {
  useEffect,
  type MouseEvent,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

export const WAVE_TEXT_CHARACTER_PRESETS = {
  letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  symbols: "!@#$%&*+-=<>?/\\~:;",
  blocks: "░▒▓█",
} as const;

export type WaveTextCharacterPreset = keyof typeof WAVE_TEXT_CHARACTER_PRESETS;

export interface WaveTextProps extends Omit<
  ComponentProps<"span">,
  "children" | "onMouseEnter" | "onMouseLeave" | "onMouseMove"
> {
  text: string;
  preset?: WaveTextCharacterPreset;
  charset?: string;
  duration?: number;
  spread?: number;
  preserveSpaces?: boolean;
}

type Wave = {
  origin: number;
  startedAt: number;
};

const WAVE_WIDTH = 2.5;

function getScrambledText({
  characters,
  charset,
  preserveSpaces,
  waves,
  now,
  duration,
  spread,
}: {
  characters: string[];
  charset: string;
  preserveSpaces: boolean;
  waves: Wave[];
  now: number;
  duration: number;
  spread: number;
}) {
  const maxIndex = Math.max(characters.length - 1, 1);

  return characters
    .map((character, index) => {
      if (preserveSpaces && /\s/.test(character)) return character;

      for (const wave of waves) {
        const progress = Math.min((now - wave.startedAt) / duration, 1);
        const radius = progress * maxIndex * spread;
        const distance = Math.abs(index - wave.origin);

        if (Math.abs(distance - radius) <= WAVE_WIDTH) {
          const frame = Math.floor(now / 42);
          return charset[(index * 7 + frame) % charset.length] ?? character;
        }
      }

      return character;
    })
    .join("");
}

export function WaveText({
  text,
  preset = "symbols",
  charset,
  duration = 900,
  spread = 1,
  preserveSpaces = true,
  className,
  ...props
}: WaveTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const wavesRef = useRef<Wave[]>([]);
  const isHoveringRef = useRef(false);
  const cursorRef = useRef(-1);
  const shouldReduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const safeCharset =
    charset ||
    WAVE_TEXT_CHARACTER_PRESETS[preset] ||
    WAVE_TEXT_CHARACTER_PRESETS.symbols;
  const safeDuration = Math.max(100, duration);
  const safeSpread = Math.max(0.25, spread);

  useEffect(() => {
    setDisplayText(text);
    wavesRef.current = [];
    cursorRef.current = -1;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [text, safeCharset, safeDuration, safeSpread, preserveSpaces]);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  const getCharacterIndex = (event: MouseEvent<HTMLSpanElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !text.length) return 0;

    const position = Math.round(
      ((event.clientX - rect.left) / rect.width) * (text.length - 1),
    );
    return Math.max(0, Math.min(text.length - 1, position));
  };

  const animate = () => {
    const now = performance.now();
    wavesRef.current = wavesRef.current.filter(
      (wave) => now - wave.startedAt < safeDuration,
    );

    if (!wavesRef.current.length) {
      setDisplayText(text);
      animationFrameRef.current = null;
      return;
    }

    setDisplayText(
      getScrambledText({
        characters: Array.from(text),
        charset: safeCharset,
        preserveSpaces,
        waves: wavesRef.current,
        now,
        duration: safeDuration,
        spread: safeSpread,
      }),
    );
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const startWave = (origin: number) => {
    if (shouldReduceMotion || !text) return;

    wavesRef.current.push({ origin, startedAt: performance.now() });
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  const handleMouseEnter = (event: MouseEvent<HTMLSpanElement>) => {
    isHoveringRef.current = true;
    const origin = getCharacterIndex(event);
    cursorRef.current = origin;
    startWave(origin);
  };

  const handleMouseMove = (event: MouseEvent<HTMLSpanElement>) => {
    if (!isHoveringRef.current) return;

    const origin = getCharacterIndex(event);
    if (origin === cursorRef.current) return;

    cursorRef.current = origin;
    startWave(origin);
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    cursorRef.current = -1;
  };

  return (
    <span
      ref={rootRef}
      className={cn(
        "inline-block cursor-default whitespace-pre-wrap select-none",
        !shouldReduceMotion && "cursor-pointer",
        className,
      )}
      aria-label={text}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span aria-hidden="true">{displayText}</span>
    </span>
  );
}
