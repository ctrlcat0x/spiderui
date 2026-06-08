"use client"

import { useEffect, useId, useState } from "react"
import { motion, type Transition } from "motion/react"
import opentype from "opentype.js"
import { cn } from "@workspace/ui/lib/utils"

const PATH_VARIANTS = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
} as const

const DEFAULT_FONT_PATHS = [
  "/LastoriaBoldRegular.otf",
  "./LastoriaBoldRegular.otf",
] as const

export interface SignatureProps {
  text?: string
  /** Stroke and fill color. Omit to inherit `text-foreground` via `currentColor`. */
  color?: string
  fontSize?: number
  duration?: number
  delay?: number
  className?: string
  inView?: boolean
  once?: boolean
  fontUrl?: string
}

type SignatureGeometry = {
  paths: string[]
  width: number
  height: number
  maskStrokeWidth: number
}

type Bounds = {
  x1: number
  y1: number
  x2: number
  y2: number
}

function mergeBounds(target: Bounds, next: opentype.BoundingBox) {
  target.x1 = Math.min(target.x1, next.x1)
  target.y1 = Math.min(target.y1, next.y1)
  target.x2 = Math.max(target.x2, next.x2)
  target.y2 = Math.max(target.y2, next.y2)
}

async function loadFont(fontUrl?: string) {
  const candidates = fontUrl
    ? [fontUrl]
    : typeof window !== "undefined"
      ? [
          ...DEFAULT_FONT_PATHS,
          `${window.location.origin}/LastoriaBoldRegular.otf`,
          "https://spiderui.dev/LastoriaBoldRegular.otf",
        ]
      : [...DEFAULT_FONT_PATHS, "https://spiderui.dev/LastoriaBoldRegular.otf"]

  for (const path of candidates) {
    try {
      return await opentype.load(path)
    } catch {
      // try next path
    }
  }

  return null
}

function buildSignatureGeometry(
  text: string,
  fontSize: number,
  font: opentype.Font,
): SignatureGeometry {
  const scale = fontSize / font.unitsPerEm
  const maskStrokeWidth = Math.max(fontSize * 0.34, 6)
  const strokePad = maskStrokeWidth / 2
  const padX = fontSize * 0.12
  const padY = fontSize * 0.18
  const baseline = font.ascender * scale

  let x = 0
  const bounds: Bounds = {
    x1: Number.POSITIVE_INFINITY,
    y1: Number.POSITIVE_INFINITY,
    x2: Number.NEGATIVE_INFINITY,
    y2: Number.NEGATIVE_INFINITY,
  }

  for (const char of text) {
    const glyph = font.charToGlyph(char)
    mergeBounds(bounds, glyph.getPath(x, baseline, fontSize).getBoundingBox())
    x += (glyph.advanceWidth ?? font.unitsPerEm) * scale
  }

  const shiftX = padX + strokePad - bounds.x1
  const shiftY = padY + strokePad - bounds.y1

  let drawX = shiftX
  const paths: string[] = []

  for (const char of text) {
    const glyph = font.charToGlyph(char)
    paths.push(
      glyph.getPath(drawX, baseline + shiftY, fontSize).toPathData(3),
    )
    drawX += (glyph.advanceWidth ?? font.unitsPerEm) * scale
  }

  return {
    paths,
    width: bounds.x2 - bounds.x1 + padX * 2 + strokePad * 2,
    height: bounds.y2 - bounds.y1 + padY * 2 + strokePad * 2,
    maskStrokeWidth,
  }
}

function estimateGeometry(text: string, fontSize: number): SignatureGeometry {
  return {
    paths: [],
    width: text.length * fontSize * 0.65,
    height: fontSize * 1.6,
    maskStrokeWidth: Math.max(fontSize * 0.34, 6),
  }
}

function getPathTransition(
  index: number,
  delay: number,
  duration: number,
): Transition {
  const start = delay + index * 0.2

  return {
    pathLength: { delay: start, duration, ease: "easeInOut" },
    opacity: { delay: start + 0.01, duration: 0.01 },
  }
}

type MaskPathsProps = {
  paths: string[]
  delay: number
  duration: number
  strokeWidth: number
}

function MaskPaths({ paths, delay, duration, strokeWidth }: MaskPathsProps) {
  return (
    <>
      {paths.map((d, index) => (
        <motion.path
          key={index}
          d={d}
          stroke="white"
          strokeWidth={strokeWidth}
          fill="none"
          variants={PATH_VARIANTS}
          transition={getPathTransition(index, delay, duration)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </>
  )
}

export function Signature({
  text = "Signature",
  color,
  fontSize = 14,
  duration = 1.5,
  delay = 0,
  className,
  inView = false,
  once = true,
  fontUrl,
}: SignatureProps) {
  const maskId = `signature-reveal-${useId().replace(/:/g, "")}`
  const ink = color ?? "currentColor"
  const [geometry, setGeometry] = useState<SignatureGeometry>(() =>
    estimateGeometry(text, fontSize),
  )

  useEffect(() => {
    let cancelled = false

    async function loadGeometry() {
      const font = await loadFont(fontUrl)

      if (cancelled) {
        return
      }

      if (!font) {
        setGeometry(estimateGeometry(text, fontSize))
        return
      }

      setGeometry(buildSignatureGeometry(text, fontSize, font))
    }

    void loadGeometry()

    return () => {
      cancelled = true
    }
  }, [fontSize, fontUrl, text])

  const { paths, width, height, maskStrokeWidth } = geometry

  return (
    <motion.svg
      key={`${paths.length}-${width}-${height}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={cn("text-foreground overflow-visible", className)}
      initial="hidden"
      whileInView={inView ? "visible" : undefined}
      animate={inView ? undefined : "visible"}
      viewport={{ once }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <MaskPaths
            paths={paths}
            delay={delay}
            duration={duration}
            strokeWidth={maskStrokeWidth}
          />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        {paths.map((d, index) => (
          <path key={index} d={d} fill={ink} />
        ))}
      </g>
    </motion.svg>
  )
}
