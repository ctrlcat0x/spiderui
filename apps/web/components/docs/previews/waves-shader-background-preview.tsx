"use client";

import { WavesShaderBackground } from "@workspace/ui/components/waves-shader-background";

export function WavesShaderBackgroundPreview() {
  return (
    <div className="flex min-h-[500px] w-full items-center justify-center p-6 sm:p-10">
      <div className="aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-border/70 bg-muted shadow-sm">
        <WavesShaderBackground />
      </div>
    </div>
  );
}
