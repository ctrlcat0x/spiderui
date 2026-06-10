"use client"

import type { ChangeEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  PauseIcon,
  PlayIcon,
  VolumeHighIcon,
  VolumeMute01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@workspace/ui/lib/utils"
import {
  DEFAULT_VIDEO_PLAYER_SRC,
  useVideoPlayback,
  videoRangeClassName,
  videoVolumeRangeClassName,
  VideoPlayerFrame,
  VideoPlayerMediaProps,
  VideoThumbnailOverlay,
} from "@workspace/ui/components/video-player-shared"

const CONTROL_SPRING = { type: "spring" as const, stiffness: 420, damping: 32 }

export type VideoPlayer002Props = VideoPlayerMediaProps

function CenterPlayButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      aria-label="Play video"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      transition={CONTROL_SPRING}
      className={cn(
        "absolute left-1/2 top-1/2 z-20 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
        "bg-background/90 text-foreground shadow-lg ring-1 ring-border/60 backdrop-blur-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <HugeiconsIcon icon={PlayIcon} strokeWidth={2} className="size-7" />
    </motion.button>
  )
}

function PlaybackControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  onToggle,
  onProgressChange,
  onProgressPointerDown,
  onProgressPointerUp,
  onVolumeChange,
}: {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  onToggle: () => void
  onProgressChange: (event: ChangeEvent<HTMLInputElement>) => void
  onProgressPointerDown: () => void
  onProgressPointerUp: () => void
  onVolumeChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  const progressMax = duration > 0 ? duration : 100

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={CONTROL_SPRING}
      className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 bg-gradient-to-t from-black/75 via-black/45 to-transparent px-4 pb-4 pt-12"
    >
      <motion.button
        type="button"
        aria-label={isPlaying ? "Pause video" : "Play video"}
        onClick={onToggle}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={CONTROL_SPRING}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <HugeiconsIcon
          icon={isPlaying ? PauseIcon : PlayIcon}
          strokeWidth={2}
          className="size-5"
        />
      </motion.button>

      <input
        type="range"
        min={0}
        max={progressMax}
        step={0.1}
        value={currentTime}
        onChange={onProgressChange}
        onPointerDown={onProgressPointerDown}
        onPointerUp={onProgressPointerUp}
        aria-label="Video progress"
        className={videoRangeClassName}
      />

      <div className="flex shrink-0 items-center gap-2">
        <HugeiconsIcon
          icon={volume > 0 ? VolumeHighIcon : VolumeMute01Icon}
          strokeWidth={2}
          className="size-4 text-white"
          aria-hidden
        />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={onVolumeChange}
          aria-label="Volume"
          className={videoVolumeRangeClassName}
        />
      </div>
    </motion.div>
  )
}

export function VideoPlayer002({
  src = DEFAULT_VIDEO_PLAYER_SRC,
  thumbnailSrc,
  defaultVolume = 1,
  ambientIntensity = 0,
  className,
}: VideoPlayer002Props) {
  const {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayback,
    play,
    syncPlayingState,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleProgressChange,
    handleProgressPointerDown,
    handleProgressPointerUp,
    handleVolumeChange,
  } = useVideoPlayback({ defaultVolume })

  const showThumbnail = Boolean(thumbnailSrc) && !isPlaying

  return (
    <VideoPlayerFrame
      videoRef={videoRef}
      thumbnailSrc={thumbnailSrc}
      useThumbnailAmbient={showThumbnail}
      ambientIntensity={ambientIntensity}
      className={className}
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
        className="absolute inset-0 size-full object-cover"
      />

      {thumbnailSrc ? (
        <VideoThumbnailOverlay
          thumbnailSrc={thumbnailSrc}
          visible={showThumbnail}
        />
      ) : null}

      <AnimatePresence>
        {!isPlaying ? (
          <CenterPlayButton key="center-play" onClick={play} />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isPlaying ? (
          <PlaybackControls
            key="playback-controls"
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            onToggle={togglePlayback}
            onProgressChange={handleProgressChange}
            onProgressPointerDown={handleProgressPointerDown}
            onProgressPointerUp={handleProgressPointerUp}
            onVolumeChange={handleVolumeChange}
          />
        ) : null}
      </AnimatePresence>
    </VideoPlayerFrame>
  )
}
