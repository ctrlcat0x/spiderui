"use client"

import {
  OposHover,
  type QuoteWordItem,
} from "@workspace/ui/components/opos-hover"
import { PREVIEW_TRAIL_IMAGES } from "@/components/docs/previews/image-trail-playground"

const QUOTE_WORDS = ["SHOW", "ME", "THE", "MONEY"] as const

const PREVIEW_ITEMS: QuoteWordItem[] = QUOTE_WORDS.map((word, index) => ({
  id: index + 1,
  name: word,
  image: PREVIEW_TRAIL_IMAGES[index] ?? PREVIEW_TRAIL_IMAGES[0]!,
}))

export function OposHoverPreview() {
  return (
    <div className="relative h-full min-h-[640px] w-full overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-950">
      <OposHover
        items={PREVIEW_ITEMS}
        className="min-h-[640px] bg-transparent p-6"
        titleClassName="text-[clamp(3.5rem,16vw,12rem)]"
      />
    </div>
  )
}

export function OposHoverDemo() {
  return <OposHoverPreview />
}
