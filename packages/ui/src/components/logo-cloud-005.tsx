"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@workspace/ui/lib/utils"

export type LogoCloud005Item = {
  name: string
  est: string
  logo: React.ReactNode
}

export type LogoCloud005Row = LogoCloud005Item[]

export type LogoCloud005Props = {
  title?: string | string[]
  rows: LogoCloud005Row[]
  dimOpacity?: number
  className?: string
}

const MAX_ITEMS_PER_ROW = 4

function LogoCloud005Cell({
  item,
  cellId,
  hoveredId,
  onHover,
  dimOpacity,
}: {
  item: LogoCloud005Item
  cellId: string
  hoveredId: string | null
  onHover: (id: string | null) => void
  dimOpacity: number
}) {
  const isHovered = hoveredId === cellId
  const isDimmed = hoveredId !== null && !isHovered

  return (
    <button
      type="button"
      className={cn(
        "group relative flex aspect-[5/3] w-full items-center justify-center p-8 transition-[opacity,background-color] duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        isHovered && "bg-muted/50",
      )}
      style={{ opacity: isDimmed ? dimOpacity : 1 }}
      onMouseEnter={() => onHover(cellId)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(cellId)}
      onBlur={() => onHover(null)}
      aria-label={`${item.name}, established ${item.est.replace(/^EST\.\s*/i, "")}`}
    >
      <div
        className={cn(
          "flex max-h-10 max-w-[75%] items-center justify-center transition-[filter] duration-300 ease-out",
          "[&_img]:max-h-10 [&_img]:w-auto [&_svg]:max-h-10 [&_svg]:w-auto",
          isHovered ? "grayscale-0" : "grayscale",
        )}
      >
        {item.logo}
      </div>

      <AnimatePresence>
        {isHovered ? (
          <>
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute top-4 left-4 text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase"
            >
              {item.name}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute right-4 bottom-4 text-[10px] tracking-wide text-muted-foreground"
            >
              {item.est}
            </motion.span>
          </>
        ) : null}
      </AnimatePresence>
    </button>
  )
}

function LogoCloud005Title({ title }: { title: string | string[] }) {
  const lines = Array.isArray(title) ? title : [title]

  return (
    <header className="mb-10 max-w-2xl">
      {lines.map((line, index) => (
        <h2
          key={`${line}-${index}`}
          className={cn(
            "text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
            index === 0 ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {line}
        </h2>
      ))}
    </header>
  )
}

export function LogoCloud005({
  title,
  rows,
  dimOpacity = 0.45,
  className,
}: LogoCloud005Props) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)

  return (
    <section className={cn("w-full max-w-5xl", className)}>
      {title ? <LogoCloud005Title title={title} /> : null}

      <div className="overflow-hidden rounded-sm border border-border divide-y divide-border">
        {rows.map((row, rowIndex) => {
          const items = row.slice(0, MAX_ITEMS_PER_ROW)

          return (
            <div
              key={rowIndex}
              className="grid grid-cols-2 divide-x divide-border sm:grid-cols-4"
            >
              {items.map((item, itemIndex) => {
                const cellId = `${rowIndex}-${itemIndex}`

                return (
                  <LogoCloud005Cell
                    key={cellId}
                    item={item}
                    cellId={cellId}
                    hoveredId={hoveredId}
                    onHover={setHoveredId}
                    dimOpacity={dimOpacity}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </section>
  )
}
