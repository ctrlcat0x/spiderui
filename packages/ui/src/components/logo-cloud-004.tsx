"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

const KEYFRAMES = `
  @keyframes logo-cloud-004-marquee-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes logo-cloud-004-marquee-x-reverse { from { transform: translateX(-50%); } to { transform: translateX(0); } }
  @keyframes logo-cloud-004-marquee-y { from { transform: translateY(0); } to { transform: translateY(-50%); } }
  @keyframes logo-cloud-004-marquee-y-reverse { from { transform: translateY(-50%); } to { transform: translateY(0); } }
`

const ANIMATION_NAME: Record<string, string> = {
  left: "logo-cloud-004-marquee-x",
  right: "logo-cloud-004-marquee-x-reverse",
  up: "logo-cloud-004-marquee-y",
  down: "logo-cloud-004-marquee-y-reverse",
}

export interface MarqueeProps {
  children: React.ReactNode
  duration?: number
  pauseOnHover?: boolean
  direction?: "left" | "right" | "up" | "down"
  gap?: number
  fade?: boolean
  fadeAmount?: number
  className?: string
}

export function Marquee({
  children,
  className,
  duration = 20,
  pauseOnHover = false,
  direction = "left",
  gap = 32,
  fade = true,
  fadeAmount = 10,
  ...props
}: MarqueeProps & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  const [isPaused, setIsPaused] = React.useState(false)
  const isVertical = direction === "up" || direction === "down"
  const items = React.Children.toArray(children)

  const maskImage = fade
    ? isVertical
      ? `linear-gradient(to bottom, transparent 0%, black ${fadeAmount}%, black ${100 - fadeAmount}%, transparent 100%)`
      : `linear-gradient(to right, transparent 0%, black ${fadeAmount}%, black ${100 - fadeAmount}%, transparent 100%)`
    : undefined

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        className={cn(
          "flex w-full overflow-hidden",
          isVertical && "flex-col",
          className,
        )}
        style={
          maskImage ? { maskImage, WebkitMaskImage: maskImage } : undefined
        }
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        {...props}
      >
        <div
          className={cn("flex shrink-0", isVertical && "flex-col")}
          style={{
            gap: `${gap}px`,
            animationName: ANIMATION_NAME[direction],
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {items.map((item, i) => (
            <div
              key={`a-${i}`}
              className={cn("flex shrink-0", isVertical && "w-full")}
            >
              {item}
            </div>
          ))}
          {items.map((item, i) => (
            <div
              key={`b-${i}`}
              aria-hidden
              className={cn("flex shrink-0", isVertical && "w-full")}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export interface LogoCloud004Item {
  name: string
  svg: React.ReactNode
}

export interface LogoMarqueeProps {
  logos: LogoCloud004Item[]
  label?: string
  duration?: number
  gap?: number
  reverse?: boolean
  pauseOnHover?: boolean
  fade?: boolean
  fadeAmount?: number
  className?: string
}

export function LogoMarquee({
  logos,
  label,
  duration = 20,
  gap = 80,
  reverse = false,
  pauseOnHover = true,
  fade = true,
  fadeAmount = 10,
  className,
}: LogoMarqueeProps) {
  return (
    <section className={cn("overflow-hidden py-16 w-full", className)}>
      <div className="m-auto max-w-7xl px-6">
        {label ? (
          <div className="mb-8 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ) : null}
        <Marquee
          direction={reverse ? "right" : "left"}
          duration={duration}
          gap={gap}
          pauseOnHover={pauseOnHover}
          fade={fade}
          fadeAmount={fadeAmount}
        >
          {logos.map(({ name, svg }) => (
            <span key={name} aria-label={name} className="flex items-center">
              {svg}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
