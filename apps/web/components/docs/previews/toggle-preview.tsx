"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  TOGGLE_DEFAULT_CONFIG,
  usePlaygroundStore,
} from "@/hooks/use-playground-store";
import { Toggle } from "@workspace/ui/components/toggle";

export function TogglePreview({ disabled = false }: { disabled?: boolean }) {
  const [enabled, setEnabled] = useState(true);
  const config = usePlaygroundStore((state) => state.toggleConfig);

  return (
    <div className="flex min-h-[420px] w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-5">
        <Toggle
          checked={enabled}
          onCheckedChange={setEnabled}
          accentColor={config.accentColor}
          size={config.size}
          disabled={disabled || config.disabled}
          aria-label="Enable notifications"
        />
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Notifications {enabled ? "on" : "off"}
        </p>
      </div>
    </div>
  );
}

const ACCENT_PRESETS = ["#10b981", "#3b82f6", "#8b5cf6", "#f43f5e"];
const SIZES = ["sm", "default", "lg"] as const;

export function TogglePersonalizePanel() {
  const config = usePlaygroundStore((state) => state.toggleConfig);
  const updateConfig = usePlaygroundStore((state) => state.updateToggleConfig);
  const resetConfig = usePlaygroundStore((state) => state.resetToggleConfig);

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <div>
        <label
          htmlFor="toggle-accent-color"
          className="mb-3 block text-[10px] font-mono uppercase tracking-widest text-muted-foreground"
        >
          Accent color
        </label>
        <div className="flex items-center gap-3">
          <input
            id="toggle-accent-color"
            type="color"
            value={config.accentColor}
            onChange={(event) =>
              updateConfig({ accentColor: event.target.value })
            }
            className="size-10 cursor-pointer rounded-md border border-border bg-transparent p-1"
          />
          <code className="text-xs text-muted-foreground">
            {config.accentColor}
          </code>
        </div>
        <div className="mt-3 flex gap-2">
          {ACCENT_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Use ${color}`}
              aria-pressed={config.accentColor === color}
              onClick={() => updateConfig({ accentColor: color })}
              className={cn(
                "size-7 rounded-full border-2 transition-transform active:scale-[0.96]",
                config.accentColor === color
                  ? "border-foreground"
                  : "border-transparent",
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Size
        </div>
        <div className="flex gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={config.size === size}
              onClick={() => updateConfig({ size })}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
                config.size === size
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/70 text-muted-foreground hover:text-foreground",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground/90">
        <input
          type="checkbox"
          checked={config.disabled}
          onChange={(event) => updateConfig({ disabled: event.target.checked })}
          className="size-4 rounded border-border"
        />
        Disabled
      </label>

      <button
        type="button"
        onClick={resetConfig}
        className="rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Reset props
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Default accent: {TOGGLE_DEFAULT_CONFIG.accentColor}
      </p>
    </div>
  );
}
