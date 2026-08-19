"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

const DEFAULT_EMOJIS = ["🥰", "🤩", "😕", "🥺", "😁"];
const BURST_COUNT = 5;
const MAX_PARTICLES = 45;

type Particle = {
  id: number;
  emoji: string;
  originX: number;
  originY: number;
  x: number;
  drift: number;
  travel: number;
  delay: number;
};

export type EmojiReactionProps = ComponentProps<"div"> & {
  emojis?: string[];
  onReact?: (emoji: string) => void;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: {
    trigger: "size-8 text-lg",
    emoji: "text-2xl",
    pill: "gap-1 p-1",
    text: "text-xs",
  },
  md: {
    trigger: "size-10 text-xl",
    emoji: "text-[34px]",
    pill: "gap-1.5 p-1.5",
    text: "text-sm",
  },
  lg: {
    trigger: "size-12 text-2xl",
    emoji: "text-[42px]",
    pill: "gap-2 p-2",
    text: "text-base",
  },
} as const;

export function EmojiReaction({
  emojis = DEFAULT_EMOJIS,
  onReact,
  size = "md",
  className,
  ...props
}: EmojiReactionProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const seed = useRef(0);
  const s = sizes[size];

  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const react = (emoji: string) => {
    setLast(emoji);
    onReact?.(emoji);
    if (!reduced) {
      const origin = rootRef.current?.getBoundingClientRect();
      if (!origin) return;
      const id = seed.current;
      seed.current += BURST_COUNT;
      setParticles((current) =>
        [
          ...current,
          ...Array.from({ length: BURST_COUNT }, (_, index) => ({
            id: id + index,
            emoji,
            originX: origin.width / 2,
            originY: origin.height / 2,
            x: (Math.random() - 0.5) * 14,
            drift: (Math.random() - 0.5) * 150,
            travel: 300 + Math.random() * 180,
            delay: index * 0.08,
          })),
        ].slice(-MAX_PARTICLES),
      );
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn("relative flex w-fit flex-col items-center", className)}
      {...props}
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          aria-hidden
          className="pointer-events-none fixed z-30 text-3xl"
          style={{
            left: particle.originX,
            top: particle.originY,
            marginLeft: "-0.5em",
            marginTop: "-0.5em",
          }}
          initial={{ x: particle.x, y: 0, opacity: 0, scale: 0.5 }}
          animate={{
            x: particle.x + particle.drift,
            y: -particle.travel,
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.1, 1, 0.7],
            rotate: [0, 12, -8, 4],
          }}
          transition={{
            duration: 1.6,
            delay: particle.delay,
            ease: [0.4, 0.3, 0.5, 1],
          }}
          onAnimationComplete={() =>
            setParticles((current) =>
              current.filter((item) => item.id !== particle.id),
            )
          }
        >
          {particle.emoji}
        </motion.span>
      ))}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Pick a reaction"
            className={cn(
              "absolute bottom-full z-20 mb-4 flex rounded-full bg-muted/95 shadow-xl ring-1 ring-border/50",
              s.pill,
            )}
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={
              reduced
                ? { duration: 0.12 }
                : { type: "spring", stiffness: 500, damping: 28 }
            }
          >
            {emojis.map((emoji) => (
              <motion.button
                key={emoji}
                type="button"
                role="menuitem"
                aria-label={`React ${emoji}`}
                className={cn(
                  "relative z-10 rounded-full p-1 outline-none transition-transform hover:scale-125 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.96]",
                  s.emoji,
                )}
                onClick={() => react(emoji)}
                whileTap={reduced ? undefined : { scale: 0.9 }}
              >
                {emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={
          open ? "Close reactions" : last ? `Reacted ${last}` : "Add a reaction"
        }
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "relative z-10 grid place-items-center rounded-full bg-muted text-foreground/70 shadow-sm ring-1 ring-border/50 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          s.trigger,
        )}
      >
        {open ? "×" : (last ?? "☺️")}
      </button>
      <span className={cn("mt-4 text-muted-foreground", s.text)}>
        Click the button, then pick an emoji to throw it up the screen.
      </span>
    </div>
  );
}

export default EmojiReaction;
