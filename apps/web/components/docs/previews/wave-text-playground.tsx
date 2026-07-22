"use client";

import type { ReactNode } from "react";
import {
  WaveText,
  WAVE_TEXT_CHARACTER_PRESETS,
  type WaveTextCharacterPreset,
} from "@workspace/ui/components/wave-text";

import { cn } from "@/lib/utils";
import {
  type WaveTextConfig,
  usePlaygroundStore,
} from "@/hooks/use-playground-store";

const PRESET_LABELS: Record<WaveTextCharacterPreset, string> = {
  letters: "Letters",
  symbols: "Symbols",
  blocks: "░▒▓█",
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
      {children}
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="flex items-center justify-between text-sm">
        <span className="text-foreground/90">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {format(value)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-300/70 dark:bg-zinc-700/70"
      />
    </label>
  );
}

export function WaveTextPlayground({
  config: configOverride,
}: {
  config?: WaveTextConfig;
}) {
  const storeConfig = usePlaygroundStore((state) => state.waveTextConfig);
  const remountVersion = usePlaygroundStore(
    (state) => state.waveTextRemountVersion,
  );
  const config = configOverride ?? storeConfig;

  return (
    <div className="flex h-full min-h-[320px] w-full items-center justify-center overflow-hidden px-6 py-16">
      <div className="space-y-5 text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
          Move across the text
        </p>
        <WaveText
          key={remountVersion}
          text={config.text}
          preset={config.preset}
          duration={config.duration}
          spread={config.spread}
          preserveSpaces={config.preserveSpaces}
          className="max-w-full font-mono text-2xl font-medium tracking-tight text-foreground sm:text-4xl"
        />
      </div>
    </div>
  );
}

export function WaveTextPersonalizePanel() {
  const config = usePlaygroundStore((state) => state.waveTextConfig);
  const updateConfig = usePlaygroundStore(
    (state) => state.updateWaveTextConfig,
  );
  const resetConfig = usePlaygroundStore((state) => state.resetWaveTextConfig);
  const replayPreview = usePlaygroundStore(
    (state) => state.resetWaveTextPreview,
  );

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <div className="space-y-2">
        <SectionTitle>Content</SectionTitle>
        <label htmlFor="wave-text-content" className="sr-only">
          Text
        </label>
        <textarea
          id="wave-text-content"
          value={config.text}
          rows={3}
          maxLength={80}
          onChange={(event) => updateConfig({ text: event.target.value })}
          className="w-full resize-none rounded-md border border-border/70 bg-transparent px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/25"
        />
      </div>

      <div>
        <SectionTitle>Character preset</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {(
            Object.keys(
              WAVE_TEXT_CHARACTER_PRESETS,
            ) as WaveTextCharacterPreset[]
          ).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => updateConfig({ preset })}
              className={cn(
                "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                config.preset === preset
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/70 text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={config.preset === preset}
            >
              {PRESET_LABELS[preset]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle>Motion</SectionTitle>
        <SliderField
          label="Wave duration"
          value={config.duration}
          min={300}
          max={1800}
          step={50}
          format={(value) => `${value}ms`}
          onChange={(duration) => updateConfig({ duration })}
        />
        <SliderField
          label="Wave spread"
          value={config.spread}
          min={0.5}
          max={2}
          step={0.1}
          format={(value) => `${value.toFixed(1)}×`}
          onChange={(spread) => updateConfig({ spread })}
        />
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-foreground/90">
        Preserve spaces
        <input
          type="checkbox"
          checked={config.preserveSpaces}
          onChange={(event) =>
            updateConfig({ preserveSpaces: event.target.checked })
          }
          className="size-4 accent-foreground"
        />
      </label>

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
  );
}
