"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ImgHTMLAttributes,
  type ReactNode,
} from "react"
import { cn } from "@workspace/ui/lib/utils"

function preloadImages(sources: string[]) {
  return Promise.all(
    sources.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new Image()
          image.onload = () => resolve()
          image.onerror = () => resolve()
          image.src = src
        }),
    ),
  )
}

export interface Image2GifProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  images: string[]
  interval?: number
  loop?: boolean
  onComplete?: () => void
  renderImage?: (src: string, index: number) => ReactNode
  renderLoading?: () => ReactNode
}

export function Image2Gif({
  images,
  interval = 500,
  loop = true,
  onComplete,
  renderImage,
  renderLoading,
  className,
  alt = "Frame sequence",
  ...props
}: Image2GifProps) {
  const [index, setIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const frames = useMemo(() => images.filter(Boolean), [images])
  const currentSrc = frames[index]

  useEffect(() => {
    setIndex(0)
    setReady(false)
    if (frames.length === 0) return

    let cancelled = false
    void preloadImages(frames).then(() => {
      if (!cancelled) setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [frames])

  useEffect(() => {
    if (!ready || frames.length <= 1) return

    const timer = window.setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1
        if (next < frames.length) return next
        if (loop) return 0
        onCompleteRef.current?.()
        return prev
      })
    }, interval)

    return () => window.clearInterval(timer)
  }, [ready, frames.length, interval, loop])

  if (frames.length === 0) {
    return (
      <p className="text-sm text-destructive" role="alert">
        No images provided.
      </p>
    )
  }

  if (!ready) {
    return (
      renderLoading?.() ?? (
        <div
          className={cn(
            "h-full w-full animate-pulse rounded-xl bg-gradient-to-r from-muted to-muted/60",
            className,
          )}
        />
      )
    )
  }

  if (renderImage && currentSrc) {
    return <>{renderImage(currentSrc, index)}</>
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      {...props}
    />
  )
}

export const DEFAULT_IMAGE2GIF_FRAMES = [
  "https://cdn.cosmos.so/ef24a640-42da-4133-96a0-4572d2b0ccbe?format=webp",
  "https://cdn.cosmos.so/a0c031cd-fb8e-4b24-8d28-b22c82f8d45b?format=webp&w=400",
  "https://cdn.cosmos.so/2bb3d2a5-282b-4d56-aa07-26f37db500e6?format=webp&w=400",
  "https://cdn.cosmos.so/2ca26f41-477f-491d-943f-e795434dbaa5?format=webp&w=400",
  "https://cdn.cosmos.so/6d05ef91-722e-4fcc-83c5-765e348ec644?format=webp&w=400",
  "https://cdn.cosmos.so/b519df17-b76c-4bf3-9a2a-75af2d4ef68e?format=webp&w=400",
  "https://cdn.cosmos.so/f3624768-7629-4fb9-8f36-a4d00b306abc?format=webp&w=400",
  "https://cdn.cosmos.so/7a82b55b-90ec-4ce0-80d4-32b87c658e7d?format=webp&w=400",
]
