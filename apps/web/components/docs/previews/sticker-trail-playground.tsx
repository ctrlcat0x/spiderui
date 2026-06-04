"use client"

import Image from "next/image"
import { RotateCcw } from "lucide-react"
import {
  DEFAULT_STICKER_PATHS,
  StickerTrail,
} from "@workspace/ui/components/sticker-trail"
import { cn } from "@/lib/utils"
import {
  STICKER_TRAIL_DEFAULT_CONFIG,
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

export function StickerTrailPreview() {
  const config = usePlaygroundStore((state) => state.stickerTrailConfig)
  const remountVersion = usePlaygroundStore(
    (state) => state.stickerTrailRemountVersion,
  )

  return (
    <div className="relative h-full min-h-[500px] w-full overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-8">
        <p className="max-w-xs text-center font-serif text-3xl text-zinc-900 dark:text-white sm:text-4xl">
          Drag your mouse around.
        </p>
      </div>
      <StickerTrail
        key={remountVersion}
        data={DEFAULT_STICKER_PATHS}
        spawnDistance={config.spawnDistance}
        driftAmount={config.driftAmount}
        removeDelay={config.removeDelay}
        maxItems={config.maxItems}
        renderItem={(src) => (
          <Image
            src={src}
            alt=""
            width={144}
            height={144}
            className="size-36 object-contain"
            draggable={false}
          />
        )}
      />
    </div>
  )
}

export function StickerTrailPersonalizePanel() {
  const config = usePlaygroundStore((state) => state.stickerTrailConfig)
  const updateConfig = usePlaygroundStore((state) => state.updateStickerTrailConfig)
  const resetConfig = usePlaygroundStore((state) => state.resetStickerTrailConfig)
  const resetPreview = usePlaygroundStore((state) => state.resetStickerTrailPreview)
  const remountVersion = usePlaygroundStore(
    (state) => state.stickerTrailRemountVersion,
  )

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <SliderField
        label="Spawn distance"
        value={config.spawnDistance}
        min={1}
        max={200}
        step={5}
        format={(v) => `${v}px`}
        onChange={(spawnDistance) => updateConfig({ spawnDistance })}
      />

      <SliderField
        label="Drift amount"
        value={config.driftAmount}
        min={1}
        max={200}
        step={5}
        format={(v) => `${v}px`}
        onChange={(driftAmount) => updateConfig({ driftAmount })}
      />

      <SliderField
        label="Remove delay"
        value={config.removeDelay}
        min={0.1}
        max={2}
        step={0.1}
        format={(v) => `${v.toFixed(1)}s`}
        onChange={(removeDelay) => updateConfig({ removeDelay })}
      />

      <SliderField
        label="Max stickers"
        value={config.maxItems}
        min={1}
        max={24}
        step={1}
        format={(v) => `${Math.round(v)}`}
        onChange={(maxItems) =>
          updateConfig({ maxItems: Math.round(maxItems) })
        }
      />

      <button
        type="button"
        onClick={resetPreview}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
      >
        <RotateCcw className="size-3.5" aria-hidden />
        Clear trail
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
        Defaults match Skiper UI: spawn {STICKER_TRAIL_DEFAULT_CONFIG.spawnDistance}
        px, drift {STICKER_TRAIL_DEFAULT_CONFIG.driftAmount}px,{" "}
        {STICKER_TRAIL_DEFAULT_CONFIG.removeDelay}s fade, up to{" "}
        {STICKER_TRAIL_DEFAULT_CONFIG.maxItems} stickers. Preview key v
        {remountVersion}.
      </p>
    </div>
  )
}
