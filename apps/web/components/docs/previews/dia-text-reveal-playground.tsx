"use client"

import {
  DiaTextReveal,
  DIA_TEXT_REVEAL_COLOR_PRESETS,
  type DiaTextRevealColorPreset,
} from "@workspace/ui/components/dia-text-reveal"
import { cn } from "@/lib/utils"
import {
  type DiaTextRevealConfig,
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

const COLOR_PRESET_LABELS: Record<DiaTextRevealColorPreset, string> = {
  dia: "Dia",
  warm: "Warm",
  cool: "Cool",
}

type DiaTextRevealPlaygroundProps = {
  config?: DiaTextRevealConfig
  className?: string
}

export function DiaTextRevealPlayground({
  config: configOverride,
  className,
}: DiaTextRevealPlaygroundProps) {
  const storeConfig = usePlaygroundStore((state) => state.diaTextRevealConfig)
  const remountVersion = usePlaygroundStore(
    (state) => state.diaTextRevealRemountVersion,
  )
  const config = configOverride ?? storeConfig

  const revealText =
    config.mode === "rotate"
      ? config.rotatePhrases
      : config.text

  return (
    <div
      className={cn(
        "flex h-full min-h-[320px] w-full flex-col items-center justify-center gap-8 px-6 py-16",
        className,
      )}
    >
      <h1 className="text-center font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        {config.mode === "rotate" ? (
          <>
            Learn to{" "}
            <DiaTextReveal
              key={remountVersion}
              repeat
              repeatDelay={config.repeatDelay}
              text={revealText}
              colors={[...DIA_TEXT_REVEAL_COLOR_PRESETS[config.colorPreset]]}
              duration={config.duration}
              delay={config.delay}
              startOnView={false}
              once={false}
            />
          </>
        ) : (
          <DiaTextReveal
            key={remountVersion}
            text={revealText}
            colors={[...DIA_TEXT_REVEAL_COLOR_PRESETS[config.colorPreset]]}
            duration={config.duration}
            delay={config.delay}
            startOnView={false}
            once={false}
          />
        )}
      </h1>
    </div>
  )
}

export function DiaTextRevealPersonalizePanel() {
  const config = usePlaygroundStore((state) => state.diaTextRevealConfig)
  const updateConfig = usePlaygroundStore((state) => state.updateDiaTextRevealConfig)
  const resetConfig = usePlaygroundStore((state) => state.resetDiaTextRevealConfig)
  const replayPreview = usePlaygroundStore((state) => state.resetDiaTextRevealPreview)

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <SectionTitle>Mode</SectionTitle>
      <div className="flex gap-2">
        {(["single", "rotate"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => updateConfig({ mode })}
            className={cn(
              "flex-1 rounded-md border px-3 py-2 text-xs font-medium capitalize transition-colors",
              config.mode === mode
                ? "border-foreground bg-foreground text-background"
                : "border-border/70 text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={config.mode === mode}
          >
            {mode}
          </button>
        ))}
      </div>

      {config.mode === "single" ? (
        <div className="space-y-2">
          <label htmlFor="dia-text-reveal-text" className="text-sm text-foreground/90">
            Text
          </label>
          <input
            id="dia-text-reveal-text"
            type="text"
            value={config.text}
            onChange={(e) => updateConfig({ text: e.target.value })}
            className="h-10 w-full rounded-md border border-border/70 bg-transparent px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/25"
          />
        </div>
      ) : (
        <p className="text-xs leading-relaxed text-muted-foreground">
          Rotates between &ldquo;build faster&rdquo;, &ldquo;ship smarter&rdquo;, and
          &ldquo;scale easier&rdquo; after each sweep.
        </p>
      )}

      <SectionTitle>Gradient palette</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(DIA_TEXT_REVEAL_COLOR_PRESETS) as DiaTextRevealColorPreset[]).map(
          (preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => updateConfig({ colorPreset: preset })}
              className={cn(
                "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                config.colorPreset === preset
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/70 text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={config.colorPreset === preset}
            >
              {COLOR_PRESET_LABELS[preset]}
            </button>
          ),
        )}
      </div>

      <SectionTitle>Timing</SectionTitle>
      <SliderField
        label="Duration"
        value={config.duration}
        min={0.6}
        max={3}
        step={0.1}
        format={(v) => `${v.toFixed(1)}s`}
        onChange={(duration) => updateConfig({ duration })}
      />
      <SliderField
        label="Delay"
        value={config.delay}
        min={0}
        max={2}
        step={0.1}
        format={(v) => `${v.toFixed(1)}s`}
        onChange={(delay) => updateConfig({ delay })}
      />
      {config.mode === "rotate" && (
        <SliderField
          label="Repeat delay"
          value={config.repeatDelay}
          min={0.2}
          max={2.5}
          step={0.1}
          format={(v) => `${v.toFixed(1)}s`}
          onChange={(repeatDelay) => updateConfig({ repeatDelay })}
        />
      )}

      <button
        type="button"
        onClick={replayPreview}
        className="rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted/50"
      >
        Replay animation
      </button>

      <button
        type="button"
        onClick={resetConfig}
        className="rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Reset to defaults
      </button>
    </div>
  )
}
