"use client"

import { useCallback } from "react"
import { clickSoftSound } from "@/lib/click-soft"
import { useSound } from "@/hooks/use-sound"

export function useClickSound() {
  const [play] = useSound(clickSoftSound, { volume: 0.45, interrupt: true })

  return useCallback(() => {
    play()
  }, [play])
}
