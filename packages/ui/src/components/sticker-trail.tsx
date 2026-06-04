"use client"

import { wrap } from "motion"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react"
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react"
import { cn } from "@workspace/ui/lib/utils"

type TrailItem<T> = {
  id: number
  x: number
  y: number
  driftX: number
  driftY: number
  rotate: number
  data: T
}

export type StickerTrailProps<T> = {
  data: T[]
  renderItem: (item: T) => ReactNode
  removeDelay?: number
  driftAmount?: number
  spawnDistance?: number
  maxItems?: number
  className?: string
  containerRef?: RefObject<HTMLElement | null>
}

export const DEFAULT_STICKER_PATHS = Array.from(
  { length: 12 },
  (_, index) => `/svgStickers/${index + 1}.svg`,
)

export function StickerTrail<T>({
  data,
  renderItem,
  removeDelay = 1,
  driftAmount = 36,
  spawnDistance = 76,
  maxItems = 8,
  className,
  containerRef,
}: StickerTrailProps<T>) {
  const internalRef = useRef<HTMLDivElement>(null)
  const rootRef = containerRef ?? internalRef
  const [items, setItems] = useState<TrailItem<T>[]>([])
  const distanceSum = useRef(0)
  const dataIndex = useRef(0)
  const idCounter = useRef(0)
  const timeoutIds = useRef<number[]>([])
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  const distanceInPixels = useTransform(() => {
    const x = pointerX.get()
    const y = pointerY.get()
    const dx = x - (pointerX.getPrevious() ?? x)
    const dy = y - (pointerY.getPrevious() ?? y)
    return Math.hypot(dx, dy)
  })

  useMotionValueEvent(distanceInPixels, "change", (latest) => {
    if (!data.length) return

    distanceSum.current += latest
    if (distanceSum.current < spawnDistance) return

    const x = pointerX.get()
    const y = pointerY.get()
    const prevX = pointerX.getPrevious() ?? x
    const prevY = pointerY.getPrevious() ?? y
    const dx = x - prevX
    const dy = y - prevY
    const dist = Math.hypot(dx, dy) || 1
    const nx = dx / dist
    const ny = dy / dist
    const angle = Math.atan2(ny, nx) * (180 / Math.PI)
    const trailId = idCounter.current++

    const entry: TrailItem<T> = {
      id: trailId,
      x,
      y,
      driftX: nx * driftAmount + (Math.random() - 0.5) * driftAmount * 0.5,
      driftY: ny * driftAmount + (Math.random() - 0.5) * driftAmount * 0.5,
      rotate: angle * 0.15,
      data: data[dataIndex.current]!,
    }

    setItems((prev) => {
      const next = [...prev, entry]
      if (maxItems > 0 && next.length > maxItems) {
        return next.slice(-maxItems)
      }
      return next
    })
    dataIndex.current = wrap(0, data.length, dataIndex.current + 1)

    const timeoutId = window.setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== trailId))
    }, removeDelay * 1000)

    timeoutIds.current.push(timeoutId)
    distanceSum.current = 0
  })

  useEffect(() => {
    const root =
      "current" in rootRef && rootRef.current
        ? rootRef.current
        : internalRef.current

    if (!root) return

    const handlePointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      pointerX.set(event.clientX - rect.left)
      pointerY.set(event.clientY - rect.top)
    }

    root.addEventListener("pointermove", handlePointerMove)
    return () => root.removeEventListener("pointermove", handlePointerMove)
  }, [pointerX, pointerY, rootRef])

  useEffect(() => {
    return () => {
      timeoutIds.current.forEach((id) => window.clearTimeout(id))
      timeoutIds.current = []
    }
  }, [])

  const isExternalContainer = Boolean(containerRef)

  return (
    <div
      ref={isExternalContainer ? undefined : internalRef}
      className={cn(
        !isExternalContainer && "relative h-full w-full overflow-hidden",
        className,
      )}
      aria-hidden={!isExternalContainer}
    >
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="pointer-events-none absolute z-20"
            style={{
              left: item.x,
              top: item.y,
              translate: "-50% -50%",
            }}
            initial={{ scale: 0, x: 0, y: 0, rotate: item.rotate }}
            animate={{
              scale: 1,
              x: item.driftX,
              y: item.driftY,
              rotate: item.rotate,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              scale: { type: "spring", stiffness: 260, damping: 20, mass: 1 },
              x: { type: "spring", stiffness: 60, damping: 18, mass: 0.8 },
              y: { type: "spring", stiffness: 60, damping: 18, mass: 0.8 },
              rotate: { type: "spring", stiffness: 60, damping: 18, mass: 0.8 },
            }}
          >
            {renderItem(item.data)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
