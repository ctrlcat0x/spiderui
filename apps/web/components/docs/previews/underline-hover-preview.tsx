"use client";

import {
  DEFAULT_UNDERLINE_PATHS,
  UnderlineHover,
} from "@workspace/ui/components/underline-hover";

const PREVIEW_PATHS = [DEFAULT_UNDERLINE_PATHS[2]];

export function UnderlineHoverPreview() {
  return (
    <div className="flex min-h-[360px] w-full items-center justify-center bg-[#111111] px-6 py-16 text-zinc-100">
      <UnderlineHover
        href="#"
        onClick={(event) => event.preventDefault()}
        paths={PREVIEW_PATHS}
        underlineColor="#ff4b2b"
        className="text-5xl tracking-tight sm:text-6xl"
      >
        Hover me
      </UnderlineHover>
    </div>
  );
}
