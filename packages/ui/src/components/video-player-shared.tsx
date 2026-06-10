"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@workspace/ui/lib/utils"

export const DEFAULT_VIDEO_PLAYER_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

export const DEFAULT_VIDEO_PLAYER_THUMBNAIL =
  "https://cdn.cosmos.so/ef24a640-42da-4133-96a0-4572d2b0ccbe?format=webp&w=1200"

export type VideoPlayerMediaProps = {
  src?: string
  thumbnailSrc?: string
  defaultVolume?: number
  ambientIntensity?: number
  className?: string
}

const AMBIENT_CANVAS_WIDTH = 64
const AMBIENT_CANVAS_HEIGHT = 36
const AMBIENT_BLUR_PX = 60
const AMBIENT_MAX_OPACITY = 0.85
const AMBIENT_SCALE = 1.08

function clampAmbientIntensity(value: number) {
  return Math.max(0, Math.min(1, value))
}

export function VideoAmbientGlow({
  videoRef,
  thumbnailSrc,
  useThumbnail,
  ambientIntensity,
}: {
  videoRef: RefObject<HTMLVideoElement | null>
  thumbnailSrc?: string
  useThumbnail: boolean
  ambientIntensity: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const thumbnailImageRef = useRef<HTMLImageElement | null>(null)
  const rafRef = useRef(0)
  const intensity = clampAmbientIntensity(ambientIntensity)

  useEffect(() => {
    if (!thumbnailSrc) {
      thumbnailImageRef.current = null
      return
    }

    const image = new Image()
    image.crossOrigin = "anonymous"
    image.decoding = "async"
    image.src = thumbnailSrc

    const handleLoad = () => {
      thumbnailImageRef.current = image
    }

    image.addEventListener("load", handleLoad)
    if (image.complete) handleLoad()

    return () => {
      image.removeEventListener("load", handleLoad)
      thumbnailImageRef.current = null
    }
  }, [thumbnailSrc])

  useEffect(() => {
    if (intensity <= 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      const thumbnail = thumbnailImageRef.current

      if (useThumbnail && thumbnail) {
        try {
          ctx.drawImage(
            thumbnail,
            0,
            0,
            AMBIENT_CANVAS_WIDTH,
            AMBIENT_CANVAS_HEIGHT,
          )
        } catch {
          // Cross-origin poster cannot be sampled.
        }
      } else {
        const video = videoRef.current
        if (video && (!video.paused || video.readyState >= 2)) {
          try {
            ctx.drawImage(
              video,
              0,
              0,
              AMBIENT_CANVAS_WIDTH,
              AMBIENT_CANVAS_HEIGHT,
            )
          } catch {
            // Cross-origin frames cannot be sampled.
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [intensity, useThumbnail, videoRef])

  if (intensity <= 0) return null

  return (
    <canvas
      ref={canvasRef}
      width={AMBIENT_CANVAS_WIDTH}
      height={AMBIENT_CANVAS_HEIGHT}
      aria-hidden
      className="pointer-events-none absolute rounded-sm"
      style={{
        inset: 0,
        width: "100%",
        height: "100%",
        filter: `blur(${AMBIENT_BLUR_PX}px)`,
        opacity: intensity * AMBIENT_MAX_OPACITY,
        transform: `scale(${AMBIENT_SCALE})`,
        zIndex: 0,
      }}
    />
  )
}

export function VideoPlayerFrame({
  videoRef,
  thumbnailSrc,
  useThumbnailAmbient = false,
  ambientIntensity = 0,
  className,
  children,
}: {
  videoRef: RefObject<HTMLVideoElement | null>
  thumbnailSrc?: string
  useThumbnailAmbient?: boolean
  ambientIntensity?: number
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <VideoAmbientGlow
        videoRef={videoRef}
        thumbnailSrc={thumbnailSrc}
        useThumbnail={useThumbnailAmbient}
        ambientIntensity={ambientIntensity}
      />
      <div className="relative z-[1] aspect-video w-full overflow-hidden rounded-sm bg-muted">
        {children}
      </div>
    </div>
  )
}

const THUMBNAIL_TRANSITION = {
  duration: 0.45,
  ease: [0.4, 0, 0.2, 1] as const,
}

export function VideoThumbnailOverlay({
  thumbnailSrc,
  visible,
  className,
}: {
  thumbnailSrc: string
  visible: boolean
  className?: string
}) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        filter:
          reducedMotion || visible
            ? "blur(0px)"
            : "blur(16px)",
      }}
      transition={THUMBNAIL_TRANSITION}
      className={cn(
        "pointer-events-none absolute inset-0 z-10 overflow-hidden",
        !visible && "pointer-events-none",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnailSrc}
        alt=""
        className="size-full object-cover"
        draggable={false}
      />
    </motion.div>
  )
}

export function useVideoPlayback({
  defaultVolume = 1,
}: {
  defaultVolume?: number
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(defaultVolume)
  const isScrubbingRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.volume = volume
  }, [volume])

  const syncPlayingState = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setIsPlaying(!video.paused && !video.ended)
  }, [])

  const play = useCallback(async () => {
    const video = videoRef.current
    if (!video) return
    try {
      await video.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }, [])

  const pause = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    setIsPlaying(false)
  }, [])

  const togglePlayback = useCallback(async () => {
    if (isPlaying) {
      pause()
      return
    }
    await play()
  }, [isPlaying, pause, play])

  const seek = useCallback((time: number) => {
    const video = videoRef.current
    if (!video || !Number.isFinite(time)) return
    const clamped = Math.max(0, Math.min(time, video.duration || 0))
    video.currentTime = clamped
    setCurrentTime(clamped)
  }, [])

  const handleTimeUpdate = useCallback(() => {
    if (isScrubbingRef.current) return
    const video = videoRef.current
    if (!video) return
    setCurrentTime(video.currentTime)
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setDuration(video.duration)
    setCurrentTime(video.currentTime)
  }, [])

  const handleProgressChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextTime = Number(event.target.value)
      seek(nextTime)
    },
    [seek],
  )

  const handleProgressPointerDown = useCallback(() => {
    isScrubbingRef.current = true
  }, [])

  const handleProgressPointerUp = useCallback(() => {
    isScrubbingRef.current = false
    const video = videoRef.current
    if (!video) return
    setCurrentTime(video.currentTime)
  }, [])

  const handleVolumeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextVolume = Number(event.target.value)
      setVolume(nextVolume)
    },
    [],
  )

  return {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    togglePlayback,
    seek,
    syncPlayingState,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleProgressChange,
    handleProgressPointerDown,
    handleProgressPointerUp,
    handleVolumeChange,
  }
}

export function useCursorFollower(containerRef: RefObject<HTMLElement | null>) {
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      setCursor({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
    },
    [containerRef],
  )

  const handlePointerEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handlePointerLeave = useCallback(() => {
    setIsHovering(false)
  }, [])

  return {
    cursor,
    isHovering,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
  }
}

export const videoRangeClassName =
  "h-1 w-full cursor-pointer appearance-none rounded-full bg-white/25 accent-white [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"

export const videoVolumeRangeClassName =
  "h-1 w-24 cursor-pointer appearance-none rounded-full bg-white/25 accent-white [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
