import { cn } from "@/lib/utils"

type FadeVariant = "docs-index" | "docs-content" | "preview" | "sidebar"

type ScrollEdgeFadeProps = {
  position: "top" | "bottom"
  variant?: FadeVariant
  className?: string
}

const variantStyles: Record<FadeVariant, { top: string; bottom: string }> = {
  "docs-index": {
    top: "h-40 bg-gradient-to-b from-white via-white to-transparent dark:from-[#111] dark:via-[#111] dark:to-transparent [mask-image:linear-gradient(to_bottom,black_20%,transparent)]",
    bottom:
      "h-24 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#111] dark:via-[#111]/80 dark:to-transparent [mask-image:linear-gradient(to_top,black,transparent)]",
  },
  "docs-content": {
    top: "h-40 bg-gradient-to-b from-[#f3f4f6] via-[#f3f4f6] to-transparent dark:from-[#080808] dark:via-[#080808] dark:to-transparent [mask-image:linear-gradient(to_bottom,black_20%,transparent)]",
    bottom:
      "h-24 bg-gradient-to-t from-[#f3f4f6] via-[#f3f4f6]/80 to-transparent dark:from-[#080808] dark:via-[#080808]/80 dark:to-transparent [mask-image:linear-gradient(to_top,black,transparent)]",
  },
  preview: {
    top: "h-32 bg-gradient-to-b from-white via-white to-transparent dark:from-[#121212] dark:via-[#121212] dark:to-transparent [mask-image:linear-gradient(to_bottom,black_20%,transparent)]",
    bottom:
      "h-20 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#121212] dark:via-[#121212]/80 dark:to-transparent [mask-image:linear-gradient(to_top,black,transparent)]",
  },
  sidebar: {
    top: "h-16 bg-gradient-to-b from-white via-white to-transparent dark:from-[#121212] dark:via-[#121212] dark:to-transparent [mask-image:linear-gradient(to_bottom,black_20%,transparent)]",
    bottom:
      "h-16 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#121212] dark:via-[#121212]/80 dark:to-transparent [mask-image:linear-gradient(to_top,black,transparent)]",
  },
}

export function ScrollEdgeFade({
  position,
  variant = "docs-content",
  className,
}: ScrollEdgeFadeProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 z-30 backdrop-blur-sm",
        position === "top" ? "top-0" : "bottom-0",
        variantStyles[variant][position],
        className,
      )}
    />
  )
}
