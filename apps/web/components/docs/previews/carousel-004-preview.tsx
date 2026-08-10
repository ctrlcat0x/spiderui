"use client";

import {
  Carousel004,
  type Carousel004Item,
} from "@workspace/ui/components/carousel-004";

const flowerImages: Carousel004Item[] = [
  {
    id: "poppies",
    src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=85",
    alt: "Pink poppies against a pale blue sky",
  },
  {
    id: "red-flower",
    src: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1600&q=85",
    alt: "Red flower in soft daylight",
  },
  {
    id: "tropical-leaf",
    src: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1600&q=85",
    alt: "Large tropical green leaf",
  },
  {
    id: "white-flowers",
    src: "https://images.unsplash.com/photo-1469259943454-aa100abba749?auto=format&fit=crop&w=1600&q=85",
    alt: "White flowers in a garden",
  },
  {
    id: "houseplant",
    src: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=85",
    alt: "Green houseplant leaves",
  },
  {
    id: "orchid",
    src: "https://images.unsplash.com/photo-1531058240690-006c446962d8?auto=format&fit=crop&w=1600&q=85",
    alt: "Pink orchid in bloom",
  },
];

export function Carousel004Preview() {
  return (
    <div className="flex min-h-[620px] w-full items-center justify-center p-5 sm:p-8">
      <Carousel004 items={flowerImages} loop className="w-full max-w-5xl" />
    </div>
  );
}
