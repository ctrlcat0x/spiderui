"use client"

import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import { cn } from "@workspace/ui/lib/utils"

gsap.registerPlugin(SplitText)

export type QuoteWordItem = {
  id: number | string
  name: string
  image: string
}

/** Jerry Maguire — word by word */
export const DEFAULT_QUOTE_WORDS: QuoteWordItem[] = [
  { id: 1, name: "SHOW", image: "https://i.pravatar.cc/150?img=11" },
  { id: 2, name: "ME", image: "https://i.pravatar.cc/150?img=47" },
  { id: 3, name: "THE", image: "https://i.pravatar.cc/150?img=25" },
  { id: 4, name: "MONEY", image: "https://i.pravatar.cc/150?img=14" },
]

const headingClass =
  "weeeee-hover-heading m-0 whitespace-nowrap text-center font-black uppercase leading-none tracking-tighter"

const CHAR_STAGGER = { each: 0.025, from: "center" as const }
const CHAR_EASE = "power4.out"
const CHAR_DURATION = 0.75

type CursorFollowerProps = {
  x: number
  y: number
  expanded: boolean
  accentColor: string
}

const CursorFollower = ({
  x,
  y,
  expanded,
  accentColor,
}: CursorFollowerProps) => {
  const dotRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!dotRef.current || !bubbleRef.current) return
    gsap.set(dotRef.current, { xPercent: -50, yPercent: -50 })
    gsap.set(bubbleRef.current, {
      xPercent: -100,
      yPercent: -100,
      transformOrigin: "100% 100%",
    })
  }, [])

  useLayoutEffect(() => {
    if (!dotRef.current || !bubbleRef.current) return
    gsap.to(dotRef.current, {
      x,
      y,
      xPercent: -50,
      yPercent: -50,
      duration: 0.45,
      ease: "power3.out",
    })
    gsap.to(bubbleRef.current, {
      x,
      y,
      xPercent: -100,
      yPercent: -100,
      duration: 0.45,
      ease: "power3.out",
    })
  }, [x, y])

  useLayoutEffect(() => {
    if (!dotRef.current || !bubbleRef.current) return
    gsap.to(dotRef.current, {
      scale: expanded ? 0 : 1,
      opacity: expanded ? 0 : 1,
      duration: 0.25,
      ease: "power2.out",
    })
    gsap.to(bubbleRef.current, {
      scale: expanded ? 1 : 0,
      opacity: expanded ? 1 : 0,
      duration: 0.35,
      ease: expanded ? "back.out(1.4)" : "power2.in",
      transformOrigin: "100% 100%",
    })
  }, [expanded])

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] size-2 rounded-full bg-zinc-950 dark:bg-white"
        aria-hidden
      />
      <div
        ref={bubbleRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] flex size-16 items-center justify-center rounded-full opacity-0"
        style={{ backgroundColor: accentColor }}
        aria-hidden
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </div>
    </>
  )
}

export type WeeeeeHoverProps = {
  items?: QuoteWordItem[]
  title?: string
  accentColor?: string
  className?: string
  titleClassName?: string
  showChrome?: boolean
  header?: ReactNode
}

export function WeeeeeHover({
  items = DEFAULT_QUOTE_WORDS,
  title = "Weee!",
  accentColor = "#ff2d1f",
  className,
  titleClassName,
  showChrome = false,
  header,
}: WeeeeeHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleStageRef = useRef<HTMLDivElement>(null)
  const defaultLayerRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0, expanded: false })

  const titleSizeClass =
    titleClassName ?? "text-[clamp(4rem,18vw,11rem)]"

  useLayoutEffect(() => {
    const root = containerRef.current
    const titleStage = titleStageRef.current
    const imagesGrid = imagesRef.current
    const defaultLayer = defaultLayerRef.current
    if (!root || !titleStage || !imagesGrid || !defaultLayer) return

    const cleanups: (() => void)[] = []
    const splits: SplitText[] = []
    let activeIndex: number | null = null

    const defaultChars = ".name-default .weeeee-hover-char"
    const memberChars = (index: number) =>
      `.name-member-${index} .weeeee-hover-char`

    const lockDefaultHidden = () => {
      gsap.killTweensOf(defaultChars)
      gsap.set(defaultChars, { yPercent: -100 })
      defaultLayer.style.visibility = "hidden"
    }

    const unlockDefaultVisible = () => {
      defaultLayer.style.visibility = "visible"
    }

    const exitChars = (selector: string) => {
      gsap.killTweensOf(selector)
      gsap.to(selector, {
        yPercent: -100,
        duration: CHAR_DURATION,
        ease: CHAR_EASE,
        stagger: CHAR_STAGGER,
      })
    }

    const enterChars = (selector: string) => {
      gsap.killTweensOf(selector)
      gsap.set(selector, { yPercent: 100 })
      gsap.to(selector, {
        yPercent: 0,
        duration: CHAR_DURATION,
        ease: CHAR_EASE,
        stagger: CHAR_STAGGER,
      })
    }

    const hideDefaultTitle = () => {
      unlockDefaultVisible()
      exitChars(defaultChars)
    }

    const showDefaultTitle = () => {
      unlockDefaultVisible()
      enterChars(defaultChars)
    }

    const showMemberName = (index: number) => {
      enterChars(memberChars(index))
    }

    const exitMemberName = (index: number) => {
      exitChars(memberChars(index))
    }

    const resetInactiveMembers = (visibleIndexes: number[]) => {
      items.forEach((_, i) => {
        if (visibleIndexes.includes(i)) return
        gsap.killTweensOf(memberChars(i))
        gsap.set(memberChars(i), { yPercent: 100 })
      })
    }

    const isInsideImagesGrid = (relatedTarget: EventTarget | null) => {
      if (!(relatedTarget instanceof Node)) return false
      return imagesGrid.contains(relatedTarget)
    }

    const ctx = gsap.context(() => {
      titleStage
        .querySelectorAll<HTMLElement>(".weeeee-hover-heading")
        .forEach((heading) => {
          splits.push(
            SplitText.create(heading, {
              type: "chars",
              charsClass: "weeeee-hover-char inline-block",
            }),
          )
        })

      gsap.set(defaultChars, { yPercent: 0 })
      items.forEach((_, index) => {
        gsap.set(memberChars(index), { yPercent: 100 })
      })

      const profileItems = gsap.utils.toArray<HTMLElement>(".profile-img-wrap")

      const onGridLeave = () => {
        if (activeIndex === null) return

        const previousIndex = activeIndex
        exitMemberName(previousIndex)
        activeIndex = null
        resetInactiveMembers([previousIndex])
        showDefaultTitle()
      }

      imagesGrid.addEventListener("mouseleave", onGridLeave)
      cleanups.push(() => {
        imagesGrid.removeEventListener("mouseleave", onGridLeave)
      })

      profileItems.forEach((imgElement, index) => {
        const onMouseEnter = () => {
          gsap.to(imgElement, {
            width: 140,
            height: 140,
            duration: 0.5,
            ease: "power4.out",
          })

          if (activeIndex === null) {
            hideDefaultTitle()
          } else if (activeIndex !== index) {
            lockDefaultHidden()
            resetInactiveMembers([activeIndex, index])
            exitMemberName(activeIndex)
          } else {
            lockDefaultHidden()
          }

          activeIndex = index
          showMemberName(index)
        }

        const onMouseLeave = (event: MouseEvent) => {
          gsap.to(imgElement, {
            width: 70,
            height: 70,
            duration: 0.5,
            ease: "power4.out",
          })

          if (isInsideImagesGrid(event.relatedTarget)) {
            return
          }
        }

        imgElement.addEventListener("mouseenter", onMouseEnter)
        imgElement.addEventListener("mouseleave", onMouseLeave)

        cleanups.push(() => {
          imgElement.removeEventListener("mouseenter", onMouseEnter)
          imgElement.removeEventListener("mouseleave", onMouseLeave)
        })
      })
    }, root)

    return () => {
      cleanups.forEach((fn) => fn())
      splits.forEach((split) => split.revert())
      ctx.revert()
    }
  }, [items, title])

  const handleMouseMove = (event: React.MouseEvent) => {
    setCursor((current) => ({
      ...current,
      x: event.clientX,
      y: event.clientY,
    }))
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-full min-h-[640px] select-none flex-col overflow-hidden bg-zinc-50 font-sans text-zinc-950 dark:bg-zinc-950 dark:text-white",
        className,
      )}
      onMouseMove={handleMouseMove}
    >
      {showChrome && header ? <div className="shrink-0">{header}</div> : null}

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-2 pb-6 pt-4">
        <div
          ref={imagesRef}
          className="z-10 flex w-max max-w-full flex-wrap items-center justify-center gap-1.5 max-md:max-w-xs max-md:gap-2"
          onMouseLeave={() => {
            setCursor((current) => ({ ...current, expanded: false }))
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="profile-img-wrap h-[70px] w-[70px] shrink-0 cursor-pointer overflow-hidden rounded-md p-1"
              style={{
                outline: "2px solid transparent",
                outlineOffset: 2,
              }}
              onMouseEnter={(event) => {
                setCursor((current) => ({ ...current, expanded: true }))
                event.currentTarget.style.outlineColor = accentColor
                const img = event.currentTarget.querySelector("img")
                if (img) img.style.filter = "grayscale(0%)"
              }}
              onMouseLeave={(event) => {
                const nextTarget = event.relatedTarget
                const isStillInStrip =
                  nextTarget instanceof Node &&
                  imagesRef.current?.contains(nextTarget)

                if (!isStillInStrip) {
                  setCursor((current) => ({ ...current, expanded: false }))
                }

                event.currentTarget.style.outlineColor = "transparent"
                const img = event.currentTarget.querySelector("img")
                if (img) img.style.filter = "grayscale(100%)"
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="pointer-events-none size-full rounded-md object-cover grayscale"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div
          ref={titleStageRef}
          className={cn(
            "title-stage relative w-full shrink-0 overflow-hidden",
            titleSizeClass,
          )}
          style={{ height: "1.12em" }}
        >
          <div
            ref={defaultLayerRef}
            className="name-default absolute inset-0 z-0 overflow-hidden"
          >
            <h2 className={cn(headingClass, "text-zinc-950 dark:text-white")}>
              {title}
            </h2>
          </div>

          {items.map((item, index) => (
            <div
              key={item.id}
              className={`name-member-${index} pointer-events-none absolute inset-0 z-10 overflow-hidden`}
            >
              <h2
                className={cn(headingClass)}
                style={{ color: accentColor }}
              >
                {item.name}
              </h2>
            </div>
          ))}
        </div>
      </div>

      <CursorFollower
        x={cursor.x}
        y={cursor.y}
        expanded={cursor.expanded}
        accentColor={accentColor}
      />
    </div>
  )
}
