"use client"

import { CardStroke } from "@workspace/ui/components/card-stroke"
import { cn } from "@/lib/utils"
import {
  CARD_STROKE_DEFAULT_CONFIG,
  type CardStrokeConfig,
  usePlaygroundStore,
} from "@/hooks/use-playground-store"

const PRESETS: Array<{ name: string; config: CardStrokeConfig }> = [
  { name: "Default", config: CARD_STROKE_DEFAULT_CONFIG },
  {
    name: "Neon",
    config: {
      title: "Dark Accent",
      description: "Custom stroke and text colors.",
      accentStrokeColor: "#00E5FF",
      baseStrokeColor: "#7C3AED",
      textColor: "#FFFFFF",
    },
  },
  {
    name: "Warm",
    config: {
      title: "Nature Preview",
      description: "Warm strokes on a landscape card.",
      accentStrokeColor: "#FCD34D",
      baseStrokeColor: "#F97316",
      textColor: "#FFFBEB",
    },
  },
]

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
    {children}
  </div>
)

const ColorField = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) => (
  <div className="space-y-2">
    <label className="text-sm text-foreground/90">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-border/70 bg-transparent p-0.5"
        aria-label={`${label} color picker`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 flex-1 rounded-md border border-border/70 bg-transparent px-3 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/25"
        aria-label={`${label} hex value`}
      />
    </div>
  </div>
)

type CardStrokePlaygroundProps = {
  className?: string
  config?: CardStrokeConfig
}

export function CardStrokePlayground({
  className,
  config: configOverride,
}: CardStrokePlaygroundProps) {
  const storeConfig = usePlaygroundStore((state) => state.cardStrokeConfig)
  const renderVersion = usePlaygroundStore((state) => state.cardStrokeRenderVersion)
  const config = configOverride ?? storeConfig

  return (
    <div className="mx-auto flex h-full w-full max-w-xl items-center justify-center p-6">
      <CardStroke
        key={configOverride ? undefined : renderVersion}
        className={className}
        title={config.title}
        description={config.description}
        accentStrokeColor={config.accentStrokeColor}
        baseStrokeColor={config.baseStrokeColor}
        textColor={config.textColor}
        imageAlt="Placeholder preview image"
      />
    </div>
  )
}

export function CardStrokePersonalizePanel() {
  const config = usePlaygroundStore((state) => state.cardStrokeConfig)
  const activePreset = usePlaygroundStore((state) => state.activeCardStrokePreset)
  const updateCardStrokeConfig = usePlaygroundStore(
    (state) => state.updateCardStrokeConfig,
  )
  const setCardStrokeConfig = usePlaygroundStore((state) => state.setCardStrokeConfig)
  const setActiveCardStrokePreset = usePlaygroundStore(
    (state) => state.setActiveCardStrokePreset,
  )
  const resetCardStrokeConfig = usePlaygroundStore(
    (state) => state.resetCardStrokeConfig,
  )

  const handlePreset = (preset: (typeof PRESETS)[number]) => {
    setActiveCardStrokePreset(preset.name)
    setCardStrokeConfig(preset.config)
  }

  const update = (updates: Partial<CardStrokeConfig>) => {
    setActiveCardStrokePreset("Custom")
    updateCardStrokeConfig(updates)
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <SectionTitle>Presets</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => handlePreset(preset)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              activePreset === preset.name
                ? "border-foreground bg-foreground text-background"
                : "border-border/70 text-muted-foreground hover:text-foreground",
            )}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <SectionTitle>Colors</SectionTitle>
      <ColorField
        label="Accent stroke"
        value={config.accentStrokeColor}
        onChange={(accentStrokeColor) => update({ accentStrokeColor })}
      />
      <ColorField
        label="Base stroke"
        value={config.baseStrokeColor}
        onChange={(baseStrokeColor) => update({ baseStrokeColor })}
      />
      <ColorField
        label="Text"
        value={config.textColor}
        onChange={(textColor) => update({ textColor })}
      />

      <button
        type="button"
        onClick={resetCardStrokeConfig}
        className="mt-auto rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Reset to defaults
      </button>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Hover the card in the preview to see the stroke draw and text reveal.
      </p>
    </div>
  )
}
