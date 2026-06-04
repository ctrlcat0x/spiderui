"use client"

import { Badge } from "@workspace/ui/components/badge"

const COLOR_VARIANTS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "pink",
  "orange",
  "cyan",
  "indigo",
  "violet",
  "rose",
  "amber",
  "lime",
  "emerald",
  "sky",
  "slate",
  "fuchsia",
] as const

export function BadgeColorsPreview() {
  return (
    <div className="flex flex-wrap justify-center gap-2 p-4">
      {COLOR_VARIANTS.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </Badge>
      ))}
    </div>
  )
}
