"use client"

import { useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import { PauseIcon, PlayIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@workspace/ui/lib/utils"
import {
  DEFAULT_VIDEO_PLAYER_SRC,
  useCursorFollower,
  useVideoPlayback,
  VideoPlayerFrame,
  VideoPlayerMediaProps,
  VideoThumbnailOverlay,
} from "@workspace/ui/components/video-player-shared"

const CURSOR_SPRING = { type: "spring" as const, stiffness: 520, damping: 36 }

export type VideoPlayer001Props = VideoPlayerMediaProps

function CursorPlayControl({
  x,
  y,
  isPlaying,
  onToggle,
}: {
  x: number
  y: number
  isPlaying: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      className="pointer-events-none absolute z-20"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={CURSOR_SPRING}
    >
      <motion.button
        type="button"
        aria-label={isPlaying ? "Pause video" : "Play video"}
        onClick={(event) => {
          event.stopPropagation()
          onToggle()
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={CURSOR_SPRING}
        className={cn(
          "pointer-events-auto flex size-12 -translate-x-1/2 translate-y-3 items-center justify-center rounded-full",
          "bg-background/90 text-foreground shadow-lg ring-1 ring-border/60 backdrop-blur-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isPlaying ? (
            <motion.span
              key="pause"
              initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 12 }}
              transition={{ duration: 0.18 }}
              className="inline-flex"
            >
              <HugeiconsIcon icon={PauseIcon} strokeWidth={2} className="size-5" />
            </motion.span>
          ) : (
            <motion.span
              key="play"
              initial={{ opacity: 0, scale: 0.7, rotate: 12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotate: -12 }}
              transition={{ duration: 0.18 }}
              className="inline-flex"
            >
              <HugeiconsIcon icon={PlayIcon} strokeWidth={2} className="size-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}

export function VideoPlayer001({
  src = DEFAULT_VIDEO_PLAYER_SRC,
  thumbnailSrc,
  defaultVolume = 1,
  ambientIntensity = 0,
  className,
}: VideoPlayer001Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    videoRef,
    isPlaying,
    togglePlayback,
    syncPlayingState,
    handleTimeUpdate,
    handleLoadedMetadata,
  } = useVideoPlayback({ defaultVolume })

  const {
    cursor,
    isHovering,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
  } = useCursorFollower(containerRef)

  const showThumbnail = Boolean(thumbnailSrc) && !isPlaying

  return (
    <VideoPlayerFrame
      videoRef={videoRef}
      thumbnailSrc={thumbnailSrc}
      useThumbnailAmbient={showThumbnail}
      ambientIntensity={ambientIntensity}
      className={className}
    >
      <div
        ref={containerRef}
        role="button"
        tabIndex={0}
        aria-label={isPlaying ? "Pause video" : "Play video"}
        onClick={() => {
          void togglePlayback()
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            void togglePlayback()
          }
        }}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className="relative size-full cursor-pointer"
      >
      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={syncPlayingState}
        onPause={syncPlayingState}
        onEnded={syncPlayingState}
        className="pointer-events-none absolute inset-0 size-full object-cover"
      />

      {thumbnailSrc ? (
        <VideoThumbnailOverlay
          thumbnailSrc={thumbnailSrc}
          visible={showThumbnail}
        />
      ) : null}

      <AnimatePresence>
        {isHovering ? (
          <CursorPlayControl
            key="cursor-control"
            x={cursor.x}
            y={cursor.y}
            isPlaying={isPlaying}
            onToggle={togglePlayback}
          />
        ) : null}
      </AnimatePresence>
      </div>
    </VideoPlayerFrame>
  )
}
