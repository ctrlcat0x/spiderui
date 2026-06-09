export type ComponentCategory =
  | "Primitives"
  | "Components"
  | "Text Effects"
  | "Card Interactions"
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
  "opos-hover": {
    title: "OPOS Hover",
    description:
      "Quote-word thumbnails with a giant headline swap on hover, per-character GSAP reveals, and a cursor dot that expands into a bubble.",
    category: "Components",
    slug: "opos-hover",
    addedAt: "2026-06-04",
    previewImage: "/previews/opos-hover.png",
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
    previewImage: "/previews/sticker-trail.png",
  },
  "card-stroke": {
    title: "Card Stroke",
    description:
      "A card with animated SVG strokes and word-by-word text reveal on hover.",
    category: "Card Interactions",
    slug: "card-stroke",
    addedAt: "2026-06-01",
    previewImage: "/previews/card-stroke.png",
  },
  avatar: {
    title: "Avatar",
    description:
      "An animated AI orb avatar with blinking eyes, 12 colors, 3 sizes, and 3 shapes.",
    category: "Primitives",
    slug: "avatar",
    addedAt: "2026-06-01",
    previewImage: "/previews/avatar.png",
  },
  badge: {
    title: "Badge",
    description:
      "A badge with semantic and full-spectrum color variants built on Base UI.",
    category: "Primitives",
    slug: "badge",
    addedAt: "2026-06-01",
    previewImage: "/previews/badge.png",
  },
  footer: {
    title: "Footer",
    description:
      "A scroll-driven footer with animated spectrum bars, inspired by Dia browser.",
    category: "Components",
    slug: "footer",
    addedAt: "2026-06-01",
    previewImage: "/previews/footer.png",
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
    previewImage: "/previews/spotify-card.png",
  },
  "vertical-spotify-card": {
    title: "Vertical Spotify Card",
    description:
      "Tall vertical Spotify card with progressive blur album art, seek bar, and transport controls.",
    category: "Components",
    slug: "vertical-spotify-card",
    addedAt: "2026-06-01",
    previewImage: "/previews/vertical-spotify-card.png",
  },
  "album-cards": {
    title: "Album Cards",
    description:
      "Stacked Spotify album covers with click-to-eject spinning vinyl, reflections, and neighbor dimming.",
    category: "Components",
    slug: "album-cards",
    addedAt: "2026-06-01",
    previewImage: "/previews/album-cards.png",
  },
  "mini-archive": {
    title: "Mini Archive",
    description:
      "A 3D glass folder with hinged cover, frosted blur, and stamp cards that fan out on open.",
    category: "Components",
    slug: "mini-archive",
    addedAt: "2026-06-05",
    previewImage: "/previews/mini-archive.png",
  },
  "fan-cards": {
    title: "Fan Cards",
    description:
      "A fan-out card stack with hover lift, spring focus, and receding background cards.",
    category: "Card Interactions",
    slug: "fan-cards",
    addedAt: "2026-06-05",
    previewImage: "/previews/fan-cards.png",
  },
  "accordion-reveal": {
    title: "Accordion Reveal",
    description:
      "Hover-expand rows with full-bleed imagery, indexed labels, and dimmed siblings.",
    category: "Card Interactions",
    slug: "accordion-reveal",
    addedAt: "2026-06-06",
    previewImage: "/previews/accordion-reveal.png",
  },
  "dia-text-reveal": {
    title: "Dia Text Reveal",
    description:
      "A sweeping gradient band reveals text, then settles on your theme foreground color.",
    category: "Text Effects",
    slug: "dia-text-reveal",
    addedAt: "2026-06-06",
    previewImage: "/previews/dia-text-reveal.png",
  },
  "logo-cloud-1": {
    title: "Logo Cloud 1",
    description:
      "Animated logo cloud with staggered fade-in and group cycling.",
    category: "Logo Clouds",
    slug: "logo-cloud-1",
    addedAt: "2026-06-01",
    previewImage: "/previews/logo-cloud-1.png",
  },
  "logo-cloud-2": {
    title: "Logo Cloud 2",
    description:
      "Animated logo cloud that cycles groups of 3 logos with spring blur transitions.",
    category: "Logo Clouds",
    slug: "logo-cloud-2",
    addedAt: "2026-06-01",
    previewImage: "/previews/logo-cloud-2.png",
  },
  "logo-cloud-3": {
    title: "Logo Cloud 3",
    description:
      "CSS-animated logo carousel that cycles groups with vertical blur and slide transitions.",
    category: "Logo Clouds",
    slug: "logo-cloud-3",
    addedAt: "2026-06-01",
    previewImage: "/previews/logo-cloud-3.png",
  },
  "logo-cloud-4": {
    title: "Logo Cloud 4",
    description:
      "CSS marquee logo cloud with configurable direction, speed, gap, and gradient fade edges.",
    category: "Logo Clouds",
    slug: "logo-cloud-4",
    addedAt: "2026-06-01",
    previewImage: "/previews/logo-cloud-4.png",
  },
  "pricing-1": {
    title: "Pricing 1",
    description:
      "Modern pricing grid with animated sliding numbers, yearly billing toggle, and featured plan corner decorations.",
    category: "Pricing",
    slug: "pricing-1",
    addedAt: "2026-06-01",
    previewImage: "/previews/pricing-1.png",
  },
  "pricing-2": {
    title: "Pricing 2",
    description:
      "Three-column pricing with a gradient featured card and illustrated cursor decoration.",
    category: "Pricing",
    slug: "pricing-2",
    addedAt: "2026-06-01",
    previewImage: "/previews/pricing-2.png",
  },
  "pricing-3": {
    title: "Pricing 3",
    description:
      "Asymmetric three-column pricing with an elevated featured plan, amber badge, and security footer note.",
    category: "Pricing",
    slug: "pricing-3",
    addedAt: "2026-06-01",
    previewImage: "/previews/pricing-3.png",
  },
  "pricing-4": {
    title: "Pricing 4",
    description:
      "Horizontal list-style pricing with accent blobs, strikethrough prices, and optional recommended badge.",
    category: "Pricing",
    slug: "pricing-4",
    addedAt: "2026-06-01",
    previewImage: "/previews/pricing-4.png",
  },
  "pricing-5": {
    title: "Pricing 5",
    description:
      "Tabbed individuals/teams pricing grid with coloured card backdrops, Avatar orbs, grain overlays, and feature checklists.",
    category: "Pricing",
    slug: "pricing-5",
    addedAt: "2026-06-01",
    previewImage: "/previews/pricing-5.png",
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
