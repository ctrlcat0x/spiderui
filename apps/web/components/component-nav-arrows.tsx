"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { docsConfig } from "@/config/docs"
import { cn } from "@/lib/utils"
import { useClickSound } from "@/hooks/use-click-sound"

const headerButtonClass =
  "inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-white/60 text-black/50 backdrop-blur-sm transition-all duration-150 hover:border-black/20 hover:bg-white/80 hover:text-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.96] dark:border-white/10 dark:bg-white/5 dark:text-white/40 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white/80"

const sidebarButtonClass =
  "inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.96] dark:text-zinc-400 dark:hover:text-zinc-100"

export function ComponentNavArrows({ variant = "header" }: { variant?: "header" | "sidebar" }) {
  const iconButtonClass = variant === "sidebar" ? sidebarButtonClass : headerButtonClass
  const pathname = usePathname()
  const playClick = useClickSound()

  const items = docsConfig.flatComponentNav
  const currentIndex = items.findIndex((item) => item.href === pathname)

  if (currentIndex === -1) return null

  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null

  const handleClick = () => {
    playClick()
  }

  return (
    <div className="flex shrink-0 items-center gap-0.5">
      {prevItem ? (
        <Link
          href={prevItem.href}
          onClick={handleClick}
          className={iconButtonClass}
          aria-label={`Previous: ${prevItem.title}`}
          title={prevItem.title}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className={cn(iconButtonClass, "pointer-events-none opacity-25")}
          aria-hidden
        >
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {nextItem ? (
        <Link
          href={nextItem.href}
          onClick={handleClick}
          className={iconButtonClass}
          aria-label={`Next: ${nextItem.title}`}
          title={nextItem.title}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className={cn(iconButtonClass, "pointer-events-none opacity-25")}
          aria-hidden
        >
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </div>
  )
}
