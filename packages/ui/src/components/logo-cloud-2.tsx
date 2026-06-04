"use client"

import React, { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@workspace/ui/lib/utils"

export interface LogoCloud2Item {
  name: string
  svg: React.ReactNode
}

export interface LogoCloud2Props {
  logos: LogoCloud2Item[]
  label?: string
  duration?: number
  className?: string
}

export function LogoCloud2({
  logos,
  label,
  duration = 2.5,
  className,
}: LogoCloud2Props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const groups = useMemo(() => {
    const result: LogoCloud2Item[][] = []
    for (let i = 0; i < logos.length; i += 3) {
      result.push(logos.slice(i, i + 3))
    }
    return result
  }, [logos])

  useEffect(() => {
    if (groups.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % groups.length)
    }, duration * 1000)

    return () => clearInterval(interval)
  }, [groups.length, duration])

  const currentGroup = groups[currentIndex] ?? []

  return (
    <section className={cn("py-12 w-full", className)}>
      {label ? (
        <p className="text-center text-muted-foreground text-sm tracking-widest uppercase font-light mb-8">
          {label}
        </p>
      ) : null}
      <div className="mx-auto max-w-5xl px-6">
        <div
          className={cn(
            "mx-auto grid max-w-2xl items-center gap-8",
            currentGroup.length === 1 && "grid-cols-1 place-items-center",
            currentGroup.length === 2 && "grid-cols-2",
            currentGroup.length >= 3 && "grid-cols-3",
          )}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {currentGroup.map((logo, i) => (
              <motion.div
                key={`${currentIndex}-${logo.name}`}
                className="flex flex-row items-center justify-center gap-2"
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 12, filter: "blur(6px)", scale: 0.5 }}
                transition={{
                  delay: i * 0.1,
                  duration: 1.5,
                  type: "spring",
                  bounce: 0.2,
                }}
              >
                {logo.svg}
                <span className="text-lg font-semibold text-foreground tracking-tight whitespace-nowrap">
                  {logo.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
