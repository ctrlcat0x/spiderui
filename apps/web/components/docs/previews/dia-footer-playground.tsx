"use client"

import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { ArrowDown } from "lucide-react"
import {
  DiaFooter,
  DIA_FOOTER_THEMES,
  type DiaFooterColorProps,
  type DiaFooterTheme,
} from "@workspace/ui/components/dia-footer"
import { cn } from "@/lib/utils"
import {
  type DiaFooterConfig,
  usePlaygroundStore,
} from "@/hooks/use-playground-store"

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
    {children}
  </div>
)

type DiaFooterPlaygroundProps = {
  config?: DiaFooterConfig
  theme?: DiaFooterTheme
  copyrightText?: string
  colors?: DiaFooterColorProps
}

export function DiaFooterPlayground({
  config: configOverride,
  theme,
  copyrightText,
  colors,
}: DiaFooterPlaygroundProps) {
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const [scrollerReady, setScrollerReady] = useState(false)
  const storeConfig = usePlaygroundStore((state) => state.diaFooterConfig)
  const config = configOverride ?? storeConfig
  const resolvedTheme = theme ?? config.theme
  const resolvedCopy = copyrightText ?? config.copyrightText
  const remountKey = `${resolvedTheme}-${resolvedCopy}-${colors ? "custom" : "preset"}`

  const handleRootRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      setScrollerReady(false)
      scrollContainerRef.current = null
      return
    }

    const scroller = node.closest<HTMLElement>("[data-docs-preview-scroll]")
    scrollContainerRef.current = scroller
    scroller?.scrollTo({ top: 0 })
    setScrollerReady(Boolean(scroller))
  }, [])

  useLayoutEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0 })
  }, [remountKey])

  return (
    <div ref={handleRootRef} className="w-full">
      <div className="flex min-h-[50svh] flex-col items-center justify-center gap-2 px-4 font-serif text-2xl font-medium text-muted-foreground">
        <span>Scroll to see the footer</span>
        <ArrowDown className="size-4 animate-bounce" aria-hidden />
      </div>

      {scrollerReady ? (
        <DiaFooter
          key={remountKey}
          theme={resolvedTheme}
          copyrightText={resolvedCopy}
          colors={colors}
          scrollContainer={scrollContainerRef}
        />
      ) : null}
    </div>
  )
}

export function DiaFooterPersonalizePanel() {
  const config = usePlaygroundStore((state) => state.diaFooterConfig)
  const updateDiaFooterConfig = usePlaygroundStore(
    (state) => state.updateDiaFooterConfig,
  )
  const resetDiaFooterConfig = usePlaygroundStore(
    (state) => state.resetDiaFooterConfig,
  )

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <SectionTitle>Theme</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {DIA_FOOTER_THEMES.map((theme) => (
          <button
            key={theme}
            type="button"
            onClick={() => updateDiaFooterConfig({ theme })}
            className={cn(
              "rounded-md border px-2 py-1.5 text-xs font-medium capitalize transition-colors",
              config.theme === theme
                ? "border-foreground bg-foreground text-background"
                : "border-border/70 text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={config.theme === theme}
          >
            {theme.replace("-", " ")}
          </button>
        ))}
      </div>

      <SectionTitle>Copyright text</SectionTitle>
      <input
        type="text"
        value={config.copyrightText}
        onChange={(e) =>
          updateDiaFooterConfig({ copyrightText: e.target.value })
        }
        className="h-10 w-full rounded-md border border-border/70 bg-transparent px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/25"
        aria-label="Copyright text"
      />

      <button
        type="button"
        onClick={resetDiaFooterConfig}
        className="rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Reset to defaults
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Scroll the preview panel to reveal the spectrum animation and copyright
        text.
      </p>
    </div>
  )
}
