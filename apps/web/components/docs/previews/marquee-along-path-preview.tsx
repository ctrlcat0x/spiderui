"use client";

import { MarqueeAlongPath } from "@workspace/ui/components/marquee-along-path";

const tiles = [
  { label: "Aa", className: "bg-[#ff4f2e] text-black" },
  { label: "&", className: "bg-[#a8b49a] text-[#4f5948]" },
  { label: "g", className: "bg-[#58bdc2] text-black" },
  { label: "0123", className: "bg-[#dfab72] text-[#fa442c]" },
  { label: "S", className: "bg-[#f2f0eb] text-black" },
  { label: "R", className: "bg-[#b597c8] text-[#23311c]" },
  { label: "AG", className: "bg-[#f4b8d1] text-black" },
  { label: "8", className: "bg-[#7892c2] text-[#ec7950]" },
];

export function MarqueeAlongPathPreview() {
  return (
    <div className="flex min-h-[620px] w-full items-center justify-center bg-background p-5 sm:p-8">
      <MarqueeAlongPath
        aria-label="Typography samples moving along a curved path"
        path="M -35 245 C 145 345 245 240 300 105 C 345 -10 470 45 435 155 C 395 280 570 300 795 195"
        viewBox="0 0 760 360"
        speed={7}
        repeat={3}
        draggable
        pauseOnHover
        className="h-[460px] w-full max-w-4xl rounded-3xl border bg-muted/20"
        itemClassName="drop-shadow-sm"
      >
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className={`flex size-20 items-center justify-center overflow-hidden border border-black/10 font-serif text-4xl font-semibold shadow-sm sm:size-24 ${tile.className}`}
          >
            {tile.label}
          </div>
        ))}
      </MarqueeAlongPath>
    </div>
  );
}
