"use client"

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { cn } from "@workspace/ui/lib/utils"

const SWITCH_SIZES = {
  sm: { trackX: 46, trackY: 24, thumbX: 22, thumbY: 18, padding: 3 },
  md: { trackX: 62, trackY: 30, thumbX: 32, thumbY: 24, padding: 4 },
  lg: { trackX: 74, trackY: 36, thumbX: 34, thumbY: 28, padding: 5 },
} as const

const SWITCH_TONES = {
  neutral: {
    off: "color-mix(in srgb, var(--muted) 82%, transparent)",
    on: "#34c759",
    thumb: "#ffffff",
    glow: "color-mix(in srgb, #34c759 32%, transparent)",
  },
  accent: {
    off: "color-mix(in srgb, var(--muted) 82%, transparent)",
    on: "var(--foreground)",
    thumb: "#ffffff",
    glow: "color-mix(in srgb, var(--accent) 42%, transparent)",
  },
} as const

const THUMB_SPRING = { stiffness: 700, damping: 48, mass: 0.55 }
const GRAB_SPRING = { stiffness: 500, damping: 25 }
const DRAG_THRESHOLD = 3

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "role"> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: ReactNode
  description?: ReactNode
  size?: keyof typeof SWITCH_SIZES
  tone?: keyof typeof SWITCH_TONES
  labelSide?: "left" | "right"
}

function SwitchLabel({
  label,
  description,
  align,
}: {
  label: ReactNode
  description?: ReactNode
  align: "left" | "right"
}) {
  return (
    <span
      className={cn(
        "flex flex-col gap-0.5",
        align === "left" && "text-right",
      )}
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      {description ? (
        <span className="text-xs text-muted-foreground">{description}</span>
      ) : null}
    </span>
  )
}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      onCheckedChange,
      label,
      description,
      size = "md",
      tone = "neutral",
      labelSide = "right",
      className,
      style,
      disabled,
      defaultChecked,
      id,
      type = "button",
      onClick,
      onPointerCancel,
      onPointerDown,
      onPointerLeave,
      onPointerMove,
      onPointerUp,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const switchId = id ?? generatedId
    const [uncontrolledChecked, setUncontrolledChecked] = useState(
      Boolean(defaultChecked),
    )
    const isChecked = checked ?? uncontrolledChecked
    const metrics = SWITCH_SIZES[size]
    const colors = SWITCH_TONES[tone]
    const thumbTravel = metrics.trackX - metrics.thumbX - metrics.padding * 2

    const targetX = useMotionValue(isChecked ? thumbTravel : 0)
    const thumbX = useSpring(targetX, THUMB_SPRING)
    const grabTarget = useMotionValue(0)
    const grabProgress = useSpring(grabTarget, GRAB_SPRING)

    const thumbWidth = useTransform(grabProgress, [0, 1], [
      metrics.thumbX,
      metrics.thumbX + metrics.padding * 4.5,
    ])
    const thumbHeight = useTransform(grabProgress, [0, 1], [
      metrics.thumbY,
      metrics.thumbY + metrics.padding * 2.3,
    ])
    const thumbOffsetX = useTransform(
      () => thumbX.get() - (thumbWidth.get() - metrics.thumbX) / 2,
    )
    const liquidOpacity = useTransform(grabProgress, [0, 1], [0, 0.76])
    const liquidScale = useTransform(grabProgress, [0, 1], [0.82, 1.08])
    const thumbOpacity = useTransform(grabProgress, [0, 1], [1, 0.2])
    const activeProgress = useTransform(thumbX, [0, thumbTravel], [0, 1])
    const fillOpacity = useTransform(activeProgress, [0, 1], [0, 1])
    const glowOpacity = useTransform(activeProgress, [0, 0.7, 1], [0, 0.18, 0.2])
    const glowScale = useTransform(activeProgress, [0, 1], [0.82, 1])

    const dragStartX = useRef(0)
    const dragStartThumbX = useRef(0)
    const isDragging = useRef(false)
    const activePointerId = useRef<number | null>(null)
    const suppressNextClick = useRef(false)

    const setChecked = useCallback(
      (next: boolean) => {
        targetX.set(next ? thumbTravel : 0)
        if (next === isChecked) return
        if (checked === undefined) setUncontrolledChecked(next)
        onCheckedChange?.(next)
      },
      [checked, isChecked, onCheckedChange, targetX, thumbTravel],
    )

    const commitDrag = useCallback(() => {
      if (!isDragging.current) return
      isDragging.current = false
      suppressNextClick.current = true
      setChecked(targetX.get() >= thumbTravel / 2)
    }, [setChecked, targetX, thumbTravel])

    const resetInteraction = useCallback(
      (restorePosition = true) => {
        activePointerId.current = null
        grabTarget.set(0)
        if (restorePosition) targetX.set(isChecked ? thumbTravel : 0)
      },
      [grabTarget, isChecked, targetX, thumbTravel],
    )

    useEffect(() => {
      if (activePointerId.current !== null) return
      targetX.set(isChecked ? thumbTravel : 0)
    }, [isChecked, thumbTravel, targetX])

    useEffect(() => {
      const handleGlobalEnd = () => {
        if (!isDragging.current && activePointerId.current === null) return
        const wasDragging = isDragging.current
        resetInteraction(false)
        if (wasDragging) commitDrag()
      }

      window.addEventListener("pointerup", handleGlobalEnd)
      window.addEventListener("pointercancel", handleGlobalEnd)
      window.addEventListener("blur", handleGlobalEnd)
      return () => {
        window.removeEventListener("pointerup", handleGlobalEnd)
        window.removeEventListener("pointercancel", handleGlobalEnd)
        window.removeEventListener("blur", handleGlobalEnd)
      }
    }, [commitDrag, resetInteraction])

    const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event)
      if (event.defaultPrevented || disabled) return
      if (event.pointerType === "mouse" && event.button !== 0) return

      event.currentTarget.setPointerCapture(event.pointerId)
      activePointerId.current = event.pointerId
      grabTarget.set(1)
      dragStartX.current = event.clientX
      dragStartThumbX.current = thumbX.get()
      targetX.set(dragStartThumbX.current)
      isDragging.current = false
    }

    const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(event)
      if (event.defaultPrevented || disabled) return
      if (activePointerId.current !== event.pointerId) return
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return

      const deltaX = event.clientX - dragStartX.current
      if (Math.abs(deltaX) > DRAG_THRESHOLD) isDragging.current = true
      if (!isDragging.current) return

      event.preventDefault()
      targetX.set(clamp(dragStartThumbX.current + deltaX, 0, thumbTravel))
    }

    const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(event)
      if (activePointerId.current !== event.pointerId) return
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      commitDrag()
      resetInteraction(false)
    }

    const handlePointerCancel = (
      event: React.PointerEvent<HTMLButtonElement>,
    ) => {
      onPointerCancel?.(event)
      isDragging.current = false
      resetInteraction()
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented || disabled) return
      if (suppressNextClick.current) {
        suppressNextClick.current = false
        event.preventDefault()
        return
      }
      setChecked(!isChecked)
    }

    const switchControl = (
      <button
        id={switchId}
        ref={ref}
        type={type}
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleClick}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={onPointerLeave}
        aria-label={typeof label === "string" ? label : props["aria-label"]}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center rounded-full active:cursor-grabbing",
          "border border-white/35 bg-white/10 shadow-inner backdrop-blur-md",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-45",
          className,
        )}
        style={{
          width: metrics.trackX,
          height: metrics.trackY,
          touchAction: "pan-y",
          ...style,
        }}
        {...props}
      >
        <motion.span
          className="pointer-events-none absolute -inset-1 rounded-full blur-md"
          style={{
            backgroundColor: colors.glow,
            opacity: glowOpacity,
            scale: glowScale,
          }}
        />

        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: colors.off,
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.34), inset 0 -1px 2px rgba(0,0,0,0.08)",
            }}
          />
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: colors.on, opacity: fillOpacity }}
          />
        </span>

        <motion.span
          className="pointer-events-none absolute left-0 z-[9] block rounded-full"
          style={{
            width: thumbWidth,
            height: thumbHeight,
            x: thumbOffsetX,
            top: "50%",
            y: "-50%",
            marginLeft: metrics.padding,
            background: "color-mix(in srgb, var(--background) 82%, transparent)",
            opacity: liquidOpacity,
            scale: liquidScale,
            filter: "blur(9px)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        />

        <motion.span
          className="pointer-events-none z-10 block rounded-full"
          style={{
            width: thumbWidth,
            height: thumbHeight,
            x: thumbOffsetX,
            marginLeft: metrics.padding,
            backgroundColor: colors.thumb,
            opacity: thumbOpacity,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow:
              "0 3px 11px rgba(0,0,0,0.24), 0 1px 1px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.78), inset 0 -1px 1px rgba(0,0,0,0.05)",
          }}
        />
      </button>
    )

    if (!label) return switchControl

    return (
      <label
        htmlFor={switchId}
        className={cn(
          "inline-flex cursor-pointer select-none items-center gap-3",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {labelSide === "left" ? (
          <SwitchLabel label={label} description={description} align="left" />
        ) : null}
        {switchControl}
        {labelSide === "right" ? (
          <SwitchLabel label={label} description={description} align="right" />
        ) : null}
      </label>
    )
  },
)

Switch.displayName = "Switch"

export { Switch, SWITCH_SIZES, SWITCH_TONES }
