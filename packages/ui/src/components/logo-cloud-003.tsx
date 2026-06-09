"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

const KEYFRAMES = `
  @keyframes logo-cloud-003-enter {
    from { transform: translateY(32px); filter: blur(4px); opacity: 0; }
    to   { transform: translateY(0);    filter: blur(0px); opacity: 1; }
  }
  @keyframes logo-cloud-003-exit {
    from { transform: translateY(0);     filter: blur(0px); opacity: 1; }
    to   { transform: translateY(-32px); filter: blur(4px); opacity: 0; }
  }
`

export interface LogoCloud003Item {
  name: string
  svg: React.ReactNode
}

export interface LogosCarouselProps {
  logos: LogoCloud003Item[]
  count?: number
  stagger?: number
  duration?: number
  interval?: number
  initialDelay?: number
  className?: string
  label?: string
}

export function LogosCarousel({
  logos,
  count = 4,
  stagger = 0.1,
  duration = 500,
  interval = 2500,
  initialDelay = 800,
  className,
  label,
}: LogosCarouselProps) {
  const [groupIndex, setGroupIndex] = React.useState(0)
  const [active, setActive] = React.useState(false)

  const groups = React.useMemo<LogoCloud003Item[][]>(() => {
    const result: LogoCloud003Item[][] = []
    for (let i = 0; i < logos.length; i += count) {
      result.push(logos.slice(i, i + count))
    }
    return result
  }, [logos, count])

  const groupCount = groups.length
  const nextIndex = (groupIndex + 1) % groupCount

  React.useEffect(() => {
    const t = setTimeout(() => setActive(true), initialDelay)
    return () => clearTimeout(t)
  }, [initialDelay])

  React.useEffect(() => {
    if (!active || groupCount < 2) return

    const id = setInterval(
      () => setGroupIndex((prev) => (prev + 1) % groupCount),
      interval,
    )

    return () => clearInterval(id)
  }, [active, interval, groupCount])

  if (groupCount === 0) return null

  return (
    <section className={cn("py-16 w-full", className)}>
      <div className="m-auto max-w-7xl px-6">
        {label ? (
          <p className="mb-8 text-center text-sm text-muted-foreground">
            {label}
          </p>
        ) : null}
        <style>{KEYFRAMES}</style>
        <div className="grid w-full place-items-center">
          {groups.map((group, gi) => {
            const isCurrent = gi === groupIndex
            const isNext = active && gi === nextIndex
            const visible = isCurrent || isNext

            return (
              <div
                key={gi}
                className="flex w-full justify-center gap-10"
                style={{
                  gridArea: "1 / 1",
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
                {group.map((logo, li) => (
                  <AnimatedLogo
                    key={`${gi}-${logo.name}`}
                    animate={active && visible}
                    state={isCurrent ? "exit" : "enter"}
                    index={li}
                    stagger={stagger}
                    duration={duration}
                  >
                    <span aria-label={logo.name} className="flex items-center">
                      {logo.svg}
                    </span>
                  </AnimatedLogo>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

type AnimatedLogoProps = {
  children: React.ReactNode
  animate: boolean
  state: "enter" | "exit"
  index: number
  stagger: number
  duration: number
}

function AnimatedLogo({
  children,
  animate,
  state,
  index,
  stagger,
  duration,
}: AnimatedLogoProps) {
  const style: React.CSSProperties = animate
    ? {
        animationName:
          state === "enter" ? "logo-cloud-003-enter" : "logo-cloud-003-exit",
        animationDelay: `${index * stagger}s`,
        animationDuration: `${duration}ms`,
        animationFillMode: "both",
        animationTimingFunction: "ease",
      }
    : { opacity: state === "exit" ? 1 : 0 }

  return <div style={style}>{children}</div>
}
