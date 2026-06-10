"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@workspace/ui/lib/utils"

export type LogoCloud006Item = {
  name: string
  logo: React.ReactNode
  href?: string
  caseStudyLabel?: string
}

export type LogoCloud006Row = LogoCloud006Item[]

export type LogoCloud006Props = {
  title?: string | string[]
  rows: LogoCloud006Row[]
  className?: string
}

const MAX_ITEMS_PER_ROW = 4
const DEFAULT_CASE_STUDY_LABEL = "View case study"

function LogoCloud006Title({ title }: { title: string | string[] }) {
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

function LogoCloud006Cell({
  item,
  cellId,
  hoveredId,
  onHover,
}: {
  item: LogoCloud006Item
  cellId: string
  hoveredId: string | null
  onHover: (id: string | null) => void
}) {
  const isHovered = hoveredId === cellId
  const label = item.caseStudyLabel ?? DEFAULT_CASE_STUDY_LABEL
  const content = (
  <>
    <AnimatePresence mode="wait">
      {isHovered ? (
        <motion.span
          key="case-study"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-medium text-primary"
        >
          {label} &gt;
        </motion.span>
      ) : (
        <motion.div
          key="logo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex max-h-8 max-w-[70%] items-center justify-center [&_img]:max-h-8 [&_img]:w-auto [&_svg]:max-h-8 [&_svg]:w-auto"
        >
          {item.logo}
        </motion.div>
      )}
    </AnimatePresence>
  </>
  )

  const sharedClassName = cn(
    "group relative flex aspect-[5/3] w-full items-center justify-center p-8 transition-colors duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
    isHovered && "bg-muted/50",
  )

  if (item.href) {
    return (
      <a
        href={item.href}
        className={sharedClassName}
        onMouseEnter={() => onHover(cellId)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(cellId)}
        onBlur={() => onHover(null)}
        aria-label={`${item.name} case study`}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={sharedClassName}
      onMouseEnter={() => onHover(cellId)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(cellId)}
      onBlur={() => onHover(null)}
      aria-label={`${item.name} case study`}
    >
      {content}
    </button>
  )
}

export function LogoCloud006({
  title,
  rows,
  className,
}: LogoCloud006Props) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)

  return (
    <section className={cn("w-full max-w-6xl", className)}>
      {title ? <LogoCloud006Title title={title} /> : null}

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
                  <LogoCloud006Cell
                    key={cellId}
                    item={item}
                    cellId={cellId}
                    hoveredId={hoveredId}
                    onHover={setHoveredId}
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
