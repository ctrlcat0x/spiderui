"use client";

import { UnderlineHover } from "@workspace/ui/components/underline-hover";

export function UnderlineHoverPreview() {
  return (
    <div className="flex min-h-[360px] w-full items-center justify-center px-6 py-16 text-foreground">
      <UnderlineHover
        href="#"
        onClick={(event) => event.preventDefault()}
        underlineColor="#ff4b2b"
        className="text-5xl tracking-tight sm:text-6xl"
      >
        Hover me
      </UnderlineHover>
    </div>
  );
}
