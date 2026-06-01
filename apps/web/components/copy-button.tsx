"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { useClickSound } from "@/hooks/use-click-sound"

interface CopyButtonProps {
  code: string
  className?: string
  absolute?: boolean
}

export function CopyButton({ code, className, absolute = true }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const playClick = useClickSound()

  const handleCopy = async () => {
    playClick()
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`${absolute ? "absolute top-3 right-3" : ""} p-2 rounded-lg border border-border/40 bg-white/60 text-zinc-500 shadow-sm backdrop-blur-md transition-all duration-200 z-10 dark:bg-zinc-900/60 dark:text-zinc-400 ${copied
        ? "text-emerald-600 dark:text-emerald-400"
        : "hover:bg-white/80 hover:text-zinc-950 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-50"
        } ${className || ""}`}
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}
