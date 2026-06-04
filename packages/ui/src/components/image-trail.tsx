"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

export type BlindDirection = "vertical" | "horizontal"

export const IMAGE_TRAIL_DEFAULTS = {
  imageLifespan: 1000,
  minDistance: 45,
  revealDuration: 450,
  fadeDuration: 350,
  staggerDelay: 30,
  lerpFactor: 0.08,
  ease: "cubic-bezier(0.25, 1, 0.5, 1)",
  maxItems: 8,
  slicesCount: 10,
  itemWidth: 300,
  itemHeight: 400,
  desktopMinWidth: 0,
  blindDirection: "vertical" as BlindDirection,
} as const

export type ImageTrailTiming = {
  imageLifespan?: number
  minDistance?: number
  revealDuration?: number
  fadeDuration?: number
  staggerDelay?: number
  ease?: string
  lerpFactor?: number
}

export const DEFAULT_TRAIL_IMAGES = Array.from(
  { length: 20 },
  (_, i) => `/trail-images/${i + 1}.jpg`,
)

const REVEALED_CLIP = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"

const collapsedClip = (direction: BlindDirection) =>
  direction === "vertical"
    ? "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)"
    : "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)"

type ActiveImage = {
  element: HTMLDivElement
  slices: HTMLDivElement[]
  spawnTime: number
}

export interface ImageTrailProps {
  images?: string[]
  imageLifespan?: number
  minDistance?: number
  revealDuration?: number
  fadeDuration?: number
  staggerDelay?: number
  lerpFactor?: number
  ease?: string
  maxItems?: number
  slicesCount?: number
  blindDirection?: BlindDirection
  itemWidth?: number
  itemHeight?: number
  desktopMinWidth?: number
  timing?: ImageTrailTiming
  backgroundImage?: string
  backgroundClassName?: string
  className?: string
  children?: ReactNode
}

const lerp = (start: number, end: number, amount: number) =>
  (1 - amount) * start + amount * end

const getDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.hypot(x2 - x1, y2 - y1)

export function ImageTrail({
  images = DEFAULT_TRAIL_IMAGES,
  imageLifespan = IMAGE_TRAIL_DEFAULTS.imageLifespan,
  minDistance = IMAGE_TRAIL_DEFAULTS.minDistance,
  revealDuration = IMAGE_TRAIL_DEFAULTS.revealDuration,
  fadeDuration = IMAGE_TRAIL_DEFAULTS.fadeDuration,
  staggerDelay = IMAGE_TRAIL_DEFAULTS.staggerDelay,
  lerpFactor = IMAGE_TRAIL_DEFAULTS.lerpFactor,
  ease = IMAGE_TRAIL_DEFAULTS.ease,
  maxItems = IMAGE_TRAIL_DEFAULTS.maxItems,
  slicesCount = IMAGE_TRAIL_DEFAULTS.slicesCount,
  blindDirection = IMAGE_TRAIL_DEFAULTS.blindDirection,
  itemWidth = IMAGE_TRAIL_DEFAULTS.itemWidth,
  itemHeight = IMAGE_TRAIL_DEFAULTS.itemHeight,
  desktopMinWidth = IMAGE_TRAIL_DEFAULTS.desktopMinWidth,
  timing,
  backgroundImage,
  backgroundClassName,
  className,
  children,
}: ImageTrailProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const config = {
    imageLifespan: timing?.imageLifespan ?? imageLifespan,
    minDistance: timing?.minDistance ?? minDistance,
    revealDuration: timing?.revealDuration ?? revealDuration,
    fadeDuration: timing?.fadeDuration ?? fadeDuration,
    staggerDelay: timing?.staggerDelay ?? staggerDelay,
    lerpFactor: timing?.lerpFactor ?? lerpFactor,
    ease: timing?.ease ?? ease,
  }

  useEffect(() => {
    const root = rootRef.current
    const container = containerRef.current
    if (!root || !container || images.length === 0) return

    images.forEach((src) => {
      const img = new Image()
      img.decoding = "async"
      img.src = src
    })

    let currentImageIndex = 0
    let zIndexCounter = 1
    const activeTrailImages: ActiveImage[] = []
    let animationFrameId: number | null = null
    let pointerMoveHandler: ((event: PointerEvent) => void) | null = null
    const timeoutIds: number[] = []

    const mouse = { x: 0, y: 0 }
    const interpolatedMouse = { x: 0, y: 0 }
    const lastSpawnMouse = { x: 0, y: 0 }
    let hasPointer = false

    const schedule = (fn: () => void, delayMs: number) => {
      const id = window.setTimeout(fn, delayMs)
      timeoutIds.push(id)
    }

    const shouldRun = () => {
      const rect = container.getBoundingClientRect()
      if (rect.width < 80 || rect.height < 80) return false
      if (desktopMinWidth > 0 && window.innerWidth < desktopMinWidth) return false
      return true
    }

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect()
      mouse.x = clientX
      mouse.y = clientY

      if (!hasPointer) {
        interpolatedMouse.x = clientX
        interpolatedMouse.y = clientY
        lastSpawnMouse.x = clientX - rect.left
        lastSpawnMouse.y = clientY - rect.top
        hasPointer = true
      }
    }

    const dismissTrailImage = (item: ActiveImage) => {
      const collapseClip = collapsedClip(blindDirection)

      item.slices.forEach((slice, idx) => {
        const centerDist = Math.abs(idx - slicesCount / 2)
        const delay =
          (slicesCount / 2 - centerDist) * (config.staggerDelay * 0.4)

        schedule(() => {
          slice.style.clipPath = collapseClip
          const innerImg = slice.querySelector<HTMLDivElement>(".image-layer")
          if (innerImg) innerImg.style.opacity = "0"
        }, delay)
      })

      schedule(() => {
        if (container.contains(item.element)) {
          container.removeChild(item.element)
        }
      }, config.revealDuration + slicesCount * config.staggerDelay)
    }

    const trimExcessItems = () => {
      while (activeTrailImages.length >= maxItems) {
        const oldest = activeTrailImages.shift()
        if (oldest) dismissTrailImage(oldest)
      }
    }

    const createMaskSlice = (
      trailItem: HTMLDivElement,
      imgUrl: string,
      index: number,
    ) => {
      const maskLayer = document.createElement("div")
      const slicePercent = (index / slicesCount) * 100
      const sliceSizePercent = 100 / slicesCount
      const collapseClip = collapsedClip(blindDirection)

      maskLayer.style.position = "absolute"
      maskLayer.style.overflow = "hidden"
      maskLayer.style.willChange = "clip-path"
      maskLayer.style.clipPath = collapseClip
      maskLayer.style.transition = `clip-path ${config.revealDuration}ms ${config.ease}`

      const imageLayer = document.createElement("div")
      imageLayer.className = "image-layer"
      imageLayer.style.position = "absolute"
      imageLayer.style.backgroundImage = `url("${imgUrl}")`
      imageLayer.style.backgroundRepeat = "no-repeat"
      imageLayer.style.backgroundSize = `${itemWidth}px ${itemHeight}px`
      imageLayer.style.transition = `opacity ${config.fadeDuration}ms ${config.ease}`
      imageLayer.style.willChange = "opacity"

      if (blindDirection === "vertical") {
        maskLayer.style.top = "0"
        maskLayer.style.height = "100%"
        maskLayer.style.left = `${slicePercent}%`
        maskLayer.style.width = `${sliceSizePercent}%`
        imageLayer.style.top = "0"
        imageLayer.style.height = "100%"
        imageLayer.style.width = `${itemWidth}px`
        imageLayer.style.backgroundPosition = "0 center"
        imageLayer.style.left = `-${(slicePercent / 100) * itemWidth}px`
      } else {
        maskLayer.style.left = "0"
        maskLayer.style.width = "100%"
        maskLayer.style.top = `${slicePercent}%`
        maskLayer.style.height = `${sliceSizePercent}%`
        imageLayer.style.left = "0"
        imageLayer.style.width = "100%"
        imageLayer.style.height = `${itemHeight}px`
        imageLayer.style.backgroundPosition = "center 0"
        imageLayer.style.top = `-${(slicePercent / 100) * itemHeight}px`
      }

      maskLayer.appendChild(imageLayer)
      trailItem.appendChild(maskLayer)
      return maskLayer
    }

    const createTrailImage = () => {
      if (!hasPointer) return

      trimExcessItems()

      const trailItem = document.createElement("div")
      trailItem.style.position = "absolute"
      trailItem.style.width = `${itemWidth}px`
      trailItem.style.height = `${itemHeight}px`
      trailItem.style.pointerEvents = "none"
      trailItem.style.willChange = "transform"
      trailItem.style.zIndex = String(zIndexCounter++)

      const imgUrl = images[currentImageIndex]!
      currentImageIndex = (currentImageIndex + 1) % images.length

      const rect = container.getBoundingClientRect()
      const xPos = interpolatedMouse.x - rect.left - itemWidth / 2
      const yPos = interpolatedMouse.y - rect.top - itemHeight / 2

      trailItem.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`
      trailItem.style.transition = `transform 600ms ${config.ease}`

      const maskSlices: HTMLDivElement[] = []
      for (let i = 0; i < slicesCount; i++) {
        maskSlices.push(createMaskSlice(trailItem, imgUrl, i))
      }

      container.appendChild(trailItem)

      requestAnimationFrame(() => {
        const targetX = mouse.x - rect.left - itemWidth / 2
        const targetY = mouse.y - rect.top - itemHeight / 2
        trailItem.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`

        maskSlices.forEach((slice, idx) => {
          const centerDist = Math.abs(idx - slicesCount / 2)
          schedule(() => {
            slice.style.clipPath = REVEALED_CLIP
          }, centerDist * config.staggerDelay)
        })
      })

      activeTrailImages.push({
        element: trailItem,
        slices: maskSlices,
        spawnTime: Date.now(),
      })
    }

    const removeOldImages = () => {
      if (activeTrailImages.length === 0) return

      const oldest = activeTrailImages[0]
      if (!oldest || Date.now() - oldest.spawnTime < config.imageLifespan) return

      activeTrailImages.shift()
      dismissTrailImage(oldest)
    }

    const renderLoop = () => {
      if (shouldRun() && hasPointer) {
        const rect = container.getBoundingClientRect()

        interpolatedMouse.x = lerp(interpolatedMouse.x, mouse.x, config.lerpFactor)
        interpolatedMouse.y = lerp(
          interpolatedMouse.y,
          mouse.y,
          config.lerpFactor,
        )

        const traveledDistance = getDistance(
          interpolatedMouse.x - rect.left,
          interpolatedMouse.y - rect.top,
          lastSpawnMouse.x,
          lastSpawnMouse.y,
        )

        if (traveledDistance >= config.minDistance) {
          createTrailImage()
          lastSpawnMouse.x = interpolatedMouse.x - rect.left
          lastSpawnMouse.y = interpolatedMouse.y - rect.top
        }

        removeOldImages()
      }

      animationFrameId = requestAnimationFrame(renderLoop)
    }

    const stopAnimation = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
      if (pointerMoveHandler) {
        root.removeEventListener("pointermove", pointerMoveHandler)
        root.removeEventListener("pointerenter", pointerMoveHandler)
        pointerMoveHandler = null
      }
      container.replaceChildren()
      activeTrailImages.length = 0
      zIndexCounter = 1
      hasPointer = false
    }

    const startAnimation = () => {
      pointerMoveHandler = (event: PointerEvent) => {
        updatePointer(event.clientX, event.clientY)
      }

      root.addEventListener("pointermove", pointerMoveHandler)
      root.addEventListener("pointerenter", pointerMoveHandler)

      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(renderLoop)
      }
    }

    startAnimation()

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id))
      stopAnimation()
    }
  }, [
    images,
    slicesCount,
    blindDirection,
    itemWidth,
    itemHeight,
    desktopMinWidth,
    maxItems,
    config.ease,
    config.fadeDuration,
    config.imageLifespan,
    config.lerpFactor,
    config.minDistance,
    config.revealDuration,
    config.staggerDelay,
  ])

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative h-full min-h-[min(500px,100%)] w-full overflow-hidden",
        className,
      )}
    >
      {backgroundImage ? (
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center opacity-15",
            backgroundClassName,
          )}
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden
        />
      ) : null}
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        aria-hidden
      />
      {children ? (
        <div className="pointer-events-none relative z-20 flex h-full w-full items-center justify-center p-8">
          {children}
        </div>
      ) : null}
    </div>
  )
}
