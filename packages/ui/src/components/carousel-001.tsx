"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@workspace/ui/lib/utils"

export type Carousel001Slide = {
  id: string
  imageSubtitle: string
  imageSrc: string
  imageAlt?: string
}

export const DEFAULT_CAROUSEL_001_SLIDES: Carousel001Slide[] = [
  {
    id: "multiverse",
    imageSubtitle: "Across dimensions, same spark",
    imageSrc:
      "https://cdn.cosmos.so/2ca26f41-477f-491d-943f-e795434dbaa5?format=webp&w=1200",
    imageAlt: "Vivid multiverse artwork",
  },
  {
    id: "signal",
    imageSubtitle: "Light cuts through the noise",
    imageSrc:
      "https://cdn.cosmos.so/ef24a640-42da-4133-96a0-4572d2b0ccbe?format=webp&w=1200",
    imageAlt: "Neon signal in darkness",
  },
  {
    id: "horizon",
    imageSubtitle: "Where color meets atmosphere",
    imageSrc:
      "https://cdn.cosmos.so/6d05ef91-722e-4fcc-83c5-765e348ec644?format=webp&w=1200",
    imageAlt: "Atmospheric horizon scene",
  },
  {
    id: "stillness",
    imageSubtitle: "Soft focus, sharp intent",
    imageSrc:
      "https://cdn.cosmos.so/b519df17-b76c-4bf3-9a2a-75af2d4ef68e?format=webp&w=1200",
    imageAlt: "Soft abstract still life",
  },
]

const SLIDE_TRANSITION = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1] as const,
}

export type Carousel001Props = {
  title: string
  subtitle: string
  slides?: Carousel001Slide[]
  interval?: number
  className?: string
}

function CarouselNavButton({
  direction,
  onClick,
  className,
  ...props
}: {
  direction: "prev" | "next"
} & ComponentPropsWithoutRef<"button">) {
  const isPrev = direction === "prev"

  return (
    <button
      type="button"
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      onClick={onClick}
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-muted/70 text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      <HugeiconsIcon
        icon={isPrev ? ArrowLeft01Icon : ArrowRight01Icon}
        strokeWidth={2}
        className="size-3"
      />
    </button>
  )
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
                "block h-2 overflow-hidden rounded-full bg-muted-foreground/25",
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

function CarouselSlideContent({
  slide,
  direction,
}: {
  slide: Carousel001Slide
  direction: number
}) {
  const reducedMotion = useReducedMotion()
  const offset = reducedMotion ? 0 : 48

  return (
    <motion.div
      key={slide.id}
      initial={{
        opacity: 0,
        filter: reducedMotion ? "blur(0px)" : "blur(10px)",
      }}
      animate={{
        opacity: 1,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        x: direction >= 0 ? -offset : offset,
        filter: reducedMotion ? "blur(0px)" : "blur(10px)",
      }}
      transition={SLIDE_TRANSITION}
      className="flex w-full flex-col items-center gap-4"
    >
      <p className="text-sm font-normal text-muted-foreground">
        {slide.imageSubtitle}
      </p>
      <div className="w-full overflow-hidden rounded-3xl border border-border/60 bg-muted/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.imageSrc}
          alt={slide.imageAlt ?? slide.imageSubtitle}
          className="aspect-[16/10] w-full object-cover"
          draggable={false}
        />
      </div>
    </motion.div>
  )
}

export function Carousel001({
  title,
  subtitle,
  slides = DEFAULT_CAROUSEL_001_SLIDES,
  interval = 4000,
  className,
}: Carousel001Props) {
  const reducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef(performance.now())

  const slideCount = slides.length

  const goTo = useCallback(
    (index: number, nextDirection = 1) => {
      if (slideCount === 0) return
      const normalized = ((index % slideCount) + slideCount) % slideCount
      setDirection(nextDirection)
      setActiveIndex(normalized)
      setProgress(0)
      progressRef.current = 0
      startRef.current = performance.now()
    },
    [slideCount],
  )

  const goNext = useCallback(() => {
    goTo(activeIndex + 1, 1)
  }, [activeIndex, goTo])

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1, -1)
  }, [activeIndex, goTo])

  useEffect(() => {
    if (slideCount <= 1 || reducedMotion) return

    startRef.current = performance.now()
    progressRef.current = 0
    setProgress(0)

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
  }, [activeIndex, goNext, interval, reducedMotion, slideCount])

  const activeSlide = slides[activeIndex]
  if (!activeSlide) return null

  return (
    <section
      className={cn("mx-auto flex w-full max-w-3xl flex-col items-center gap-8", className)}
      aria-roledescription="carousel"
      aria-label={title}
    >
      <header className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-md text-sm font-normal text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      </header>

      <div className="flex items-center gap-4">
        <CarouselNavButton direction="prev" onClick={goPrev} />
        <CarouselPagination
          count={slideCount}
          activeIndex={activeIndex}
          progress={progress}
          onSelect={(index) => goTo(index, index > activeIndex ? 1 : -1)}
        />
        <CarouselNavButton direction="next" onClick={goNext} />
      </div>

      <div className="relative w-full overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <CarouselSlideContent
            key={activeSlide.id}
            slide={activeSlide}
            direction={direction}
          />
        </AnimatePresence>
      </div>
    </section>
  )
}
