"use client"

import { Badge } from "@workspace/ui/components/badge"

const SEMANTIC_VARIANTS = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
  "link",
] as const

export function BadgePreview() {
  return (
    <div className="flex flex-wrap justify-center gap-2 p-4">
      {SEMANTIC_VARIANTS.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </Badge>
      ))}
    </div>
  )
}
