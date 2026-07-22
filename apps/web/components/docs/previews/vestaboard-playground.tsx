"use client";

import type { ChangeEvent, ReactNode } from "react";
import {
  Vestaboard,
  VESTABOARD_COLOR_TOKENS,
} from "@workspace/ui/components/vestaboard";
import { cn } from "@/lib/utils";
import { usePlaygroundStore } from "@/hooks/use-playground-store";

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
    {children}
  </div>
);

function NumberControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="flex items-center justify-between gap-3">
        <span className="text-foreground/90">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={handleChange}
        onChange={handleChange}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
        aria-label={label}
      />
    </label>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <label className="flex items-center gap-3 rounded-lg border border-border/70 p-2.5">
      <input
        type="color"
        value={value}
        onInput={handleChange}
        onChange={handleChange}
        className="size-8 cursor-pointer rounded border-0 bg-transparent p-0"
        aria-label={`${label} color`}
      />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="font-mono text-[10px] uppercase text-muted-foreground">
          {value}
        </span>
      </span>
    </label>
  );
}

export function VestaboardPlayground() {
  const config = usePlaygroundStore((state) => state.vestaboardConfig);
  const renderVersion = usePlaygroundStore(
    (state) => state.vestaboardRenderVersion,
  );

  return (
    <div className="flex size-full items-center justify-center bg-[#090909] p-4 sm:p-8">
      <Vestaboard
        key={renderVersion}
        text={config.text}
        rows={config.rows}
        columns={config.columns}
        flipSpeed={config.flipSpeed}
        colorTokens={
          config.enableColorTiles ? config.colorTileColors : undefined
        }
        colors={{
          board: config.boardColor,
          flap: config.flapColor,
          text: config.textColor,
        }}
      />
    </div>
  );
}

export function VestaboardPersonalizePanel() {
  const config = usePlaygroundStore((state) => state.vestaboardConfig);
  const updateConfig = usePlaygroundStore(
    (state) => state.updateVestaboardConfig,
  );
  const resetConfig = usePlaygroundStore(
    (state) => state.resetVestaboardConfig,
  );
  const resetPreview = usePlaygroundStore(
    (state) => state.resetVestaboardPreview,
  );

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <SectionTitle>Message</SectionTitle>
      <textarea
        value={config.text}
        onChange={(event) => updateConfig({ text: event.target.value })}
        rows={4}
        maxLength={320}
        className="w-full resize-none rounded-lg border border-border/70 bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        aria-label="Vestaboard message"
      />

      <SectionTitle>Board</SectionTitle>
      <div className="flex flex-col gap-5">
        <NumberControl
          label="Rows"
          value={config.rows}
          min={1}
          max={10}
          onChange={(rows) => updateConfig({ rows })}
        />
        <NumberControl
          label="Columns"
          value={config.columns}
          min={4}
          max={32}
          onChange={(columns) => updateConfig({ columns })}
        />
        <NumberControl
          label="Flip speed"
          value={config.flipSpeed}
          min={80}
          max={500}
          step={10}
          unit="ms"
          onChange={(flipSpeed) => {
            updateConfig({ flipSpeed });
            resetPreview();
          }}
        />
      </div>

      <SectionTitle>Colors</SectionTitle>
      <button
        type="button"
        onClick={() =>
          updateConfig({ enableColorTiles: !config.enableColorTiles })
        }
        className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        aria-pressed={config.enableColorTiles}
      >
        Color tiles
        <span
          className={cn(
            "h-5 w-9 rounded-full p-0.5 transition-colors",
            config.enableColorTiles ? "bg-foreground" : "bg-muted",
          )}
          aria-hidden="true"
        >
          <span
            className={cn(
              "block size-4 rounded-full bg-background transition-transform",
              config.enableColorTiles ? "translate-x-4" : "translate-x-0",
            )}
          />
        </span>
      </button>
      {config.enableColorTiles ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {Object.entries(config.colorTileColors).map(([name, color]) => (
              <button
                key={name}
                type="button"
                onClick={() =>
                  updateConfig({ text: `${config.text} {${name}}` })
                }
                className="size-8 rounded-md border border-border/70 shadow-sm transition-transform active:scale-95"
                style={{ backgroundColor: color }}
                aria-label={`Append ${name} tile`}
                title={`{${name}}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Object.keys(VESTABOARD_COLOR_TOKENS).map((name) => (
              <ColorControl
                key={name}
                label={`${name[0]?.toUpperCase()}${name.slice(1)} tile`}
                value={config.colorTileColors[name] ?? "#000000"}
                onChange={(value) =>
                  updateConfig({
                    colorTileColors: {
                      ...config.colorTileColors,
                      [name]: value,
                    },
                  })
                }
              />
            ))}
          </div>
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <ColorControl
          label="Board"
          value={config.boardColor}
          onChange={(boardColor) => updateConfig({ boardColor })}
        />
        <ColorControl
          label="Flaps"
          value={config.flapColor}
          onChange={(flapColor) => updateConfig({ flapColor })}
        />
        <ColorControl
          label="Text"
          value={config.textColor}
          onChange={(textColor) => updateConfig({ textColor })}
        />
      </div>

      <button
        type="button"
        onClick={resetConfig}
        className="rounded-lg border border-border/70 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        Reset
      </button>
    </div>
  );
}
