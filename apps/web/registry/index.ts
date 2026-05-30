export type ComponentCategory =
  | "Components"
  | "Visual Effects";

export interface ComponentMetadata {
  title: string;
  description: string;
  category: ComponentCategory;
  slug: string;
  addedAt?: string;
  previewVideo?: string;
}

const NEW_BADGE_DURATION_MS = 5 * 24 * 60 * 60 * 1000;

export function isNewComponent(component: ComponentMetadata): boolean {
  if (!component.addedAt) return false;
  const addedTime = new Date(component.addedAt).getTime();
  return Date.now() - addedTime < NEW_BADGE_DURATION_MS;
}

export const components: Record<string, ComponentMetadata> = {
  "collection-surfer": {
    title: "Collection Surfer",
    description: "Smooth surfing interaction for browsing collections.",
    category: "Components",
    slug: "collection-surfer",
    previewVideo:
      "https://pub-a50e7f4ea75a4970a1738e50d53b6eb1.r2.dev/preview-videos/component-animations/collectionsurfer.mov",
  },
  "scroll-split-card": {
    title: "Scroll Split Card",
    description: "A scroll-driven interactive card that splits into three panels and flips.",
    category: "Components",
    slug: "scroll-split-card",
    addedAt: "2026-04-03",
    previewVideo:
      "https://pub-a50e7f4ea75a4970a1738e50d53b6eb1.r2.dev/preview-videos/component-animations/scrollsplitcard.webm",
  },
  "scrub-input": {
    title: "Scrub Input",
    description: "An inline interactive slider styled as a pill.",
    category: "Components",
    slug: "scrub-input",
    addedAt: "2026-02-27",
    previewVideo:
      "https://pub-a50e7f4ea75a4970a1738e50d53b6eb1.r2.dev/preview-videos/component-animations/scrubinput.mp4",
  },
  "signature": {
    title: "Signature",
    description: "An animated SVG signature effect that draws out text as if hand-written.",
    category: "Components",
    slug: "signature",
    addedAt: "2026-03-17",
    previewVideo:
      "https://pub-a50e7f4ea75a4970a1738e50d53b6eb1.r2.dev/preview-videos/component-animations/signature.webm",
  },
  "image-trail": {
    title: "Image Trail",
    description:
      "Leaves a trail of images behind the cursor with a premium delay fade.",
    category: "Visual Effects",
    slug: "image-trail",
    addedAt: "2026-03-09",
    previewVideo:
      "https://pub-a50e7f4ea75a4970a1738e50d53b6eb1.r2.dev/preview-videos/visual-effects/imagetrail.webm",
  },
};

export function getComponent(slug: string) {
  return components[slug];
}
