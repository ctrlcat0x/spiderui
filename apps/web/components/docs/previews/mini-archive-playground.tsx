"use client"

import {
  MiniArchive,
  MINI_ARCHIVE_ACCENT_COLORS,
  type MiniArchiveAccentColor,
} from "@workspace/ui/components/mini-archive"
import { cn } from "@/lib/utils"
import {
  MINI_ARCHIVE_DEFAULT_CONFIG,
  type MiniArchiveConfig,
  usePlaygroundStore,
} from "@/hooks/use-playground-store"

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
    {children}
  </div>
)

const COLOR_SWATCHES: Array<{
  value: MiniArchiveAccentColor
  label: string
  className: string
}> = [
  { value: "yellow", label: "Yellow", className: "bg-yellow-500" },
  { value: "pink", label: "Pink", className: "bg-pink-500" },
  { value: "cyan", label: "Cyan", className: "bg-cyan-500" },
  { value: "violet", label: "Violet", className: "bg-violet-500" },
  { value: "orange", label: "Orange", className: "bg-orange-500" },
  { value: "emerald", label: "Emerald", className: "bg-emerald-500" },
  { value: "black", label: "Black", className: "bg-neutral-800" },
]

type MiniArchivePlaygroundProps = {
  config?: MiniArchiveConfig
  className?: string
}

export function MiniArchivePlayground({
  config: configOverride,
  className,
}: MiniArchivePlaygroundProps) {
  const storeConfig = usePlaygroundStore((state) => state.miniArchiveConfig)
  const config = configOverride ?? storeConfig

  return (
    <div
      className={cn(
        "flex h-full min-h-[480px] w-full items-center justify-center overflow-visible py-16",
        className,
      )}
    >
      <MiniArchive
        title={config.title}
        subtitle={config.subtitle}
        accentColor={config.accentColor}
      />
    </div>
  )
}

export function MiniArchivePersonalizePanel() {
  const config = usePlaygroundStore((state) => state.miniArchiveConfig)
  const updateConfig = usePlaygroundStore((state) => state.updateMiniArchiveConfig)
  const resetConfig = usePlaygroundStore((state) => state.resetMiniArchiveConfig)

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <SectionTitle>Cover text</SectionTitle>
      <div className="space-y-2">
        <label htmlFor="mini-archive-title" className="text-sm text-foreground/90">
          Title
        </label>
        <input
          id="mini-archive-title"
          type="text"
          value={config.title}
          onChange={(e) => updateConfig({ title: e.target.value })}
          className="h-10 w-full rounded-md border border-border/70 bg-transparent px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/25"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="mini-archive-subtitle"
          className="text-sm text-foreground/90"
        >
          Subtitle
        </label>
        <input
          id="mini-archive-subtitle"
          type="text"
          value={config.subtitle}
          onChange={(e) => updateConfig({ subtitle: e.target.value })}
          className="h-10 w-full rounded-md border border-border/70 bg-transparent px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/25"
        />
      </div>

      <SectionTitle>Accent color</SectionTitle>
      <div className="flex flex-wrap gap-3">
        {COLOR_SWATCHES.map((swatch) => (
          <button
            key={swatch.value}
            type="button"
            onClick={() => updateConfig({ accentColor: swatch.value })}
            className={cn(
              "size-8 rounded-full transition-shadow",
              swatch.className,
              config.accentColor === swatch.value
                ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                : "ring-0",
            )}
            aria-label={`${swatch.label} accent`}
            aria-pressed={config.accentColor === swatch.value}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={resetConfig}
        className="mt-auto rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Reset to defaults
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Hover to peek, click to open side-by-side quote cards. Click outside to
        close. {MINI_ARCHIVE_ACCENT_COLORS.length} accent colors available.
      </p>
    </div>
  )
}
