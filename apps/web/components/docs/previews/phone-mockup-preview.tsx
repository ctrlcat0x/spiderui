"use client";

import {
  PhoneCarousel,
  type ImageItem,
} from "@workspace/ui/components/phone-mockup";

const SCREENS: ImageItem[] = [
  {
    src: "https://res.cloudinary.com/harshitproject/image/upload/v1746774805/Behance-screen.png",
    alt: "Behance app on iPhone",
  },
  {
    src: "https://res.cloudinary.com/harshitproject/image/upload/v1746774805/Notion-screen.png",
    alt: "Notion app on iPhone",
  },
  {
    src: "https://res.cloudinary.com/harshitproject/image/upload/v1746774806/One-screen.png",
    alt: "One app on iPhone",
  },
  {
    src: "https://res.cloudinary.com/harshitproject/image/upload/v1746774807/Reddit-nj7hwh.png",
    alt: "Reddit app on iPhone",
  },
];

export function PhoneMockupPreview() {
  return (
    <div className="flex min-h-[620px] w-full items-center justify-center overflow-hidden bg-muted/35 px-4 py-8">
      <PhoneCarousel
        images={SCREENS}
        interval={3_500}
        className="max-w-[760px]"
      />
    </div>
  );
}
