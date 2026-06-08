"use client"

import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"

export const MINI_ARCHIVE_ACCENT_COLORS = [
  "yellow",
  "pink",
  "cyan",
  "violet",
  "orange",
  "emerald",
  "black",
] as const

export type MiniArchiveAccentColor = (typeof MINI_ARCHIVE_ACCENT_COLORS)[number]

const ACCENT_THEMES: Record<
  MiniArchiveAccentColor,
  { cover: string; back: string; swatch: string; cardFront: string; cardBack: string }
> = {
  yellow: {
    cover: "bg-yellow-500/70",
    back: "bg-yellow-400",
    swatch: "bg-yellow-500",
    cardFront: "bg-yellow-600/80",
    cardBack: "bg-yellow-500",
  },
  pink: {
    cover: "bg-pink-500/70",
    back: "bg-pink-400",
    swatch: "bg-pink-500",
    cardFront: "bg-pink-600/80",
    cardBack: "bg-pink-500",
  },
  cyan: {
    cover: "bg-cyan-500/70",
    back: "bg-cyan-400",
    swatch: "bg-cyan-500",
    cardFront: "bg-cyan-600/80",
    cardBack: "bg-cyan-500",
  },
  violet: {
    cover: "bg-violet-500/70",
    back: "bg-violet-400",
    swatch: "bg-violet-500",
    cardFront: "bg-violet-600/80",
    cardBack: "bg-violet-500",
  },
  orange: {
    cover: "bg-orange-500/70",
    back: "bg-orange-400",
    swatch: "bg-orange-500",
    cardFront: "bg-orange-600/80",
    cardBack: "bg-orange-500",
  },
  emerald: {
    cover: "bg-emerald-500/70",
    back: "bg-emerald-400",
    swatch: "bg-emerald-500",
    cardFront: "bg-emerald-600/80",
    cardBack: "bg-emerald-500",
  },
  black: {
    cover: "bg-neutral-800/70",
    back: "bg-neutral-800",
    swatch: "bg-neutral-800",
    cardFront: "bg-neutral-900/80",
    cardBack: "bg-neutral-900",
  },
}

const DEFAULT_QUOTES = [
  { quote: "I am serious. And don't call me Shirley.", film: "Airplane!" },
  { quote: "Leave the gun. Take the cannoli.", film: "The Godfather" },
] as const

const CARD_LAYER_STYLE = {
  transformStyle: "preserve-3d" as const,
  willChange: "transform" as const,
} as const

const sceneVariants = {
  closed: {},
  hover: {},
  open: {},
}

// Separate springs for opening vs closing the cover.
// Close spring is overdamped (damping > 2*sqrt(stiffness*mass)) so it never
// overshoots past rotateY=0. Overshoot is what lets cards "peek through" — when
// the cover bounces to positive rotateY, its far edge dips behind the cards' z-plane.
const springCoverOpen = {
  type: "spring" as const,
  stiffness: 68,
  damping: 11,
  mass: 1.15,
}
const springCoverClose = {
  type: "spring" as const,
  stiffness: 160,
  damping: 28, // overdamped: 28 > 2*sqrt(160*1) ≈ 25.3 → no bounce
  mass: 1,
}

const coverVariants = {
  closed: {
    rotateY: 0,
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    transition: springCoverClose,
  },
  hover: {
    rotateY: -18,
    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.2)",
    transition: springCoverOpen,
  },
  open: {
    rotateY: -65,
    boxShadow: "0 8px 24px -6px rgba(0,0,0,0.15)",
    transition: springCoverOpen,
  },
}

const CARD_WIDTH = 256 * 0.8
const CARD_OVERLAP = 14
const CARD_OPEN_X_BACK = 88
const CARD_OPEN_X_FRONT = CARD_OPEN_X_BACK + CARD_WIDTH - CARD_OVERLAP

const springPeek = {
  type: "spring" as const,
  stiffness: 100,
  damping: 11,
  mass: 0.95,
}

const springOpenBack = {
  type: "spring" as const,
  stiffness: 62,
  damping: 10,
  mass: 1.05,
}

const springOpenFront = {
  type: "spring" as const,
  stiffness: 58,
  damping: 9,
  mass: 1.1,
  delay: 0.05,
}

const springCover = {
  type: "spring" as const,
  stiffness: 68,
  damping: 11,
  mass: 1.15,
}

const card1Variants = {
  // z: 2 keeps the card inside the folder (below cover at z:20) but above the
  // back panel (z:0), so the translucent frosted cover can blur it in idle state.
  // The overdamped close spring ensures rotateY never overshoots past 0, so the
  // cover is always geometrically in front of these cards during close.
  closed: { x: 0, y: 0, rotate: 0.5, z: 2 },
  hover: {
    x: 38,
    y: 0,
    rotate: 2.5,
    z: 11,
    transition: springPeek,
  },
  open: {
    x: CARD_OPEN_X_FRONT,
    y: 0,
    rotate: -2,
    z: 11,
    transition: springOpenFront,
  },
}

const card2Variants = {
  closed: { x: -8, y: 6, rotate: -2, z: 1 },
  hover: {
    x: 16,
    y: 2,
    rotate: -2.5,
    z: 9,
    transition: springPeek,
  },
  open: {
    x: CARD_OPEN_X_BACK,
    y: 0,
    rotate: 2,
    z: 9,
    transition: springOpenBack,
  },
}

export type MiniArchiveQuote = {
  quote: string
  film: string
}

export type MiniArchiveProps = {
  title?: string
  subtitle?: string
  accentColor?: MiniArchiveAccentColor
  quotes?: [MiniArchiveQuote, MiniArchiveQuote]
  className?: string
}

type QuoteCardProps = MiniArchiveQuote & {
  cardClass: string
}

const QuoteCard = ({ quote, film, cardClass }: QuoteCardProps) => (
  <div
    className={cn(
      "flex h-full w-full flex-col justify-between rounded-2xl border border-white/20 p-5 shadow-[2px_4px_12px_rgba(0,0,0,0.15)] backdrop-blur-sm",
      cardClass,
    )}
  >
    <p className="text-sm leading-snug text-white">&ldquo;{quote}&rdquo;</p>
    <p className="text-xs font-medium text-white/70">— {film}</p>
  </div>
)

export function MiniArchive({
  title = "集めたもの",
  subtitle = "Mini Archive",
  accentColor = "yellow",
  quotes = [...DEFAULT_QUOTES],
  className,
}: MiniArchiveProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const theme = ACCENT_THEMES[accentColor]
  const sceneState = isOpen ? "open" : isHovered ? "hover" : "closed"

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [isOpen])

  const handleToggle = () => setIsOpen((prev) => !prev)

  return (
    <div className={cn("flex flex-col items-center overflow-visible", className)}>
      <div
        ref={containerRef}
        className="relative h-80 w-64 cursor-pointer select-none overflow-visible"
        style={{ perspective: "1200px" }}
        onClick={handleToggle}
        onPointerEnter={() => {
          if (!isOpen) setIsHovered(true)
        }}
        onPointerLeave={() => setIsHovered(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleToggle()
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label={`${subtitle} folder, ${isOpen ? "open" : "closed"}`}
      >
        <motion.div
          className="relative h-full w-full"
          variants={sceneVariants}
          initial="closed"
          animate={sceneState}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className={cn(
              "absolute -right-2 bottom-0 top-0 w-[calc(100%+10px)] rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.18)]",
              theme.back,
            )}
            style={{ transform: "translateZ(0px)" }}
          />
          <motion.div
            variants={card2Variants}
            animate={sceneState}
            className="absolute left-[10%] top-[10%] h-[80%] w-[80%] origin-center"
            style={CARD_LAYER_STYLE}
          >
            <QuoteCard
              quote={quotes[1].quote}
              film={quotes[1].film}
              cardClass={theme.cardBack}
            />
          </motion.div>
          <motion.div
            variants={card1Variants}
            animate={sceneState}
            className="absolute left-[10%] top-[10%] h-[80%] w-[80%] origin-center"
            style={CARD_LAYER_STYLE}
          >
            <QuoteCard
              quote={quotes[0].quote}
              film={quotes[0].film}
              cardClass={theme.cardFront}
            />
          </motion.div>

          <motion.div
            variants={coverVariants}
            animate={sceneState}
            style={{
              transformOrigin: "left center",
              z: 20,
              backfaceVisibility: "hidden",
            }}
            className={cn(
              "absolute inset-0 flex flex-col justify-end overflow-hidden rounded-3xl border border-white/20 p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] backdrop-blur-md",
              theme.cover,
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.04]"
              style={{ backgroundImage: NOISE_BG }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5"
              aria-hidden
            />
            <div className="relative z-10 flex flex-col gap-1">
              <h3 className="text-lg font-bold leading-tight text-white">
                {title}
              </h3>
              <p className="text-xs text-white/70">{subtitle}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
