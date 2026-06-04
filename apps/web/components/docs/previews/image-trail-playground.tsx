"use client"

import { RotateCcw } from "lucide-react"
import { ImageTrail } from "@workspace/ui/components/image-trail"
import { cn } from "@/lib/utils"
import {
  IMAGE_TRAIL_DEFAULT_CONFIG,
  usePlaygroundStore,
} from "@/hooks/use-playground-store"

export const PREVIEW_TRAIL_IMAGES = [
  "https://cdn.cosmos.so/ef24a640-42da-4133-96a0-4572d2b0ccbe?format=webp",
  "https://cdn.cosmos.so/a0c031cd-fb8e-4b24-8d28-b22c82f8d45b?format=webp&w=400",
  "https://cdn.cosmos.so/2bb3d2a5-282b-4d56-aa07-26f37db500e6?format=webp&w=400",
  "https://cdn.cosmos.so/2ca26f41-477f-491d-943f-e795434dbaa5?format=webp&w=400",
  "https://cdn.cosmos.so/6d05ef91-722e-4fcc-83c5-765e348ec644?format=webp&w=400",
  "https://cdn.cosmos.so/b519df17-b76c-4bf3-9a2a-75af2d4ef68e?format=webp&w=400",
  "https://cdn.cosmos.so/f3624768-7629-4fb9-8f36-a4d00b306abc?format=webp&w=400",
  "https://cdn.cosmos.so/7a82b55b-90ec-4ce0-80d4-32b87c658e7d?format=webp&w=400",
  "https://cdn.cosmos.so/9879c7e4-0ece-485d-ad76-82f5f7365765?format=webp&w=400",
]

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

export function ImageTrailPreview() {
  const config = usePlaygroundStore((state) => state.imageTrailConfig)
  const remountVersion = usePlaygroundStore(
    (state) => state.imageTrailRemountVersion,
  )

  return (
    <div className="relative h-full min-h-[500px] w-full overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-950">
      <ImageTrail
        key={`${remountVersion}-${config.blindDirection}`}
        images={PREVIEW_TRAIL_IMAGES}
        imageLifespan={config.imageLifespan}
        minDistance={config.minDistance}
        revealDuration={config.revealDuration}
        fadeDuration={config.fadeDuration}
        staggerDelay={config.staggerDelay}
        lerpFactor={config.lerpFactor}
        maxItems={config.maxItems}
        slicesCount={config.slicesCount}
        blindDirection={config.blindDirection}
        className="h-full min-h-[500px] bg-zinc-50 dark:bg-zinc-950"
      >
        <p className="max-w-xs text-center font-serif text-3xl text-zinc-900 dark:text-white sm:text-4xl">
          Move your mouse around.
        </p>
      </ImageTrail>
    </div>
  )
}

export function ImageTrailPersonalizePanel() {
  const config = usePlaygroundStore((state) => state.imageTrailConfig)
  const updateConfig = usePlaygroundStore((state) => state.updateImageTrailConfig)
  const resetConfig = usePlaygroundStore((state) => state.resetImageTrailConfig)
  const resetPreview = usePlaygroundStore((state) => state.resetImageTrailPreview)

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <SectionTitle>Blinds</SectionTitle>

      <div className="grid grid-cols-2 gap-2">
        {(["vertical", "horizontal"] as const).map((direction) => (
          <button
            key={direction}
            type="button"
            onClick={() => updateConfig({ blindDirection: direction })}
            className={cn(
              "rounded-md border px-3 py-2 text-xs font-medium capitalize transition-colors",
              config.blindDirection === direction
                ? "border-foreground bg-foreground text-background"
                : "border-border/70 text-muted-foreground hover:text-foreground",
            )}
          >
            {direction}
          </button>
        ))}
      </div>

      <SectionTitle>Spawn</SectionTitle>

      <SliderField
        label="Spawn distance"
        value={config.minDistance}
        min={10}
        max={120}
        step={5}
        format={(v) => `${v}px`}
        onChange={(minDistance) => updateConfig({ minDistance })}
      />

      <SliderField
        label="Smoothing"
        value={config.lerpFactor}
        min={0.02}
        max={0.2}
        step={0.01}
        format={(v) => v.toFixed(2)}
        onChange={(lerpFactor) => updateConfig({ lerpFactor })}
      />

      <SectionTitle>Timing</SectionTitle>

      <SliderField
        label="Image lifespan"
        value={config.imageLifespan}
        min={400}
        max={3000}
        step={50}
        format={(v) => `${Math.round(v)}ms`}
        onChange={(imageLifespan) =>
          updateConfig({ imageLifespan: Math.round(imageLifespan) })
        }
      />

      <SliderField
        label="Reveal duration"
        value={config.revealDuration}
        min={100}
        max={800}
        step={25}
        format={(v) => `${Math.round(v)}ms`}
        onChange={(revealDuration) =>
          updateConfig({ revealDuration: Math.round(revealDuration) })
        }
      />

      <SliderField
        label="Fade duration"
        value={config.fadeDuration}
        min={100}
        max={800}
        step={25}
        format={(v) => `${Math.round(v)}ms`}
        onChange={(fadeDuration) =>
          updateConfig({ fadeDuration: Math.round(fadeDuration) })
        }
      />

      <SliderField
        label="Slice stagger"
        value={config.staggerDelay}
        min={10}
        max={80}
        step={5}
        format={(v) => `${Math.round(v)}ms`}
        onChange={(staggerDelay) =>
          updateConfig({ staggerDelay: Math.round(staggerDelay) })
        }
      />

      <SectionTitle>Layout</SectionTitle>

      <SliderField
        label="Max images"
        value={config.maxItems}
        min={1}
        max={20}
        step={1}
        format={(v) => `${Math.round(v)}`}
        onChange={(maxItems) =>
          updateConfig({ maxItems: Math.round(maxItems) })
        }
      />

      <SliderField
        label="Slice count"
        value={config.slicesCount}
        min={4}
        max={16}
        step={1}
        format={(v) => `${Math.round(v)}`}
        onChange={(slicesCount) =>
          updateConfig({ slicesCount: Math.round(slicesCount) })
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
        Defaults: {IMAGE_TRAIL_DEFAULT_CONFIG.blindDirection} blinds,{" "}
        {IMAGE_TRAIL_DEFAULT_CONFIG.imageLifespan}ms lifespan, up to{" "}
        {IMAGE_TRAIL_DEFAULT_CONFIG.maxItems} frames.
      </p>
    </div>
  )
}

export function ImageTrailDemo() {
  return <ImageTrailPreview />
}
