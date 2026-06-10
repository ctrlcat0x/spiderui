"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import {
  PauseIcon,
  PlayIcon,
  ReplayIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@workspace/ui/lib/utils"

export type Carousel003Slide = {
  id: string
  imageSrc: string
  imageAlt?: string
}

export const DEFAULT_CAROUSEL_003_SLIDES: Carousel003Slide[] = [
  {
    id: "keyboard",
    imageSrc:
      "https://cdn.cosmos.so/b519df17-b76c-4bf3-9a2a-75af2d4ef68e?format=webp&w=1200",
    imageAlt: "Synthesizer keyboard against a blue sky",
  },
  {
    id: "signal",
    imageSrc:
      "https://cdn.cosmos.so/ef24a640-42da-4133-96a0-4572d2b0ccbe?format=webp&w=1200",
    imageAlt: "Neon signal in darkness",
  },
  {
    id: "horizon",
    imageSrc:
      "https://cdn.cosmos.so/6d05ef91-722e-4fcc-83c5-765e348ec644?format=webp&w=1200",
    imageAlt: "Atmospheric horizon scene",
  },
  {
    id: "multiverse",
    imageSrc:
      "https://cdn.cosmos.so/2ca26f41-477f-491d-943f-e795434dbaa5?format=webp&w=1200",
    imageAlt: "Vivid multiverse artwork",
  },
  {
    id: "depth",
    imageSrc:
      "https://cdn.cosmos.so/f3624768-7629-4fb9-8f36-a4d00b306abc?format=webp&w=1200",
    imageAlt: "Layered depth study",
  },
  {
    id: "stillness",
    imageSrc:
      "https://cdn.cosmos.so/6d05ef91-722e-4fcc-83c5-765e348ec644?format=webp&w=1200",
    imageAlt: "Soft abstract still life",
  },
]

const SLIDE_TRANSITION = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1] as const,
}

const SPRING = { type: "spring" as const, stiffness: 520, damping: 24 }

export type Carousel003Props = {
  title: string
  slides?: Carousel003Slide[]
  interval?: number
  className?: string
}

function CarouselPagination({
  count,
  activeIndex,
  progress,
  onSelect,
}: {
  count: number
  activeIndex: number
  progress: number
  onSelect: (index: number) => void
}) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="tablist"
      aria-label="Carousel slides"
    >
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex

        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => onSelect(index)}
            className="relative flex h-2 items-center justify-center focus-visible:outline-none"
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={cn(
                "block h-2 overflow-hidden rounded-full bg-foreground/20",
                isActive ? "w-10" : "w-2",
              )}
            >
              {isActive ? (
                <motion.span
                  className="block h-full rounded-full bg-foreground/80"
                  initial={false}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.08, ease: "linear" }}
                />
              ) : null}
            </motion.span>
          </button>
        )
      })}
    </div>
  )
}

const PILL_HEIGHT = "h-11"

function ControlPill({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border border-border/50 bg-background/70 px-4 shadow-sm backdrop-blur-md",
        PILL_HEIGHT,
        className,
      )}
    >
      {children}
    </div>
  )
}

function IconControlButton({
  label,
  onClick,
  children,
  className,
  ...props
}: {
  label: string
  onClick: () => void
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<typeof motion.button>, "children" | "onClick">) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.86 }}
      transition={SPRING}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-foreground/80",
        "hover:bg-foreground/5 hover:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

function CarouselSlideImage({
  slide,
  direction,
}: {
  slide: Carousel003Slide
  direction: number
}) {
  const reducedMotion = useReducedMotion()
  const enterX = direction >= 0 ? "100%" : "-100%"
  const exitX = direction >= 0 ? "-100%" : "100%"

  return (
    <motion.div
      key={slide.id}
      initial={
        reducedMotion
          ? { opacity: 0 }
          : { x: enterX, opacity: 0, filter: "blur(12px)" }
      }
      animate={
        reducedMotion
          ? { opacity: 1 }
          : { x: 0, opacity: 1, filter: "blur(0px)" }
      }
      exit={
        reducedMotion
          ? { opacity: 0 }
          : { x: exitX, opacity: 0, filter: "blur(12px)" }
      }
      transition={SLIDE_TRANSITION}
      className="absolute inset-0"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.imageSrc}
        alt={slide.imageAlt ?? "Carousel slide"}
        className="size-full object-cover"
        draggable={false}
      />
    </motion.div>
  )
}

export function Carousel003({
  title,
  slides = DEFAULT_CAROUSEL_003_SLIDES,
  interval = 4000,
  className,
}: Carousel003Props) {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [hasEnded, setHasEnded] = useState(false)
  const progressRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef(performance.now())

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center", "end start"],
  })

  const pillScrollY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -56, 0])

  const slideCount = slides.length
  const isLastSlide = activeIndex >= slideCount - 1
  const showReplay = hasEnded || (isLastSlide && progress >= 1)

  const goTo = useCallback(
    (index: number, nextDirection = 1) => {
      if (slideCount === 0) return
      const clamped = Math.max(0, Math.min(index, slideCount - 1))
      setDirection(nextDirection)
      setActiveIndex(clamped)
      setProgress(0)
      progressRef.current = 0
      startRef.current = performance.now()
      if (clamped < slideCount - 1) {
        setHasEnded(false)
      }
    },
    [slideCount],
  )

  const goNext = useCallback(() => {
    if (activeIndex >= slideCount - 1) {
      setHasEnded(true)
      setIsPlaying(false)
      setProgress(1)
      progressRef.current = 1
      return
    }
    goTo(activeIndex + 1, 1)
  }, [activeIndex, goTo, slideCount])

  const handleReplay = useCallback(() => {
    setHasEnded(false)
    goTo(0, -1)
    setIsPlaying(true)
  }, [goTo])

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((playing) => {
      if (playing) {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      } else {
        startRef.current =
          performance.now() - progressRef.current * interval
      }
      return !playing
    })
  }, [interval])

  const handleControlClick = useCallback(() => {
    if (showReplay) {
      handleReplay()
      return
    }
    handleTogglePlay()
  }, [handleReplay, handleTogglePlay, showReplay])

  const controlLabel = showReplay
    ? "Replay slideshow"
    : isPlaying
      ? "Pause slideshow"
      : "Play slideshow"

  const controlIcon = showReplay
    ? ReplayIcon
    : isPlaying
      ? PauseIcon
      : PlayIcon

  useEffect(() => {
    if (slideCount <= 1 || reducedMotion || !isPlaying || hasEnded) return

    startRef.current = performance.now() - progressRef.current * interval

    const tick = (now: number) => {
      const elapsed = now - startRef.current
      const nextProgress = Math.min(elapsed / interval, 1)
      progressRef.current = nextProgress
      setProgress(nextProgress)

      if (nextProgress >= 1) {
        goNext()
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [
    activeIndex,
    goNext,
    hasEnded,
    interval,
    isPlaying,
    reducedMotion,
    slideCount,
  ])

  const activeSlide = slides[activeIndex]
  if (!activeSlide) return null

  return (
    <section
      ref={sectionRef}
      className={cn("mx-auto w-full max-w-5xl pb-10", className)}
      aria-roledescription="carousel"
      aria-label={title}
    >
      <header className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
      </header>

      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-muted/20">
          <AnimatePresence initial={false} custom={direction}>
            <CarouselSlideImage
              key={activeSlide.id}
              slide={activeSlide}
              direction={direction}
            />
          </AnimatePresence>
        </div>

        <motion.div
          style={{ y: pillScrollY }}
          className="relative z-10 mt-0 flex justify-center"
        >
          <div className="flex items-center gap-2">
            <ControlPill>
              <CarouselPagination
                count={slideCount}
                activeIndex={activeIndex}
                progress={showReplay ? 1 : progress}
                onSelect={(index) =>
                  goTo(index, index > activeIndex ? 1 : -1)
                }
              />
            </ControlPill>

            <ControlPill className="w-11 shrink-0 px-0">
              <IconControlButton
                label={controlLabel}
                onClick={handleControlClick}
                className="size-full rounded-full"
              >
                <HugeiconsIcon
                  icon={controlIcon}
                  strokeWidth={2}
                  className="size-4"
                />
              </IconControlButton>
            </ControlPill>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
