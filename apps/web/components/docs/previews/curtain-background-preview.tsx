"use client";

import { CurtainBackground } from "@workspace/ui/components/curtain-background";

export function CurtainBackgroundPreview() {
  return (
    <div className="flex min-h-[480px] w-full items-center justify-center p-6 sm:p-10">
      <div className="aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-border/70 bg-muted shadow-sm">
        <CurtainBackground />
      </div>
    </div>
  );
}
