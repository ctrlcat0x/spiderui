"use client"

import { useState } from "react"
import { Switch } from "@workspace/ui/components/switch"

export function SwitchPreview() {
  const [enabled, setEnabled] = useState(true)

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-8">
      <p className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        Touch me
      </p>
      <Switch
        checked={enabled}
        onCheckedChange={setEnabled}
        size="md"
        tone="neutral"
        aria-label="Toggle"
      />
    </div>
  )
}
