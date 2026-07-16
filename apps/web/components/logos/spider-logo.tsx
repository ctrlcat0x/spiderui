"use client"

import type React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const LOGO_PATHS = {
  light: "/logo_black.png",
  dark: "/logo_white.png",
  color: "/logo_normal.png",
  transparent: "/logo_transparent.png",
} as const

export type SpiderLogoVariant = keyof typeof LOGO_PATHS | "auto"

export type SpiderLogoProps = {
  className?: string
  size?: number
  variant?: SpiderLogoVariant
  priority?: boolean
  decorative?: boolean
}

export function SpiderLogo({
  className,
  size,
  variant = "auto",
  priority = false,
  decorative = false,
}: SpiderLogoProps): React.JSX.Element {
  const alt = decorative ? "" : "Spider UI"
  const imageSize = size ?? 48
  const dimensionStyle = size ? { width: size, height: size } : undefined

  if (variant === "auto") {
    return (
      <span
        className={cn("relative inline-flex shrink-0", className)}
        style={dimensionStyle}
        aria-hidden={decorative || undefined}
      >
        <Image
          src={LOGO_PATHS.light}
          alt={alt}
          width={imageSize}
          height={imageSize}
          className="size-full object-contain dark:hidden"
          priority={priority}
        />
        <Image
          src={LOGO_PATHS.dark}
          alt={alt}
          width={imageSize}
          height={imageSize}
          className="hidden size-full object-contain dark:block"
          priority={priority}
        />
      </span>
    )
  }

  return (
    <Image
      src={LOGO_PATHS[variant]}
      alt={alt}
      width={imageSize}
      height={imageSize}
      className={cn("shrink-0 object-contain", className)}
      style={dimensionStyle}
      priority={priority}
      aria-hidden={decorative || undefined}
    />
  )
}
