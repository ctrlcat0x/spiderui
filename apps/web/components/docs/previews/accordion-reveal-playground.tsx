"use client"

import { AccordionReveal } from "@workspace/ui/components/accordion-reveal"
import { cn } from "@/lib/utils"
import {
  ACCORDION_REVEAL_DEFAULT_CONFIG,
  type AccordionRevealConfig,
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

type AccordionRevealPlaygroundProps = {
  config?: AccordionRevealConfig
  className?: string
}

export function AccordionRevealPlayground({
  config: configOverride,
  className,
}: AccordionRevealPlaygroundProps) {
  const storeConfig = usePlaygroundStore((state) => state.accordionRevealConfig)
  const config = configOverride ?? storeConfig

  return (
    <div
      className={cn(
        "flex w-full min-h-full items-start justify-center px-6 py-16",
        className,
      )}
    >
      <AccordionReveal
        className="w-full max-w-xl text-foreground"
        collapsedHeight={config.collapsedHeight}
        expandedHeight={config.expandedHeight}
      />
    </div>
  )
}

export function AccordionRevealPersonalizePanel() {
  const config = usePlaygroundStore((state) => state.accordionRevealConfig)
  const updateConfig = usePlaygroundStore((state) => state.updateAccordionRevealConfig)
  const resetConfig = usePlaygroundStore((state) => state.resetAccordionRevealConfig)

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <SectionTitle>Row heights</SectionTitle>
      <SliderField
        label="Collapsed"
        value={config.collapsedHeight}
        min={48}
        max={96}
        step={2}
        format={(v) => `${v}px`}
        onChange={(collapsedHeight) => updateConfig({ collapsedHeight })}
      />
      <SliderField
        label="Expanded"
        value={config.expandedHeight}
        min={200}
        max={420}
        step={4}
        format={(v) => `${v}px`}
        onChange={(expandedHeight) => updateConfig({ expandedHeight })}
      />

      <button
        type="button"
        onClick={resetConfig}
        className="mt-auto rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Reset to defaults
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Hover a row to expand it with a full-bleed image. Other rows dim while
        one is active. Defaults: {ACCORDION_REVEAL_DEFAULT_CONFIG.collapsedHeight}
        px collapsed, {ACCORDION_REVEAL_DEFAULT_CONFIG.expandedHeight}px expanded.
      </p>
    </div>
  )
}
