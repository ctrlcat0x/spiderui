"use client"

import { VideoPlayer002 } from "@workspace/ui/components/video-player-002"
import {
  VIDEO_PLAYER_DEMO_SRC,
  VIDEO_PLAYER_DEMO_THUMBNAIL,
} from "@/lib/video-player-demo"
import { VideoPlayerPreviewShell } from "@/components/docs/previews/video-player-preview-shell"

export function VideoPlayer002Preview() {
  return (
    <VideoPlayerPreviewShell>
      <VideoPlayer002
        src={VIDEO_PLAYER_DEMO_SRC}
        thumbnailSrc={VIDEO_PLAYER_DEMO_THUMBNAIL}
        defaultVolume={0.8}
        ambientIntensity={0.85}
        className="w-full"
      />
    </VideoPlayerPreviewShell>
  )
}
