"use client"

import { Fragment, useState } from "react"
import { motion } from "motion/react"

import { cn } from "@workspace/ui/lib/utils"

const ROW_SPRING = {
  type: "spring" as const,
  stiffness: 280,
  damping: 32,
  mass: 0.9,
}

const IMAGE_EASE = [0.23, 1, 0.32, 1] as const
const DIVIDER_CLASS = "w-full border-t border-current opacity-15"

export type AccordionRevealItem = {
  label: string
  sublabel?: string
  image: string
  imageAlt?: string
  description?: string
}

export const DEFAULT_ACCORDION_REVEAL_ITEMS: AccordionRevealItem[] = [
  {
    label: "Spider-Verse",
    sublabel: "Animation",
    image:
      "https://cdn.cosmos.so/2ca26f41-477f-491d-943f-e795434dbaa5?format=webp&w=1200",
    imageAlt: "Spider-Verse multiverse artwork",
    description: "Anyone can wear the mask — leap of faith included",
  },
  {
    label: "The Matrix",
    sublabel: "Sci-Fi",
    image:
      "https://cdn.cosmos.so/ef24a640-42da-4133-96a0-4572d2b0ccbe?format=webp&w=1200",
    imageAlt: "The Matrix digital rain",
    description: "There is no spoon, only the code beneath",
  },
  {
    label: "Twin Peaks",
    sublabel: "TV",
    image:
      "https://cdn.cosmos.so/6d05ef91-722e-4fcc-83c5-765e348ec644?format=webp&w=1200",
    imageAlt: "Twin Peaks misty forest",
    description: "Damn fine coffee, damn strange woods",
  },
  {
    label: "Blade Runner",
    sublabel: "Sci-Fi",
    image:
      "https://cdn.cosmos.so/b519df17-b76c-4bf3-9a2a-75af2d4ef68e?format=webp&w=1200",
    imageAlt: "Blade Runner neon cityscape",
    description: "Tears in rain on a skyline that never sleeps",
  },
  {
    label: "The Godfather",
    sublabel: "Crime",
    image:
      "https://cdn.cosmos.so/f3624768-7629-4fb9-8f36-a4d00b306abc?format=webp&w=1200",
    imageAlt: "The Godfather dramatic still",
    description: "Leave the gun. Take the cannoli.",
  },
]

export type AccordionRevealProps = {
  items?: AccordionRevealItem[]
  collapsedHeight?: number
  expandedHeight?: number
  className?: string
}

export function AccordionReveal({
  items = DEFAULT_ACCORDION_REVEAL_ITEMS,
  collapsedHeight = 68,
  expandedHeight = 320,
  className,
}: AccordionRevealProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div className={DIVIDER_CLASS} aria-hidden />

      {items.map((item, index) => {
        const isHovered = hoveredIndex === index
        const isDimmed = hoveredIndex !== null && !isHovered

        return (
          <Fragment key={`${item.label}-${item.image}`}>
            <motion.div
              className="relative w-full cursor-default overflow-hidden"
              animate={{
                height: isHovered ? expandedHeight : collapsedHeight,
                opacity: isDimmed ? 0.38 : 1,
              }}
              transition={{
                height: ROW_SPRING,
                opacity: { duration: 0.22, ease: "easeOut" },
              }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <motion.div
                className="absolute inset-0 h-full w-full"
                initial={false}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  scale: isHovered ? 1 : 1.06,
                }}
                transition={{
                  opacity: { duration: 0.45, ease: IMAGE_EASE },
                  scale: { duration: 0.55, ease: IMAGE_EASE },
                }}
              >
                <img
                  src={item.image}
                  alt={item.imageAlt ?? ""}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
              </motion.div>

              <div className="absolute inset-0 flex items-end px-5 pb-4">
                <div className="flex w-full items-end justify-between gap-4">
                  <div className="flex min-w-0 items-baseline gap-3">
                    <motion.span
                      className="shrink-0 text-xs tabular-nums"
                      animate={{
                        color: isHovered ? "#ffffff" : "currentColor",
                        opacity: isHovered ? 0.5 : 0.4,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </motion.span>

                    <motion.span
                      className="truncate font-semibold tracking-tight"
                      style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)" }}
                      animate={{
                        color: isHovered ? "#ffffff" : "currentColor",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>

                    {item.description && (
                      <motion.span
                        className="hidden truncate text-sm text-white/70 sm:block"
                        initial={false}
                        animate={{
                          opacity: isHovered ? 1 : 0,
                          x: isHovered ? 0 : -8,
                        }}
                        transition={{
                          duration: 0.3,
                          delay: isHovered ? 0.12 : 0,
                          ease: IMAGE_EASE,
                        }}
                      >
                        — {item.description}
                      </motion.span>
                    )}
                  </div>

                  {item.sublabel && (
                    <motion.span
                      className="shrink-0 text-xs uppercase tracking-widest"
                      animate={{
                        color: isHovered
                          ? "rgba(255,255,255,0.55)"
                          : "currentColor",
                        opacity: isHovered ? 1 : 0.45,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.sublabel}
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>

            <div className={DIVIDER_CLASS} aria-hidden />
          </Fragment>
        )
      })}
    </div>
  )
}
