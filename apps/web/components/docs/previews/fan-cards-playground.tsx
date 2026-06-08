"use client"

import { FanCards } from "@workspace/ui/components/fan-cards"
import { cn } from "@/lib/utils"
import {
  FAN_CARDS_DEFAULT_CONFIG,
  type FanCardsConfig,
  usePlaygroundStore,
} from "@/hooks/use-playground-store"

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
    {children}
  </div>
)

const sliderClassName =
  "h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-300/70 dark:bg-zinc-700/70"

type SliderFieldProps = {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (value: number) => string
  onChange: (value: number) => void
}

const SliderField = ({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: SliderFieldProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-sm">
      <span className="text-foreground/90">{label}</span>
      <span className="font-mono text-xs text-muted-foreground">{format(value)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number.parseFloat(e.target.value))}
      className={sliderClassName}
      aria-label={label}
    />
  </div>
)

type FanCardsPlaygroundProps = {
  config?: FanCardsConfig
  className?: string
}

export function FanCardsPlayground({
  config: configOverride,
  className,
}: FanCardsPlaygroundProps) {
  const storeConfig = usePlaygroundStore((state) => state.fanCardsConfig)
  const config = configOverride ?? storeConfig

  return (
    <div
      className={cn(
        "flex h-full min-h-[560px] w-full items-center justify-center overflow-visible py-8",
        className,
      )}
    >
      <FanCards
        spread={config.spread}
        rotateStep={config.rotateStep}
        springStiffness={config.springStiffness}
        springDamping={config.springDamping}
      />
    </div>
  )
}

export function FanCardsPersonalizePanel() {
  const config = usePlaygroundStore((state) => state.fanCardsConfig)
  const updateConfig = usePlaygroundStore((state) => state.updateFanCardsConfig)
  const resetConfig = usePlaygroundStore((state) => state.resetFanCardsConfig)

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <SectionTitle>Fan layout</SectionTitle>
      <SliderField
        label="Spread"
        value={config.spread}
        min={60}
        max={130}
        step={2}
        format={(v) => `${v}px`}
        onChange={(spread) => updateConfig({ spread })}
      />
      <SliderField
        label="Rotation step"
        value={config.rotateStep}
        min={2}
        max={12}
        step={0.5}
        format={(v) => `${v}°`}
        onChange={(rotateStep) => updateConfig({ rotateStep })}
      />

      <SectionTitle>Spring motion</SectionTitle>
      <SliderField
        label="Stiffness"
        value={config.springStiffness}
        min={80}
        max={360}
        step={10}
        format={(v) => `${v}`}
        onChange={(springStiffness) => updateConfig({ springStiffness })}
      />
      <SliderField
        label="Damping"
        value={config.springDamping}
        min={8}
        max={40}
        step={1}
        format={(v) => `${v}`}
        onChange={(springDamping) => updateConfig({ springDamping })}
      />

      <button
        type="button"
        onClick={resetConfig}
        className="mt-auto rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Reset to defaults
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Hover to lift a card, click to focus it, click another card to switch
        focus, or click the backdrop or the same card again to re-fan. Defaults:
        spread {FAN_CARDS_DEFAULT_CONFIG.spread}
        px, rotation {FAN_CARDS_DEFAULT_CONFIG.rotateStep}°.
      </p>
    </div>
  )
}
