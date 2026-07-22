"use client";

import type { CSSProperties, ReactNode } from "react";
import { EncryptedText } from "@workspace/ui/components/encrypted-text";

import {
  ENCRYPTED_TEXT_DEFAULT_CONFIG,
  type EncryptedTextConfig,
  usePlaygroundStore,
} from "@/hooks/use-playground-store";

const sliderClassName =
  "h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-300/70 dark:bg-zinc-700/70";

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
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="flex items-center justify-between text-sm">
        <span className="text-foreground/90">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {value}ms
        </span>
      </span>
      <input
        type="range"
        min={10}
        max={200}
        step={5}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={sliderClassName}
      />
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm text-foreground/90">
      {label}
      <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        {value.toUpperCase()}
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="size-8 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
          aria-label={`${label} color`}
        />
      </span>
    </label>
  );
}

export function EncryptedTextPlayground({
  config: configOverride,
}: {
  config?: EncryptedTextConfig;
}) {
  const storeConfig = usePlaygroundStore((state) => state.encryptedTextConfig);
  const remountVersion = usePlaygroundStore(
    (state) => state.encryptedTextRemountVersion,
  );
  const config = configOverride ?? storeConfig;
  const usesDefaultColors =
    config.encryptedColor === ENCRYPTED_TEXT_DEFAULT_CONFIG.encryptedColor &&
    config.revealedColor === ENCRYPTED_TEXT_DEFAULT_CONFIG.revealedColor;
  const colorVariables = {
    "--encrypted-text-color": config.encryptedColor,
    "--revealed-text-color": config.revealedColor,
  } as CSSProperties;

  return (
    <div
      className="flex h-full min-h-[320px] w-full items-center justify-center px-6 py-16"
      style={usesDefaultColors ? undefined : colorVariables}
    >
      <EncryptedText
        key={remountVersion}
        text={config.text}
        revealDelayMs={config.revealDelayMs}
        flipDelayMs={config.flipDelayMs}
        encryptedClassName={
          usesDefaultColors
            ? "text-muted-foreground"
            : "text-[var(--encrypted-text-color)]"
        }
        revealedClassName={
          usesDefaultColors
            ? "text-foreground"
            : "text-[var(--revealed-text-color)]"
        }
        className="text-center font-mono text-2xl font-medium tracking-tight sm:text-4xl"
      />
    </div>
  );
}

export function EncryptedTextPersonalizePanel() {
  const config = usePlaygroundStore((state) => state.encryptedTextConfig);
  const updateConfig = usePlaygroundStore(
    (state) => state.updateEncryptedTextConfig,
  );
  const resetConfig = usePlaygroundStore(
    (state) => state.resetEncryptedTextConfig,
  );
  const replayPreview = usePlaygroundStore(
    (state) => state.resetEncryptedTextPreview,
  );

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <div className="space-y-2">
        <SectionTitle>Content</SectionTitle>
        <label htmlFor="encrypted-text-content" className="sr-only">
          Text
        </label>
        <textarea
          id="encrypted-text-content"
          value={config.text}
          rows={3}
          maxLength={120}
          onChange={(event) => updateConfig({ text: event.target.value })}
          className="w-full resize-none rounded-md border border-border/70 bg-transparent px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/25"
        />
      </div>

      <div className="space-y-4">
        <SectionTitle>Timing</SectionTitle>
        <SliderField
          label="Reveal delay"
          value={config.revealDelayMs}
          onChange={(revealDelayMs) => updateConfig({ revealDelayMs })}
        />
        <SliderField
          label="Scramble speed"
          value={config.flipDelayMs}
          onChange={(flipDelayMs) => updateConfig({ flipDelayMs })}
        />
      </div>

      <div className="space-y-3">
        <SectionTitle>Colors</SectionTitle>
        <ColorField
          label="Scrambled"
          value={config.encryptedColor}
          onChange={(encryptedColor) => updateConfig({ encryptedColor })}
        />
        <ColorField
          label="Revealed"
          value={config.revealedColor}
          onChange={(revealedColor) => updateConfig({ revealedColor })}
        />
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
