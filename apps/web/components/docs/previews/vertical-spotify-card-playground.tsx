"use client"

import { useState } from "react"
import { VerticalSpotifyCard } from "@workspace/ui/components/vertical-spotify-card"

const TRACKS = [
  "https://open.spotify.com/track/0DTSnA1bcVI5niJzoyBPyZ",
  "https://open.spotify.com/track/4iZ4pt7kvcaH6Yo8UoZ4s2",
  "https://open.spotify.com/track/2374M0fQpWi3dLnB54qaLX",
]

export function VerticalSpotifyCardPlayground() {
  const [index, setIndex] = useState(0)
  const trackUrl = TRACKS[Math.min(index, TRACKS.length - 1)] ?? TRACKS[0]!

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <VerticalSpotifyCard
        url={trackUrl}
        onPrev={index > 0 ? () => setIndex((i) => i - 1) : undefined}
        onNext={
          index < TRACKS.length - 1 ? () => setIndex((i) => i + 1) : undefined
        }
      />
    </div>
  )
}
