"use client"

import type { ReactNode } from "react"
import {
  ContributionGraph,
  CONTRIBUTION_THEMES,
  type ContributionAnimation,
  type ContributionShape,
  type ContributionTheme,
  type ContributionVariant,
} from "@workspace/ui/components/contribution-graph"
import { cn } from "@/lib/utils"
import { usePlaygroundStore } from "@/hooks/use-playground-store"

const VARIANTS: { id: ContributionVariant; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "city-lights", label: "City Lights" },
  { id: "minimal", label: "Minimal" },
]

const ANIMATIONS: { id: ContributionAnimation; label: string }[] = [
  { id: "left-to-right", label: "Left → Right" },
  { id: "top-to-bottom", label: "Top → Bottom" },
  { id: "random", label: "Random" },
  { id: "none", label: "None" },
]

const SHAPES: { id: ContributionShape; label: string }[] = [
  { id: "rounded", label: "Rounded" },
  { id: "square", label: "Square" },
  { id: "circle", label: "Circle" },
  { id: "squircle", label: "Squircle" },
]

const THEME_SWATCH: Record<ContributionTheme, string> = {
  green: "bg-emerald-500",
  sakura: "bg-pink-400",
  autumn: "bg-amber-500",
  winter: "bg-sky-400",
  forest: "bg-green-600",
  grayscale: "bg-zinc-500",
  orange: "bg-orange-500",
}

const THEME_LABEL: Record<ContributionTheme, string> = {
  green: "Green",
  sakura: "Sakura",
  autumn: "Autumn",
  winter: "Winter",
  forest: "Forest",
  grayscale: "Grayscale",
  orange: "Orange",
}

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <div className="mb-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
    {children}
  </div>
)

export function ContributionGraphPlayground() {
  const config = usePlaygroundStore((state) => state.contributionGraphConfig)
  const remountVersion = usePlaygroundStore(
    (state) => state.contributionGraphRemountVersion,
  )

  const graphKey = [
    remountVersion,
    config.theme,
    config.variant,
    config.animation,
    config.shape,
    config.glowIntensity,
    config.username,
  ].join("-")

  return (
    <div className="flex h-full w-full items-center justify-center p-6 sm:p-10">
      <ContributionGraph
        key={graphKey}
        username={config.username}
        theme={config.theme}
        variant={config.variant}
        animation={config.animation}
        shape={config.shape}
        glowIntensity={config.glowIntensity}
        className="w-full max-w-2xl"
      />
    </div>
  )
}

export function ContributionGraphPersonalizePanel() {
  const config = usePlaygroundStore((state) => state.contributionGraphConfig)
  const updateConfig = usePlaygroundStore(
    (state) => state.updateContributionGraphConfig,
  )
  const resetConfig = usePlaygroundStore(
    (state) => state.resetContributionGraphConfig,
  )
  const resetPreview = usePlaygroundStore(
    (state) => state.resetContributionGraphPreview,
  )

  const update = (updates: Partial<typeof config>) => {
    updateConfig(updates)
    if ("animation" in updates || "variant" in updates || "username" in updates) {
      resetPreview()
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <SectionTitle>Theme</SectionTitle>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {CONTRIBUTION_THEMES.map((theme) => (
          <button
            key={theme}
            type="button"
            onClick={() => update({ theme })}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-colors",
              config.theme === theme
                ? "border-foreground bg-foreground text-background"
                : "border-border/70 text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={config.theme === theme}
          >
            <span
              className={cn("size-3 shrink-0 rounded-sm", THEME_SWATCH[theme])}
              aria-hidden
            />
            {THEME_LABEL[theme]}
          </button>
        ))}
      </div>

      <SectionTitle>Variant</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => update({ variant: variant.id })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              config.variant === variant.id
                ? "border-foreground bg-foreground text-background"
                : "border-border/70 text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={config.variant === variant.id}
          >
            {variant.label}
          </button>
        ))}
      </div>

      <SectionTitle>Animation</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {ANIMATIONS.map((animation) => (
          <button
            key={animation.id}
            type="button"
            onClick={() => update({ animation: animation.id })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              config.animation === animation.id
                ? "border-foreground bg-foreground text-background"
                : "border-border/70 text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={config.animation === animation.id}
          >
            {animation.label}
          </button>
        ))}
      </div>

      <SectionTitle>Shape</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {SHAPES.map((shape) => (
          <button
            key={shape.id}
            type="button"
            onClick={() => update({ shape: shape.id })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
              config.shape === shape.id
                ? "border-foreground bg-foreground text-background"
                : "border-border/70 text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={config.shape === shape.id}
          >
            {shape.label}
          </button>
        ))}
      </div>

      {config.variant === "city-lights" && (
        <>
          <SectionTitle>Glow intensity</SectionTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/90">Radius</span>
              <span className="font-mono text-muted-foreground">
                {config.glowIntensity}px
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={12}
              step={1}
              value={config.glowIntensity}
              onChange={(e) =>
                updateConfig({
                  glowIntensity: Number.parseInt(e.target.value, 10),
                })
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-300/70 dark:bg-zinc-700/70"
              aria-label="Glow intensity"
            />
          </div>
        </>
      )}

      <SectionTitle>GitHub user</SectionTitle>
      <input
        type="text"
        value={config.username}
        onChange={(e) => update({ username: e.target.value.trim() })}
        placeholder="torvalds"
        className="w-full rounded-lg border border-border/70 bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring/40"
        aria-label="GitHub username"
      />

      <button
        type="button"
        onClick={() => {
          resetConfig()
          resetPreview()
        }}
        className="mt-auto rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Reset to defaults
      </button>
    </div>
  )
}
