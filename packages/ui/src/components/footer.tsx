"use client"

import { useEffect, useId, useMemo, useRef, type RefObject } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { cn } from "@workspace/ui/lib/utils"

gsap.registerPlugin(ScrollTrigger, SplitText)

export type FooterColorProps = {
  text?: string
  gradient?: string[]
}

export type FooterThemePreset = {
  text: string
  gradient: string[]
}

export const FOOTER_THEME_PRESETS = {
  "dia-browser": {
    text: "#3F3F46",
    gradient: [
      "#1D4ED8",
      "#60A5FA",
      "#E5E7EB",
      "#fbbb0c",
      "#f93b3b",
      "#FB7185",
      "#EC4899",
      "#fb3af2",
    ],
  },
  ocean: {
    text: "#0F172A",
    gradient: [
      "#1E3A8A",
      "#1D4ED8",
      "#2563EB",
      "#3B82F6",
      "#60A5FA",
      "#93C5FD",
      "#BFDBFE",
      "#E0F2FE",
    ],
  },
  amber: {
    text: "#451A03",
    gradient: [
      "#FEF3C7",
      "#FCD34D",
      "#F59E0B",
      "#D97706",
      "#B45309",
      "#92400E",
      "#78350F",
      "#451A03",
    ],
  },
  emerald: {
    text: "#022C22",
    gradient: [
      "#D1FAE5",
      "#6EE7B7",
      "#34D399",
      "#10B981",
      "#059669",
      "#047857",
      "#065F46",
      "#022C22",
    ],
  },
  violet: {
    text: "#2E1065",
    gradient: [
      "#F5F3FF",
      "#DDD6FE",
      "#C4B5FD",
      "#A78BFA",
      "#8B5CF6",
      "#7C3AED",
      "#6D28D9",
      "#4C1D95",
    ],
  },
  rose: {
    text: "#4A044E",
    gradient: [
      "#FFE4E6",
      "#FDA4AF",
      "#FB7185",
      "#F43F5E",
      "#E11D48",
      "#BE123C",
      "#9F1239",
      "#4A044E",
    ],
  },
} satisfies Record<string, FooterThemePreset>

export type FooterTheme = keyof typeof FOOTER_THEME_PRESETS

export const FOOTER_THEMES = Object.keys(
  FOOTER_THEME_PRESETS,
) as FooterTheme[]

export type FooterProps = {
  colors?: FooterColorProps
  theme?: FooterTheme
  copyrightText?: string
  /** When set, scroll-linked animations use this element instead of the window. */
  scrollContainer?: RefObject<HTMLElement | null>
}

const DEFAULT_FOOTER_THEME: FooterTheme = "dia-browser"

const currentYear = new Date().getFullYear()

export function Footer({
  colors,
  theme = DEFAULT_FOOTER_THEME,
  copyrightText,
  scrollContainer,
}: FooterProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const clipId = useId().replace(/:/g, "")

  const activeTheme = useMemo(
    () =>
      FOOTER_THEME_PRESETS[theme] ?? FOOTER_THEME_PRESETS[DEFAULT_FOOTER_THEME],
    [theme],
  )

  const resolvedColors = useMemo(() => {
    const gradient = Array.from({ length: 8 }, (_, index) => {
      return (
        colors?.gradient?.[index] ?? activeTheme.gradient[index] ?? "#9A3412"
      )
    })

    return {
      text: colors?.text ?? activeTheme.text,
      gradient,
    }
  }, [activeTheme, colors])

  useEffect(() => {
    const root = rootRef.current
    if (!root) {
      return
    }

    const scroller = scrollContainer?.current ?? undefined

    const ctx = gsap.context(() => {
      const svg = root.querySelector("svg")
      if (svg) {
        for (let i = 0; i < 9; i++) {
          const gradient = svg.getElementById?.(
            `grad${i}`,
          ) as SVGLinearGradientElement | null
          if (gradient) {
            gradient
              .querySelectorAll<SVGStopElement>("stop")
              .forEach((stop, idx) => {
                const fallback =
                  resolvedColors.gradient[resolvedColors.gradient.length - 1] ??
                  "#9A3412"
                const stopColor =
                  idx < resolvedColors.gradient.length
                    ? resolvedColors.gradient[idx]
                    : fallback
                if (stopColor) {
                  stop.setAttribute("stop-color", stopColor)
                }
              })
          }
        }
      }

      const animationSection = root.querySelector(".animation-section") ?? root
      const mainTitle = root.querySelector<Element>(".main-title")
      const allSplitLines: gsap.TweenTarget[] = []

      if (mainTitle) {
        const mainTitleSplit = SplitText.create(mainTitle, { type: "lines" })
        gsap.set(mainTitleSplit.lines, {
          opacity: 0,
          y: 30,
          filter: "blur(8px)",
        })
        allSplitLines.push(...mainTitleSplit.lines)
      }

      const isEmbeddedScroller = Boolean(scroller)

      gsap.set(".svg-container", {
        autoAlpha: 0,
        scaleY: 0.05,
        yPercent: 100,
        transformOrigin: "center bottom",
      })
      gsap.set(".main-title", { autoAlpha: 0 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: animationSection,
          start: isEmbeddedScroller ? "top bottom" : "top bottom",
          end: isEmbeddedScroller ? "bottom bottom" : "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          ...(scroller ? { scroller } : {}),
        },
      })

      timeline
        .fromTo(
          ".svg-container",
          { autoAlpha: 0, scaleY: 0.05, yPercent: 100 },
          { autoAlpha: 1, duration: 0.01 },
          0,
        )
        .fromTo(
          ".main-title",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.01 },
          0,
        )
        .to(
          ".svg-container",
          {
            scaleY: 0.05,
            yPercent: 100,
            duration: 0.28,
            ease: "power2.out",
          },
          0,
        )
        .to(
          ".svg-container",
          {
            scaleY: 1,
            yPercent: 0,
            duration: 1.15,
            ease: "power2.out",
          },
          0.28,
        )
        .to(
          allSplitLines,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.08,
            duration: 0.75,
            ease: "power2.out",
          },
          0.55,
        )
    }, root)

    if (scroller) {
      scroller.scrollTop = 0
    }

    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener("resize", handleResize)

    const refresh = () => ScrollTrigger.refresh()
    const refreshTimeout = window.setTimeout(refresh, 100)
    const refreshRaf = requestAnimationFrame(() => {
      if (scroller) {
        scroller.scrollTop = 0
      }
      refresh()
      requestAnimationFrame(refresh)
    })

    return () => {
      window.clearTimeout(refreshTimeout)
      cancelAnimationFrame(refreshRaf)
      window.removeEventListener("resize", handleResize)
      ctx.revert()
    }
  }, [resolvedColors, scrollContainer])

  const footerCopy =
    copyrightText ?? `copyright © ${currentYear} — Spider UI`

  const isEmbedded = Boolean(scrollContainer)

  return (
    <div ref={rootRef} className={cn("overflow-x-hidden", !isEmbedded && "mt-[40vh]")}>
      {!isEmbedded && (
        <div className="scroll-space bg-background transition-colors duration-300" />
      )}
      <div
        className={cn(
          "animation-section relative shrink-0 overflow-hidden bg-background transition-colors duration-300",
          isEmbedded ? "h-[min(380px,70vh)]" : "h-screen",
        )}
      >
        <div
          className={cn(
            "footer-container pointer-events-none z-10",
            isEmbedded
              ? "absolute inset-x-0 bottom-0 h-full"
              : "fixed inset-x-0 bottom-0 h-screen",
          )}
        >
          <div
            className={cn(
              "svg-container pointer-events-none absolute inset-x-0 bottom-0 z-15 origin-bottom opacity-0 will-change-[transform,opacity,filter]",
              isEmbedded ? "h-full" : "h-screen",
            )}
          >
            <svg
              className="spectrum-svg size-full"
              viewBox="0 0 1567 584"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <g clipPath={`url(#${clipId})`} filter="url(#blur)">
                <path d="M1219 584H1393V184H1219V584Z" fill="url(#grad0)" />
                <path d="M1045 584H1219V104H1045V584Z" fill="url(#grad1)" />
                <path d="M348 584H174L174 184H348L348 584Z" fill="url(#grad2)" />
                <path d="M522 584H348L348 104H522L522 584Z" fill="url(#grad3)" />
                <path d="M697 584H522L522 54H697L697 584Z" fill="url(#grad4)" />
                <path d="M870 584H1045V54H870V584Z" fill="url(#grad5)" />
                <path d="M870 584H697L697 0H870L870 584Z" fill="url(#grad6)" />
                <path
                  d="M174 585H0.000183105L-3.75875e-06 295H174L174 585Z"
                  fill="url(#grad7)"
                />
                <path d="M1393 584H1567V294H1393V584Z" fill="url(#grad8)" />
              </g>
              <defs>
                <filter
                  id="blur"
                  x="-30"
                  y="-30"
                  width="1627"
                  height="644"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="15"
                    result="effect1_foregroundBlur"
                  />
                </filter>
                {Array.from({ length: 9 }, (_, i) => {
                  const coords: Record<
                    number,
                    { x1: string; y1: string; x2: string; y2: string }
                  > = {
                    0: { x1: "1306", y1: "584", x2: "1306", y2: "184" },
                    1: { x1: "1132", y1: "584", x2: "1132", y2: "104" },
                    2: { x1: "261", y1: "584", x2: "261", y2: "184" },
                    3: { x1: "435", y1: "584", x2: "435", y2: "104" },
                    4: { x1: "609.501", y1: "584", x2: "609.501", y2: "54" },
                    5: { x1: "957.5", y1: "584", x2: "957.5", y2: "54" },
                    6: { x1: "783.501", y1: "584", x2: "783.501", y2: "0" },
                    7: { x1: "87.0003", y1: "585", x2: "87.0003", y2: "295" },
                    8: { x1: "1480", y1: "584", x2: "1480", y2: "294" },
                  }
                  const c =
                    coords[i] ??
                    coords[0] ?? {
                      x1: "1306",
                      y1: "584",
                      x2: "1306",
                      y2: "184",
                    }

                  return (
                    <linearGradient
                      key={`grad${i}`}
                      id={`grad${i}`}
                      x1={c.x1}
                      y1={c.y1}
                      x2={c.x2}
                      y2={c.y2}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor={resolvedColors.gradient[0]} />
                      <stop
                        offset="0.182709"
                        stopColor={resolvedColors.gradient[1]}
                      />
                      <stop
                        offset="0.283673"
                        stopColor={resolvedColors.gradient[2]}
                      />
                      <stop
                        offset="0.413484"
                        stopColor={resolvedColors.gradient[3]}
                      />
                      <stop
                        offset="0.586565"
                        stopColor={resolvedColors.gradient[4]}
                      />
                      <stop
                        offset="0.682722"
                        stopColor={resolvedColors.gradient[5]}
                      />
                      <stop
                        offset="0.802892"
                        stopColor={resolvedColors.gradient[6]}
                      />
                      <stop
                        offset="1"
                        stopColor={resolvedColors.gradient[7]}
                        stopOpacity="0"
                      />
                    </linearGradient>
                  )
                })}
                <clipPath id={clipId}>
                  <rect width="1567" height="584" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div
            className="main-title pointer-events-none absolute bottom-1/2 left-1/2 z-20 -translate-x-1/2 translate-y-1/2 bg-transparent text-center font-serif text-foreground leading-[1.4] opacity-0 transition-colors duration-300"
            style={{ color: resolvedColors.text }}
          >
            {footerCopy}
          </div>
        </div>
      </div>
      {isEmbedded && (
        <div
          className="scroll-tail min-h-[min(120px,20vh)] shrink-0 bg-background transition-colors duration-300"
          aria-hidden
        />
      )}
    </div>
  )
}
