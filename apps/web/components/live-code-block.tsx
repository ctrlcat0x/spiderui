"use client"

import { useEffect, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { usePlaygroundStore } from "@/hooks/use-playground-store"

interface LiveCodeBlockProps {
  defaultCode: string
  lang?: string
}

export function LiveCodeBlock({ defaultCode, lang = "tsx" }: LiveCodeBlockProps) {
  const { code } = usePlaygroundStore()
  const [displayCode, setDisplayCode] = useState(defaultCode)
  const [html, setHtml] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    usePlaygroundStore.getState().setCode(defaultCode)
  }, [defaultCode])

  useEffect(() => {
    if (code) {
      setDisplayCode(code)
    }
  }, [code])

  useEffect(() => {
    let cancelled = false

    const highlight = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/docs/source", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: displayCode, lang }),
        })

        if (!response.ok) return

        const data = (await response.json()) as { html?: string }
        if (!cancelled && data.html) {
          setHtml(data.html)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    highlight()
    return () => {
      cancelled = true
    }
  }, [displayCode, lang])

  return (
    <div className="relative group min-h-[200px]">
      <div className="absolute top-0 right-0 p-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-zinc-100/90 dark:bg-zinc-900/90 rounded-bl-md border-l border-b border-border">
        Real-time
      </div>
      <div
        data-code-block
        data-line-numbers="false"
        className="relative text-sm w-full border-none bg-transparent min-h-[200px] [&_pre]:!overflow-x-auto [&_pre]:!overflow-y-hidden"
      >
        <CopyButton code={displayCode.trim()} />
        {isLoading && !html ? (
          <div className="h-[200px] w-full animate-pulse rounded-md bg-muted/20" />
        ) : html ? (
          <div
            className="[&_pre]:p-4 [&_pre]:overflow-x-auto overflow-auto max-h-[500px]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : null}
      </div>
    </div>
  )
}
