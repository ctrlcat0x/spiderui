"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@workspace/ui/lib/utils"

export type Carousel002Slide = {
  id: string
  imageSrc: string
  imageAlt?: string
}

export const DEFAULT_CAROUSEL_002_SLIDES: Carousel002Slide[] = [
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
    id: "stillness",
    imageSrc:
      "https://cdn.cosmos.so/b519df17-b76c-4bf3-9a2a-75af2d4ef68e?format=webp&w=1200",
    imageAlt: "Soft abstract still life",
  },
  {
    id: "depth",
    imageSrc:
      "https://cdn.cosmos.so/f3624768-7629-4fb9-8f36-a4d00b306abc?format=webp&w=1200",
    imageAlt: "Layered depth study",
  },
]

const SLIDE_TRANSITION = {
  duration: 0.45,
  ease: [0.4, 0, 0.2, 1] as const,
}

const SPRING = { type: "spring" as const, stiffness: 420, damping: 28 }

export type Carousel002Props = {
  title: string
  subtitle: string
  slides?: Carousel002Slide[]
  interval?: number
  className?: string
}

function CarouselNavButton({
  direction,
  onClick,
  className,
}: {
  direction: "prev" | "next"
  onClick: () => void
  className?: string
}) {
  const isPrev = direction === "prev"

  return (
    <motion.button
      type="button"
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      transition={SPRING}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-muted/60 text-muted-foreground",
        "hover:bg-muted hover:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className,
      )}
    >
      <HugeiconsIcon
        icon={isPrev ? ArrowLeft01Icon : ArrowRight01Icon}
        strokeWidth={2}
        className="size-5"
      />
    </motion.button>
  )
}

function CarouselProgressPills({
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
      className="flex min-w-0 flex-1 items-center gap-2"
      role="tablist"
      aria-label="Carousel slides"
    >
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex

        return (
          <motion.button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => onSelect(index)}
            whileTap={{ scale: 0.96 }}
            transition={SPRING}
            className="relative flex h-3 flex-1 items-center focus-visible:outline-none"
          >
            <span className="relative block h-1.5 w-full overflow-hidden rounded-full bg-muted-foreground/20">
              {isActive ? (
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full bg-foreground"
                  initial={false}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.08, ease: "linear" }}
                />
              ) : null}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

function CarouselSlideImage({ slide }: { slide: Carousel002Slide }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      key={slide.id}
      initial={{
        opacity: 0,
        filter: reducedMotion ? "blur(0px)" : "blur(14px)",
      }}
      animate={{
        opacity: 1,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        filter: reducedMotion ? "blur(0px)" : "blur(14px)",
      }}
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

export function Carousel002({
  title,
  subtitle,
  slides = DEFAULT_CAROUSEL_002_SLIDES,
  interval = 4000,
  className,
}: Carousel002Props) {
  const reducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef(performance.now())

  const slideCount = slides.length

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) return
      const normalized = ((index % slideCount) + slideCount) % slideCount
      setActiveIndex(normalized)
      setProgress(0)
      progressRef.current = 0
      startRef.current = performance.now()
    },
    [slideCount],
  )

  const goNext = useCallback(() => {
    goTo(activeIndex + 1)
  }, [activeIndex, goTo])

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1)
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
      className={cn(
        "mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-12",
        className,
      )}
      aria-roledescription="carousel"
      aria-label={title}
    >
      <div className="flex flex-col justify-between gap-10 lg:min-h-full">
        <header className="flex flex-col gap-4">
          <h2 className="max-w-lg font-serif text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem]">
            {title}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </header>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CarouselNavButton direction="prev" onClick={goPrev} />
            <CarouselNavButton direction="next" onClick={goNext} />
          </div>
          <CarouselProgressPills
            count={slideCount}
            activeIndex={activeIndex}
            progress={progress}
            onSelect={goTo}
          />
        </div>
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-muted/20">
        <AnimatePresence mode="wait" initial={false}>
          <CarouselSlideImage key={activeSlide.id} slide={activeSlide} />
        </AnimatePresence>
      </div>
    </section>
  )
}
