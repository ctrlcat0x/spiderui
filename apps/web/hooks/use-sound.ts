"use client"

import { useCallback, useRef, useState } from "react"
import { playSound } from "@/lib/sound-engine"
import type { SoundAsset, UseSoundOptions, UseSoundReturn } from "@/lib/sound-types"

export function useSound(
  sound: SoundAsset,
  options: UseSoundOptions = {}
): UseSoundReturn {
  const playbackRef = useRef<{ stop: () => void } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const optionsRef = useRef(options)
  optionsRef.current = options

  const stop = useCallback(() => {
    playbackRef.current?.stop()
    playbackRef.current = null
    setIsPlaying(false)
    optionsRef.current.onStop?.()
  }, [])

  const play = useCallback(
    async (overrides?: { volume?: number; playbackRate?: number }) => {
      const opts = optionsRef.current
      if (opts.soundEnabled === false) return

      if (opts.interrupt) {
        stop()
      }

      const volume = overrides?.volume ?? opts.volume ?? 1
      const playbackRate = overrides?.playbackRate ?? opts.playbackRate ?? 1

      opts.onPlay?.()
      setIsPlaying(true)

      const playback = await playSound(sound.dataUri, {
        volume,
        playbackRate,
        onEnd: () => {
          playbackRef.current = null
          setIsPlaying(false)
          opts.onEnd?.()
        },
      })
      playbackRef.current = playback
    },
    [sound.dataUri, stop]
  )

  const pause = useCallback(() => {
    stop()
    optionsRef.current.onPause?.()
  }, [stop])

  return [play, { stop, pause, isPlaying, duration: sound.duration, sound }] as const
}
