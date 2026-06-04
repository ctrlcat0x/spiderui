export type ComponentCategory =
  | "Primitives"
  | "Components"
  | "Visual Effects"
  | "Logo Clouds"
  | "Pricing";

const PRIMITIVE_SLUG_ORDER = ["avatar", "badge"] as const;

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
  "weeeee-hover": {
    title: "Weeee Hover",
    description:
      "Quote-word thumbnails with a giant headline swap on hover, per-character GSAP reveals, and a cursor dot that expands into a bubble.",
    category: "Components",
    slug: "weeeee-hover",
    addedAt: "2026-06-04",
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
      "Venetian-blind cursor image trail with staggered slice reveals and smoothed pointer tracking.",
    category: "Visual Effects",
    slug: "image-trail",
    addedAt: "2026-03-09",
    previewImage: "/previews/image-trail.png",
  },
  "sticker-trail": {
    title: "Sticker Trail",
    description:
      "Motion-powered cursor trail of drifting stickers that spawn and fade as you move the pointer.",
    category: "Visual Effects",
    slug: "sticker-trail",
    addedAt: "2026-06-01",
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
    category: "Primitives",
    slug: "avatar",
    addedAt: "2026-06-01",
  },
  badge: {
    title: "Badge",
    description:
      "A badge with semantic and full-spectrum color variants built on Base UI.",
    category: "Primitives",
    slug: "badge",
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
  "logo-cloud-1": {
    title: "Logo Cloud 1",
    description:
      "Animated logo cloud with staggered fade-in and group cycling.",
    category: "Logo Clouds",
    slug: "logo-cloud-1",
    addedAt: "2026-06-01",
  },
  "logo-cloud-2": {
    title: "Logo Cloud 2",
    description:
      "Animated logo cloud that cycles groups of 3 logos with spring blur transitions.",
    category: "Logo Clouds",
    slug: "logo-cloud-2",
    addedAt: "2026-06-01",
  },
  "logo-cloud-3": {
    title: "Logo Cloud 3",
    description:
      "CSS-animated logo carousel that cycles groups with vertical blur and slide transitions.",
    category: "Logo Clouds",
    slug: "logo-cloud-3",
    addedAt: "2026-06-01",
  },
  "logo-cloud-4": {
    title: "Logo Cloud 4",
    description:
      "CSS marquee logo cloud with configurable direction, speed, gap, and gradient fade edges.",
    category: "Logo Clouds",
    slug: "logo-cloud-4",
    addedAt: "2026-06-01",
  },
  "pricing-1": {
    title: "Pricing 1",
    description:
      "Modern pricing grid with animated sliding numbers, yearly billing toggle, and featured plan corner decorations.",
    category: "Pricing",
    slug: "pricing-1",
    addedAt: "2026-06-01",
  },
  "pricing-2": {
    title: "Pricing 2",
    description:
      "Three-column pricing with a gradient featured card and illustrated cursor decoration.",
    category: "Pricing",
    slug: "pricing-2",
    addedAt: "2026-06-01",
  },
  "pricing-3": {
    title: "Pricing 3",
    description:
      "Asymmetric three-column pricing with an elevated featured plan, amber badge, and security footer note.",
    category: "Pricing",
    slug: "pricing-3",
    addedAt: "2026-06-01",
  },
  "pricing-4": {
    title: "Pricing 4",
    description:
      "Horizontal list-style pricing with accent blobs, strikethrough prices, and optional recommended badge.",
    category: "Pricing",
    slug: "pricing-4",
    addedAt: "2026-06-01",
  },
  "pricing-5": {
    title: "Pricing 5",
    description:
      "Tabbed individuals/teams pricing grid with coloured card backdrops, Avatar orbs, grain overlays, and feature checklists.",
    category: "Pricing",
    slug: "pricing-5",
    addedAt: "2026-06-01",
  },
};

export function getComponent(slug: string) {
  return components[slug];
}

export function isPrimitiveComponent(slug: string): boolean {
  return components[slug]?.category === "Primitives";
}

export function getComponentDocsHref(slug: string): string {
  if (isPrimitiveComponent(slug)) {
    return `/docs/components/primitives/${slug}`;
  }
  return `/docs/components/${slug}`;
}

function primitiveSlugSortIndex(slug: string): number {
  const index = PRIMITIVE_SLUG_ORDER.indexOf(
    slug as (typeof PRIMITIVE_SLUG_ORDER)[number],
  )
  return index === -1 ? PRIMITIVE_SLUG_ORDER.length : index
}

export function getPrimitiveSlugs(): string[] {
  return Object.values(components)
    .filter((c) => c.category === "Primitives")
    .map((c) => c.slug)
    .sort((a, b) => primitiveSlugSortIndex(a) - primitiveSlugSortIndex(b))
}

export function compareComponentsInCategory(
  a: ComponentMetadata,
  b: ComponentMetadata,
): number {
  if (a.category === "Primitives" && b.category === "Primitives") {
    return primitiveSlugSortIndex(a.slug) - primitiveSlugSortIndex(b.slug)
  }
  return a.title.localeCompare(b.title)
}
