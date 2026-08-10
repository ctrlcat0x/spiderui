"use client";

import { TextRoll } from "@workspace/ui/components/text-roll";

const COMPONENTS = ["tabs", "button", "dialog", "tooltip"];

export function TextRollPreview() {
  return (
    <div className="flex min-h-[360px] w-full items-center justify-center px-6 py-16">
      <div className="flex items-baseline gap-[0.7ch] font-mono text-2xl tracking-tight sm:text-4xl">
        <span className="text-muted-foreground">$ npx shadcn add</span>
        <TextRoll
          items={COMPONENTS}
          interval={1_500}
          duration={0.45}
          className="text-foreground"
        />
      </div>
    </div>
  );
}
