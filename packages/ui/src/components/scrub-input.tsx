"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface ScrubInputProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  label: string
  min?: number
  max?: number
  step?: number
  className?: string
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const valueFromPointer = (
  clientX: number,
  rect: DOMRect,
  min: number,
  max: number,
  step: number,
) => {
  const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
  const raw = min + ratio * (max - min)
  const snapped = min + Math.round((raw - min) / step) * step
  return clamp(snapped, min, max)
}

const toPercentage = (value: number, min: number, max: number) =>
  max > min ? ((value - min) / (max - min)) * 100 : 0

export function ScrubInput({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  label,
  min = 0,
  max = 100,
  step = 1,
  className,
}: ScrubInputProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  const setValue = useCallback(
    (nextValue: number) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue)
      }
      onChange?.(nextValue)
    },
    [isControlled, onChange],
  )

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const container = containerRef.current
      if (!container) {
        return
      }

      const nextValue = valueFromPointer(
        clientX,
        container.getBoundingClientRect(),
        min,
        max,
        step,
      )

      if (nextValue !== value) {
        setValue(nextValue)
      }
    },
    [max, min, setValue, step, value],
  )

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      containerRef.current?.setPointerCapture(event.pointerId)
      isDraggingRef.current = true
      setIsDragging(true)
      updateFromPointer(event.clientX)
    },
    [updateFromPointer],
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) {
        return
      }
      updateFromPointer(event.clientX)
    },
    [updateFromPointer],
  )

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    containerRef.current?.releasePointerCapture(event.pointerId)
    isDraggingRef.current = false
    setIsDragging(false)
  }, [])

  const fillWidth = Math.max(20, toPercentage(value, min, max))

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn(
        "relative h-12 w-[280px] cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900",
        "transition-transform active:scale-[0.98]",
        className,
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className={cn(
          "absolute top-0 left-0 flex h-full items-center justify-end rounded-2xl border-r border-zinc-200 bg-white pr-3 shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-none",
          isDragging
            ? "transition-none"
            : "transition-[width] duration-300 ease-out",
        )}
        style={{ width: `${fillWidth}%` }}
      >
        <div className="h-5 w-[3px] rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-5">
        <span className="text-[15px] font-medium tracking-tight text-black/60 dark:text-white/60">
          {label}
        </span>
        <span className="text-[16px] font-medium tracking-tight text-black/50 dark:text-white/50">
          {value}
        </span>
      </div>
    </div>
  )
}
