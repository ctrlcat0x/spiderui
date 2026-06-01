"use client"

import { useState } from "react"
import { RotateCcw } from "lucide-react"
import {
  GreetingPreloader,
  type Greeting,
} from "@workspace/ui/components/greeting-preloader"
import { cn } from "@/lib/utils"
import {
  GREETING_PRELOADER_DEFAULT_CONFIG,
  usePlaygroundStore,
} from "@/hooks/use-playground-store"

export const DEMO_GREETINGS: Greeting[] = [
  { text: "Hello", language: "English" },
  { text: "Bonjour", language: "French" },
  { text: "안녕하세요", language: "Korean" },
  { text: "Ciao", language: "Italian" },
  { text: "Hallo", language: "German" },
  { text: "नमस्ते", language: "Hindi" },
  { text: "こんにちは", language: "Japanese" },
]

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
    {children}
  </div>
)

type GreetingPreloaderPlaygroundProps = {
  fullPage?: boolean
  greetings?: Greeting[]
  intervalMs?: number
  remountKey?: number
}

export function GreetingPreloaderPlayground({
  fullPage = false,
  greetings = DEMO_GREETINGS,
  intervalMs: intervalOverride,
  remountKey: remountKeyOverride,
}: GreetingPreloaderPlaygroundProps) {
  const config = usePlaygroundStore((state) => state.greetingPreloaderConfig)
  const remountVersion = usePlaygroundStore(
    (state) => state.greetingPreloaderRemountVersion,
  )
  const intervalMs = intervalOverride ?? config.intervalMs
  const [localKey, setLocalKey] = useState(0)
  const remountKey = remountKeyOverride ?? remountVersion + localKey

  return (
    <div className="relative flex min-h-50 w-full items-center justify-center overflow-hidden rounded-lg bg-background">
      <p className="text-md z-10 text-muted-foreground">
        {fullPage ? "Full-page mode covers the viewport on mount." : "Replay loads the preloader again."}
      </p>

      {!fullPage && remountKeyOverride === undefined && (
        <button
          type="button"
          onClick={() => setLocalKey((k) => k + 1)}
          className="absolute right-4 top-4 z-30 inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted"
          aria-label="Replay preloader"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Replay
        </button>
      )}

      <GreetingPreloader
        key={remountKey}
        fullPage={fullPage}
        greetings={greetings}
        intervalMs={intervalMs}
      />
    </div>
  )
}

export function GreetingPreloaderPersonalizePanel() {
  const config = usePlaygroundStore((state) => state.greetingPreloaderConfig)
  const updateConfig = usePlaygroundStore(
    (state) => state.updateGreetingPreloaderConfig,
  )
  const resetConfig = usePlaygroundStore(
    (state) => state.resetGreetingPreloaderConfig,
  )
  const remountVersion = usePlaygroundStore(
    (state) => state.greetingPreloaderRemountVersion,
  )
  const resetPreview = usePlaygroundStore(
    (state) => state.resetGreetingPreloaderPreview,
  )

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <SectionTitle>Interval (ms)</SectionTitle>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/90">Speed</span>
          <span className="font-mono text-muted-foreground">{config.intervalMs}ms</span>
        </div>
        <input
          type="range"
          min={150}
          max={800}
          step={50}
          value={config.intervalMs}
          onChange={(e) =>
            updateConfig({ intervalMs: Number.parseInt(e.target.value, 10) })
          }
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-300/70 dark:bg-zinc-700/70"
          aria-label="Greeting interval in milliseconds"
        />
      </div>

      <button
        type="button"
        onClick={() => {
          resetPreview()
        }}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
      >
        <RotateCcw className="size-3.5" aria-hidden />
        Replay preview
      </button>

      <button
        type="button"
        onClick={resetConfig}
        className={cn(
          "rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
        )}
      >
        Reset to defaults
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Replay remounts the preloader (key v{remountVersion}). Full-page mode
        animates layout selectors such as <code className="text-foreground">#navbar</code>.
      </p>
    </div>
  )
}
