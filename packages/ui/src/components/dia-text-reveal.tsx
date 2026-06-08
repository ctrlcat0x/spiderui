"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type HTMLMotionProps,
} from "motion/react"

import { cn } from "@workspace/ui/lib/utils"

export const DIA_TEXT_REVEAL_DEFAULT_COLORS = [
  "#c679c4",
  "#fa3d1d",
  "#ffb005",
  "#e1e1fe",
  "#0358f7",
] as const

export const DIA_TEXT_REVEAL_COLOR_PRESETS = {
  dia: [...DIA_TEXT_REVEAL_DEFAULT_COLORS],
  warm: ["#fa3d1d", "#ffb005", "#fb7185", "#f97316"],
  cool: ["#0358f7", "#60a5fa", "#a78bfa", "#22d3ee"],
} as const

export type DiaTextRevealColorPreset = keyof typeof DIA_TEXT_REVEAL_COLOR_PRESETS

const BAND_HALF = 17
const SWEEP_START = -BAND_HALF
const SWEEP_END = 100 + BAND_HALF
const WIDTH_TRANSITION = { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }

const sweepEase = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2

function buildGradient(
  pos: number,
  colors: readonly string[],
  textColor: string,
) {
  const bandStart = pos - BAND_HALF
  const bandEnd = pos + BAND_HALF

  if (bandStart >= 100) {
    return `linear-gradient(90deg, ${textColor}, ${textColor})`
  }

  const stops: string[] = []

  if (bandStart > 0) {
    stops.push(`${textColor} 0%`, `${textColor} ${bandStart.toFixed(2)}%`)
  }

  const span = BAND_HALF * 2
  colors.forEach((color, index) => {
    const pct =
      colors.length === 1
        ? pos
        : bandStart + (index / (colors.length - 1)) * span
    stops.push(`${color} ${pct.toFixed(2)}%`)
  })

  if (bandEnd < 100) {
    stops.push(`transparent ${bandEnd.toFixed(2)}%`, "transparent 100%")
  }

  return `linear-gradient(90deg, ${stops.join(", ")})`
}

function measureTextWidths(element: HTMLElement, texts: string[]) {
  const parent = element.parentElement
  if (!parent) return []

  const probe = element.cloneNode(false) as HTMLElement
  probe.className = element.className
  Object.assign(probe.style, {
    position: "absolute",
    visibility: "hidden",
    pointerEvents: "none",
    width: "auto",
    whiteSpace: "nowrap",
  })
  parent.appendChild(probe)

  const widths = texts.map((value) => {
    probe.textContent = value
    return probe.getBoundingClientRect().width
  })

  probe.remove()
  return widths
}

const GRADIENT_TEXT_STYLE: CSSProperties = {
  transform: "translateY(-2px)",
  color: "transparent",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  backgroundSize: "100% 100%",
}

export interface DiaTextRevealProps
  extends Omit<
    HTMLMotionProps<"span">,
    "ref" | "children" | "style" | "animate" | "transition" | "color"
  > {
  text: string | string[]
  colors?: string[]
  textColor?: string
  duration?: number
  delay?: number
  repeat?: boolean
  repeatDelay?: number
  startOnView?: boolean
  once?: boolean
  className?: string
  fixedWidth?: boolean
}

export function DiaTextReveal({
  text,
  colors = [...DIA_TEXT_REVEAL_DEFAULT_COLORS],
  textColor = "var(--foreground)",
  duration = 1.5,
  delay = 0,
  repeat = false,
  repeatDelay = 0.5,
  startOnView = true,
  once = true,
  className,
  fixedWidth = false,
  ...props
}: DiaTextRevealProps) {
  const texts = useMemo(
    () => (Array.isArray(text) ? text : [text]),
    [Array.isArray(text) ? text.join("\0") : text],
  )
  const textsKey = texts.join("\0")
  const isMulti = texts.length > 1
  const prefersReducedMotion = useReducedMotion()

  const spanRef = useRef<HTMLSpanElement>(null)
  const textsRef = useRef(texts)
  const indexRef = useRef(0)
  const hasPlayedRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const stopAnimationRef = useRef<(() => void) | null>(null)

  textsRef.current = texts

  const [activeIndex, setActiveIndex] = useState(0)
  const [measuredWidths, setMeasuredWidths] = useState<number[]>([])

  const sweepPos = useMotionValue(SWEEP_START)
  const backgroundImage = useTransform(sweepPos, (pos) =>
    buildGradient(pos, colors, textColor),
  )
  const isInView = useInView(spanRef, { once, amount: 0.1 })

  const stopPlayback = useCallback(() => {
    stopAnimationRef.current?.()
    clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    const element = spanRef.current
    if (!element || !isMulti) {
      setMeasuredWidths([])
      return
    }
    setMeasuredWidths(measureTextWidths(element, texts))
  }, [isMulti, textsKey, texts])

  const runSweep = useCallback(() => {
    stopPlayback()
    sweepPos.set(SWEEP_START)

    const controls = animate(sweepPos, SWEEP_END, {
      duration,
      delay,
      ease: sweepEase,
      onComplete() {
        if (!repeat) return

        timerRef.current = setTimeout(() => {
          const nextTexts = textsRef.current
          indexRef.current = (indexRef.current + 1) % nextTexts.length
          setActiveIndex(indexRef.current)
          runSweep()
        }, repeatDelay * 1000)
      },
    })

    stopAnimationRef.current = () => controls.stop()
  }, [delay, duration, repeat, repeatDelay, stopPlayback, sweepPos])

  useEffect(() => {
    if (prefersReducedMotion) {
      sweepPos.set(SWEEP_END)
      return
    }

    if (startOnView && !isInView) return
    if (once && hasPlayedRef.current) return

    hasPlayedRef.current = true
    indexRef.current = 0
    setActiveIndex(0)
    runSweep()

    return stopPlayback
  }, [
    isInView,
    once,
    prefersReducedMotion,
    runSweep,
    startOnView,
    stopPlayback,
    sweepPos,
    textsKey,
  ])

  const layoutWidth =
    isMulti && measuredWidths.length > 0
      ? fixedWidth
        ? Math.max(...measuredWidths)
        : measuredWidths[activeIndex]
      : undefined

  return (
    <motion.span
      ref={spanRef}
      className={cn("align-bottom leading-[100%] text-inherit", className)}
      style={{
        ...GRADIENT_TEXT_STYLE,
        backgroundImage,
        ...(isMulti && {
          display: "inline-block",
          overflow: "hidden",
          whiteSpace: "nowrap",
          verticalAlign: "text-center",
          ...(layoutWidth != null && { width: layoutWidth }),
        }),
      }}
      animate={
        isMulti && !fixedWidth && layoutWidth != null
          ? { width: layoutWidth }
          : undefined
      }
      transition={WIDTH_TRANSITION}
      {...props}
    >
      {texts[activeIndex]}
    </motion.span>
  )
}
