"use client";

import type { ReactNode } from "react";
import { ScrambleText } from "@workspace/ui/components/scramble-text";

import { cn } from "@/lib/utils";
import {
  type ScrambleTextCaretPreset,
  type ScrambleTextConfig,
  usePlaygroundStore,
} from "@/hooks/use-playground-store";

const CARET_LABELS: Record<ScrambleTextCaretPreset, string> = {
  line: "Line",
  block: "Block",
  underscore: "Underscore",
  none: "None",
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
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
    <label className="flex flex-col gap-2">
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

export function ScrambleTextPreview({
  config: configOverride,
}: {
  config?: ScrambleTextConfig;
}) {
  const storeConfig = usePlaygroundStore((state) => state.scrambleTextConfig);
  const remountVersion = usePlaygroundStore(
    (state) => state.scrambleTextRemountVersion,
  );
  const config = configOverride ?? storeConfig;

  return (
    <div className="flex h-full min-h-[320px] w-full items-center justify-center overflow-hidden px-6 py-16">
      <ScrambleText
        key={remountVersion}
        text={config.text}
        scrambleSpeed={config.scrambleSpeed}
        scrambledLetterCount={config.scrambledLetterCount}
        caretVariant={config.caretVariant}
        showCaret={config.caretVariant !== "none"}
        blinkCaret={config.blinkCaret}
        hideCaretOnComplete={config.hideCaretOnComplete}
        scrambledClassName="text-orange-400/80"
        caretClassName="text-foreground"
        className="font-mono text-2xl font-medium leading-none tracking-tight text-foreground sm:text-4xl"
      />
    </div>
  );
}

export function ScrambleTextPersonalizePanel() {
  const config = usePlaygroundStore((state) => state.scrambleTextConfig);
  const updateConfig = usePlaygroundStore(
    (state) => state.updateScrambleTextConfig,
  );
  const resetConfig = usePlaygroundStore(
    (state) => state.resetScrambleTextConfig,
  );
  const replayPreview = usePlaygroundStore(
    (state) => state.resetScrambleTextPreview,
  );

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <div>
        <SectionTitle>Content</SectionTitle>
        <label htmlFor="scramble-text-content" className="sr-only">
          Text
        </label>
        <textarea
          id="scramble-text-content"
          value={config.text}
          rows={3}
          maxLength={100}
          onChange={(event) => updateConfig({ text: event.target.value })}
          className="w-full resize-none rounded-md border border-border/70 bg-transparent px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/25"
        />
      </div>

      <div>
        <SectionTitle>Caret</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CARET_LABELS) as ScrambleTextCaretPreset[]).map(
            (caretVariant) => (
              <button
                key={caretVariant}
                type="button"
                onClick={() => updateConfig({ caretVariant })}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                  config.caretVariant === caretVariant
                    ? "border-foreground bg-foreground text-background"
                    : "border-border/70 text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={config.caretVariant === caretVariant}
              >
                {CARET_LABELS[caretVariant]}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SectionTitle>Animation</SectionTitle>
        <SliderField
          label="Reveal speed"
          value={config.scrambleSpeed}
          min={20}
          max={160}
          step={5}
          format={(value) => `${value}ms`}
          onChange={(scrambleSpeed) => updateConfig({ scrambleSpeed })}
        />
        <SliderField
          label="Scrambled characters"
          value={config.scrambledLetterCount}
          min={0}
          max={8}
          step={1}
          format={(value) => String(value)}
          onChange={(scrambledLetterCount) =>
            updateConfig({ scrambledLetterCount })
          }
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-foreground/90">
          Blink caret
          <input
            type="checkbox"
            checked={config.blinkCaret}
            disabled={config.caretVariant === "none"}
            onChange={(event) =>
              updateConfig({ blinkCaret: event.target.checked })
            }
            className="size-4 accent-foreground disabled:opacity-40"
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-foreground/90">
          Hide on complete
          <input
            type="checkbox"
            checked={config.hideCaretOnComplete}
            disabled={config.caretVariant === "none"}
            onChange={(event) =>
              updateConfig({ hideCaretOnComplete: event.target.checked })
            }
            className="size-4 accent-foreground disabled:opacity-40"
          />
        </label>
      </div>

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
