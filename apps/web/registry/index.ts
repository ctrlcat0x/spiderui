export type ComponentCategory =
  | "Components"
  | "Visual Effects";

export interface ComponentMetadata {
  title: string;
  description: string;
  category: ComponentCategory;
  slug: string;
  addedAt?: string;
  previewImage?: string;
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
    previewImage: "/previews/collection-surfer.png",
  },
  "scroll-split-card": {
    title: "Scroll Split Card",
    description: "A scroll-driven interactive card that splits into three panels and flips.",
    category: "Components",
    slug: "scroll-split-card",
    addedAt: "2026-04-03",
    previewImage: "/previews/scroll-split-card.png",
  },
  "scrub-input": {
    title: "Scrub Input",
    description: "An inline interactive slider styled as a pill.",
    category: "Components",
    slug: "scrub-input",
    addedAt: "2026-02-27",
    previewImage: "/previews/scrub-input.png",
  },
  "signature": {
    title: "Signature",
    description: "An animated SVG signature effect that draws out text as if hand-written.",
    category: "Components",
    slug: "signature",
    addedAt: "2026-03-17",
    previewImage: "/previews/signature.png",
  },
  "image-trail": {
    title: "Image Trail",
    description:
      "Leaves a trail of images behind the cursor with a premium delay fade.",
    category: "Visual Effects",
    slug: "image-trail",
    addedAt: "2026-03-09",
    previewImage: "/previews/image-trail.png",
  },
  "card-stroke": {
    title: "Card Stroke",
    description:
      "A card with animated SVG strokes and word-by-word text reveal on hover.",
    category: "Components",
    slug: "card-stroke",
    addedAt: "2026-06-01",
  },
  avatar: {
    title: "Avatar",
    description:
      "An animated AI orb avatar with blinking eyes, 12 colors, 3 sizes, and 3 shapes.",
    category: "Components",
    slug: "avatar",
    addedAt: "2026-06-01",
  },
  footer: {
    title: "Footer",
    description:
      "A scroll-driven footer with animated spectrum bars, inspired by Dia browser.",
    category: "Components",
    slug: "footer",
    addedAt: "2026-06-01",
  },
  "greeting-preloader": {
    title: "Greetings Preloader",
    description:
      "A multilingual greeting preloader with Motion transitions and a GSAP page reveal.",
    category: "Components",
    slug: "greeting-preloader",
    addedAt: "2026-06-01",
  },
  "spotify-card": {
    title: "Spotify Card",
    description:
      "Spotify track card with blurred art, vinyl animation, preview playback, and seek controls.",
    category: "Components",
    slug: "spotify-card",
    addedAt: "2026-06-01",
  },
  "vertical-spotify-card": {
    title: "Vertical Spotify Card",
    description:
      "Tall vertical Spotify card with progressive blur album art, seek bar, and transport controls.",
    category: "Components",
    slug: "vertical-spotify-card",
    addedAt: "2026-06-01",
  },
  "album-cards": {
    title: "Album Cards",
    description:
      "Stacked Spotify album covers with click-to-eject spinning vinyl, reflections, and neighbor dimming.",
    category: "Components",
    slug: "album-cards",
    addedAt: "2026-06-01",
  },
};

export function getComponent(slug: string) {
  return components[slug];
}
