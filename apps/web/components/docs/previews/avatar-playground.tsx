"use client"

import {
  Avatar,
  type AvatarShape,
  type AvatarSize,
  AVATAR_COLORS,
} from "@workspace/ui/components/avatar"
import { cn } from "@/lib/utils"
import {
  AVATAR_DEFAULT_CONFIG,
  type AvatarConfig,
  usePlaygroundStore,
} from "@/hooks/use-playground-store"

const SIZES: AvatarSize[] = ["sm", "md", "lg"]
const SHAPES: AvatarShape[] = ["circle", "square", "squircle"]

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
    {children}
  </div>
)

type AvatarPlaygroundProps = {
  config?: AvatarConfig
  layout?: "single" | "shapes"
}

export function AvatarPlayground({
  config: configOverride,
  layout = "single",
}: AvatarPlaygroundProps) {
  const storeConfig = usePlaygroundStore((state) => state.avatarConfig)
  const config = configOverride ?? storeConfig

  if (layout === "shapes") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-8">
        <div className="flex items-center gap-4">
          <Avatar color="pink" size="md" shape="square" />
          <Avatar color="blue" size="md" shape="circle" />
          <Avatar color="green" size="md" shape="squircle" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <Avatar
        color={config.color}
        size={config.size}
        shape={config.shape}
        blinking={config.blinking}
      />
    </div>
  )
}

export function AvatarPersonalizePanel() {
  const config = usePlaygroundStore((state) => state.avatarConfig)
  const updateAvatarConfig = usePlaygroundStore((state) => state.updateAvatarConfig)
  const resetAvatarConfig = usePlaygroundStore((state) => state.resetAvatarConfig)

  const update = (updates: Partial<AvatarConfig>) => {
    updateAvatarConfig(updates)
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <SectionTitle>Color</SectionTitle>
      <div className="grid grid-cols-4 gap-2">
        {AVATAR_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => update({ color })}
            className={cn(
              "rounded-md border px-2 py-1.5 text-[10px] font-medium capitalize transition-colors",
              config.color === color
                ? "border-foreground bg-foreground text-background"
                : "border-border/70 text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={config.color === color}
          >
            {color}
          </button>
        ))}
      </div>

      <SectionTitle>Size</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => update({ size })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium uppercase transition-colors",
              config.size === size
                ? "border-foreground bg-foreground text-background"
                : "border-border/70 text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={config.size === size}
          >
            {size}
          </button>
        ))}
      </div>

      <SectionTitle>Shape</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {SHAPES.map((shape) => (
          <button
            key={shape}
            type="button"
            onClick={() => update({ shape })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
              config.shape === shape
                ? "border-foreground bg-foreground text-background"
                : "border-border/70 text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={config.shape === shape}
          >
            {shape}
          </button>
        ))}
      </div>

      <SectionTitle>Blinking</SectionTitle>
      <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground/90">
        <input
          type="checkbox"
          checked={config.blinking}
          onChange={(e) => update({ blinking: e.target.checked })}
          className="size-4 rounded border-border"
        />
        Animate eyes
      </label>

      <button
        type="button"
        onClick={resetAvatarConfig}
        className="mt-auto rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Reset to defaults
      </button>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Tap the orb in the preview for squash-and-stretch feedback.
      </p>
    </div>
  )
}
